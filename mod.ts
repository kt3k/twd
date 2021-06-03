/// <reference no-default-lib="true"/>
/// <reference lib="deno.ns" />
/// <reference lib="dom" />
/// <reference lib="esnext" />
import { setup } from "https://esm.sh/twind@0.16.13";
import {
  getStyleTagProperties,
  shim,
  virtualSheet,
  VirtualSheet,
} from "https://esm.sh/twind@0.16.13/shim/server";

export type { VirtualSheet };
let sheet: VirtualSheet
export function init({ mode }: { mode: "strict" | "silent" | "warn" }): VirtualSheet {
  if (sheet) {
    return sheet;
  }
  sheet = virtualSheet();
  setup({ sheet, mode });
  return sheet;
}
export function generate(docs: string[], sheet: VirtualSheet): string {
  sheet.reset();
  for (const html of docs) {
    shim(html);
  }
  const { textContent } = getStyleTagProperties(sheet);
  return textContent;
}
