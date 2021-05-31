import { setup } from "https://esm.sh/twind@0.16.13";
import {
  getStyleTagProperties,
  shim,
  virtualSheet,
} from "https://esm.sh/twind@0.16.13/shim/server";

export async function generate(html: string): Promise<string> {
  const sheet = virtualSheet();
  setup({ sheet, mode: "silent" });
  sheet.reset();
  shim(html);
  const { textContent } = getStyleTagProperties(sheet);
  return textContent;
}
