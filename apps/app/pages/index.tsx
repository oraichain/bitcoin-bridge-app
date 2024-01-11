import { Button } from '@nomic-ui/components';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { NomicContext } from '../contexts/NomicContext';

export default function Custom404() {
  const router = useRouter();

  // if (router.asPath !== router.route && router.route === '/') {
  //   router.push(router.asPath);
  // }

  const nomic = useContext(NomicContext);

  useEffect(() => {
    if (nomic.initialized) {
      nomic.updateValidators();
    }
  }, [nomic, nomic.initialized]);


  const sendToken = async () => {
    console.log("Send Token")
    nomic.sendToken("oraibtc1rchnkdpsxzhquu63y6r4j4t57pnc9w8ea88hue", 0n);
  }

  return (
    <div className="min-w-128 flex flex-col gap-6 h-full w-full justify-center items-center">
      <div className="-mt-8">
        <h1>Welcome to OraiBtc Subnet dApp!</h1>
        
      </div>
    </div>
  );
}
