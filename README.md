# twd v0.2.2

[![ci](https://github.com/kt3k/twd/actions/workflows/ci.yml/badge.svg)](https://github.com/kt3k/twd/actions/workflows/ci.yml)

Simple tailwind like CLI tool for deno 🦕

This tool uses [twind](https://github.com/tw-in-js/twind) internally.

# Install

```
deno install --allow-read=. --allow-write=. -fq https://deno.land/x/twd@v0.2.2/cli.ts
```

# Usage

Call `twd` command with html file input.

```sh
twd input.html
```

This outputs the tailwind compatible stylesheet which is needed by the input
file.

You can specify more than 1 input file.

```sh
twd input-a.html input-b.html
```

This outputs the stylesheet which include classes needed by any of the input
files.

## Watch files

You can watch files with `-w, --watch` option.

```sh
twd -w input-a.html input-b.html -o styles.css
```

When you use `-w` option, you also need to specify `-o, --output` option, which
specifies the output file for generated styles.

## Configuration

You can configure the output through 'twd.ts' file.

You can create the boilerplate code with `-i` (--init) option.

```sh
twd -i
```

This creates the config file 'twd.ts' like the below:

```ts
import { Config } from "https://deno.land/x/twd@0.2.0/types.ts";

export const config: Config = {
  preflight: true,
  theme: {},
};
```

You can configure `preflight` and `theme` options. See
[twind documentation](https://twind.dev/handbook/configuration.html#frontmatter-title)
for details.

# TODOs

- Provide `twd/colors` module
- Provide tailwind compatible purging

# License

MIT
