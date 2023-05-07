---
title: X7 Finance Docs
tags: [docs]
---

Coming soon. {% .lead %}
{% callout  title="Interested in launching on Xchange?" %}
The X7 DAO has been granted 20 NFT's that provide project founders with a discount on their initial liquidity loan. X7 DAO is seeking innovative builders looking to launch their project in the next 30 days. To get in touch - [reach out here](https://docs.google.com/forms/d/e/1FAIpQLSd4aN9IA0HOMTUQBRPHMEswtsfPzjsVOGhZlLS9BxviIqJHaQ/viewform)
{% /callout %}

## Xchange is coming

### LoanTerm Example

```js
interface IX7LoanTerms is IERC721 {

    // The interface that will be used to define loan terms.
    //
    // Initial loan terms will be:
    //
    //  10% origination fee
    //  25% premimum, due in 5 installments over the lifetime of the loan.
    //
    //  Principal due prior to the end of the loan period.
    //
    //  Failure to pay the premium or principal on time makes the loan eligible for liquidation
    //
    //  In the future, the DAO will control which Loan Terms are active.


    // Mints and returns the loan tokenID. Escrows the origination fee.
    function originate(uint256 amount) external payable returns (uint256);


    // Cancels the originated loan prior to funding.
    // Only the originator may call this.
    // A fee is collected to prevent griefing.
    // The remainder of the origination fee is returned.
    function cancel(uint256 tokenId) external;


    // Funds the loan.
    //
    // Sets the "fee receiver" to the msg.sender.
    //  If the lending pool has enough capital, the lending pool will fund.
    //  If the lending pool does not have enough capital, a third party may choose to fund.
    //
    // Collects the origination fee from escrow.
    //  A portion is guarenteed to go to the lending pool fee destinations
    //  If a third party funded the loan, they receive a portion of the origination fee
    function fund(uint256 tokenId) external payable;


    // Pays against the premiums, preventing liquidation.
    // returns true if the loan is "current".
    function payPremium(uint256 tokenId) external payable returns (bool);


    // Pays off remaining premiums + principal
    function payOff(uint256 tokenId) external payable;


    // Pays against whatever is outstanding. Refunds the remainder.
    // Pays all premiums first, and then the principal.
    // A fee token contract could hard code this call to repay the loan automatically.
    // returns false until the loan is completely satisfied, then returns true.
    function pay(uint256 tokenId) external payable returns (bool);

}
```
