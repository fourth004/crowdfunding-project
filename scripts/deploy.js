// scripts/deploy.js
/*import hre from "hardhat";

async function main() {
  // use Hardhat's signer
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", await deployer.getAddress());

  // Get factory and deploy (no constructor args in your contract)
  const Factory = await hre.ethers.getContractFactory("Crowdfunding", deployer);
  const contract = await Factory.deploy(); // no args because constructor() is empty

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("✅ Contract deployed at:", address);
  console.log("✅ Deployer address:", await deployer.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
*/
// scripts/deploy.js
// scripts/deploy.js
// scripts/deploy.js
// scripts/deploy.js
// scripts/deploy.js
// scripts/deploy.js
/*import { ethers } from "hardhat"; // <-- This no longer works in v3

// ✅ Correct Hardhat v3 deployment script:
import hre from "hardhat";

async function main() {
  // Deploy contract using Hardhat v3 API
  const contract = await hre.ethers.deployContract("Crowdfunding");

  // Wait for deployment
  await contract.waitForDeployment();

  console.log("✅ Contract deployed at:", await contract.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

*/
// scripts/deploy.cjs
// scripts/deploy.cjs
import { ethers } from "ethers";
import hre from "hardhat";

async function main() {
  // Connect to local Hardhat node
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  // Hardhat default private key (Account #0)
  const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const wallet = new ethers.Wallet(privateKey, provider);

  // Read compiled contract artifact
  const artifact = await hre.artifacts.readArtifact("Crowdfunding");

  // Create factory
  const factory = new ethers.ContractFactory(
    artifact.abi,
    artifact.bytecode,
    wallet
  );

  // Deploy contract (no constructor arguments)
  const contract = await factory.deploy();
  await contract.waitForDeployment();

  console.log("✅ Contract deployed at:", await contract.getAddress());
  console.log("✅ Deployer (admin) address:", wallet.address);
}

// Run
main().catch((err) => {
  console.error(err);
  process.exit(1);
});


