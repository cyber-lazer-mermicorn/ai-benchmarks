# Copilot Instructions — AI Benchmarks

## Always
- Use `performance.now()` for all timing
- Save results as JSON to `results/YYYY-MM-DD/`
- Read results from files in dashboard — never hardcode
- Type results with the `BenchmarkResult` interface

## Never
- Hardcode scores or latency numbers
- Use `Date.now()` for sub-ms timing
- Skip saving results after a benchmark run
