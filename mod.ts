/// <reference no-default-lib="true"/>
/// <reference lib="deno.ns" />
/// <reference lib="dom" />
/// <reference lib="esnext" />
import { create, Configuration, setup } from "https://esm.sh/twind@0.16.13";
import {
  getStyleTagProperties,
  VirtualSheet,
  virtualSheet,
} from "https://esm.sh/twind@0.16.13/shim/server";

export type GenerateConfig = Pick<Configuration, "preflight" | "theme" | "mode">;
export function generate(docs: string[],   {
  mode,
  preflight,
  theme,
}: GenerateConfig,
): string {
  const sheet = virtualSheet();
  const { tw } = create({ sheet, mode, preflight, theme });
  sheet.reset();
  for (const html of docs) {
    tw(...(html.match(/[^<>"'`\s]*[^<>"'`\s:]/g) ?? []));
  }
  const { textContent } = getStyleTagProperties(sheet);
  return textContent;
}
