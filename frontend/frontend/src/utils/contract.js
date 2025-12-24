import ABI from '../CrowdfundingABI.json';
import { ethers } from 'ethers';
export function getContract(providerOrSigner, address){
return new ethers.Contract(address, ABI, providerOrSigner);
}
//export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
// frontend/src/utils/contract.js
export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // replace with your deployed address

