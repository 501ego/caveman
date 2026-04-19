<p align="center">
  <img src="https://em-content.zobj.net/source/apple/391/rock_1faa8.png" width="120" />
</p>

<h1 align="center">caveman</h1>

<p align="center">
  <strong>why use many token when few do trick</strong>
</p>

<p align="center">
  <a href="https://github.com/501ego/caveman/stargazers"><img src="https://img.shields.io/github/stars/501ego/caveman?style=flat&color=yellow" alt="Stars"></a>
  <a href="https://github.com/501ego/caveman/commits/main"><img src="https://img.shields.io/github/last-commit/501ego/caveman?style=flat" alt="Last Commit"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/501ego/caveman?style=flat" alt="License"></a>
</p>

<p align="center">
  <a href="#before--after">Before/After</a> •
  <a href="#install">Install</a> •
  <a href="#intensity-levels">Levels</a> •
  <a href="#caveman-compress">Compress</a>
</p>

---

A [Claude Code](https://docs.anthropic.com/en/docs/claude-code) plugin that makes Claude talk like caveman — cutting **~65-75% of output tokens** while keeping full technical accuracy. Includes [文言文 mode](#文言文-wenyan-mode) and a [compression tool](#caveman-compress) that cuts **~46% of input tokens** every session.

Based on the viral observation that caveman-speak dramatically reduces LLM token usage without losing technical substance. So we made it a one-line install.

## Before / After

<table>
<tr>
<td width="50%">

### 🗣️ Normal Claude (69 tokens)

> "The reason your React component is re-rendering is likely because you're creating a new object reference on each render cycle. When you pass an inline object as a prop, React's shallow comparison sees it as a different object every time, which triggers a re-render. I'd recommend using useMemo to memoize the object."

</td>
<td width="50%">

### 🪨 Caveman Claude (19 tokens)

> "New object ref each render. Inline object prop = new ref = re-render. Wrap in `useMemo`."

</td>
</tr>
<tr>
<td>

### 🗣️ Normal Claude

> "Sure! I'd be happy to help you with that. The issue you're experiencing is most likely caused by your authentication middleware not properly validating the token expiry. Let me take a look and suggest a fix."

</td>
<td>

### 🪨 Caveman Claude

> "Bug in auth middleware. Token expiry check use `<` not `<=`. Fix:"

</td>
</tr>
</table>

**Same fix. 75% less word. Brain still big.**

**Pick your level of grunt:**

<table>
<tr>
<td width="25%">

#### 🪶 Lite

> "Your component re-renders because you create a new object reference each render. Inline object props fail shallow comparison every time. Wrap it in `useMemo`."

</td>
<td width="25%">

#### 🪨 Full

> "New object ref each render. Inline object prop = new ref = re-render. Wrap in `useMemo`."

</td>
<td width="25%">

#### 🔥 Ultra

> "Inline obj prop → new ref → re-render. `useMemo`."

</td>
<td width="25%">

#### 📜 文言文

> "物出新參照，致重繪。useMemo Wrap之。"

</td>
</tr>
</table>

**Same answer. You pick how many word.**

```
┌─────────────────────────────────────┐
│  TOKENS SAVED          ████████ 75% │
│  TECHNICAL ACCURACY    ████████ 100%│
│  SPEED INCREASE        ████████ ~3x │
│  VIBES                 ████████ OOG │
└─────────────────────────────────────┘
```

- **Faster response** — less token to generate = speed go brrr
- **Easier to read** — no wall of text, just the answer
- **Same accuracy** — all technical info kept, only fluff removed ([science say so](https://arxiv.org/abs/2604.00025))
- **Save money** — ~71% less output token = less cost
- **Fun** — every code review become comedy

## Install

One command. Done.

```bash
claude plugin marketplace add 501ego/caveman
claude plugin install caveman@caveman
```

Install once. Use in every session. One rock. That it.

**Standalone hooks (without plugin):**
```bash
# macOS / Linux / WSL
bash <(curl -s https://raw.githubusercontent.com/501ego/caveman/main/hooks/install.sh)

# Windows (PowerShell)
irm https://raw.githubusercontent.com/501ego/caveman/main/hooks/install.ps1 | iex
```

Or from a local clone: `bash hooks/install.sh` / `powershell -File hooks\install.ps1`

Uninstall: `bash hooks/uninstall.sh` or `powershell -File hooks\uninstall.ps1`

### What You Get

| Feature | Status |
|---------|:------:|
| Caveman mode | ✓ |
| Auto-activate every session | ✓ |
| `/caveman` slash command | ✓ |
| Mode switching (lite/full/ultra) | ✓ |
| Statusline badge `[CAVEMAN]` | ✓ |
| caveman-compress | ✓ |
| `/compact` auto-compresses before compacting | ✓ |

**Statusline badge:** Shows `[CAVEMAN]`, `[CAVEMAN:ULTRA]`, etc. in your Claude Code status bar.

- **No existing statusline:** installer wires the badge automatically
- **Existing statusline (e.g. claude-hud):** installer skips — badge won't show. See [`hooks/README.md`](hooks/README.md) to add it manually

## Usage

Trigger with:
- `/caveman`
- "talk like caveman"
- "caveman mode"
- "less tokens please"

Stop with: "stop caveman" or "normal mode"

### Intensity Levels

| Level | Trigger | What it do |
|-------|---------|------------|
| **Lite** | `/caveman lite` | Drop filler, keep grammar. Professional but no fluff |
| **Full** | `/caveman full` | Default caveman. Drop articles, fragments, full grunt |
| **Ultra** | `/caveman ultra` | Maximum compression. Telegraphic. Abbreviate everything |

### 文言文 (Wenyan) Mode

Classical Chinese literary compression — same technical accuracy, but in the most token-efficient written language humans ever invented.

| Level | Trigger | What it do |
|-------|---------|------------|
| **Wenyan-Lite** | `/caveman wenyan-lite` | Semi-classical. Grammar intact, filler gone |
| **Wenyan-Full** | `/caveman wenyan` | Full 文言文. Maximum classical terseness |
| **Wenyan-Ultra** | `/caveman wenyan-ultra` | Extreme. Ancient scholar on a budget |

Level stick until you change it or session end.

## caveman-compress

`/caveman:compress <filepath>` — caveman make Claude *speak* with fewer tokens. **Compress** make Claude *read* fewer tokens.

Your `CLAUDE.md` loads on **every session start**. Caveman Compress rewrites memory files into caveman-speak so Claude reads less — without you losing the human-readable original.

```
/caveman:compress CLAUDE.md
```

```
CLAUDE.md          ← compressed (Claude reads this every session — fewer tokens)
CLAUDE.original.md ← human-readable backup (you read and edit this)
```

| File | Original | Compressed | Saved |
|------|----------:|----------:|------:|
| `claude-md-preferences.md` | 706 | 285 | **59.6%** |
| `project-notes.md` | 1145 | 535 | **53.3%** |
| `claude-md-project.md` | 1122 | 636 | **43.3%** |
| `todo-list.md` | 627 | 388 | **38.1%** |
| `mixed-with-code.md` | 888 | 560 | **36.9%** |
| **Average** | **898** | **481** | **46%** |

Code blocks, URLs, file paths, commands, headings, dates, version numbers — anything technical passes through untouched. Only prose gets compressed. See the full [caveman-compress README](caveman-compress/README.md) for details. [Security note](./caveman-compress/SECURITY.md): Snyk flags this as High Risk due to subprocess/file patterns — it's a false positive.

### /compact command

`/compact` — automatically compresses `CLAUDE.md` with caveman-compress before compacting. Next session loads smaller file. One command. Cost go down forever.

> [!IMPORTANT]
> Caveman only affects output tokens — thinking/reasoning tokens are untouched. Caveman no make brain smaller. Caveman make *mouth* smaller. Biggest win is **readability and speed**, cost savings are a bonus.

A March 2026 paper ["Brevity Constraints Reverse Performance Hierarchies in Language Models"](https://arxiv.org/abs/2604.00025) found that constraining large models to brief responses **improved accuracy by 26 percentage points** on certain benchmarks and completely reversed performance hierarchies. Verbose not always better. Sometimes less word = more correct.

## Star This Repo

If caveman save you mass token, mass money — leave mass star. ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=501ego/caveman&type=Date)](https://star-history.com/#501ego/caveman&Date)

## License

MIT — free like mass mammoth on open plain.
