---
description: Compress a file to caveman-speak to save input tokens
---

Compress the file at: $ARGUMENTS

Find caveman-compress scripts at `~/.claude/plugins/caveman/caveman-compress/scripts/__main__.py`. Run:

```
cd ~/.claude/plugins/caveman/caveman-compress && python3 -m scripts <absolute path to file>
```

Script compresses prose to caveman style. Preserves code blocks, URLs, file paths, commands exactly. Saves backup as `FILE.original.md`. Report token savings when done.
