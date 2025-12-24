# Crowdfunding Project

A decentralized crowdfunding platform built on Ethereum, allowing users to create and fund projects transparently using smart contracts. This project demonstrates a full-stack dApp setup with Solidity smart contracts, Hardhat for development, and a React frontend.

## Features

- **Project Creation:** Users can create crowdfunding campaigns with a funding goal and deadline.  
- **Fund Contributions:** Supporters can contribute Ether to campaigns.  
- **Automatic Refunds:** If a campaign doesn’t reach its funding goal, contributors can claim refunds.  
- **Fund Withdrawal:** Campaign creators can withdraw funds once the goal is met.  
- **Blockchain Transparency:** All transactions are recorded on the Ethereum blockchain.

## Tech Stack

- **Blockchain:** Ethereum, Solidity, Hardhat  
- **Frontend:** React, TypeScript  
- **Backend / Integration:** Ethers.js, Node.js  
- **Testing:** Mocha & Chai for smart contracts  

## Project Structure

crowdfunding-project/
├── contracts/ # Solidity smart contracts
├── frontend/ # React frontend application
├── backend/ # API or integration scripts
├── scripts/ # Deployment scripts
├── tests/ # Smart contract tests
├── hardhat.config.ts # Hardhat configuration
└── README.md

## Setup Instructions

1.Clone the repository

git clone https://github.com/fourth004/crowdfunding-project.git
cd crowdfunding-project

2.Install dependencies
npm install

3.Compile smart contracts
npx hardhat compile

4.Run tests
npx hardhat test

5.Start frontend
cd frontend
npm start

Usage
Deploy smart contracts to a local Hardhat network or a testnet like Sepolia.
Interact with campaigns via the React frontend.
Test contract functionality using the provided Mocha/Chai tests.

Contributing
Contributions are welcome! Please fork the repository and submit a pull request.
