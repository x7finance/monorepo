"use client"

import { XCHANGE } from "common"
import { cn } from "utils"
import { Button } from "ui-server"
import { ChainsArray, ChevronDownIcon } from "icons"

import { Fragment } from "react"
import { Menu, Transition } from "@headlessui/react"

export function Dropdown({
  name,
  label,
  type,
  contract,
}: {
  name: JSX.Element | string
  label: string
  type: string
  contract: string
}) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button as="span" className="inline-flex w-full justify-center">
          <Button
            icon={<ChevronDownIcon className="w-4 h-4" />}
            iconPosition="end"
            variant={type === "scan" ? "outline" : "default"}
            aria-label={label}
          >
            {name}
          </Button>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-zinc-100 rounded-md bg-zinc-100 shadow-lg ring-1 ring-black focus:outline-none dark:bg-zinc-800 dark:ring-zinc-50/7.5">
          <div className="py-1">
            {ChainsArray.map((c, id) => {
              return (
                <Menu.Item key={`${id}-${type}-${c?.scanner}`}>
                  {({ active }) => (
                    <a
                      href={generateLink(c, type, contract)}
                      rel="noopener noreferrer"
                      target="_blank"
                      className={cn(
                        active
                          ? "bg-zinc-300 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100"
                          : "text-zinc-700 dark:text-zinc-300",
                        "group flex items-center px-4 py-2 text-sm"
                      )}
                    >
                      {c.icon}
                      <span className="ml-2">{c.name}</span>
                    </a>
                  )}
                </Menu.Item>
              )
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

function generateLink(c: any, type: string, contract: string) {
  switch (type) {
    case "xchange":
      // TODO: figure out if I can the chain query param will trigger a network change
      return `${XCHANGE}/#/swap?outputCurrency=${contract}`
    case "scan":
      return `${c?.scannerLink}/token/${contract}`
    default:
      return ""
  }
}
