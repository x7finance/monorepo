import { PairCreated as PairCreatedEvent } from "../generated/PancakeFactory/PancakeFactory";
import { PoolCreated as PoolCreatedEvent } from "../generated/PancakeV3Factory/PancakeV3Factory";
import { PairCreated, PoolCreated } from "../generated/schema";

export function handlePairCreated(event: PairCreatedEvent): void {
  let entity = new PairCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );
  entity.token0 = event.params.token0;
  entity.token1 = event.params.token1;
  entity.pair = event.params.pair;
  entity.param3 = event.params.param3;
  entity.factory = "pancakeswap";

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handlePoolCreated(event: PoolCreatedEvent): void {
  let entity = new PoolCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  );
  entity.token0 = event.params.token0;
  entity.token1 = event.params.token1;
  entity.fee = event.params.fee;
  entity.pair = event.params.pool;
  entity.tickSpacing = event.params.tickSpacing;
  entity.factory = "pancakeswap";

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
