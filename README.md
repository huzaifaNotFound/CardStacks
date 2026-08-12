# CardStacks

A modern HyperCard-inspired visual creation tool. Build interactive "stacks" of cards, place widgets on them, wire up simple declarative actions, and run or export the result as a standalone HTML file.

## Features

- Stack/card editor with a classic monochrome Macintosh interface
- Widgets: text, button, field, image, shape, slider, canvas, grid
- Tools: widgets (select/move/resize), interact (click to run), pencil, eraser, line, box, oval, text
- Declarative actions: go to card, go back, show message, change text, set value, set visibility, open URL
- Variables with `{{name}}` interpolation and field/slider/image `bind`
- Run mode and editor "interact" mode share one runtime
- Autosave to localStorage
- Save/open editable `.stack` files (Stack JSON)
- Export to standalone HTML with the stack JSON embedded, and re-import exported HTML back into the editor
- Undo/redo, keyboard shortcuts (Ctrl+Z/Y/S/E/N/D, Delete, 1-7 and T for tools)
- Premade example stacks: Birthday Card Maker, The Lost Lighthouse, Rock Paper Scissors, Notes, Paint, To-Do, Portfolio
- 1-bit pixel-art assets generated for the examples and embedded as data URIs

## Getting started

```bash
npm install
npm run dev        # start the dev server
```

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |
| `npm run typecheck` | Type-check only |
| `npm run verify` | Run all checks: typecheck, tests, export pipeline, build |
| `npm run test:runtime` | Unit tests for the standalone runtime |
| `npm run test:stacks` | Validate all premade stacks |
| `npm run test:export` | Build and verify the HTML export pipeline |

## Data model

One canonical JSON model drives the editor, runtime, persistence, export, and import:

```
Stack
  cards
    widgets
      props
      events
        actions
  variables
```

`.stack` files are serialized Stack JSON. Exported HTML embeds the same JSON in a `cardstacks-data` script tag, which is how it can be imported back for editing.

## Project layout

```
src/
  app/       store, shortcuts, app shell
  model/     types, factories, validation, interpolation
  actions/   action catalog + interpreter
  widgets/   widget registry + editor renderers
  editor/    toolbar, menus, card list, canvas, inspector
  runtime/   framework-free standalone runtime (shared with export)
  export/    HTML export template + builder
  io/        localStorage persistence, file open/save/import
  home/      launcher screen
  stacks/    premade stacks + shared art
  ai/        planned AI builder (stubs only)
  styles/    monochrome design system
scripts/     tests and image-conversion tooling
```

## Tech

Vite, React 18, TypeScript, Zustand, nanoid. No UI framework, no backend, no build-time complexity in the export: the runtime is plain JS inlined into exported HTML.

## Exporting

Use `File > Export HTML` (or the EXPORT button) to download a single self-contained HTML file. It works offline, contains the full Stack JSON, and can be re-imported via `File > Import HTML`.
