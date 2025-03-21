---
title: Swaps
---

## Brief Overview

Token swaps in Xchange provide a simple method to trade one ERC-20 token for another.

For end-users, swapping is an intuitive process: a user selects an input token and an output token, specifies the input amount, and the Xchange protocol calculates the corresponding amount of the output token they will receive. With just one click, the swap is executed, and the user immediately receives the output token in their wallet.

In this guide, we'll explore the protocol-level mechanics of a swap on Xchange to gain a deeper understanding of how this decentralized exchange operates.

Unlike traditional trading platforms that rely on order books for liquidity representation and price determination, Xchange takes a different approach. It utilizes an automated market maker mechanism to provide instant feedback on exchange rates and slippage.

As we learned in the [Protocol Overview](/docs/guides/how-xchange-works), each pair on Xchange is backed by a liquidity pool. Liquidity pools are smart contracts holding balances of two distinct tokens and enforcing rules regarding their deposit and withdrawal.

These rules are governed by the constant product formula. Whenever a user withdraws (purchases) one token, an equivalent proportion of the other token must be deposited (sold) to maintain the constant product. This ensures the efficient functioning of the Xchange protocol.

### Swap function

At the most basic level, all swaps in Xchange happen within a single function, aptly named swap:

```js
function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data);
```

### Receiving Tokens

As evident from the function signature, Xchange also requires swap callers to indicate the number of output tokens they wish to receive. This information is provided through the amount{0,1}Out parameters, which correspond to the desired amount of token{0,1}.

### Sending Tokens

In Xchange, the process of receiving tokens as payment for a swap works differently compared to typical smart contracts. Instead of requiring callers to make an approval on the token contract and then calling a function that utilizes `transferFrom`, Xchange pairs employ an alternative method.

When interacting with Xchange pairs, the tokens are not immediately transferred. Rather, the pairs check their token balances at the end of each interaction. Subsequently, at the beginning of the next interaction, the current balances are compared against the stored values to determine the amount of tokens that were sent by the current interactor.

As a result, tokens must be transferred to the pairs before the swap function is called. An exception to this rule is Flash Swaps. To safely use the swap function, it should be called from another smart contract. The alternative approach of transferring tokens to the pair and then calling swap is not considered safe to do non-atomically, as it would leave the sent tokens vulnerable to arbitrage. To maintain security and prevent arbitrage-related issues, calling the swap function from another smart contract is the recommended method.

### Sending Tokens With an ILL

In addition to the information mentioned above, when a liquidity pair has been funded with an ILL, the smart contract employs a safeguard to ensure that selling tokens in the pair will not result in reducing the loan amount below a certain threshold. If the proposed sell transaction would leave an insufficient loan amount, the sell will be rejected by the contract.

This mechanism is implemented to maintain the required level of liquidity in the pair and to avoid potential issues with loan repayments or liquidity shortages that could arise if the loan amount is excessively reduced through token sales.

See [how lending works](/docs/guides/how-lending-works) for an explanation on this
