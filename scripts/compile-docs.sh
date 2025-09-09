#!/usr/bin/env bash
set -euo pipefail

# Compile website docs into a single markdown file in nav order.
# Usage: bash scripts/compile-docs.sh [OUTPUT_FILE]

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
DOCS_ROOT="$ROOT_DIR/contents/docs"
ROUTES_FILE="$ROOT_DIR/lib/routes-config.ts"
OUTFILE="${1:-$ROOT_DIR/LISA_DOCS_COMPILED.md}"

if [[ ! -f "$ROUTES_FILE" ]]; then
  echo "Cannot find $ROUTES_FILE" >&2
  exit 1
fi

node - <<'NODE' "$ROUTES_FILE" "$DOCS_ROOT" "$OUTFILE"
const fs = require('fs');
const path = require('path');

const [, , routesPath, docsRoot, outFile] = process.argv;
const src = fs.readFileSync(routesPath, 'utf8');

// Extract the ROUTES array literal safely by bracket matching
const start = src.indexOf('export const ROUTES');
if (start === -1) {
  throw new Error('export const ROUTES not found in ' + routesPath);
}
const eqIdx = src.indexOf('=', start);
const arrStart = src.indexOf('[', eqIdx);
let depth = 0, endIdx = -1;
for (let i = arrStart; i < src.length; i++) {
  const ch = src[i];
  if (ch === '[') depth++;
  else if (ch === ']') { depth--; if (depth === 0) { endIdx = i; break; } }
}
if (endIdx === -1) {
  throw new Error('Failed to find end of ROUTES array');
}
const arrayLiteral = src.slice(arrStart, endIdx + 1);

let ROUTES;
try {
  // Evaluate the array literal as JS
  ROUTES = eval(arrayLiteral);
} catch (err) {
  console.error('Failed to eval ROUTES array literal:', err);
  process.exit(1);
}

// Flatten to ordered sections and pages
function flattenSections(routes) {
  const sections = [];
  for (const section of routes) {
    const sec = {
      title: section.title,
      href: section.href,
      noLink: !!section.noLink,
      items: []
    };
    if (Array.isArray(section.items)) {
      for (const item of section.items) {
        sec.items.push({ title: item.title, href: section.href + item.href });
      }
    }
    sections.push(sec);
  }
  return sections;
}

const sections = flattenSections(ROUTES);

function readMdxBody(filePath) {
  if (!fs.existsSync(filePath)) return null;
  let txt = fs.readFileSync(filePath, 'utf8');
  // Strip YAML frontmatter if present
  if (txt.startsWith('---')) {
    const end = txt.indexOf('\n---');
    if (end !== -1) {
      txt = txt.slice(end + 4);
      if (txt.startsWith('\n')) txt = txt.slice(1);
    }
  }
  return txt.trimEnd();
}

function readMdxExact(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf8').trimEnd();
}

const out = [];
for (const sec of sections) {
  // Add section header
  out.push(`# ${sec.title}`, '');
  
  // Process the section itself if it has content
  const rel = sec.href.replace(/^\//, '');
  const mdxPath = path.join(docsRoot, rel, 'index.mdx');
  const body = readMdxExact(mdxPath);
  if (body) out.push(body, '');
  
  // If section has items, process them too
  if (sec.items && Array.isArray(sec.items)) {
    for (const item of sec.items) {
      const itemRel = item.href.replace(/^\//, '');
      const itemMdxPath = path.join(docsRoot, itemRel, 'index.mdx');
      const itemBody = readMdxExact(itemMdxPath);
      if (itemBody) out.push(itemBody, '');
    }
  }
  
  // Add separator between sections
  out.push('---', '');
}

fs.writeFileSync(outFile, out.join('\n'), 'utf8');
console.log('Wrote', outFile);
NODE

echo "Done. Output -> $OUTFILE"


