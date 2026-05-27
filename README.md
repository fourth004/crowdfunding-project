# EduFund – Decentralized Crowdfunding Platform

EduFund is a blockchain-based crowdfunding platform built using Ethereum smart contracts, Hardhat, React, and Ethers.js.  
It allows multiple simulated users to create campaigns, donate ETH, finalize campaigns, and withdraw refunds transparently on a local blockchain network.

---

## Features

### Multi-User Simulation
- Switch between multiple simulated blockchain users
- Each user has their own Hardhat wallet with a private key and address
- Users can create campaigns and donate independently

### Campaign Management
- Create fundraising campaigns with:
  - Title
  - Description
  - Funding goal (in ETH)
  - Deadline (minutes, hours, days, months, or years)

### Donation System
- Donate ETH to active campaigns (minimum 0.01 ETH)
- Real-time funding progress tracking
- Prevents creators from donating to their own campaigns

### Campaign States
Campaigns automatically move between:
- **Ongoing** — active and accepting donations
- **Successful** — goal met, funds transferred to creator
- **Failed** — goal not met, refunds available

### Finalization Logic
- Any user can finalize an expired campaign
- Successful campaigns transfer funds to the creator automatically
- Failed campaigns unlock refunds for donors

### Refund System
- Only users who donated can withdraw refunds
- Refund eligibility checked directly from the blockchain
- Prevents duplicate refunds
- Shows "already refunded" message after withdrawal

### Transaction History
- All transactions read directly from blockchain events
- Persists for the duration of the Hardhat node session
- Tracks:
  - Campaign creation
  - Donations
  - Campaign finalization
  - Refund withdrawals
- Shows transaction hash and block number for each entry

### Smart Contract Security
- Reentrancy guard on all fund transfers
- Withdraw pattern used for refunds
- Creator cannot donate to their own campaign
- Minimum donation enforced on-chain

### Modern UI
- Dark themed responsive interface
- Progress bars and status badges
- Campaign filtering (All, Ongoing, Successful, Failed, Mine)
- Donor count and user contribution displayed per campaign
- Dedicated transaction history page

---

## Tech Stack

### Blockchain
- Solidity ^0.8.18
- Ethereum (local Hardhat network)
- Hardhat v3

### Frontend
- React
- JavaScript
- React Router

### Web3 Integration
- Ethers.js v6

### Testing
- Mocha
- Chai
- 24 passing tests

### Development Tools
- Node.js
- npm

---

## Project Structure

```bash
crowdfunding-project/
│
├── contracts/          # Solidity smart contracts
├── frontend/           # React frontend
│   └── src/
│       ├── components/ # React components
│       ├── context/    # UserContext for user switching
│       └── utils/      # constants, ABI, user list
├── scripts/            # Deployment scripts
├── test/               # Smart contract tests (24 tests)
├── artifacts/          # Compiled contracts
├── hardhat.config.js
├── package.json
└── README.md
```

---

### Installation & Setup
1. Clone Repository
git clone https://github.com/YOUR_USERNAME/crowdfunding-project.git
cd crowdfunding-project
2. Install Dependencies
npm install
3. Start Hardhat Local Blockchain
npx hardhat node

4. Deploy Smart Contract
In a new terminal:
npx hardhat run scripts/deploy.js --network localhost

5. Start Frontend
cd frontend
npm install
npm start


### How It Works
- Select a simulated user
- Create a crowdfunding campaign
- Donate ETH to campaigns
- Finalize campaigns after deadline
- Withdraw refunds from failed campaigns
- View transaction history

## Future Improvements

- MetaMask integration
- IPFS image uploads
- Authentication system
- Campaign categories and search
- Real blockchain deployment (Sepolia)


### Important Notes

- The project currently uses a local Hardhat blockchain
- Wallets are simulated using predefined private keys
- This project is intended for educational purposes