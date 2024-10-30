'use client'

import {contractAddress, contractABI} from "@/constants";
import {useReadContract, useBalance} from "wagmi";
import {useState, useEffect} from "react";
import {formatEther} from "viem";

export default function StakingPoolInfo() {
    const [totalAddressesStaked, setTotalAddressesStaked] = useState<number>(0);
    
    const {data: totalAddresses} = useReadContract({
      address: contractAddress,
      abi: contractABI,
      functionName: "totalAddressesStaked",
    }) as { data: bigint };
    
    // Utiliser useBalance au lieu de useReadContract pour obtenir le solde ETH
    const {data: balance} = useBalance({
      address: contractAddress,
    });
  
    useEffect(() => {
      if (totalAddresses) {
        setTotalAddressesStaked(Number(totalAddresses));
      }
    }, [totalAddresses]);
  
    return (
        <div className="bg-gray-800 shadow-xl rounded-lg p-6 text-white">
            <h2 className="text-3xl font-bold mb-4">Contract Information</h2>
            <div className="space-y-6">
              <div className="bg-gray-700 p-3 rounded-lg">
                <p className="text-lg text-gray-300 mb-2">Contract Address:
                  <span className="ml-2 text-xl font-mono break-all">{contractAddress}</span>
                </p>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg">
                <p className="text-lg text-gray-300">
                  Total Addresses Staked: 
                  <span className="ml-2 text-2xl font-bold">{totalAddressesStaked}</span>
                </p>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg">
                <p className="text-lg text-gray-300">
                  Contract Balance: 
                  <span className="ml-2 text-2xl font-bold">
                    {balance ? Number(formatEther(balance.value)).toFixed(4) : "0.0000"} ETH
                  </span>
                </p>
              </div>
            </div>
        </div>
    );
}
  