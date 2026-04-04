# Daily LLM Games (OpenClaw Experiment)

This repo was an experiment: using OpenClaw to auto-generate & commit tiny web microgames daily.

It ran for a bit—check dated folders (e.g., [`2026-03-26`](2026-03-26/) "Number Memory", [`2026-03-07`](2026-03-07/) "Type Rush").

But overhead was wasteful, so **reimplemented unsupervised** at [daily-unsupervised-llm-game](https://github.com/AieatAssam/daily-unsupervised-llm-game):

- Pure GitHub Actions.
- Claude Code LLM only (no OpenClaw/external deps).
- Daily games continue there.

No new games here—star/watch the new one! 🦞