#!/usr/bin/env bun

import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT_DIR = path.resolve(SCRIPT_DIR, "../..")
const AVAILABLE_CORES = Math.max(1, os.availableParallelism())

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function parseTurboConcurrency(
  value: string,
  availableCores: number
): number | null {
  const trimmed = value.trim()
  const asInteger = Number.parseInt(trimmed, 10)
  if (trimmed.endsWith("%")) {
    const percent = Number.parseInt(trimmed.slice(0, -1), 10)
    if (Number.isNaN(percent)) {
      return null
    }
    return clamp(
      Math.floor((availableCores * percent) / 100),
      1,
      availableCores
    )
  }

  if (Number.isNaN(asInteger)) {
    return null
  }

  return clamp(asInteger, 1, availableCores)
}

function getDefaultTurboConcurrency(availableCores: number): number {
  return clamp(Math.floor(availableCores * 0.5), 2, 8)
}

function parseArgs(argv: string[]) {
  let task: string | undefined
  const forwarded: string[] = []

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg?.startsWith("--task=")) {
      task = arg.slice("--task=".length)
      continue
    }
    if (arg === "--task") {
      task = argv[index + 1]
      index += 1
      continue
    }
    if (arg) {
      forwarded.push(arg)
    }
  }

  return { task: task ?? "test", forwarded }
}

const { task, forwarded } = parseArgs(process.argv.slice(2))
const resolvedTurboConcurrency =
  parseTurboConcurrency(process.env.TURBO_CONCURRENCY ?? "", AVAILABLE_CORES) ??
  getDefaultTurboConcurrency(AVAILABLE_CORES)
const resolvedVitestMaxWorkers = clamp(
  Math.floor(AVAILABLE_CORES / resolvedTurboConcurrency),
  1,
  3
)

const localTurbo = path.resolve(REPO_ROOT_DIR, "node_modules/.bin/turbo")
const turboPath = Bun.file(localTurbo).size
  ? localTurbo
  : (Bun.which("turbo") ?? "turbo")
const proc = Bun.spawnSync(
  [turboPath, task, "--output-logs=full", ...forwarded],
  {
    cwd: REPO_ROOT_DIR,
    stdio: ["inherit", "inherit", "inherit"],
    env: {
      ...process.env,
      TURBO_CONCURRENCY:
        process.env.TURBO_CONCURRENCY ?? String(resolvedTurboConcurrency),
      VITEST_MAX_WORKERS:
        process.env.VITEST_MAX_WORKERS ?? String(resolvedVitestMaxWorkers),
      TURBO_LOG_ORDER: process.env.TURBO_LOG_ORDER ?? "stream",
    },
  }
)

process.exit(proc.exitCode ?? 0)
