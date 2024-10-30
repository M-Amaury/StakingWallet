'use client'

import {contractAddress, contractABI} from "@/constants";
import {useReadContract} from "wagmi";
import {useState, useEffect} from "react";

export default function IsStaked(props: {walletId: number}) {
    const [isStaked, setIsStaked] = useState<boolean>(false);
  
    const {data: staked} = useReadContract({
      address: contractAddress,
      abi: contractABI,
      functionName: "isWalletStaked",
      args: [props.walletId],
    }) as { data: boolean };
  
  
    useEffect(() => {
      if (staked) {
        setIsStaked(staked);
      }
    }, [staked]);
  
    return (
            <h2 className="text-xl font-bold mb-4">{isStaked ? 'Yes' : 'No'}</h2>
    );
}
  