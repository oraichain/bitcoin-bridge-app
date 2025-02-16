import { useContext, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { BitcoinContext } from '../../contexts/BitcoinContext';
import { ConfirmationContext } from '../../contexts/ConfirmationContext';
import { Transaction } from '../../models/transaction';
import { ConfirmationModal } from './ConfirmationModal';
import { Transition } from '@headlessui/react';
import { AddressAnimation } from './AddressAnimation';
import { NomicContext } from '../../contexts/NomicContext';
import { displayBtc, displayPercentage, removeUrlQueryParams } from '@nomic-ui/utils';
import { useRouter } from 'next/router';
import { fromBech32, toBech32 } from '@cosmjs/encoding';
import { OraichainChain, OraiBtcSubnetChain } from 'apps/app/models/ibc-chain';

interface SocketMessage {
  addr: string;
  value: number;
}

export const AddressModal = observer(() => {
  const bitcoinContext = useContext(BitcoinContext);
  const confirmationContext = useContext(ConfirmationContext);
  const nomic = useContext(NomicContext);
  const router = useRouter();

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showAddress, setShowAddress] = useState(true);
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!nomic.wallet?.address) return;

    async function getAddress() {
      if (nomic.depositAddress) {
        return;
      }

      // `${channel_of_oraibtc_that_connect_to_destination_chain}/${destination_chain_address}`
      await nomic.generateAddress(`${OraiBtcSubnetChain.source.channelId}/${toBech32('orai', fromBech32(nomic.wallet?.address).data)}`);
    }

    getAddress();
  }, [nomic.wallet?.address, nomic.depositAddress]);

  useEffect(() => {
    socket.current = new WebSocket('wss://ws.blockchain.info/inv');
    socket.current.onopen = () => {
      socket.current?.send(
        JSON.stringify({
          op: 'unconfirmed_sub'
        })
      );
    };
    socket.current.onmessage = (e) => {
      const message = JSON.parse(e.data);
      if (message.x) {
        const hash = message.x.hash;
        message.x.out.forEach(async (tx: SocketMessage) => {
          if (tx.addr === nomic.depositAddress?.address) {
            socket.current?.send(
              JSON.stringify({
                op: 'unconfirmed_unsub'
              })
            );

            const txn = await Transaction.deposit(BigInt(tx.value * 1e6), nomic.depositAddress, hash);

            bitcoinContext.addTransaction(txn);

            const transactions = JSON.parse(localStorage['nomic/bitcoin/transactions/' + nomic.wallet.address] || '[]');

            transactions.push(txn.toJSON());
            localStorage.setItem('nomic/bitcoin/transactions/' + nomic.wallet.address, JSON.stringify(transactions));

            setShowAddress(false);

            setTimeout(() => {
              removeUrlQueryParams(router, 'deposit');
            }, 250);

            socket.current?.close();
          }
        });
      }
    };

    const currSocket = socket.current;
    return () => {
      currSocket.close();
    };
  });

  useEffect(() => {
    setShowConfirmation(!confirmationContext.confirmed);
  }, [confirmationContext.confirmed]);

  return (
    <>
      <div className="grid place-items-center text-textPrimary">
        <Transition.Root
          className="absolute z-40 w-full"
          as="div"
          show={showConfirmation}
          enter="transform transition ease-in-out duration-10 sm:duration-700"
          enterFrom="translate-y-2"
          enterTo="translate-y-0"
          leave="transform transition ease-in-out duration-450 sm:duration-700"
          leaveFrom="translate-y-0"
          leaveTo="translate-y-full"
        >
          <Transition.Child leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <ConfirmationModal />
          </Transition.Child>
        </Transition.Root>
        <Transition className="w-full" show={showAddress} leave="ease-out duration-450 sm:duration-700" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="flex flex-col justify-center items-center w-full text-center gap-6">
            <h1 className="text-2xl font-semibold">Bitcoin Deposit Address</h1>
            <AddressAnimation />
            <div className="w-full text-center text-sm text-red-400 font-bold">
              <h3>This address is valid for 4 days. Deposits sent after this time will be lost.</h3>
            </div>
            <div className="relative border border-textTertiary rounded-md px-3 py-2 shadow-sm w-full">
              <label htmlFor="name" className="absolute -top-2 left-2 -mt-px inline-block px-1 bg-surfaceModal text-xs font-medium text-textSecondary">
                Channel/Receiver
              </label>
              {nomic.wallet?.address && (
                <input
                  type="text"
                  id="delegation-input"
                  defaultValue={`${OraichainChain.source.channelId}/${toBech32('orai', fromBech32(nomic.wallet?.address).data)}`}
                  autoComplete="off"
                  className="bg-surfaceModal block w-full border-0 p-0 text-textPrimary placeholder-textSecondary focus:ring-0 sm:text-sm focus:outline-none"
                />
              )}
            </div>
            <div className="px-4 pb-4 text-sm text-textSecondary font-bold w-full">
              <div className="flow-root">
                <h2 className="float-left"> Bitcoin Transaction Fee: </h2>
                <h3 className="float-right">{displayBtc(Transaction.btcDepositFee)}</h3>
              </div>
              <div className="flow-root">
                <h2 className="float-left"> OraiBtcSubnet Bridge Fee: </h2>
                <h3 className="float-right">{displayPercentage(Transaction.nomicBridgeFee)}</h3>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </>
  );
});
