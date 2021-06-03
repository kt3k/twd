import { assertStringIncludes } from "https://deno.land/std@0.97.0/testing/asserts.ts";
import { generate } from "./mod.ts";

Deno.test("integration test", async () => {
  const styles = await generate([`<body class="bg-purple-500"></body>`]);
  assertStringIncludes(
    styles,
    ".bg-purple-500",
  );
});

Deno.test("integration test 2", async () => {
  const styles = await generate([
    `<body class="bg-purple-500"></body>`,
    `<body class="bg-purple-600"></body>`,
  ]);
  assertStringIncludes(styles, ".bg-purple-500");
  assertStringIncludes(styles, ".bg-purple-600");
});
