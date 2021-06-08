import { assertStringIncludes } from "https://deno.land/std@0.97.0/testing/asserts.ts";
import { generate, init } from "./mod.ts";

const sheet = init({ mode: "silent" });

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
    `bg-blue-700`, // raw class name works
    `< asdf foobar="bg-red-800"> bg-gray-900`, // broken html doesn't matter
  ], sheet);
  assertStringIncludes(styles, ".bg-purple-500");
  assertStringIncludes(styles, ".bg-purple-600");
  assertStringIncludes(styles, ".bg-blue-700");
  assertStringIncludes(styles, ".bg-red-800");
  assertStringIncludes(styles, ".bg-gray-900");
});
