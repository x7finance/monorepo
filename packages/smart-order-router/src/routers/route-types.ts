import type { Token } from "@x7/utils"

import {
  MixedRouteSDK,
  RouteV2 as V2RouteRaw,
  RouteV3 as V3RouteRaw,
} from "@x7/sdk"
import { Protocol } from "@x7/utils"

export class V3Route extends V3RouteRaw<Token, Token> {
  protocol: Protocol.V3 = Protocol.V3
}

export class V2Route extends V2RouteRaw<Token, Token> {
  protocol: Protocol.V2 = Protocol.V2
}

export class MixedRoute extends MixedRouteSDK<Token, Token> {
  protocol: Protocol.MIXED = Protocol.MIXED
}
