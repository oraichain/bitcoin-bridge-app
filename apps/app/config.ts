class Config {
  chainId: string;
  chainName: string;
  stakingUrl: string;
  rpcUrl: string;
  restUrl: string;
  relayerUrl: string;

  constructor() {
    this.chainId =
      process.env.NEXT_PUBLIC_APP_ENV === "mainnet"
        ? "oraibtc-mainnet-1"
        : "oraibtc-subnet-1";
    this.chainName = "OraiBtcMainnet";
    this.stakingUrl = "";
    this.rpcUrl =
      process.env.NEXT_PUBLIC_APP_ENV === "mainnet"
        ? "https://btc.rpc.orai.io"
        : "https://oraibtc.rpc.orai.io";
    this.restUrl =
      process.env.NEXT_PUBLIC_APP_ENV === "mainnet"
        ? "https://btc.lcd.orai.io"
        : "https://oraibtc.lcd.orai.io";
    this.relayerUrl = "https://btc.relayer.orai.io";
  }
}

export const config = new Config();
