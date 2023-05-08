import { ConnectionComponent } from "@/components/connect-button"
import { Web3Wrapper } from "@/components/web3-wrapper"

export default function DAOPage() {
  return (
    <Web3Wrapper>
      hello
      <ConnectionComponent />
      <div>dao</div>
    </Web3Wrapper>
  )
}
