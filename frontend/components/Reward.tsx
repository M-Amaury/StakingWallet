'use client'

import {contractAddress, contractABI} from "@/constants";
import {useReadContract} from "wagmi";
import {useState, useEffect} from "react";
import {formatEther} from "viem";

export default function CurrentReward(props: {walletId: number}) {
    const [currentReward, setCurrentReward] = useState<number>(0);
  
    const {data: reward} = useReadContract({
      address: contractAddress,
      abi: contractABI,
      functionName: "currentReward",
      args: [props.walletId],
    }) as { data: bigint };
  
  
    useEffect(() => {
      if (reward) {
        setCurrentReward(Number(formatEther(reward)));
      }
    }, [reward]);
  
    return (
            <h2 className="text-xl font-bold mb-4">{currentReward} WEB3</h2>
    );
}
  