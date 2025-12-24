// frontend/src/utils/blockchain.js
/*
import { ethers } from "ethers";
import CrowdfundingArtifact from "../CrowdfundingABI.json";
import { CONTRACT_ADDRESS } from "./contract";

const abi = Array.isArray(CrowdfundingArtifact) ? CrowdfundingArtifact : (CrowdfundingArtifact.abi ?? CrowdfundingArtifact);

export async function connectWallet() {
  try {
    if (!window.ethereum) {
      alert("MetaMask not found");
      return null;
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
    return { provider, signer, address, contract };
  } catch (err) {
    console.error(err);
    return null;
  }
}

// provider-only for read-only calls
export async function getProvider() {
  if (!window.ethereum) return null;
  const provider = new ethers.BrowserProvider(window.ethereum);
  return provider;
}
*/

import { ethers } from "ethers";
import CrowdfundingArtifact from "../CrowdfundingABI.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

let provider;
let signer;
let contract;

export async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask not installed");
    return;
  }

  await window.ethereum.request({ method: "eth_requestAccounts" });

  provider = new ethers.BrowserProvider(window.ethereum);
  signer = await provider.getSigner();

  // ✅ IMPORTANT FIX
  const abi = CrowdfundingArtifact.abi;

  contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

  const address = await signer.getAddress();
  return { address, signer, contract };
}

export async function getConnectedAccounts() {
  if (!window.ethereum) return [];
  return await window.ethereum.request({ method: "eth_accounts" });
}

export { provider, signer, contract };
