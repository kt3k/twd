import {
  assertEquals,
  assertStringIncludes,
} from "https://deno.land/std@0.97.0/testing/asserts.ts";
import { main, readConfig } from "./cli.ts";

Deno.test("-h", async () => {
  const status = await main(["-h"]);
  assertEquals(status, 0);
});

Deno.test("-v", async () => {
  const status = await main(["-v"]);
  assertEquals(status, 0);
});

Deno.test("-i", async () => {
  const cwd = Deno.cwd();
  const tmp = await Deno.makeTempDir();
  let config: string;
  let status: number;
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

  try {
    Deno.chdir(tmp);
    status = await main(["-i"]);
  } finally {
    Deno.chdir(cwd);
  }
  // It fails on the 2nd time because the config file is already there
  assertEquals(status, 1);
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
  await Deno.writeTextFile(tmp + "/twd.ts", 'export const config = { preflight: false }');
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
