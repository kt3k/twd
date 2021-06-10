/// <reference no-default-lib="true"/>
/// <reference lib="deno.ns" />
/// <reference lib="dom" />
/// <reference lib="esnext" />
import { Configuration, create } from "https://esm.sh/twind@0.16.13";
import { Config } from "./types.ts";
import {
  getStyleTagProperties,
  virtualSheet,
} from "https://esm.sh/twind@0.16.13/shim/server";

export type GenerateConfig = Config & Pick<Configuration, "mode">;
export function generate(docs: string[], {
  mode,
  preflight,
  theme,
  plugins,
}: GenerateConfig): string {
  const sheet = virtualSheet();
  const { tw } = create({ sheet, mode, preflight, theme, plugins });
  sheet.reset();
  for (const html of docs) {
    tw(...(html.match(/[^<>"'`\s]*[^<>"'`\s:]/g) ?? []));
  }
  const { textContent } = getStyleTagProperties(sheet);
  return textContent;
}
