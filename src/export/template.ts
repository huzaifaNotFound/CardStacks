import { patternCssRules } from '../styles/patterns'

/**
 * CSS embedded in standalone exports. Self-contained: no external fonts or
 * assets except the two Silkscreen subsets passed in as data URIs.
 */
export function composeExportCss(args: { widgetsCss: string; font400: string; font700: string }): string {
  return `
@font-face{font-family:'Silkscreen';font-weight:400;src:url("${args.font400}") format('woff2');}
@font-face{font-family:'Silkscreen';font-weight:700;src:url("${args.font700}") format('woff2');}
*{box-sizing:border-box}
html,body{height:100%;margin:0;background:#000}
body{font-family:'Silkscreen',monospace;color:#000;-webkit-font-smoothing:none;text-rendering:geometricPrecision}
#cs-root{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:32px;background:#000}
.cs-card{position:relative;border:1px solid #000;box-shadow:3px 3px 0 0 #000;flex:none;background:#fff}
.cs-card .w{position:absolute;font-family:'Silkscreen',monospace}
.cs-modal{position:fixed;inset:0;display:grid;place-items:center;background:rgba(0,0,0,.35);z-index:9999}
.cs-modal-box{background:#fff;border:2px solid #000;border-radius:0;box-shadow:3px 3px 0 0 #000;min-width:200px;max-width:340px;padding:12px;display:flex;flex-direction:column;align-items:center;gap:8px}
.cs-modal-text{font-size:12px;text-align:center;white-space:pre-wrap;word-break:break-word;max-height:180px;overflow:auto}
.cs-modal-box button{font-family:'Silkscreen',monospace;font-size:10px;background:#fff;color:#000;border:1px solid #000;border-radius:0;padding:4px 16px;box-shadow:2px 2px 0 0 #000;cursor:pointer}
.cs-modal-box button:hover{background:#000;color:#fff}
${patternCssRules()}
${args.widgetsCss}
`
}

const esc = (s: string) => s.replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' })[c] as string)

export function buildExportHtml(args: {
  title: string
  stackJson: string
  runtimeSrc: string
  css: string
}): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${esc(args.title)}</title>
<style>${args.css}</style>
</head>
<body>
<div id="cs-root"></div>
<script type="application/json" id="cardstacks-data">${args.stackJson}</script>
<script>${args.runtimeSrc}</script>
<script>
(function () {
  var el = document.getElementById('cs-root')
  var raw = document.getElementById('cardstacks-data').textContent
  var stack = JSON.parse(raw)
  window.CardStacksRuntime.mount(el, stack, {})
})()
</script>
</body>
</html>`
}
