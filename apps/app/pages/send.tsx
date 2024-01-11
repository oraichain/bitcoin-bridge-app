import { Button } from "@nomic-ui/components";
import { observer } from "mobx-react-lite";
import { LoadableButton } from "../components/LoadableButton";
import { useContext, useState } from "react";
import { NomicClient } from "../models/nomic-client/nomic-client";
import { displayNom } from "@nomic-ui/utils";
import { NomicContext } from "../contexts/NomicContext";

const Send = () => {
    const nomic = useContext(NomicContext);
//   const router = useRouter();
  const [input, setInput] = useState(BigInt(0));
  const [address, setAddress] = useState("");
  const [displayMax, setDisplayMax] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
    const setMax = (val: bigint) => {
        const input = document.getElementById("send-input") as HTMLInputElement;
        if (!displayMax) {
          const displayVal = displayNom(val, false);
          input.value = displayVal;
          setInput(
            BigInt((Number(displayVal) * Number(nomic.modifier)).toFixed(0))
          );
          setDisplayMax(true);
        } else {
          input.value = "";
          setInput(BigInt(0));
          setDisplayMax(false);
        }
      };
  return (
    <div className="flex flex-col items-center gap-8 text-textPrimary p-2">
      <h1 className="text-2xl font-semibold"> Withdraw Bitcoin </h1>
      <div className="flex flex-col gap-1 justify-center w-full">
        
      </div>
      <div className="flex flex-col gap-4 w-full">
        <div className="relative border border-textTertiary rounded-md px-3 py-2 shadow-sm">
          <label
            htmlFor="name"
            className="absolute -top-2 left-2 -mt-px inline-block px-1 bg-surfaceModal text-xs font-medium text-textSecondary"
          >
            Orai Bridge Address
          </label>
          <input
            type="text"
            id="delegation-input"
            autoComplete="off"
            className="bg-surfaceModal block w-full border-0 p-0 text-textPrimary placeholder-textSecondary focus:ring-0 sm:text-sm focus:outline-none"
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="relative border border-textTertiary rounded-md px-3 py-2 shadow-sm">
          <label
            htmlFor="name"
            className="absolute -top-2 left-2 -mt-px inline-block px-1 bg-surfaceModal text-xs font-medium text-textSecondary"
          >
            Amount
          </label>
          <div className="flex flex-row">
            <input
              type="number"
              id="send-input"
              autoComplete="off"
              className="bg-surfaceModal block w-full border-0 p-0 text-textPrimary placeholder-textSecondary focus:ring-0 sm:text-sm focus:outline-none"
              onChange={(e) =>
                setInput(
                  BigInt(
                    (
                      Number(e.target.value) * Number(nomic.modifier)
                    ).toFixed(0)
                  )
                )
              }
            />
            <div className="flex">
              <Button
                className="bg-gradientStart text-textPrimary !py-0.5 !px-2"
                onClick={() =>
                  setMax(
                    nomic.nomBalance > BigInt(0)
                      ? nomic.nomBalance
                      : BigInt(0)
                  )
                }
              >
                MAX
              </Button>
              <div className="inset-y-0 right-0 pl-3 pr-3 flex items-center pointer-events-none">
                <div className="text-gray-500 sm:text-md flex flex-row">
                  <h1>oraibtc</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="sm:flex sm:flex-row-reverse gap-2 w-full">
        <LoadableButton
          activeText={"Send"}
          loadingText={"Sending..."}
          isLoading={sendLoading}
          setIsLoading={setSendLoading}
          colorClass={"bg-gradientStart"}
          onClick={async () => {
            console.log("🚀 ~ file: send.tsx:107 ~ onClick={ ~ input:", input)
            await nomic.sendToken(address.trim(), input);
            
          }}
        />
        {/* <LoadableButton
          activeText={"Cancel"}
          colorClass={"bg-gradientStart"}
          onClick={async () => {
            removeUrlQueryParams(router, "withdraw");
          }}
        /> */}
      </div>
    </div>
  )
};
export default observer(Send);
