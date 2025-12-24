import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "../frontend/src/utils/constants.js";

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

async function main() {
  const count = await contract.campaignCount();
  console.log("Campaign count:", Number(count));

  for (let i = 1; i <= Number(count); i++) {  // start from 1
    const c = await contract.getCampaign(i);
    console.log(`\nCampaign ${i}:`, {
      id: i,
      creator: c[0],
      title: c[1],
      description: c[2],
      goal: ethers.formatEther(c[3]),
      deadline: Number(c[4]),
      raised: ethers.formatEther(c[5]),
      state: Number(c[6]),
      finalized: c[7]
    });
  }
}

main().catch(console.error);
