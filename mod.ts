/// <reference no-default-lib="true"/>
/// <reference lib="deno.ns" />
/// <reference lib="dom" />
/// <reference lib="esnext" />
import { setup, strict } from "https://esm.sh/twind@0.16.13";
import {
  getStyleTagProperties,
  shim,
  virtualSheet,
} from "https://esm.sh/twind@0.16.13/shim/server";

const sheet = virtualSheet();
setup({ sheet, mode: strict });

export function generate(docs: string[]): string {
  sheet.reset();
  for (const html of docs) {
    shim(html);
  }
  const { textContent } = getStyleTagProperties(sheet);
  return textContent;
}
