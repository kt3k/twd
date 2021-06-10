import {
  assertEquals,
  assertStringIncludes,
} from "https://deno.land/std@0.97.0/testing/asserts.ts";
import { expandFiles, main, readConfig } from "./cli.ts";

Deno.test("-h", async () => {
  const status = await main(["-h"]);
  assertEquals(status, 0);
});

Deno.test("-v", async () => {
  const status = await main(["-v"]);
  assertEquals(status, 0);
});

Deno.test("-i option and config reading", async () => {
  const cwd = Deno.cwd();
  const tmp = await Deno.makeTempDir();
  let config: string;
  let status: number;
  let styles: string;

  // Run `twd -i`
  try {
    Deno.chdir(tmp);
    status = await main(["-i"]);
    config = await Deno.readTextFile("twd.ts");
  } finally {
    Deno.chdir(cwd);
  }
  assertEquals(status, 0);
  assertStringIncludes(config, `import { Config } from`);
  assertStringIncludes(config, `export const config: Config = {`);

  // Run `twd test.html -o styles.css` with config file
  try {
    Deno.chdir(tmp);
    await Deno.writeTextFile("test.html", `<p class="text-gray-500"></p>`);
    await main(["test.html", "-o", "styles.css"]);
    styles = await Deno.readTextFile("styles.css");
  } finally {
    Deno.chdir(cwd);
  }
  assertStringIncludes(styles, ".text-gray-500");
  assertStringIncludes(styles, "#6b7280"); // coolGray 500 (default)

  // Run `twd -i`, but twd.ts already exists
  try {
    Deno.chdir(tmp);
    status = await main(["-i"]);
  } finally {
    Deno.chdir(cwd);
  }
  assertEquals(status, 1);
});

Deno.test("use custom config", async () => {
  const cwd = Deno.cwd();
  const tmp = await Deno.makeTempDir();
  let styles: string;
  // Run `twd test.html -o styles.css` with custom config
  try {
    Deno.chdir(tmp);
    await Deno.writeTextFile(
      "test.html",
      `<p class="text-gray-500 scroll-snap-x"></p>`,
    );
    await Deno.writeTextFile(
      "twd.ts",
      `/// <reference no-default-lib="true"/>
/// <reference lib="deno.ns" />
/// <reference lib="dom" />
/// <reference lib="esnext" />
import { Configuration } from "https://esm.sh/twind@0.16.13";
import * as colors from "https://deno.land/x/twd@v0.4.2/colors.ts";

export const config: Configuration = {
  preflight: false,
  theme: {
    extend: {
      colors: {
        gray: colors.trueGray,
      },
    },
  },
  plugins: {
    'scroll-snap': (parts) => ({ 'scroll-snap-type': parts[0] }),
  }
};`,
    );
    Deno.chdir(tmp);
    await main(["test.html", "-o", "styles.css"]);
    styles = await Deno.readTextFile("styles.css");
  } finally {
    Deno.chdir(cwd);
  }
  assertStringIncludes(styles, "#737373"); // trueGray 500
  assertStringIncludes(styles, ".scroll-snap-x{scroll-snap-type:x}"); // trueGray 500
});

Deno.test("no input files", async () => {
  const status = await main([]);
  assertEquals(status, 1);
});

Deno.test("prints to stdout", async () => {
  const status = await main(["test.html"]);
  assertEquals(status, 0);
});

Deno.test("-o styles.css", async () => {
  const tmp = await Deno.makeTempDir();
  const tmpfile = tmp + "/styles.css";
  const status = await main(["test.html", "-o", tmpfile]);
  assertEquals(status, 0);
  const styles = await Deno.readTextFile(tmpfile);
  assertStringIncludes(styles, "bg-purple-500");
});

Deno.test("readConfig reads config if it exists", async () => {
  const tmp = await Deno.makeTempDir();
  await Deno.writeTextFile(
    tmp + "/twd.ts",
    "export const config = { preflight: false }",
  );
  let config: unknown;
  const cwd = Deno.cwd();
  try {
    Deno.chdir(tmp);
    config = await readConfig();
  } finally {
    Deno.chdir(cwd);
  }
  assertEquals(config, { preflight: false });
});

Deno.test("readConfig returns empty object if it does not exists", async () => {
  const tmp = await Deno.makeTempDir();
  let config: unknown;
  const cwd = Deno.cwd();
  try {
    Deno.chdir(tmp);
    config = await readConfig();
  } finally {
    Deno.chdir(cwd);
  }
  assertEquals(config, {});
});

Deno.test("expandFiles", async () => {
  const files = await expandFiles("testdata");
  assertEquals(
    files.sort(),
    [
      "testdata/foo.html",
      "testdata/bar.html",
      "testdata/baz.html",
      "testdata/0/qux.html",
    ].sort(),
  );
});
