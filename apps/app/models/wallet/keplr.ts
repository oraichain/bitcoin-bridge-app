// @ts-nocheck
import { Key } from "@keplr-wallet/types";
import { Wallet } from "./wallet";
import { config } from "../../config";
import { ChainInfo, OraiBtcSubnetChain } from "../ibc-chain";
// import { SigningStargateClient } from '@cosmjs/stargate';
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { makeStdTx } from "@cosmjs/amino";

export class Keplr implements Wallet {
  address?: string;
  connected = false;
  name?: string;
  logo = "/keplr.svg";
  queryableBalances = ["Oraichain Mainnet", "OraiBtcSubnet"];

  key?: Key;

  async isPresent() {
    return !window.keplr;
  }

  async connect() {
    await this.suggestChain();
    await window.keplr.enable(config.chainId);
    localStorage.setItem("nomic/wallet", "keplr");
    const key = await window.keplr.getKey(config.chainId);
    this.address = key.bech32Address;
    this.name = key.name;
    this.connected = true;
  }

  async sign(data: string) {
    const signer = window.keplr.getOfflineSigner(config.chainId);
    const signDoc = JSON.parse(data);

    const res = await signer.signAmino(this.address, signDoc);
    const tx = makeStdTx(signDoc, res.signature);

    const resOut = await Wallet.broadcast(tx);
    if (resOut.checkTx.code !== 0) {
      throw new Error(resOut.checkTx.log);
    }

    if (resOut.deliverTx?.code !== 0) {
      throw new Error(resOut.deliverTx?.log);
    }
  }

  async provideSigner(chain: ChainInfo) {
    const offlineSigner = window.keplr.getOfflineSigner(
      OraiBtcSubnetChain.chainId
    );
    try {
      const cosmJs = await SigningCosmWasmClient.connectWithSigner(
        chain.rpcEndpoint,
        offlineSigner
      );
      return cosmJs;
    } catch (e) {
      console.error("error provide signer: ", e);
    }
  }

  async suggestChain() {
    await window.keplr.experimentalSuggestChain({
      chainId: "Oraichain",
      chainName: "Oraichain",
      rpc: "https://rpc.orai.io",
      rest: "https://lcd.orai.io",
      bip44: {
        coinType: 118,
      },
      bech32Config: {
        bech32PrefixAccAddr: "orai",
        bech32PrefixAccPub: "orai" + "pub",
        bech32PrefixValAddr: "orai" + "valoper",
        bech32PrefixValPub: "orai" + "valoperpub",
        bech32PrefixConsAddr: "orai" + "valcons",
        bech32PrefixConsPub: "orai" + "valconspub",
      },
      currencies: [
        {
          coinDenom: "orai",
          coinMinimalDenom: "orai",
          coinDecimals: 6,
        },
      ],
      feeCurrencies: [
        {
          coinDenom: "orai",
          coinMinimalDenom: "orai",
          coinDecimals: 6,
          gasPriceStep: {
            low: 0.003,
            average: 0.005,
            high: 0.007,
          },
        },
      ],
      stakeCurrency: {
        coinDenom: "orai",
        coinMinimalDenom: "orai",
        coinDecimals: 6,
      },
      features: ["stargate"],
    });

    await window.keplr.experimentalSuggestChain({
      chainId: "oraibtc-mainnet-1",
      chainName: "OraiBtc Bridge",
      rpc: "https://btc.rpc.orai.io",
      rest: "https://btc.lcd.orai.io",
      networkType: "cosmos",
      stakeCurrency: {
        coinDenom: "ORAIBTC",
        coinMinimalDenom: "uoraibtc",
        coinDecimals: 6,
        gasPriceStep: {
          low: 0,
          average: 0,
          high: 0,
        },
        coinImageUrl:
          "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
      },
      bip44: {
        coinType: 118,
      },
      coinType: 118,
      bech32Config: {
        bech32PrefixAccAddr: "oraibtc",
        bech32PrefixAccPub: "oraibtc" + "pub",
        bech32PrefixValAddr: "oraibtc" + "valoper",
        bech32PrefixValPub: "oraibtc" + "valoperpub",
        bech32PrefixConsAddr: "oraibtc" + "valcons",
        bech32PrefixConsPub: "oraibtc" + "valconspub",
      },
      // List of all coin/tokens used in this chain.
      currencies: [
        {
          coinDenom: "ORAIBTC",
          coinMinimalDenom: "uoraibtc",
          coinDecimals: 6,
          gasPriceStep: {
            low: 0,
            average: 0,
            high: 0,
          },
          coinImageUrl:
            "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
        },
        {
          coinDenom: "OBTC",
          coinMinimalDenom: "usat",
          coinDecimals: 14,
          gasPriceStep: {
            low: 0,
            average: 0,
            high: 0,
          },
          coinImageUrl:
            "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
        },
      ],

      feeCurrencies: [
        {
          coinDenom: "ORAIBTC",
          coinMinimalDenom: "uoraibtc",
          coinDecimals: 6,
          gasPriceStep: {
            low: 0,
            average: 0,
            high: 0,
          },
          coinImageUrl:
            "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
        },
        {
          coinDenom: "OBTC",
          coinMinimalDenom: "usat",
          coinDecimals: 14,
          gasPriceStep: {
            low: 0,
            average: 0,
            high: 0,
          },
          coinImageUrl:
            "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
        },
      ],
      features: ["stargate", "ibc-transfer", "cosmwasm"],
    });
  }
}
