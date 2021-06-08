/// <reference no-default-lib="true"/>
/// <reference lib="deno.ns" />
/// <reference lib="dom" />
/// <reference lib="esnext" />
import { parse } from "https://deno.land/std@0.97.0/flags/mod.ts";
import { join, toFileUrl } from "https://deno.land/std@0.97.0/path/mod.ts";
import { magenta, red } from "https://deno.land/std@0.97.0/fmt/colors.ts";
import { generate, init as initTwind, VirtualSheet } from "./mod.ts";
import { Config } from "./types.ts";
import debounce from "https://esm.sh/debounce@1.2.1";

const NAME = "twd";
const VERSION = "0.3.0";

function usage() {
  console.log(`
Usage: ${NAME} [-h|-v|-i] <input files, ...> [-d][-w][-o <output>]

Options:
  -i, --init           Initializes 'twd.ts' config file.
  -w, --watch          Watches the input file. If you set this option, you also need to specify -o option.
  -o, --output         Specifies the output file. If not specified, it prints in stdout.
  -d, --debug          Output warnings during extracting tailwind classes.
  -v, --version        Shows the version number.
  -h, --help           Shows the help message.
`.trim());
}

async function genStyles(files: string[], sheet: VirtualSheet) {
  return generate(await Promise.all(files.map(Deno.readTextFile)), sheet);
}

async function writeStyles(
  output: string,
  files: string[],
  sheet: VirtualSheet,
) {
  console.log(`Writing styles to file '${output}'`);
  await Deno.writeTextFile(output, await genStyles(files, sheet));
}

type CliArgs = {
  help: boolean;
  version: boolean;
  watch: boolean;
  output: string;
  debug: boolean;
  init: boolean;
  _: string[];
};

export async function main(cliArgs: string[]): Promise<number> {
  const {
    help,
    version,
    watch,
    output,
    debug,
    init,
    _: files,
  } = parse(cliArgs, {
    boolean: ["help", "version", "watch", "debug", "init"],
    string: ["output"],
    alias: {
      v: "version",
      h: "help",
      w: "watch",
      o: "output",
      d: "debug",
      i: "init",
    },
  }) as CliArgs;

  if (version) {
    console.log(`${NAME}@${VERSION}`);
    return 0;
  }

  if (help) {
    usage();
    return 0;
  }

  if (init) {
    try {
      await Deno.lstat("twd.ts");
      console.log(red("Error: twd.ts already exists"));
      return 1;
    } catch (e) {
      if (e.name === "NotFound") {
        console.log("Creating config file 'twd.ts'");
        await Deno.writeTextFile(
          "twd.ts",
          `
import { Config } from "https://deno.land/x/twd@v0.3.0/types.ts";

export const config: Config = {
  preflight: true,
  theme: {},
};
`.trim() + "\n",
        );
        console.log("Done!");
        return 0;
      }
      throw e;
    }
  }

  if (files.length === 0) {
    console.error(red("No input is given"));
    usage();
    return 1;
  }

  const sheet = initTwind({
    ...await readConfig(),
    mode: debug ? "warn" : "silent",
  });

  if (watch) {
    if (!output) {
      console.log(
        "Error: --output option is not specified. You need to specify --output option with --watch option",
      );
      return 1;
    }

    const perform = debounce(async () => {
      await writeStyles(output, files, sheet);
    });

    perform();
    for await (const _e of Deno.watchFs(files)) {
      perform();
    }
    return 0;
  }

  if (output) {
    await writeStyles(output, files, sheet);
    return 0;
  }
  console.log(await genStyles(files, sheet));
  return 0;
}

export async function readConfig(): Promise<Config> {
  let config: Config;
  try {
    const path = toFileUrl(join(Deno.cwd(), "twd.ts"));
    config = (await import(path.href)).config;
    console.error(magenta(`Using config file: '${path}'`));
  } catch {
    console.error(
      `Using default settings. You can optionally configure it by 'twd.ts' config file.`,
    );
    config = {};
  }

  return config;
}

if (import.meta.main) {
  Deno.exit(await main(Deno.args));
}
