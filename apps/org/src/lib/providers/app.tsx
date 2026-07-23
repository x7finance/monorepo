/* oxlint-disable @typescript-eslint/no-unsafe-return */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */
"use client"

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { memo, Suspense, useEffect, useMemo } from "react"

import { Toaster } from "@x7/ui/sonner"
import { SplashController } from "@x7/ui/splash"
import { TooltipProvider } from "@x7/ui/tooltip"
import { TransactionStoreProvider } from "~/lib/providers/tx"
import { Web3Provider } from "~/lib/providers/web3"
import {
  createMutationCacheConfig,
  createQueryCacheConfig,
  DEFAULT_QUERY_OPTIONS,
} from "~/lib/query"

import { AlphaRouterProvider } from "./router"

interface ProvidersProps {
  children: React.ReactNode
  // oxlint-disable-next-line @typescript-eslint/no-explicit-any
  initialState?: any
}

const MemoizedTooltipProvider = memo(TooltipProvider)
const MemoizedSplashController = memo(SplashController)

function WalletAccessibility() {
  useEffect(() => {
    const shadowObservers: MutationObserver[] = []
    const observedShadowRoots = new WeakSet<ShadowRoot>()
    let syncModal = () => {}

    const observeShadowRoot = (shadowRoot: ShadowRoot) => {
      if (observedShadowRoots.has(shadowRoot)) {
        return
      }

      observedShadowRoots.add(shadowRoot)
      const observer = new MutationObserver(() => syncModal())
      observer.observe(shadowRoot, {
        attributes: true,
        attributeFilter: ["class"],
        childList: true,
        subtree: true,
      })
      shadowObservers.push(observer)
    }

    const patchReownElement = (element: HTMLElement) => {
      const root = element.getRootNode()
      const shadowHost = root instanceof ShadowRoot ? root.host : null
      const shadowHostTag = shadowHost?.tagName.toLowerCase()

      if (
        element.tagName === "WUI-CARD" &&
        element.getAttribute("role") === "alertdialog"
      ) {
        element.setAttribute("aria-label", "Connect wallet")
      }

      if (element instanceof HTMLButtonElement) {
        if (shadowHost?.getAttribute("data-testid") === "w3m-header-close") {
          element.setAttribute("aria-label", "Close wallet dialog")
        } else if (shadowHostTag === "wui-icon-link") {
          element.setAttribute("aria-label", "Wallet help")
        } else if (shadowHostTag === "wui-input-element") {
          element.setAttribute("aria-label", "Clear wallet search")
        } else if (shadowHostTag === "wui-certified-switch") {
          element.setAttribute(
            "aria-label",
            "Show WalletConnect certified wallets only"
          )
        }
      }

      if (
        element instanceof HTMLInputElement &&
        element.type === "checkbox" &&
        shadowHostTag === "wui-switch"
      ) {
        element.setAttribute("aria-hidden", "true")
        element.disabled = true
        element.tabIndex = -1

        const hostRoot = shadowHost?.getRootNode()
        const certifiedSwitch =
          hostRoot instanceof ShadowRoot ? hostRoot.host : null
        const toggle = certifiedSwitch?.shadowRoot?.querySelector("button")
        toggle?.setAttribute("aria-pressed", String(element.checked))
      }

      if (element instanceof HTMLImageElement) {
        element.alt = ""
      }
    }

    const patchReownTree = (shadowRoot: ShadowRoot) => {
      observeShadowRoot(shadowRoot)

      shadowRoot.querySelectorAll<HTMLElement>("*").forEach((element) => {
        patchReownElement(element)

        if (element.shadowRoot) {
          patchReownTree(element.shadowRoot)
        }
      })
    }

    syncModal = () => {
      document
        .querySelectorAll<HTMLElement>(
          '[data-testid^="rk-wallet-option-"] [role="img"]'
        )
        .forEach((icon) => icon.setAttribute("aria-hidden", "true"))

      const walletConnectShadowRoot =
        document.querySelector("wcm-modal")?.shadowRoot

      if (walletConnectShadowRoot) {
        observeShadowRoot(walletConnectShadowRoot)
        const modal =
          walletConnectShadowRoot.querySelector<HTMLElement>("#wcm-modal")

        if (modal) {
          const isOpen = modal.classList.contains("wcm-active")

          modal.setAttribute("aria-label", "Connect wallet")
          modal.setAttribute("aria-hidden", isOpen ? "false" : "true")
          modal.inert = !isOpen
        }
      }

      const reownShadowRoot = document.querySelector("w3m-modal")?.shadowRoot

      if (reownShadowRoot) {
        patchReownTree(reownShadowRoot)
      }
    }

    syncModal()

    const documentObserver = new MutationObserver(() => syncModal())
    documentObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      documentObserver.disconnect()
      shadowObservers.forEach((observer) => observer.disconnect())
    }
  }, [])

  return null
}

export function AppProviders(props: ProvidersProps) {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        queryCache: new QueryCache(createQueryCacheConfig()),
        mutationCache: new MutationCache(createMutationCacheConfig()),
        defaultOptions: DEFAULT_QUERY_OPTIONS,
      }),
    []
  )

  const toastOptions = useMemo(
    () => ({
      style: {
        bottom: 30,
      },
    }),
    []
  )

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense>
        <Web3Provider initialState={props.initialState}>
          <WalletAccessibility />
          <div className="xl:max-w-none">
            <div className="relative z-0">
              <TransactionStoreProvider>
                <AlphaRouterProvider>
                  <MemoizedTooltipProvider>
                    <MemoizedSplashController>
                      {props.children}
                      <div id="dialog-root" />
                    </MemoizedSplashController>
                  </MemoizedTooltipProvider>
                </AlphaRouterProvider>
              </TransactionStoreProvider>
            </div>
          </div>

          <Toaster richColors closeButton toastOptions={toastOptions} />
        </Web3Provider>
      </Suspense>
    </QueryClientProvider>
  )
}
