import { buildManifest, OUTPUT_SCHEMA, type AiStack } from './manifest'

/**
 * AI stack generator — PLANNED, NOT IMPLEMENTED.
 *
 * Intended flow:
 *   1. Send the capability manifest + user prompt to a model with structured
 *      output constrained by OUTPUT_SCHEMA.
 *   2. Model returns canonical Stack JSON (never code).
 *   3. Pipe the result through validateStack() (same gate as .stack import).
 *   4. loadStack() — identical to opening a file.
 *
 * Entry points (future): a "+ AI" tile on Home and File → Generate with AI…
 */
export async function generateStack(prompt: string): Promise<AiStack> {
  void buildManifest
  void OUTPUT_SCHEMA
  void prompt
  throw new Error('AI builder is not implemented yet.')
}
