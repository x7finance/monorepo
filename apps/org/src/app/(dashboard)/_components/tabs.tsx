import * as React from "react";

import { cn } from "@x7/css";
import { ChevronDownIcon } from "@x7/icons";
import { useLocalStorage } from "@x7/ui";
import { Button } from "@x7/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@x7/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@x7/ui/popover";
import { ChainId, ChainIdentifierEnum } from "@x7/utils";

interface TabButtonInterface {
  id: ChainIdentifierEnum | string;
  label: string;
  color: string;
}

export const CHAIN_MAPPING = {
  [ChainIdentifierEnum.eth]: ChainId.ETHEREUM,
  [ChainIdentifierEnum.eth_testnet]: ChainId.ETHEREUM_TESTNET,
  [ChainIdentifierEnum.bsc]: ChainId.BSC,
  [ChainIdentifierEnum.bsc_testnet]: ChainId.BSC_TESTNET,
  [ChainIdentifierEnum.polygon]: ChainId.POLYGON,
  [ChainIdentifierEnum.polygon_testnet]: ChainId.POLYGON_TESTNET,
  [ChainIdentifierEnum.arbitrum]: ChainId.ARBITRUM,
  [ChainIdentifierEnum.arbitrum_testnet]: ChainId.ARBITRUM_TESTNET,
  [ChainIdentifierEnum.optimism]: ChainId.OPTIMISM,
  [ChainIdentifierEnum.optimism_testnet]: ChainId.OPTIMISM_TESTNET,
  [ChainIdentifierEnum.base]: ChainId.BASE,
  [ChainIdentifierEnum.base_testnet]: ChainId.BASE_TESTNET,
};

export const CHAIN_TAB_BUTTONS: TabButtonInterface[] = [
  { id: ChainIdentifierEnum.base, label: "Base", color: "blue" },
  { id: ChainIdentifierEnum.eth, label: "Ethereum", color: "blue" },
  { id: ChainIdentifierEnum.bsc, label: "Binance", color: "yellow" },
  { id: ChainIdentifierEnum.polygon, label: "Polygon", color: "purple" },
  { id: ChainIdentifierEnum.arbitrum, label: "Arbitrum", color: "blue" },
  { id: ChainIdentifierEnum.optimism, label: "Optimism", color: "red" },
  {
    id: ChainIdentifierEnum.base_testnet,
    label: "Base Sepolia",
    color: "blue",
  },
  {
    id: ChainIdentifierEnum.eth_testnet,
    label: "Ethereum Sepolia",
    color: "blue",
  },
  {
    id: ChainIdentifierEnum.arbitrum_testnet,
    label: "Arbitrum Sepolia",
    color: "blue",
  },
  {
    id: ChainIdentifierEnum.optimism_testnet,
    label: "Optimism Sepolia",
    color: "red",
  },
  {
    id: ChainIdentifierEnum.polygon_testnet,
    label: "Polygon Amoy",
    color: "purple",
  },
  {
    id: ChainIdentifierEnum.bsc_testnet,
    label: "Binance Smart Chain Testnet",
    color: "yellow",
  },
];

export const LOAN_TAB_BUTTONS: TabButtonInterface[] = [
  { id: "001", label: "001", color: "lime" },
  { id: "003", label: "003", color: "amber" },
  { id: "004", label: "004", color: "blue" },
  { id: "005", label: "005", color: "cyan" },
];

interface TabButtonsProps {
  activeTab: ChainIdentifierEnum | string;
  handleTabChange: (id: ChainIdentifierEnum | string) => void;
  tabs: TabButtonInterface[];
  title: string;
  placeholderSearch: string;
}

export const Combobox = ({
  activeTab,
  handleTabChange,
  tabs,
  title,
  placeholderSearch,
}: TabButtonsProps) => {
  const [open, setOpen] = React.useState(false);
  const [storedTab, setStoredTab] = useLocalStorage<string>(title, activeTab);

  const handleSelect = (value: string) => {
    handleTabChange(value);
    setStoredTab(value);
    setOpen(false);
  };

  return (
    <div className="mr-8 flex flex-wrap justify-start">
      <p className="relative left-1 mr-2 flex items-center text-sm text-muted-foreground">
        {title}
      </p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            iconPosition="end"
            icon={ChevronDownIcon}
            iconProps={{
              className: cn("ml-auto"),
            }}
            className="w-[150px] justify-start"
          >
            {storedTab ? (
              <>
                {tabs.find((tab) => tab.id === storedTab)?.label ??
                  placeholderSearch}
              </>
            ) : (
              <>{placeholderSearch}</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="rounded-none border-zinc-100 p-0! dark:border-zinc-800"
          side="right"
          align="start"
        >
          <Command className="bg-zinc-100 text-foreground dark:bg-zinc-900">
            <CommandInput placeholder={placeholderSearch} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {tabs.map((tab) => (
                  <CommandItem
                    key={tab.id}
                    value={tab.id}
                    onSelect={handleSelect}
                  >
                    <span
                      className={cn(
                        "mr-2 h-4 w-4",
                        tab.id === storedTab ? "opacity-100" : "opacity-40",
                      )}
                    />
                    <span>{tab.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
