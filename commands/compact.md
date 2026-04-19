---
description: Compress Markdown context with caveman-compress, then compact session.
---

Caveman compact. Two step:

1. Run caveman-compress on target file (say `/caveman:compress <filepath>` or describe what to compress). See `caveman-compress/SKILL.md` for behavior — code blocks, URLs, paths untouched, only prose shrink.
2. After compress done, run built-in `/compact` to compact session context.

If no file given, compress any long Markdown in current context, then compact.

Backup saved as `<filename>.original.md`. Brain still big. File now small.
