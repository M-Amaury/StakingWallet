'use client'

import {contractAddress, contractABI} from "@/constants";
import {useReadContract} from "wagmi";
import {useState, useEffect} from "react";
import {formatEther} from "viem";

export default function StakeBalance(props: {walletId: number}) {
    const [currentBalance, setCurrentBalance] = useState<number>(0);
  
    const {data: balance} = useReadContract({
      address: contractAddress,
      abi: contractABI,
      functionName: "currentStake",
      args: [props.walletId],
    }) as { data: bigint };
  
  
    useEffect(() => {
      if (balance) {
        setCurrentBalance(Number(formatEther(balance)));
      }
    }, [balance]);
  
    return (
            <h2 className="text-xl font-bold mb-4">{currentBalance} ETH</h2>
    );
}
  