import { CheckCircleIcon, CircleDashedIcon, Loader2 } from "@x7/icons"

const ChecklistItemStatus = {
  Completed: "completed",
  InProgress: "inprogress",
  Pending: "pending",
}

const checklistItems = [
  {
    text: "Launch default Xchange infrastructure on org",
    status: ChecklistItemStatus.Completed,
  },
  {
    text: "Launch X7D minting on 5 launched chains",
    status: ChecklistItemStatus.Completed,
  },
  {
    text: "Get to 100 followers on Farcaster",
    status: ChecklistItemStatus.InProgress,
  },
  {
    text: "Deploy X7 Token Burner contract on BASE",
    status: ChecklistItemStatus.Completed,
  },
  {
    text: "Deploy Ecosystem Splitter contract on BASE",
    status: ChecklistItemStatus.Completed,
  },
  {
    text: "Deploy Treasury Splitter contract on BASE",
    status: ChecklistItemStatus.Completed,
  },
  {
    text: "Deploy Lending Pool Reserve contract on BASE",
    status: ChecklistItemStatus.Completed,
  },
  {
    text: "Deploy Xchange Factory contract on BASE",
    status: ChecklistItemStatus.Completed,
  },
  {
    text: "Move launch liquidity to BASE",
    status: ChecklistItemStatus.Completed,
  },
  {
    text: "Deploy Liquidity Hub on BASE",
    status: ChecklistItemStatus.Pending,
  },
  {
    text: "Deploy Discount Authorities on BASE",
    status: ChecklistItemStatus.Pending,
  },
  {
    text: "Deploy Profit Share Splitter on BASE",
    status: ChecklistItemStatus.Pending,
  },
  {
    text: "Deploy Xchange Discount Authority on BASE",
    status: ChecklistItemStatus.Pending,
  },
  {
    text: "Deploy Xchange Router on BASE",
    status: ChecklistItemStatus.Pending,
  },
  {
    text: "Deploy Lending Pool on BASE",
    status: ChecklistItemStatus.Pending,
  },
  {
    text: "Deploy Loans Contracts on BASE",
    status: ChecklistItemStatus.Pending,
  },
  {
    text: "Update Litepaper for Xchange BASE Launch",
    status: ChecklistItemStatus.Completed,
  },
  {
    text: "Update Whitepaper for Xchange BASE Launch",
    status: ChecklistItemStatus.InProgress,
  },
  {
    text: "Utility NFT's on BASE",
    status: ChecklistItemStatus.Pending,
  },
  {
    text: "Deploy default pairs contracts on 6 chains",
    status: ChecklistItemStatus.Completed,
  },
  {
    text: "Enable lending pool on BASE",
    status: ChecklistItemStatus.InProgress,
  },
  {
    text: "Enable decentralized RPC provider on Xchange",
    status: ChecklistItemStatus.Completed,
  },
  {
    text: "Enable decentralized trading on Xchange",
    status: ChecklistItemStatus.Completed,
  },
  {
    text: "Release Loan Origination Form",
    status: ChecklistItemStatus.Completed,
  },
  { text: "Enable X7D Minting on BASE", status: ChecklistItemStatus.Completed },
  { text: "Harden airdrop strategy", status: ChecklistItemStatus.InProgress },
  {
    text: "Secure launch marketing partners",
    status: ChecklistItemStatus.InProgress,
  },
  {
    text: "Schedule Official Launch Date",
    status: ChecklistItemStatus.Pending,
  },
  {
    text: "Open source the Xchange code",
    status: ChecklistItemStatus.InProgress,
  },
]

export function LiveLaunchList() {
  return (
    <div className="my-8">
      <div>
        <h2 className="mb-8 text-3xl font-bold">Live Launch List</h2>
        <ul className="space-y-6 pl-2">
          {checklistItems.map((item) => (
            <li key={item.text} className="flex items-center">
              {item.status === ChecklistItemStatus.Completed ? (
                <>
                  <CheckCircleIcon className="mr-2 h-6 w-6 text-emerald-500" />
                  <span className="text-xl">{item.text}</span>
                </>
              ) : item.status === ChecklistItemStatus.InProgress ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin text-yellow-500" />
                  <span className="text-xl text-yellow-500">{item.text}</span>
                </>
              ) : (
                <>
                  <CircleDashedIcon className="mr-2 h-6 w-6 text-zinc-500" />
                  <span className="text-xl text-zinc-500">{item.text}</span>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
