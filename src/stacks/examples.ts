import type { Stack } from '../model/types'
import { adventureStack } from './adventure'
import { birthdayStack } from './birthday'
import { notesStack } from './notes'
import { paintStack } from './paint'
import { portfolioStack } from './portfolio'
import { rpsStack } from './rps'
import { todoStack } from './todo'

/**
 * Example stacks shown on the Home screen.
 *
 * These are REAL stacks — valid canonical Stack JSON using the same generic
 * widgets and actions a user has. There is no privileged runtime path for
 * them. (They get cloned into localStorage on first open by the loader.)
 */

export interface Example {
  id: string
  label: string
  make: () => Stack
}

export const EXAMPLES: Example[] = [
  { id: 'birthday', label: 'Birthday Card', make: birthdayStack },
  { id: 'adventure', label: 'Adventure', make: adventureStack },
  { id: 'rps', label: 'Rock Paper Scissors', make: rpsStack },
  { id: 'notes', label: 'Notes', make: notesStack },
  { id: 'paint', label: 'Paint', make: paintStack },
  { id: 'todo', label: 'To-Do', make: todoStack },
  { id: 'portfolio', label: 'Portfolio', make: portfolioStack },
]
