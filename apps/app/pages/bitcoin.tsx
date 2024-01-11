import { useContext, useEffect } from "react";
import { NomicContext } from "../contexts/NomicContext";
import { BitcoinPageHeader } from "../components/BitcoinPageHeader/BitcoinPageHeader";
import { DepositModal } from "../components/DepositModal/DepositModal";
import { WithdrawModal } from "../components/WithdrawModal/WithdrawModal";
import { TransactionListCard } from "../components/TransactionList/TransactionListCard";
import { Button } from "@nomic-ui/components";

export default function BitcoinPage() {
  const nomic = useContext(NomicContext);

  const sendToken = async () => {
    console.log("Send Token")
    nomic.sendToken("oraibtc1rchnkdpsxzhquu63y6r4j4t57pnc9w8ea88hue", 0n);
  }

  return (
    <div className="flex flex-col gap-6">
        <Button onClick={sendToken}>Send</Button>

      <DepositModal />
      <WithdrawModal />
      <BitcoinPageHeader />
      <TransactionListCard />
    </div>
  );
}
