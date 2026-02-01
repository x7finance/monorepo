/* oxlint-disable @typescript-eslint/prefer-nullish-coalescing */
/* oxlint-disable react-hooks/exhaustive-deps */
"use client";

import type { HTMLAttributes } from "react";
import React, { lazy, Suspense, useMemo } from "react";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useBalance } from "wagmi";

import { cn } from "@x7/css";
import { ChevronDownIcon, CogIcon } from "@x7/icons";
import type { ButtonProps } from "@x7/ui/button";
import { Button } from "@x7/ui/button";
import { CircleLoading } from "@x7/ui/circle-loading";
import { SliderOver } from "@x7/ui/slide-over";

import { useWeb3Config } from "~/lib/providers/web3";
import { useSlideOverStore } from "~/lib/stores/slide-over";

// Use React.lazy to dynamically import WalletSlide
const WalletSlide = lazy(() =>
  import("./wallet-slider").then((module) => ({ default: module.WalletSlide })),
);

export function ConnectionComponent(
  props: HTMLAttributes<HTMLButtonElement> &
    ButtonProps & { "data-iscog"?: boolean },
) {
  const { size, variant, ...rest } = props;

  const isSlideOverOpen = useSlideOverStore((state) => state.isSlideOverOpen);

  const setIsSlideOverOpen = useSlideOverStore(
    (state) => state.setIsSlideOverOpen,
  );

  const { wagmiConfig } = useWeb3Config();

  const { address } = useAccount();
  const { data: account_ } = useBalance({ address, config: wagmiConfig });

  const renderConnectButton = useMemo(() => {
    return (
      <ConnectButton.Custom>
        {({ account, chain, openChainModal, openConnectModal, mounted }) => {
          return (
            <div
              className={cn(
                mounted
                  ? `w-full opacity-100`
                  : `aria-hidden pointer-events-none select-none opacity-0`,
                `connection-layout-shift`,
              )}
            >
              {(() => {
                if (!mounted || !account || !chain) {
                  if (props["data-iscog"]) {
                    return (
                      <button
                        className="flex items-center gap-x-1 px-4 py-4 transition-opacity hover:opacity-80"
                        onClick={(e) => {
                          e.preventDefault();

                          openConnectModal();
                        }}
                      >
                        <CogIcon className="h-4 w-4" />
                      </button>
                    );
                  }
                  return (
                    <Button
                      size={size ?? "default"}
                      variant={variant ?? "default"}
                      id="connectButton"
                      className={cn(
                        "flex items-center",
                        "h-8 px-2 text-2xs sm:h-10 sm:px-4 sm:py-2 sm:text-sm",
                      )}
                      onClick={(e) => {
                        e.preventDefault();

                        openConnectModal();
                      }}
                      {...rest}
                    >
                      Connect Wallet
                    </Button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <Button onClick={openChainModal}>Wrong network</Button>
                  );
                }

                return (
                  <div className="flex gap-1 text-zinc-700 dark:text-zinc-100 sm:gap-2">
                    <Button
                      variant={"outline"}
                      onClick={openChainModal}
                      className={cn(
                        "flex items-center border-zinc-300 dark:border-zinc-700",
                        "h-8 px-2 text-2xs sm:h-10 sm:px-4 sm:py-2 sm:text-sm",
                      )}
                      type="button"
                      {...props}
                    >
                      {chain.hasIcon && (
                        <div
                          className="inline-block h-5 w-5 overflow-hidden rounded-full sm:mr-2"
                          style={{
                            background: chain.iconBackground,
                          }}
                        >
                          {chain.iconUrl && (
                            <Image
                              className="flex items-center justify-center"
                              alt={chain.name ?? "Chain icon"}
                              src={chain.iconUrl}
                              width={24}
                              height={24}
                            />
                          )}
                        </div>
                      )}

                      <span className="hidden sm:flex">{chain.name}</span>
                      <span className="hidden sm:flex">
                        <ChevronDownIcon className="relative left-2 h-6 w-6" />
                      </span>
                    </Button>

                    <Button
                      variant={"outline"}
                      onClick={() => setIsSlideOverOpen(!isSlideOverOpen)}
                      className={cn(
                        "border-zinc-300 font-bold dark:border-zinc-700",
                        "h-8 px-2 text-2xs sm:h-10 sm:px-4 sm:py-2 sm:text-sm",
                      )}
                      data-testid="account-button"
                      type="button"
                    >
                      <span className="hidden xs:flex">
                        {account_?.formatted
                          ? ` ${Number(account_.formatted).toFixed(3)}`
                          : ""}
                        {account_?.symbol ? ` ${account_.symbol}` : ""}
                      </span>
                      <span className="mx-2 hidden text-zinc-300 dark:text-zinc-700 xs:flex">
                        |
                      </span>
                      {account.displayName}
                    </Button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    );
  }, [props["data-iscog"], isSlideOverOpen, account_]);

  return (
    <>
      {renderConnectButton}
      <SliderOver
        open={isSlideOverOpen}
        setOpen={() => setIsSlideOverOpen(!isSlideOverOpen)}
      >
        {/* Wrap WalletSlide with Suspense to handle loading state */}
        <Suspense fallback={<CircleLoading size={8} />}>
          <WalletSlide />
        </Suspense>
      </SliderOver>
    </>
  );
}
