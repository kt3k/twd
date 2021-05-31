import { generate } from "./mod.ts";

function usage() {
  console.log(`Usage twind <input html>`);
}

const file = Deno.args[0];

if (!file) {
  console.log("No input is given");
  usage();
}

const html = await Deno.readTextFile(file);
const styles = await generate(html);
console.log(styles);
