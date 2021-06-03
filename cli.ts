/// <reference no-default-lib="true"/>
/// <reference lib="deno.ns" />
/// <reference lib="dom" />
/// <reference lib="esnext" />
import { parse } from "https://deno.land/std@0.97.0/flags/mod.ts";
import { generate } from "./mod.ts";
import debounce from "https://esm.sh/debounce@1.2.1";

const NAME = "twd";
const VERSION = "0.1.3";

function usage() {
  console.log(`
Usage: ${NAME} [-h|-v] <input files, ...> [-w][-o <output>]

Options:
  -v, --version        Shows the version number.
  -h, --help           Shows the help message.
  -w, --watch          Watches the input file. If you set this option, you also need to specify -o option.
  -o, --output         Specifies the output file. If not specified, it prints in stdout.
`.trim());
}

async function genStyles(files: string[]) {
  return generate(await Promise.all(files.map(Deno.readTextFile)));
}

async function writeStyles(output: string, files: string[]) {
  console.log(`Writing styles to file '${output}'`);
  await Deno.writeTextFile(output, await genStyles(files));
}

type CliArgs = {
  help: boolean;
  version: boolean;
  watch: boolean;
  output: string;
  _: string[];
};

export async function main(cliArgs: string[]): Promise<number> {
  const {
    help,
    version,
    watch,
    output,
    _: files,
  } = parse(cliArgs, {
    boolean: ["help", "version", "watch"],
    string: ["output"],
    alias: {
      v: "version",
      h: "help",
      w: "watch",
      o: "output",
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

  if (files.length === 0) {
    console.log("No input is given");
    usage();
    return 1;
  }

  if (watch) {
    if (!output) {
      console.log(
        "Error: --output option is not specified. You need to specify --output option with --watch option",
      );
      return 1;
    }

    const perform = debounce(async () => {
      await writeStyles(output, files);
    });

    perform();
    for await (const _e of Deno.watchFs(files)) {
      perform();
    }
    return 0;
  }

  if (output) {
    await writeStyles(output, files);
    return 0;
  }
  console.log(await genStyles(files));
  return 0;
}

if (import.meta.main) {
  Deno.exit(await main(Deno.args));
}
