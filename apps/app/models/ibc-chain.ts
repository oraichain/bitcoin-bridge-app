import Nomic from '../public/logo-small.svg';
import { config } from '../config';
import Orai from '../public/orai.svg';

export interface ChainInfo {
  name: string;
  logo: string;
  chainId: string;
  rpcEndpoint: string;
}

export interface IbcInfo {
  source: {
    channelId: string;
    port: string;
    nBtcIbcDenom: string;
  };
  destination: {
    channelId: string;
    port: string;
  };
  locked: boolean;
}

export type IbcChain = ChainInfo & IbcInfo;

export const OraiBtcSubnetChain: IbcChain = {
  name: 'OraiBtcSubnet',
  logo: Nomic,
  chainId: config.chainId,
  rpcEndpoint: config.rpcUrl,
  source: {
    channelId: 'channel-0',
    port: 'transfer',
    nBtcIbcDenom: 'usat'
  },
  destination: {
    channelId: 'channel-167',
    port: 'wasm.orai195269awwnt5m6c843q6w7hp8rt0k7syfu9de4h0wz384slshuzps8y7ccm'
  },
  locked: true
};

export const OraichainChain: IbcChain = {
  name: 'Oraichain Mainnet',
  logo: Orai,
  chainId: 'Oraichain',
  rpcEndpoint: 'https://rpc.orai.io',
  source: {
    channelId: 'channel-166',
    port: 'wasm.orai195269awwnt5m6c843q6w7hp8rt0k7syfu9de4h0wz384slshuzps8y7ccm',
    nBtcIbcDenom: 'ibc/DCDCAF4399A0804D177740C634E305B2CB3A0137789A26EDC3E4B18FC4F2D176'
  },
  destination: {
    channelId: 'channel-4',
    port: 'transfer'
  },
  locked: true
};

export const Chains: IbcChain[] = [OraiBtcSubnetChain, OraichainChain];
