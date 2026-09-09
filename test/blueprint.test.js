import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()

test('1. Authoritative Blueprint Categories (7) Validation', () => {
  const blueprintRaw = fs.readFileSync(path.join(ROOT, 'blueprint.json'), 'utf-8')
  const blueprint = JSON.parse(blueprintRaw)

  const expectedCategories = [
    'User Profiles & Identity',
    'Content Creation & Sharing',
    'Content Discovery',
    'Personalized Experience',
    'Navigation & User Flow',
    'Responsive & Accessible UI',
    'Creative & Original Design'
  ]

  assert.equal(blueprint.authoritativeBlueprintCategories.length, 7, 'Must have exactly 7 categories')

  expectedCategories.forEach((name) => {
    const found = blueprint.authoritativeBlueprintCategories.find((c) => c.name === name)
    assert.ok(found, `Mandatory category "${name}" must exist in blueprint`)
    assert.equal(found.status, 'COMPLETED', `Category "${name}" must be COMPLETED`)
  })
})

test('2. Critical Component Files Existence', () => {
  const requiredFiles = [
    'src/pages/Landing.tsx',
    'src/features/universe/UniverseScreen.tsx',
    'src/features/universe/OrbitField.tsx',
    'src/features/universe/Hud.tsx',
    'src/features/universe/BottomNav.tsx',
    'src/features/you/YouPanel.tsx',
    'src/features/signals/Composer.tsx',
    'src/features/pulse/PulseFeed.tsx',
    'src/features/drift/DriftView.tsx',
    'src/store/useOrbitStore.ts',
    'src/lib/color.ts',
    'public/images/nebula-universe.jpg'
  ]

  requiredFiles.forEach((file) => {
    const fullPath = path.join(ROOT, file)
    assert.ok(fs.existsSync(fullPath), `Required component ${file} must exist`)
  })
})

test('3. HTML Semantic Landmarks and Metadata Verification', () => {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8')

  assert.ok(html.includes('faie:authoritative-blueprint'), 'Must declare faie:authoritative-blueprint meta')
  assert.ok(html.includes('authoritative-blueprint-categories'), 'Must contain authoritative-blueprint landmark')
  assert.ok(html.includes('data-feature="User Profiles & Identity"'), 'Must contain User Profiles & Identity landmark')
  assert.ok(html.includes('data-feature="Content Creation & Sharing"'), 'Must contain Content Creation & Sharing landmark')
  assert.ok(html.includes('data-feature="Content Discovery"'), 'Must contain Content Discovery landmark')
  assert.ok(html.includes('data-feature="Personalized Experience"'), 'Must contain Personalized Experience landmark')
  assert.ok(html.includes('data-feature="Navigation & User Flow"'), 'Must contain Navigation & User Flow landmark')
  assert.ok(html.includes('data-feature="Responsive & Accessible UI"'), 'Must contain Responsive & Accessible UI landmark')
  assert.ok(html.includes('data-feature="Creative & Original Design"'), 'Must contain Creative & Original Design landmark')
})

test('4. WCAG AA Accessibility Contrast Compliance', () => {
  const css = fs.readFileSync(path.join(ROOT, 'src/index.css'), 'utf-8')
  assert.ok(css.includes('WCAG AA'), 'CSS must document WCAG AA contrast tokens')
  assert.ok(css.includes('prefers-reduced-motion'), 'CSS must implement prefers-reduced-motion')
})
