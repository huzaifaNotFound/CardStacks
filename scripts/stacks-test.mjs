import { EXAMPLES } from '../src/stacks/examples.ts'
import { validateStack } from '../src/model/validate.ts'
import { useStore } from '../src/app/store.ts'

let ok = true
for (const ex of EXAMPLES) {
  const { stack, warnings } = validateStack(ex.make())
  console.log(
    `${warnings.length === 0 ? 'PASS' : 'FAIL'}  ${ex.label} (${stack.cards.length} cards, ${stack.cards.reduce(
      (n, c) => n + c.widgets.length,
      0,
    )} widgets)${warnings.length ? ' — ' + warnings.join('; ') : ''}`,
  )
  if (warnings.length) ok = false

  // Every goToCard target must resolve.
  for (const c of stack.cards) {
    for (const w of c.widgets) {
      for (const ev of w.events) {
        for (const a of ev.actions) {
          if (a.type === 'goToCard' && !stack.cards.some((x) => x.id === a.cardId)) {
            console.log(`  FAIL goToCard ${a.cardId} missing`)
            ok = false
          }
          if ((a.type === 'changeText' || a.type === 'setVisibility') && a.targetId) {
            const found = c.widgets.some((x) => x.id === a.targetId || x.name === a.targetId)
            if (!found) {
              console.log(`  FAIL action target ${a.targetId} missing on card ${c.name}`)
              ok = false
            }
          }
        }
      }
    }
  }
}

// Store must accept every example without throwing.
for (const ex of EXAMPLES) {
  useStore.getState().loadStack(ex.make())
}
console.log(ok ? '\nALL PREMADE STACKS VALID' : '\nSTACK VALIDATION FAILED')
process.exit(ok ? 0 : 1)
