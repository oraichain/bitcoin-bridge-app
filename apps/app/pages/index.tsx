import { useRouter } from 'next/router';

export default function Custom404() {
  const router = useRouter();

  if (router.asPath !== router.route && router.route === '/') {
    router.push(router.asPath);
  }
  return (
    <div className="min-w-128 flex flex-col gap-6 h-full w-full justify-center items-center">
      <div className="-mt-8">
        <h1>Welcome to OraiBtc Subnet dApp!</h1>
      </div>
    </div>
  );
}
