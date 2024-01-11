import { useContext, useEffect, useState } from 'react';
import { RewardStep } from '../components/RewardStep/RewardStep';
import { NomicContext } from '../contexts/NomicContext';
import { observer } from 'mobx-react-lite';
import { LoadableButton } from '../components/LoadableButton';
import { Card } from '@nomic-ui/components';
import { Metamask } from '../models/wallet/metamask';
import { EvmosAirdropState } from '../models/evmos-airdrop-state';
import { RewardType } from '../models/reward';

const RewardPageUnobserved = () => {
  const nomic = useContext(NomicContext);
  const [connectLoading, setConnectLoading] = useState(false);
  const [claimAttempted, setClaimAttempted] = useState(EvmosAirdropState.NOATTEMPT);

  const updateClaimAttempted = () => {
    if (nomic.wallet?.address) {
      const claimAttemptedString = localStorage.getItem('nomic/evmosAirdropClaimAttempted/' + nomic.wallet.address);
      setClaimAttempted(claimAttemptedString ? (claimAttemptedString as EvmosAirdropState) : EvmosAirdropState.NOATTEMPT);
    }
  };

  useEffect(() => {
    updateClaimAttempted();
  }, [nomic.wallet?.address]);

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      {!nomic.wallet || nomic.wallet instanceof Metamask ? null : (
        <Card className="flex flex-row justify-between items-center">
          <div className="flex flex-col w-2/5">
            <h1 className="text text-lg text-textPrimary">Evmos Rewards</h1>
            <h3 className="text text-textSecondary">To claim the Evmos portion of the rewards, connect your Evmos account</h3>
          </div>
          {claimAttempted === EvmosAirdropState.NOATTEMPT ? (
            <LoadableButton
              activeText={'Connect Evmos'}
              loadingText={'Connecting...'}
              colorClass={'bg-primary'}
              isLoading={connectLoading}
              setIsLoading={setConnectLoading}
              onClick={async () => {
                await nomic.joinRewardAccounts();
                updateClaimAttempted();
              }}
            />
          ) : (
            <h1 className="text-md font-semibold text-textSecondary">{claimAttempted === EvmosAirdropState.INELIGIBLE ? 'Not Eligible for Reward Portion' : 'Reward Portion Successfully Transferred'}</h1>
          )}
        </Card>
      )}
    </div>
  );
};

export default observer(RewardPageUnobserved);
