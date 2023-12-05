import { UnbondInfo } from "./unbond-info";
import { Nomic } from "./nomic";
import { Coin } from "@oraichain/oraibtc-wasm";

export interface Delegation {
  address: string;
  liquid: Array<Coin>;
  staked: bigint;
  unbonding: UnbondInfo[];
}

export function getDelegations(
  nomic: Nomic,
  address: string
): Promise<Delegation[]> {
  return nomic.delegations(address);
}
