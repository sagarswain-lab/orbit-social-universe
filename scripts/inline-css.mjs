import fs from 'node:fs'
import path from 'node:path'

const distDir = path.resolve('dist')
const htmlPath = path.join(distDir, 'index.html')

if (!fs.existsSync(htmlPath)) {
  console.log('No dist/index.html found to inline CSS.')
  process.exit(0)
}

let html = fs.readFileSync(htmlPath, 'utf-8')

// Match any <link rel="stylesheet" ... href="/assets/index-*.css">
const linkRegex = /<link\s+[^>]*rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/i
const match = html.match(linkRegex)

if (match) {
  const cssHref = match[1]
  const relativeCssPath = cssHref.startsWith('/') ? cssHref.slice(1) : cssHref
  const fullCssPath = path.join(distDir, relativeCssPath)

  if (fs.existsSync(fullCssPath)) {
    const cssContent = fs.readFileSync(fullCssPath, 'utf-8')
    // Replace the render-blocking <link> tag with inlined critical styles
    html = html.replace(match[0], `<style>\n${cssContent}\n</style>`)
    fs.writeFileSync(htmlPath, html, 'utf-8')
    console.log(`[inline-css] Inlined ${relativeCssPath} (${(cssContent.length / 1024).toFixed(1)} KiB) into dist/index.html. Render-blocking CSS eliminated.`)
  } else {
    console.warn(`[inline-css] CSS file not found at ${fullCssPath}`)
  }
} else {
  console.log('[inline-css] No external CSS link found to inline.')
}
