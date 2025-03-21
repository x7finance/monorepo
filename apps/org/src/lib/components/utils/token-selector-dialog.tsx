/* eslint-disable @typescript-eslint/unbound-method */
"use client";

import type { FC, ReactNode } from "react";
import React, { useMemo, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "@x7/css";
import { XIcon } from "@x7/icons";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@x7/ui/dialog";
import type { ChainId, Currency, Token } from "@x7/utils";

import { TokenListContent } from "~/lib/components/utils/token-list-content";

// Custom DialogContent without portal
const CustomDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <>
    <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] dark:bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-white p-6 shadow-lg duration-200 dark:border-zinc-800",
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
        <XIcon className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </>
));
CustomDialogContent.displayName = "CustomDialogContent";

interface TokenSelectorProps {
  id: string;
  selected: Currency | undefined;
  chainId: ChainId;
  onSelect(currency: Currency): void;
  children: ReactNode;
  currencies?: Record<string, Token>;
  includeNative?: boolean;
  hidePinnedTokens?: boolean;
  hideSearch?: boolean;
}

export const TokenSelectorDialog: FC<TokenSelectorProps> = ({
  includeNative = true,
  id,
  selected,
  onSelect,
  chainId,
  currencies,
  hidePinnedTokens,
  hideSearch,
  children,
}) => {
  const [open, setOpen] = useState(false);

  // Memoize the props to ensure they are stable
  const tokenListProps = useMemo(
    () => ({
      open,
      setOpen,
      includeNative,
      id,
      selected,
      onSelect,
      chainId,
      currencies,
      hidePinnedTokens,
      hideSearch,
    }),
    [
      open,
      includeNative,
      id,
      selected,
      onSelect,
      chainId,
      currencies,
      hidePinnedTokens,
      hideSearch,
    ],
  );

  return (
    <Dialog modal={false} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <CustomDialogContent className="flex! min-h-[85vh] flex-col justify-start">
        <DialogHeader>
          <DialogTitle>Select a token</DialogTitle>
          <DialogDescription>
            from the default list or search for a token by symbol or address.
          </DialogDescription>
        </DialogHeader>
        <TokenListContent {...tokenListProps} />
      </CustomDialogContent>
    </Dialog>
  );
};
