// Replace with your deployed contract address on Hardhat Local
/*export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// Contract ABI (replace/add functions as per your contract)
export const ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_title", "type": "string" },
      { "internalType": "string", "name": "_description", "type": "string" },
      { "internalType": "uint256", "name": "_goal", "type": "uint256" },
      { "internalType": "uint256", "name": "_duration", "type": "uint256" }
    ],
    "name": "createCampaign",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_campaignId", "type": "uint256" }
    ],
    "name": "donateToCampaign",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_campaignId", "type": "uint256" }
    ],
    "name": "getCampaign",
    "outputs": [
      { "internalType": "string", "name": "title", "type": "string" },
      { "internalType": "string", "name": "description", "type": "string" },
      { "internalType": "uint256", "name": "goal", "type": "uint256" },
      { "internalType": "uint256", "name": "duration", "type": "uint256" },
      { "internalType": "uint256", "name": "raised", "type": "uint256" },
      { "internalType": "address", "name": "owner", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
*/


export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_title", "type": "string" },
      { "internalType": "string", "name": "_description", "type": "string" },
      { "internalType": "uint256", "name": "_goalWei", "type": "uint256" },
      { "internalType": "uint256", "name": "_durationSeconds", "type": "uint256" }
    ],
    "name": "createCampaign",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  {
    "inputs": [{ "internalType": "uint256", "name": "_campaignId", "type": "uint256" }],
    "name": "donate",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },

  {
    "inputs": [{ "internalType": "uint256", "name": "_campaignId", "type": "uint256" }],
    "name": "finalizeCampaign",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  {
    "inputs": [{ "internalType": "uint256", "name": "_campaignId", "type": "uint256" }],
    "name": "withdrawRefund",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  {
    "inputs": [{ "internalType": "uint256", "name": "_campaignId", "type": "uint256" }],
    "name": "getCampaign",
    "outputs": [
      { "internalType": "address", "name": "creator", "type": "address" },
      { "internalType": "string", "name": "title", "type": "string" },
      { "internalType": "string", "name": "description", "type": "string" },
      { "internalType": "uint256", "name": "goal", "type": "uint256" },
      { "internalType": "uint256", "name": "deadline", "type": "uint256" },
      { "internalType": "uint256", "name": "raised", "type": "uint256" },
      { "internalType": "uint8", "name": "state", "type": "uint8" },
      { "internalType": "bool", "name": "finalized", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },

  {
    "inputs": [],
    "name": "campaignCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];
