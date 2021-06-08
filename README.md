# twd v0.3.1

[![ci](https://github.com/kt3k/twd/actions/workflows/ci.yml/badge.svg)](https://github.com/kt3k/twd/actions/workflows/ci.yml)

Simple tailwind like CLI tool for deno 🦕

This tool uses [twind](https://github.com/tw-in-js/twind) internally.

# Install

```
deno install --allow-read=. --allow-write=. --allow-net=deno.land,esm.sh,cdn.esm.sh -fq https://deno.land/x/twd@v0.3.1/cli.ts
```

# Usage

Call `twd` command with input html files.

```sh
twd input.html
```

This outputs the tailwind compatible stylesheet which is needed by the input
file.

You can specify more than 1 input file.

```sh
twd input-foo.html input-bar.html
```

This outputs the stylesheet for both input-foo.html and input-bar.html.

Or you can input the files under the directory by specifying the directory.

```sh
twd dir/
```

## Watch files

You can watch files with `-w, --watch` option.

```sh
twd -w input-a.html input-b.html -o styles.css
```

When you use `-w` option, you also need to specify `-o, --output` option, which
specifies the output file for generated styles.

# Config

You can configure the output styles through config file 'twd.ts'.

You can create the boilerplate code with `-i` (--init) option.

```shellsession
$ twd -i
Creating config file 'twd.ts'
Done!
```

This creates the config file 'twd.ts' like the below:

```ts
import { Config } from "https://deno.land/x/twd@v0.3.1/types.ts";

export const config: Config = {
  preflight: true,
  theme: {},
};
```

## Theme

Theming works almost the same way as
[theming in tailwind](https://tailwindcss.com/docs/theme), or
[theming in twind](https://twind.dev/handbook/configuration.html#theme).

The example of overriding values in the theme:

```ts
import { Config } from "https://deno.land/x/twd@v0.3.1/types.ts";

export const config: Config = {
  preflight: true,
  theme: {
    fontFamily: {
      sans: ["Helvetica", "sans-serif"],
      serif: ["Times", "serif"],
    },
    extend: {
      spacing: {
        128: "32rem",
        144: "36rem",
      },
    },
  },
};
```

## Colors

The Tailwind v2 compatible color palette is available from
`https://deno.land/x/twd@v0.3.1/colors.ts`.

```ts
import { Config } from "https://deno.land/x/twd@v0.3.1/types.ts";
import * as colors from "https://deno.land/x/twd@v0.3.1/colors.ts";

export const config: Config = {
  theme: {
    colors: {
      // Build your palette here
      gray: colors.trueGray,
      red: colors.red,
      blue: colors.lightBlue,
      yellow: colors.amber,
    },
  },
};
```

To extend the existing color palette use theme.extend:

```ts
import { Config } from "https://deno.land/x/twd@v0.3.1/types.ts";
import * as colors from "https://deno.land/x/twd@v0.3.1/colors.ts";

export const config: Config = {
  theme: {
    extend: {
      colors: {
        gray: colors.trueGray,
      },
    },
  },
};
```

## Preflight

`twd` automatically provides reset stylesheet,
[modern-normalize](https://github.com/sindresorhus/modern-normalize), in the
same way as [tailwind](https://tailwindcss.com/docs/preflight) or
[twind](https://twind.dev/handbook/configuration.html#preflight). By default
`twd` inserts these styles at the beginning of the other styles.

This behavior can be disabled by `preflight` option in 'twd.ts' config file.

```ts
import { Config } from "https://deno.land/x/twd@v0.3.1/types.ts";

export const config: Config = {
  preflight: false,
};
```

# TODOs

- Maybe support glob input?

# License

MIT
