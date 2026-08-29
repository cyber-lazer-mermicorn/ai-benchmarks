# AI Benchmarks — Agent Doctrine

## What this repo is
Systematic AI model benchmarking: TTFT, throughput, cost-per-token, quality scores across providers.
By Cherry Shanaley (Chan), AI Solutions Engineer.

## Tech stack
- TypeScript strict, Node.js (benchmarks), Next.js 15 (dashboard)

## Coding rules
- Latency measured with `performance.now()` — never `Date.now()`
- Each benchmark run saves a JSON result to `results/YYYY-MM-DD/`
- Results schema: `{ model, provider, runId, inputTokens, outputTokens, ttft_ms, throughput_tps, cost_usd, timestamp }`
- Never hardcode expected results — benchmark runs are ground truth
- Dashboard reads from `results/` — never hardcodes numbers
- Benchmark suites in `suites/` — one file per capability (reasoning, coding, math, multimodal)

## Commands
```bash
npm install
npm run bench:all       # run all suites
npm run bench -- --suite reasoning
npm run dev             # dashboard
npm run test
```

## Do not
- Hardcode benchmark results in dashboard
- Use `Date.now()` for timing
- Run benchmarks without saving to `results/`
