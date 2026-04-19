# CLAUDE.md — caveman

## README is a product artifact

README = product front door. Non-technical people read it to decide if caveman worth install. Treat like UI copy.

**Rules for any README change:**

- Readable by non-AI-agent users. If you write "SessionStart hook injects system context," invisible to most — translate it.
- Keep Before/After examples first. That the pitch.
- Install table always complete + accurate. One broken install command costs real user.
- What You Get table must sync with actual code. Feature ships or removed → update table.
- Preserve voice. Caveman speak in README on purpose. "Brain still big." "Cost go down forever." "One rock. That it." — intentional brand. Don't normalize.
- Benchmark numbers from real runs in `benchmarks/` and `evals/`. Never invent or round. Re-run if doubt.
- Readability check before any README commit: would non-programmer understand + install within 60 seconds?

---

## Project overview

Caveman makes Claude Code respond in compressed caveman-style prose — cuts ~65-75% output tokens, full technical accuracy. Ships as Claude Code plugin or standalone hooks.

---

## File structure and what owns what

### Single source of truth files — edit only these

| File | What it controls |
|------|-----------------|
| `skills/caveman/SKILL.md` | Caveman behavior: intensity levels, rules, wenyan mode, auto-clarity, persistence. Only file to edit for behavior changes. |
| `caveman-compress/SKILL.md` | Compress sub-skill behavior. |

### Auto-generated / auto-synced — do not edit directly

Overwritten by CI on push to main when sources change. Edits here lost.

| File | Synced from |
|------|-------------|
| `caveman/SKILL.md` | `skills/caveman/SKILL.md` |
| `plugins/caveman/skills/caveman/SKILL.md` | `skills/caveman/SKILL.md` |

---

## CI sync workflow

`.github/workflows/sync-skill.yml` triggers on main push when `skills/caveman/SKILL.md` changes.

What it does:
1. Copies `skills/caveman/SKILL.md` to all synced SKILL.md locations
2. Commits and pushes with `[skip ci]` to avoid loops

CI bot commits as `github-actions[bot]`. After PR merge, wait for workflow before declaring release complete.

---

## Hook system (Claude Code)

Three hooks in `hooks/` plus a `caveman-config.js` shared module and a `package.json` CommonJS marker. Communicate via flag file at `$CLAUDE_CONFIG_DIR/.caveman-active` (falls back to `~/.claude/.caveman-active`).

```
SessionStart hook ──writes "full"──▶ $CLAUDE_CONFIG_DIR/.caveman-active ◀──writes mode── UserPromptSubmit hook
                                                       │
                                                    reads
                                                       ▼
                                              caveman-statusline.sh
                                            [CAVEMAN] / [CAVEMAN:ULTRA] / ...
```

`hooks/package.json` pins the directory to `{"type": "commonjs"}` so the `.js` hooks resolve as CJS even when an ancestor `package.json` (e.g. `~/.claude/package.json` from another plugin) declares `"type": "module"`. Without this, `require()` blows up with `ReferenceError: require is not defined in ES module scope`.

All hooks honor `CLAUDE_CONFIG_DIR` for non-default Claude Code config locations.

### `hooks/caveman-config.js` — shared module

Exports:
- `getDefaultMode()` — resolves default mode from `CAVEMAN_DEFAULT_MODE` env var, then `$XDG_CONFIG_HOME/caveman/config.json` / `~/.config/caveman/config.json` / `%APPDATA%\caveman\config.json`, then `'full'`
- `safeWriteFlag(flagPath, content)` — symlink-safe flag write. Refuses if flag target or its immediate parent is a symlink. Opens with `O_NOFOLLOW` where supported. Atomic temp + rename. Creates with `0600`. Protects against local attackers replacing the predictable flag path with a symlink to clobber files writable by the user. Used by both write hooks. Silent-fails on all filesystem errors.

### `hooks/caveman-activate.js` — SessionStart hook

Runs once per Claude Code session start. Three things:
1. Writes the active mode to `$CLAUDE_CONFIG_DIR/.caveman-active` via `safeWriteFlag` (creates if missing)
2. Emits caveman ruleset as hidden stdout — Claude Code injects SessionStart hook stdout as system context, invisible to user
3. Checks `settings.json` for statusline config; if missing, appends nudge to offer setup on first interaction

Silent-fails on all filesystem errors — never blocks session start.

### `hooks/caveman-mode-tracker.js` — UserPromptSubmit hook

Reads JSON from stdin. Three responsibilities:

**1. Slash-command activation.** If prompt starts with `/caveman`, writes mode to flag file via `safeWriteFlag`:
- `/caveman` → configured default (see `caveman-config.js`, defaults to `full`)
- `/caveman lite` → `lite`
- `/caveman ultra` → `ultra`
- `/caveman wenyan` or `/caveman wenyan-full` → `wenyan`
- `/caveman wenyan-lite` → `wenyan-lite`
- `/caveman wenyan-ultra` → `wenyan-ultra`
- `/caveman-compress` → `compress`

**2. Natural-language activation/deactivation.** Matches phrases like "activate caveman", "turn on caveman mode", "talk like caveman" and writes the configured default mode. Matches "stop caveman", "disable caveman", "normal mode", "deactivate caveman" etc. and deletes the flag file. README promises these triggers, the hook enforces them.

**3. Per-turn reinforcement.** When flag is set to a non-independent mode (i.e. not `compress`), emits a small `hookSpecificOutput` JSON reminder so the model keeps caveman style after other plugins inject competing instructions mid-conversation. The full ruleset still comes from SessionStart — this is just an attention anchor.

### `hooks/caveman-statusline.sh` — Statusline badge

Reads flag file at `$CLAUDE_CONFIG_DIR/.caveman-active`. Outputs colored badge string for Claude Code statusline:
- `full` or empty → `[CAVEMAN]` (orange)
- anything else → `[CAVEMAN:<MODE_UPPERCASED>]` (orange)

Configured in `settings.json` under `statusLine.command`. PowerShell counterpart at `hooks/caveman-statusline.ps1` for Windows.

### Hook installation

**Plugin install** — hooks wired automatically by plugin system.

**Standalone install** — `hooks/install.sh` (macOS/Linux) or `hooks/install.ps1` (Windows) copies hook files into `~/.claude/hooks/` and patches `~/.claude/settings.json` to register SessionStart and UserPromptSubmit hooks plus statusline.

**Uninstall** — `hooks/uninstall.sh` / `hooks/uninstall.ps1` removes hook files and patches settings.json.

---

## Skill system

Skills = Markdown files with YAML frontmatter consumed by Claude Code's skill/plugin system.

### Intensity levels

Defined in `skills/caveman/SKILL.md`. Six levels: `lite`, `full` (default), `ultra`, `wenyan-lite`, `wenyan-full`, `wenyan-ultra`. Persists until changed or session ends.

### Auto-clarity rule

Caveman drops to normal prose for: security warnings, irreversible action confirmations, multi-step sequences where fragment ambiguity risks misread, user confused or repeating question. Resumes after. Defined in skill — preserve in any SKILL.md edit.

### caveman-compress

Sub-skill in `caveman-compress/SKILL.md`. Takes file path, compresses prose to caveman style, writes to original path, saves backup at `<filename>.original.md`. Validates headings, code blocks, URLs, file paths, commands preserved. Retries up to 2 times on failure with targeted patches only. Requires Python 3.10+.

---

## Slash commands

`commands/compact.md` wires the built-in `/compact` command to run caveman-compress first, compressing the conversation summary before Claude Code compacts the context window. This keeps compacted context in caveman style so token savings persist across compactions.

---

## Key rules for agents working here

- Edit `skills/caveman/SKILL.md` for behavior changes. Never edit synced copies.
- README most important file for user-facing impact. Optimize for non-technical readers. Preserve caveman voice.
- CI workflow commits back to main after merge. Account for when checking branch state.
- Hook files must silent-fail on all filesystem errors. Never let hook crash block session start.
- Any new flag file write must go through `safeWriteFlag()` in `caveman-config.js`. Direct `fs.writeFileSync` on predictable user-owned paths reopens the symlink-clobber attack surface.
- Hooks must respect `CLAUDE_CONFIG_DIR` env var, not hardcode `~/.claude`. Same for `install.sh` / `install.ps1` / statusline scripts.
