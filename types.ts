/// <reference no-default-lib="true"/>
/// <reference lib="deno.ns" />
/// <reference lib="dom" />
/// <reference lib="esnext" />
import { Configuration } from "https://esm.sh/twind@0.16.13";

export type Config = Pick<Configuration, "theme" | "preflight">;
