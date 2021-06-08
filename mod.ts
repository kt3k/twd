/// <reference no-default-lib="true"/>
/// <reference lib="deno.ns" />
/// <reference lib="dom" />
/// <reference lib="esnext" />
import { tw, Configuration, setup } from "https://esm.sh/twind@0.16.13";
import {
  getStyleTagProperties,
  VirtualSheet,
  virtualSheet,
} from "https://esm.sh/twind@0.16.13/shim/server";

export type { VirtualSheet };
let sheet: VirtualSheet;
export function init(
  {
    mode,
    preflight,
    theme,
  }: Pick<Configuration, "preflight" | "theme" | "mode">,
): VirtualSheet {
  if (sheet) {
    return sheet;
  }
  sheet = virtualSheet();
  setup({ sheet, mode, preflight, theme });
  return sheet;
}
export function generate(docs: string[], sheet: VirtualSheet): string {
  sheet.reset();
  for (const html of docs) {
    const patterns = html.match(/[^<>"'`\s]*[^<>"'`\s:]/g);
    if (patterns) {
      tw(...patterns);
    }
  }
  const { textContent } = getStyleTagProperties(sheet);
  return textContent;
}
