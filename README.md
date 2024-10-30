# Staking Wallet DApp

A decentralized application (DApp) that allows users to create wallets, deposit ETH, stake their funds, and earn rewards in WEB3 tokens.

## Features

- **Wallet Management**
  - Create multiple wallets
  - Deposit ETH
  - Withdraw ETH
  - View current balance

- **Staking Capabilities**
  - Stake ETH from wallet
  - Earn WEB3 tokens as rewards
  - View current stake amount
  - Unstake ETH
  - Track staking rewards

- **Real-time Information**
  - Total addresses staked
  - Contract balance
  - Individual wallet balances
  - Staking status

## Tech Stack

- **Frontend**
  - Next.js 14
  - TypeScript
  - TailwindCSS
  - Wagmi 2.0
  - RainbowKit
  - Viem

- **Backend**
  - Solidity
  - Hardhat
  - OpenZeppelin Contracts

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- MetaMask or any Web3 wallet

### Installation

1. Clone the repository :
git clone https://github.com/yourusername/staking-wallet-dapp.git

2. Install backend dependencies
```bash
cd backend
npm install

3. Install frontend dependencies
```bash
cd frontend
npm install

### Running the Project

1. Start the local Hardhat node
```bash
cd backend
npx hardhat node

2. Start the Next.js application
```bash
cd frontend
npm run dev

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Smart Contracts

### Staking.sol
The main contract that handles:
- Wallet creation and management
- Staking mechanism
- Reward distribution
- WEB3 token minting

### Wallet.sol
Individual wallet contract that manages:
- ETH deposits
- ETH withdrawals
- Balance tracking
- Owner permissions

## Usage

1. Connect your Web3 wallet using the "Connect Wallet" button
2. Create a new wallet using the "Create Wallet" button
3. Deposit ETH into your wallet
4. Stake your ETH to earn WEB3 tokens
5. Monitor your rewards
6. Unstake and withdraw when ready

## Testing

Run the test suite:
```bash
cd backend
npx hardhat test

## Deployment

To deploy to a testnet (e.g., Arbitrum Sepolia):
cd backend
npx hardhat run scripts/deploy.js --network arbitrumSepolia

## Contact
Contract address Arbitrum Sepolia: [0xA550704E303b6329dfeaFAB2a27cA0e8a3fDc33A](https://sepolia.arbiscan.io/address/0xa550704e303b6329dfeafab2a27ca0e8a3fdc33a)
