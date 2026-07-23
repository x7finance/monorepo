import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address } from "@graphprotocol/graph-ts"
import { handleDiscountAuthoritySet } from "../src/xchange-factory"
import { createDiscountAuthoritySetEvent } from "./xchange-factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let oldAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newAddress = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newDiscountAuthoritySetEvent = createDiscountAuthoritySetEvent(
      oldAddress,
      newAddress
    )
    handleDiscountAuthoritySet(newDiscountAuthoritySetEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("DiscountAuthoritySet created and stored", () => {
    assert.entityCount("DiscountAuthoritySet", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "DiscountAuthoritySet",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "oldAddress",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "DiscountAuthoritySet",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "newAddress",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
