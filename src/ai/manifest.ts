/**
 * AI builder — PLANNED ONLY, not wired into the MVP.
 *
 * The integration surface is deliberately one function:
 *
 *     generateStack(prompt): Promise<Stack>
 *
 * The AI never emits JavaScript/HTML. It returns canonical Stack JSON, which
 * flows through the SAME `validateStack()` gate the .stack importer uses.
 * Because AI output ≡ .stack content, nothing else in the app needs to know
 * the AI exists.
 */

import type { Action, Card, Stack, Widget, WidgetType } from '../model/types'

/** The closed vocabulary the AI may emit. */
export const AI_CAPABILITIES = {
  schema: 'cardstacks/1',
  widgetTypes: ['text', 'field', 'button', 'image', 'shape', 'slider', 'canvas', 'grid'],
  actionTypes: ['goToCard', 'goBack', 'showMessage', 'changeText', 'setValue', 'setVisibility', 'openUrl'],
  events: ['click', 'change', 'submit', 'load'],
  maxCards: 20,
  maxWidgetsPerCard: 40,
} as const

/** Compact capability manifest sent to the model. */
export function buildManifest(): string {
  return JSON.stringify(AI_CAPABILITIES)
}

/** JSON Schema constraining the model's output to the canonical model. */
export const OUTPUT_SCHEMA = {
  type: 'object',
  required: ['schema', 'name', 'cards'],
  properties: {
    schema: { const: 'cardstacks/1' },
    name: { type: 'string' },
    variables: { type: 'object' },
    cards: {
      type: 'array',
      items: {
        type: 'object',
        required: ['name', 'widgets'],
        properties: {
          name: { type: 'string' },
          background: { type: 'string' },
          widgets: {
            type: 'array',
            items: {
              type: 'object',
              required: ['type'],
              properties: {
                type: { enum: AI_CAPABILITIES.widgetTypes },
                name: { type: 'string' },
                x: { type: 'number' },
                y: { type: 'number' },
                w: { type: 'number' },
                h: { type: 'number' },
                props: { type: 'object' },
                events: { type: 'array' },
              },
            },
          },
        },
      },
    },
  },
} as const

export type AiCard = Card
export type AiWidget = Widget
export type AiAction = Action
export type AiStack = Stack
export type AiWidgetType = WidgetType

/** Placeholder — the real implementation lands after the MVP ships. */
export async function generateStack(_prompt: string): Promise<Stack> {
  throw new Error('AI builder is not implemented yet.')
}
