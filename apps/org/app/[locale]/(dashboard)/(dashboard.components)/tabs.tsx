import { ChainIdentifierEnum } from "@x7/common"
// @ts-expect-error todo: fix this
import { Button } from "@x7/ui/button"
import { cn } from "@x7/utils"

interface TabButtonInterface {
  id: ChainIdentifierEnum | string
  label: string
  color: string
}

export const CHAIN_TAB_BUTTONS: TabButtonInterface[] = [
  { id: ChainIdentifierEnum.erc, label: "Ethereum", color: "blue" },
  { id: ChainIdentifierEnum.bsc, label: "Binance", color: "yellow" },
  { id: ChainIdentifierEnum.polygon, label: "Polygon", color: "purple" },
  { id: ChainIdentifierEnum.arbitrum, label: "Arbitrum", color: "blue" },
  { id: ChainIdentifierEnum.optimism, label: "Optimism", color: "red" },
]

export const LOAN_TAB_BUTTONS: TabButtonInterface[] = [
  { id: "001", label: "001 - Simple", color: "lime" },
  { id: "002", label: "002 - Amortizing", color: "cyan" },
  { id: "003", label: "003 - Interest", color: "amber" },
]

interface TabButtonsProps {
  activeTab: ChainIdentifierEnum | string
  handleTabChange: (id: ChainIdentifierEnum | string) => void
  tabs: TabButtonInterface[]
}

export const TabButtons = ({
  activeTab,
  handleTabChange,
  tabs,
}: TabButtonsProps) => {
  return (
    <div className="flex space-x-2 sm:space-x-4 md:justify-center">
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

interface TabButtonProps extends TabButtonInterface {
  active: ChainIdentifierEnum | string
  onClick: (id: ChainIdentifierEnum | string) => void
}

export const TabButton = ({
  id,
  label,
  color,
  active,
  onClick,
}: TabButtonProps) => {
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
