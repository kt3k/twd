import { assertStringIncludes } from "https://deno.land/std@0.97.0/testing/asserts.ts";
import { generate, init } from "./mod.ts";

const config = { mode: "silent" } as const;
const info = init(config);

Deno.test("integration test", async () => {
  const styles = await generate(
    [`<body class="bg-purple-500"></body>`],
    info,
  );
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
  ], info);
  assertStringIncludes(styles, ".bg-purple-500");
  assertStringIncludes(styles, ".bg-purple-600");
  assertStringIncludes(styles, ".bg-blue-700");
  assertStringIncludes(styles, ".bg-red-800");
  assertStringIncludes(styles, ".bg-gray-900");
});

Deno.test("exception words", () => {
  // This test case checks that special words which has problem with twind
  // don't throw.
  // See https://github.com/tw-in-js/twind/issues/189 for details.
  generate([
    "toLocaleString",
    "__defineGetter__",
  ], info);
});
