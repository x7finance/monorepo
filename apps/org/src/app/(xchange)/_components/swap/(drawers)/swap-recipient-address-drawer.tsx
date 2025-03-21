"use client";

import React, { useEffect, useState } from "react";
import { isAddress } from "viem";

import { cn } from "@x7/css";
import { PlusCircleIcon } from "@x7/icons";
import { useRecipientAddress, useRecipientAddressState } from "@x7/ui";
import { Button } from "@x7/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@x7/ui/drawer";
import { Input } from "@x7/ui/input";
import { Label } from "@x7/ui/label";
import { PasteButton } from "@x7/ui/paste-button";

export function SwapRecipientAddressDrawer() {
  const [recipientAddressState] = useRecipientAddressState();
  const [recipientAddress] = useRecipientAddress();
  const [open, setOpen] = useState(false);

  const displayAccountName = recipientAddress
    ? formatAddress(recipientAddress)
    : "Add Address";

  return (
    recipientAddressState && (
      <div className="ring-offset-background relative mt-2 rounded-lg border p-2">
        <div className="flex items-center justify-between">
          <span className="text-socket-primary font-medium">
            Recipient Address
          </span>
          <div className="flex items-center font-medium">
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger>
                <div className="flex items-center justify-between">
                  <Button variant="ghost" name="ChartPanelNewestButton">
                    <PlusCircleIcon className="h-4 w-4" />
                    <span className="text-socket-primary font-medium">
                      {displayAccountName}
                    </span>
                  </Button>
                </div>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader className="text-left">
                  <DrawerTitle className="text-center">
                    Edit Recipient Address
                  </DrawerTitle>
                  <DrawerDescription className="text-center">
                    Make changes to the recipient address here. Click save when
                    done.
                  </DrawerDescription>
                </DrawerHeader>
                <ProfileForm className="px-4" />
                <DrawerFooter className="pt-2">
                  <DrawerClose>
                    <Button variant="outline">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    )
  );
}

function ProfileForm({ className }: { className: string }) {
  const [inputValue, setInputValue] = useState("");
  const [recipientAddress, setRecipientAddress] = useRecipientAddress();

  useEffect(() => {
    setInputValue(recipientAddress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useRecipientAddress]);

  const handlePaste = (pastedContent: string) => {
    setInputValue(pastedContent);
  };

  const handleClick = () => {
    if (!isAddress(inputValue)) {
      return;
    }
    setRecipientAddress(inputValue);
  };

  const handleClear = () => {
    setInputValue("");
    setRecipientAddress("");
  };

  return (
    <div
      className={cn(
        "mx-auto grid w-full max-w-xl items-start gap-4 text-center",
        className,
      )}
    >
      <div className="grid gap-2">
        <Label htmlFor="address">Address</Label>
        <div className="relative flex">
          <Input
            id="address"
            placeholder="Destination Address"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          {inputValue && (
            <Button
              type="button"
              onClick={handleClear}
              variant={"outline"}
              className="ml-2"
            >
              Clear
            </Button>
          )}
          <PasteButton
            onPaste={handlePaste}
            title=""
            buttonPositionClass="inline-block ml-2"
          />
        </div>
      </div>
      {!isAddress(recipientAddress) && (
        <Button type="button" onClick={handleClick}>
          Save changes
        </Button>
      )}
    </div>
  );
}

function formatAddress(address: string): string {
  const leadingChars = 5;
  const trailingChars = 5;

  return address.length < leadingChars + trailingChars
    ? address
    : `${address.substring(0, leadingChars)}\u2026${address.substring(
        address.length - trailingChars,
      )}`;
}
