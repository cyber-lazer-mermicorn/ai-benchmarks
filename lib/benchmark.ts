import OpenAI from 'openai';
import Groq from 'groq-sdk';
import Anthropic from '@anthropic-ai/sdk';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface BenchmarkResult {
  provider: string;
  model: string;
  latencyMs: number;
  tokensPerSec: number;
  totalTokens: number;
  costPer1MTokens: number;
  qualityScore: number;
}

// Benchmark OpenAI
export async function benchmarkOpenAI(prompt: string): Promise<BenchmarkResult> {
  try {
    const start = Date.now();
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024,
    });
    const elapsed = Date.now() - start;
    const tokens = response.usage?.total_tokens || 0;

    return {
      provider: 'OpenAI',
      model: 'gpt-4-turbo-preview',
      latencyMs: elapsed,
      tokensPerSec: Math.round((tokens / elapsed) * 1000),
      totalTokens: tokens,
      costPer1MTokens: 10.0,
      qualityScore: 0.95,
    };
  } catch (error: any) {
    throw new Error(`OpenAI benchmark error: ${error?.message || 'Unknown error'}`);
  }
}

// Benchmark Groq
export async function benchmarkGroq(prompt: string): Promise<BenchmarkResult> {
  try {
    const start = Date.now();
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024,
    });
    const elapsed = Date.now() - start;
    const tokens = response.usage?.total_tokens || 0;

    return {
      provider: 'Groq',
      model: 'llama-3.3-70b-versatile',
      latencyMs: elapsed,
      tokensPerSec: Math.round((tokens / elapsed) * 1000),
      totalTokens: tokens,
      costPer1MTokens: 0.59,
      qualityScore: 0.85,
    };
  } catch (error: any) {
    throw new Error(`Groq benchmark error: ${error?.message || 'Unknown error'}`);
  }
}

// Benchmark Anthropic
export async function benchmarkAnthropic(prompt: string): Promise<BenchmarkResult> {
  try {
    const start = Date.now();
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });
    const elapsed = Date.now() - start;
    const tokens = (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0);

    return {
      provider: 'Anthropic',
      model: 'claude-sonnet-4-20250514',
      latencyMs: elapsed,
      tokensPerSec: Math.round((tokens / elapsed) * 1000),
      totalTokens: tokens,
      costPer1MTokens: 3.0,
      qualityScore: 0.92,
    };
  } catch (error: any) {
    throw new Error(`Anthropic benchmark error: ${error?.message || 'Unknown error'}`);
  }
}

// Run all benchmarks
export async function runBenchmarks(prompt: string) {
  try {
    const [openaiResult, groqResult, anthropicResult] = await Promise.all([
      benchmarkOpenAI(prompt),
      benchmarkGroq(prompt),
      benchmarkAnthropic(prompt),
    ]);

    return {
      results: [openaiResult, groqResult, anthropicResult],
      winner: {
        fastest: [openaiResult, groqResult, anthropicResult].sort((a, b) => a.latencyMs - b.latencyMs)[0],
        cheapest: [openaiResult, groqResult, anthropicResult].sort((a, b) => a.costPer1MTokens - b.costPer1MTokens)[0],
        bestQuality: [openaiResult, groqResult, anthropicResult].sort((a, b) => b.qualityScore - a.qualityScore)[0],
      },
    };
  } catch (error: any) {
    throw new Error(`Benchmark error: ${error?.message || 'Unknown error'}`);
  }
}
