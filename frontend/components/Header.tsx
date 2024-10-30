import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from 'react';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold">StakingWallet</div>
        <ConnectButton />
      </div>
    </header>
  );
}

export default Header;
