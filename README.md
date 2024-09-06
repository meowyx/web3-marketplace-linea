# Web3 Linea Marketplace

This is a decentralized marketplace application built using Next.js for the frontend and Hardhat for the blockchain backend. The smart contract is deployed on the Linea testnet.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- pnpm
- Hardhat
- Infura account for API keys
- A wallet for private key (e.g., MetaMask)

### Clone the repository

```bash
git clone https://github.com/meowyx/web3-marketplace-linea.git
cd web3-linea-marketplace

```

### Install dependencies

Navigate to the root of the repository and run:

```bash
pnpm install

```

This will install the necessary dependencies for both the frontend and the blockchain packages.

## File Structure

```bash
packages
├── site          # Frontend built with Next.js, Tailwind CSS, and ShadCN UI
└── blockchain    # Smart contracts using Hardhat

```

### Frontend (Site)

The frontend is located in the `packages/site` directory and is built with:

- **Next.js**: A React framework for server-side rendering and static website generation.
- **Tailwind CSS**: Utility-first CSS framework.
- **ShadCN UI**: A UI component library.

To run the frontend locally:

```bash
cd packages/site
pnpm dev

```

This will start the development server for the frontend.

### Backend (Blockchain)

The smart contracts are located in the `packages/blockchain` directory. The smart contract logic is written in Solidity, and Hardhat is used as the development environment.

### .env Variables

Before deploying the smart contract, make sure to update the `.env` file in the `packages/blockchain` directory with the following values:

```bash
# Infura API key for connecting to Ethereum networks
INFURA_API_KEY=your_infura_api_key_here

# Private key of the account to be used for deployments and transactions
ACCOUNT_PRIVATE_KEY=your_account_private_key_here

```

### Deploy the Smart Contract

To deploy the smart contract to the Linea testnet, run the following command:

```bash
npx hardhat ignition deploy ignition/modules/Marketplace.ts --network linea-testnet

```

This will deploy the marketplace smart contract on Linea Sepolia.
