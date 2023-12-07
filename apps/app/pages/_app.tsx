import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import { useContext, useEffect, useState } from 'react';
import { NomicContext } from '../contexts/NomicContext';
import { AppLayout } from '../layouts/AppLayout';
import { configure } from 'mobx';
import { BitcoinContext } from '../contexts/BitcoinContext';
configure({
  useProxies: 'never',
  enforceActions: 'never'
});

function CustomApp({ Component, pageProps }: AppProps) {
  const nomic = useContext(NomicContext);
  const bitcoin = useContext(BitcoinContext);
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    async function init() {
      await nomic.init();
      setInitialized(true);
      const wallet = nomic.getCurrentWallet();
      if (wallet && !wallet.connected) {
        await wallet.connect();
        nomic.wallet = wallet;
        await nomic.build();
      }
      await bitcoin.getBitcoinPrice();
    }
    init();
  }, []);

  return (
    <>
      <Head>
        <title>Oraichain Bitcoin Subnet Bridge</title>
      </Head>
      <div suppressHydrationWarning className="h-screen">
        <AppLayout>{initialized && <Component {...pageProps} />}</AppLayout>
      </div>
    </>
  );
}

export default CustomApp;
