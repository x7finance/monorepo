import { ColorHueToggle } from "./color-hue-toggle"
// import { HotPairsToggle } from "./hot-pairs-toggle";
import { RecipientAddressToggle } from "./recipient-address-toggle"
import { TradePercentageToggle } from "./trade-percentage-toggle"

export function FeaturesPanel() {
  return (
    <>
      {/* <HotPairsToggle /> */}
      <TradePercentageToggle />
      <RecipientAddressToggle />
      <ColorHueToggle />
    </>
  )
}
