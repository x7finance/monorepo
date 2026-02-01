import type { IV3SubgraphProvider, V3SubgraphPool } from "./subgraph-provider"

import { URISubgraphProvider } from "../uri-subgraph-provider"

export class V3URISubgraphProvider
  extends URISubgraphProvider<V3SubgraphPool>
  implements IV3SubgraphProvider {}
