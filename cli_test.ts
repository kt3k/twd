import {
  assertEquals,
  assertStringIncludes,
} from "https://deno.land/std@0.97.0/testing/asserts.ts";
import { main } from "./cli.ts";

Deno.test("-h", async () => {
  const status = await main(["-h"]);
  assertEquals(status, 0);
});

Deno.test("-v", async () => {
  const status = await main(["-v"]);
  assertEquals(status, 0);
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
