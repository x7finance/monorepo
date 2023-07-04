import { ChainIdentifierEnum } from "@x7/common"
import { Button } from "@x7/ui"
import { cn } from "@x7/utils"

export const CHAIN_TAB_BUTTONS = [
  { id: ChainIdentifierEnum.erc, label: "Ethereum", color: "blue" },
  { id: ChainIdentifierEnum.bsc, label: "Binance", color: "yellow" },
  { id: ChainIdentifierEnum.polygon, label: "Polygon", color: "purple" },
  { id: ChainIdentifierEnum.arbitrum, label: "Arbitrum", color: "blue" },
  { id: ChainIdentifierEnum.optimism, label: "Optimism", color: "red" },
]

export const LOAN_TAB_BUTTONS = [
  { id: "001", label: "001 - Simple", color: "lime" },
  { id: "002", label: "002 - Amortizing", color: "cyan" },
  { id: "003", label: "003 - Interest", color: "amber" },
]

export const TabButtons = ({ activeTab, handleTabChange, tabs }) => {
  return (
    <div className="md:justify-center space-x-2 flex sm:space-x-4">
      {tabs.map((tabButton) => (
        <TabButton
          key={tabButton.id}
          id={tabButton.id}
          label={tabButton.label}
          color={tabButton.color}
          active={activeTab}
          onClick={handleTabChange}
        />
      ))}
    </div>
  )
}

export const TabButton = ({ id, label, color, active, onClick }) => {
  const isActive = active === id

  return (
    <Button
      size={"sm"}
      variant={"outline"}
      className={cn(
        ` ${
          isActive
            ? `bg-${color}-600/5 text-${color}-600 ring-${color}-600 ring-1 ring-${color}-600`
            : " text-zinc-500"
        }`
      )}
      onClick={() => onClick(id)}
    >
      {label}
    </Button>
  )
}
