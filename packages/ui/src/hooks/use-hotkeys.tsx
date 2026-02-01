"use client"

import * as React from "react"

type KeyboardModifiers = {
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
}

type HotkeyCallback = (event: KeyboardEvent) => void

type HotkeyOptions = {
  enabled?: boolean
  preventDefault?: boolean
  enableOnFormElements?: boolean
}

const FORM_ELEMENTS = ["INPUT", "TEXTAREA", "SELECT"]

function parseHotkey(hotkey: string): { key: string } & KeyboardModifiers {
  const parts = hotkey.toLowerCase().split("+")
  const modifiers: KeyboardModifiers = {}
  let key = ""

  for (const part of parts) {
    const trimmed = part.trim()
    switch (trimmed) {
      case "ctrl":
      case "control":
        modifiers.ctrl = true
        break
      case "shift":
        modifiers.shift = true
        break
      case "alt":
        modifiers.alt = true
        break
      case "meta":
      case "cmd":
      case "command":
        modifiers.meta = true
        break
      default:
        key = trimmed
    }
  }

  return { key, ...modifiers }
}

function matchesHotkey(
  event: KeyboardEvent,
  parsedHotkey: ReturnType<typeof parseHotkey>
): boolean {
  const { key, ctrl, shift, alt, meta } = parsedHotkey

  if (event.key.toLowerCase() !== key) return false
  if (ctrl && !event.ctrlKey) return false
  if (shift && !event.shiftKey) return false
  if (alt && !event.altKey) return false
  if (meta && !event.metaKey) return false

  return true
}

export function useHotkeys(
  hotkey: string,
  callback: HotkeyCallback,
  options: HotkeyOptions = {}
): void {
  const {
    enabled = true,
    preventDefault = true,
    enableOnFormElements = false,
  } = options

  const parsedHotkey = React.useMemo(() => parseHotkey(hotkey), [hotkey])
  const callbackRef = React.useRef(callback)
  callbackRef.current = callback

  React.useEffect(() => {
    if (!enabled) return

    const handler = (event: KeyboardEvent) => {
      if (
        !enableOnFormElements &&
        FORM_ELEMENTS.includes((event.target as HTMLElement).tagName)
      ) {
        return
      }

      if (matchesHotkey(event, parsedHotkey)) {
        if (preventDefault) {
          event.preventDefault()
        }
        callbackRef.current(event)
      }
    }

    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [enabled, preventDefault, enableOnFormElements, parsedHotkey])
}
