# twd v0.1.2

[![ci](https://github.com/kt3k/twd/actions/workflows/ci.yml/badge.svg)](https://github.com/kt3k/twd/actions/workflows/ci.yml)

Simple tailwind like CLI tool for deno 🦕

This tool uses [twind](https://github.com/tw-in-js/twind) internally.

# Install

```
deno install --allow-read=. --allow-write=. -fq https://deno.land/x/twd@v0.1.2/cli.ts
```

# Usage

Call `twd` command with html file input.

```
twd input.html
```

This outputs the tailwind compatible stylesheet which is needed by the input
file.

You can specify more than 1 input file.

```
twd input-a.html input-b.html
```

This outputs the stylesheet which include classes needed by any of the input
files.

## Watch files

You can watch files with `-w, --watch` option.

```
twd -w input-a.html input-b.html -o styles.css
```

When you use `-w` option, you also need to specify `-o, --output` option, which
specifies the output file for generated styles.

# License

MIT
