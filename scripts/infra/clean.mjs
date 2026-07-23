#!/usr/bin/env bun

/**
 * Cross-platform clean script for monorepo packages
 * Maximum performance with parallel native deletion
 *
 * Usage: bun scripts/infra/clean.mjs [directories...]
 * Defaults: .turbo node_modules dist .next .cache
 */

import { resolve } from "node:path"

// Get directories from args or use defaults
const args = process.argv.slice(2)
const dirsToClean =
  args.length > 0 ? args : [".turbo", "node_modules", "dist", ".next", ".cache"]

const cwd = process.cwd()

console.warn("Cleaning directories...")

// Delete all paths in parallel using native OS commands
const deletions = dirsToClean.map(async (dir) => {
  const fullPath = resolve(cwd, dir)
  try {
    await Bun.$`rm -rf ${fullPath}`.quiet()
    return { dir, success: true }
  } catch (error) {
    return { dir, success: false, error: error.message }
  }
})

// Wait for all deletions to complete
const results = await Promise.all(deletions)

// Report results deterministically
let cleaned = 0
for (const result of results) {
  if (result.success) {
    console.warn(`  Removed: ${result.dir}`)
    cleaned++
  } else {
    console.error(
      `  Failed to remove ${result.dir}: ${result.error || "Unknown error"}`
    )
  }
}

console.warn(
  `\nDone! Cleaned ${cleaned} director${cleaned === 1 ? "y" : "ies"}`
)
