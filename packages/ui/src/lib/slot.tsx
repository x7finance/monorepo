"use client"

import * as React from "react"

/**
 * Merges refs into a single callback ref
 */
function mergeRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return (value) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(value)
      } else if (ref !== null && ref !== undefined) {
        ;(ref as React.MutableRefObject<T | null>).current = value
      }
    }
  }
}

/**
 * Merges props, with event handlers being composed together
 */
function mergeProps(
  slotProps: Record<string, unknown>,
  childProps: Record<string, unknown>
): Record<string, unknown> {
  const overrideProps: Record<string, unknown> = { ...childProps }

  for (const propName in childProps) {
    const slotPropValue = slotProps[propName]
    const childPropValue = childProps[propName]

    // Compose event handlers
    if (
      propName.startsWith("on") &&
      typeof slotPropValue === "function" &&
      typeof childPropValue === "function"
    ) {
      overrideProps[propName] = (...args: unknown[]) => {
        childPropValue(...args)
        slotPropValue(...args)
      }
    }
    // Merge className
    else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue]
        .filter(Boolean)
        .join(" ")
    }
    // Merge style
    else if (propName === "style") {
      overrideProps[propName] = {
        ...(slotPropValue as object),
        ...(childPropValue as object),
      }
    }
  }

  return { ...slotProps, ...overrideProps }
}

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

/**
 * Slot component that renders its child element with merged props.
 * This is a custom implementation replacing @radix-ui/react-slot.
 */
const Slot = React.forwardRef<HTMLElement, SlotProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props

  if (!React.isValidElement(children)) {
    return null
  }

  const childRef = (
    children as React.ReactElement & { ref?: React.Ref<unknown> }
  ).ref

  return React.cloneElement(children, {
    ...mergeProps(slotProps, children.props as Record<string, unknown>),
    ref: forwardedRef ? mergeRefs(forwardedRef, childRef) : childRef,
  } as React.Attributes)
})

Slot.displayName = "Slot"

export { Slot }
