'use client'

import Header from "@/components/Header";
import {contractAddress, contractABI} from "@/constants";
import {useReadContract, useWriteContract} from "wagmi";
import {useState, useEffect} from "react";
import {parseEther, formatEther} from "viem";
import StakingPoolInfo from "@/components/StakingPoolInfo";
import Deposit from "@/components/Deposit";
import CurrentBalance from "@/components/CurrentBalance";
import Withdraw from "@/components/Withdraw";
import IsStaked from "@/components/IsStaked";
import Stake from "@/components/Stake";
import StakeBalance from "@/components/StakeBalance";
import Unstake from "@/components/Unstake";
import CurrentReward from "@/components/Reward";

interface Wallet {
  user: string;
  currentBalance: string;
  withdraw: string;
  staked: boolean;
  stake: string;
  currentStake: string;
  unstake: string;
  currentRewards: string;
}

export default function Home() {
  const {writeContract} = useWriteContract()

  const createWallet = async () => {
    await writeContract({
      address: contractAddress,
      abi: contractABI,
      functionName: "walletCreate",
    });
  }

  const {data: wallets} = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "getWallets",
  }) as { data: Wallet[] };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />
      <main className="flex-grow container mx-auto px-6 py-6 space-y-8">
        <StakingPoolInfo />

        <div className="bg-gray-800 shadow-xl rounded-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Staked Wallets</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-4">Wallet Id</th>
                <th className="p-4">Deposit</th>
                <th className="p-4">Current Balance</th>
                <th className="p-4">Withdraw</th>
                <th className="p-4">Staked?</th>
                <th className="p-4">Stake</th>
                <th className="p-4">Current Stake</th>
                <th className="p-4">Unstake</th>
                <th className="p-4">Current Rewards</th>
              </tr>
            </thead>
            <tbody>
              {wallets && wallets.map((wallet: Wallet, index: number) => (
                <tr key={index} className="bg-gray-700">
                  <td className="p-4">{wallet.user}</td>
                  <td className="p-4">
                    <Deposit walletId={index} />
                  </td>
                  <td className="p-4"><CurrentBalance walletId={index} /></td>
                  <td className="p-4"><Withdraw walletId={index} /></td>
                  <td className="p-4"><IsStaked walletId={index} /></td>
                  <td className="p-4"><Stake walletId={index} /></td>
                  <td className="p-4"><StakeBalance walletId={index} /></td>
                  <td className="p-4"><Unstake walletId={index}/></td>
                  <td className="p-4"><CurrentReward walletId={index} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button onClick={createWallet} className="w-full bg-gray-500 text-white px-4 py-2 rounded-md">Create Wallet</button>
      </main>
    </div>
  );
}
