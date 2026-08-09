import { buildExport } from '../src/export/exportHtml'
import { newStack, newWidget } from '../src/model/factories'

export function makeTestStackJson() {
  const s = newStack('Export Test')
  s.cards[0].name = 'Home'
  const b = newWidget('button')
  b.props.label = 'Go Back'
  b.events = [{ event: 'click', actions: [{ type: 'goBack' }] }]
  const t = newWidget('text')
  t.props.content = 'Hello {{name}}'
  s.variables = { name: 'World' }
  s.cards[0].widgets.push(b, t)
  return JSON.stringify(s)
}

export function getTestHtml(): string {
  const s = newStack('Export Test')
  s.cards[0].name = 'Home'
  const b = newWidget('button')
  b.props.label = 'Go Back'
  b.events = [{ event: 'click', actions: [{ type: 'goBack' }] }]
  const t = newWidget('text')
  t.props.content = 'Hello {{name}}'
  s.variables = { name: 'World' }
  s.cards[0].widgets.push(b, t)
  return buildExport(s)
}
