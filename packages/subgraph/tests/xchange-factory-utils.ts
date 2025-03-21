import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  DiscountAuthoritySet,
  FailsafeLiquidatorSet,
  FeeToSet,
  OwnershipTransferred,
  PairCreated,
  TrustedSet
} from "../generated/XchangeFactory/XchangeFactory"

export function createDiscountAuthoritySetEvent(
  oldAddress: Address,
  newAddress: Address
): DiscountAuthoritySet {
  let discountAuthoritySetEvent = changetype<DiscountAuthoritySet>(
    newMockEvent()
  )

  discountAuthoritySetEvent.parameters = new Array()

  discountAuthoritySetEvent.parameters.push(
    new ethereum.EventParam(
      "oldAddress",
      ethereum.Value.fromAddress(oldAddress)
    )
  )
  discountAuthoritySetEvent.parameters.push(
    new ethereum.EventParam(
      "newAddress",
      ethereum.Value.fromAddress(newAddress)
    )
  )

  return discountAuthoritySetEvent
}

export function createFailsafeLiquidatorSetEvent(
  trustedPrincipal: Address,
  isTrusted: boolean
): FailsafeLiquidatorSet {
  let failsafeLiquidatorSetEvent = changetype<FailsafeLiquidatorSet>(
    newMockEvent()
  )

  failsafeLiquidatorSetEvent.parameters = new Array()

  failsafeLiquidatorSetEvent.parameters.push(
    new ethereum.EventParam(
      "trustedPrincipal",
      ethereum.Value.fromAddress(trustedPrincipal)
    )
  )
  failsafeLiquidatorSetEvent.parameters.push(
    new ethereum.EventParam("isTrusted", ethereum.Value.fromBoolean(isTrusted))
  )

  return failsafeLiquidatorSetEvent
}

export function createFeeToSetEvent(
  oldAddress: Address,
  newAddress: Address
): FeeToSet {
  let feeToSetEvent = changetype<FeeToSet>(newMockEvent())

  feeToSetEvent.parameters = new Array()

  feeToSetEvent.parameters.push(
    new ethereum.EventParam(
      "oldAddress",
      ethereum.Value.fromAddress(oldAddress)
    )
  )
  feeToSetEvent.parameters.push(
    new ethereum.EventParam(
      "newAddress",
      ethereum.Value.fromAddress(newAddress)
    )
  )

  return feeToSetEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPairCreatedEvent(
  token0: Address,
  token1: Address,
  pair: Address,
  param3: BigInt
): PairCreated {
  let pairCreatedEvent = changetype<PairCreated>(newMockEvent())

  pairCreatedEvent.parameters = new Array()

  pairCreatedEvent.parameters.push(
    new ethereum.EventParam("token0", ethereum.Value.fromAddress(token0))
  )
  pairCreatedEvent.parameters.push(
    new ethereum.EventParam("token1", ethereum.Value.fromAddress(token1))
  )
  pairCreatedEvent.parameters.push(
    new ethereum.EventParam("pair", ethereum.Value.fromAddress(pair))
  )
  pairCreatedEvent.parameters.push(
    new ethereum.EventParam("param3", ethereum.Value.fromUnsignedBigInt(param3))
  )

  return pairCreatedEvent
}

export function createTrustedSetEvent(
  trustedPrincipal: Address,
  isTrusted: boolean
): TrustedSet {
  let trustedSetEvent = changetype<TrustedSet>(newMockEvent())

  trustedSetEvent.parameters = new Array()

  trustedSetEvent.parameters.push(
    new ethereum.EventParam(
      "trustedPrincipal",
      ethereum.Value.fromAddress(trustedPrincipal)
    )
  )
  trustedSetEvent.parameters.push(
    new ethereum.EventParam("isTrusted", ethereum.Value.fromBoolean(isTrusted))
  )

  return trustedSetEvent
}
