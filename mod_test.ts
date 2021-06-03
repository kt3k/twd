import { assertStringIncludes } from "https://deno.land/std@0.97.0/testing/asserts.ts";
import { generate, init } from "./mod.ts";

const sheet = init({ mode: "strict" });

Deno.test("integration test", async () => {
  const styles = await generate([`<body class="bg-purple-500"></body>`], sheet);
  assertStringIncludes(
    styles,
    ".bg-purple-500",
  );
});

Deno.test("integration test 2", async () => {
  const styles = await generate([
    `<body class="bg-purple-500"></body>`,
    `<body class="bg-purple-600"></body>`,
  ], sheet);
  assertStringIncludes(styles, ".bg-purple-500");
  assertStringIncludes(styles, ".bg-purple-600");
});
