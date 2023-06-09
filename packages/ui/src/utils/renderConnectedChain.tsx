import { BlockchainType, ChainEnum } from "common"
import { CloudOffIcon, glyph, IconWrapper } from "icons"

export function renderConnectedChain(chain?: BlockchainType) {
  switch (chain) {
    case ChainEnum.erc:
      return <IconWrapper glyph={glyph.ethereum} size={5} />
    case ChainEnum.bsc:
      return <IconWrapper glyph={glyph.bsc} size={5} />
    case ChainEnum.polygon:
      return <IconWrapper glyph={glyph.polygon} size={5} />
    case ChainEnum.optimism:
      return <IconWrapper glyph={glyph.optimism} size={5} />
    case ChainEnum.arbitrum:
      return <IconWrapper glyph={glyph.arbitrum} size={5} />
    case ChainEnum.offline:
      return (
        <CloudOffIcon className="h-5 w-5 text-gray-900" aria-hidden="true" />
      )
    default:
      return <CloudOffIcon className="h-5 w-5 text-black" aria-hidden="true" />
  }
}
