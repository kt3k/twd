# twindeno v0.0.1

Simple tailwind like CLI tool for deno 🦕

This tool uses [twind](https://github.com/tw-in-js/twind) internally.

# Usage

```
deno run --allow-read=. --no-check https://raw.githubusercontent.com/kt3k/twindeno/main/main.ts <input-html>
```

This extracts the tailwind classes from the given input html file, generates
css, prints it out to the stdout.

# License

MIT
