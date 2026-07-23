import { Tabs, TabsList, TabsTrigger } from "@x7/ui/tabs"

// import { ActivityTab } from "./tabs/activity";
import { LoansTab } from "./tabs/loans"
import { PoolsTab } from "./tabs/pools"
import { TokensTab } from "./tabs/tokens"

export function WalletTabbedContent() {
  return (
    <Tabs defaultValue="tokens" className="w-full">
      <TabsList className="grid w-full grid-cols-4 bg-transparent">
        <TabsTrigger value="tokens">Tokens</TabsTrigger>
        <TabsTrigger value="pools">Pools</TabsTrigger>
        <TabsTrigger value="loans">Loans</TabsTrigger>
        {/* <TabsTrigger value="activity">Activity</TabsTrigger> */}
      </TabsList>

      <TokensTab />
      <PoolsTab />
      <LoansTab />
      {/* <ActivityTab /> */}
    </Tabs>
  )
}
