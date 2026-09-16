# CivicChain

## Overview

CivicChain is a local blockchain-backed complaint registration and tracking system. The Solidity contract is the source of truth for complaint IDs, complainants, status, and timestamps. MongoDB stores searchable, paginated indexes of confirmed chain data.

## Features

- Register and inspect civic complaints
- Confirmed blockchain transactions through ethers.js
- Search, status filtering, and pagination
- Admin status updates restricted by the contract owner
- Wallet detection through MetaMask without making browsing unusable without it
- Dashboard statistics and blockchain connection details

## Architecture

React/Vite client -> Express REST API -> ethers.js -> Hardhat local network. MongoDB indexes confirmed blockchain records for efficient list queries.

## Technology Stack

React, Vite, React Router, Axios, Tailwind CSS, Lucide React, Node.js, Express, MongoDB, Mongoose, ethers.js, Solidity 0.8.20, and Hardhat.

## Project Structure

```text
client/       React application
server/       Express API and blockchain service
blockchain/   Solidity contract, deployment script, and tests
```

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB running locally on port 27017

## Installation

From the repository root:

```bash
npm install
npm install --prefix blockchain
npm install --prefix server
npm install --prefix client
cp .env.example .env
```

## Environment Variables

The server reads `.env` from the repository root. `PRIVATE_KEY` should be the private key of the Hardhat account that deploys the contract, and `ADMIN_ADDRESS` should be its address. Never expose either value in the client.

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/civic-chain
RPC_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=deployed-address
PRIVATE_KEY=hardhat-account-private-key
ADMIN_ADDRESS=hardhat-account-address
CLIENT_URL=http://localhost:5173
```

## Running MongoDB

Start a local MongoDB service or use a local MongoDB container. The default connection is `mongodb://127.0.0.1:27017/civic-chain`.

## Running the Local Blockchain

In one terminal:

```bash
npm run blockchain
```

Keep this process running. Hardhat prints funded development accounts and private keys for local use.

## Deploying the Smart Contract

In a second terminal, compile and deploy:

```bash
npm run compile
npm run deploy
```

The deployment script prints the contract address and owner, writes the ABI to `server/contract.json`, and requires the printed address to be set as `CONTRACT_ADDRESS` in `.env`. Use the matching Hardhat account private key for `PRIVATE_KEY`.

## Starting the Backend

```bash
npm run server
```

The API runs at `http://localhost:5000`.

## Starting the Frontend

```bash
npm run client
```

Open `http://localhost:5173`.

## API Endpoints

- `GET /api/health`
- `GET /api/complaints?page=1&limit=10&status=Pending&search=street`
- `POST /api/complaints`
- `GET /api/complaints/:id`
- `PUT /api/complaints/:id/status`
- `GET /api/complaints/stats`
- `GET /api/complaints/blockchain`

## Smart Contract Functions

`registerComplaint`, `updateComplaintStatus`, `getComplaint`, and `getTotalComplaints` are implemented in `blockchain/contracts/ComplaintRegistration.sol`. Only the deploying owner can update a status.

## Application Workflow

Complaint registration is submitted by the configured backend signer, mined on the local chain, read back from the contract, and only then indexed in MongoDB. Status updates follow the same confirmed-transaction sequence. The request wallet address is collected as user context, while the confirmed complainant address displayed by the app is the actual transaction signer recorded on-chain.

## Testing

```bash
npm test --prefix blockchain
npm run build --prefix client
```

## Screenshots

Screenshots can be added here after running the local application.

## Future Improvements

- Add authenticated admin sessions and role management
- Add a chain event indexer for automatic reconciliation after outages
- Support a wallet-signed registration flow for user-owned complainant addresses# civic-chain