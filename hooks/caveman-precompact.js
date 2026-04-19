#!/usr/bin/env node
// caveman — PreCompact hook
// Runs caveman-compress on project CLAUDE.md before context compaction.
// Compressed file is ready for the next session (fewer input tokens).

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

try {
  const projectClaudeMd = path.join(process.cwd(), 'CLAUDE.md');
  const compressScriptDir = path.join(__dirname, '..', 'caveman-compress');

  if (
    fs.existsSync(projectClaudeMd) &&
    fs.existsSync(path.join(compressScriptDir, 'scripts', '__main__.py'))
  ) {
    spawnSync('python3', ['-m', 'scripts', projectClaudeMd], {
      cwd: compressScriptDir,
      stdio: 'ignore'
    });
  }
} catch (e) {
  // Silent fail — never block compaction
}

process.exit(0);
