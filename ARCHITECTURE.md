# Architecture

## Overview
Benchmark runner + results dashboard. Suites run against multiple providers and save typed JSON results.

## Benchmark suites

| Suite | File | What it measures |
|---|---|---|
| Speed | `suites/speed.ts` | TTFT, throughput (tokens/s) |
| Reasoning | `suites/reasoning.ts` | Accuracy on logic tasks |
| Coding | `suites/coding.ts` | Code generation quality |
| Cost | `suites/cost.ts` | Cost per 1M tokens at various context sizes |
| Multimodal | `suites/multimodal.ts` | Vision accuracy |

## Results schema
```typescript
interface BenchmarkResult {
  model: string; provider: string; runId: string;
  inputTokens: number; outputTokens: number;
  ttft_ms: number; throughput_tps: number; cost_usd: number;
  timestamp: string; suite: string; score?: number;
}
```
