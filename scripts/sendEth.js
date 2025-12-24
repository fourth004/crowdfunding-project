import { ethers } from "ethers";

async function main() {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  const senderPrivateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"; 
  const wallet = new ethers.Wallet(senderPrivateKey, provider);

  const receiver = "0xc1da18284b58860a259beceb9526769a8ad44682";

  console.log("Funding account:", receiver);

  const tx = await wallet.sendTransaction({
    to: receiver,
    value: ethers.parseEther("10"), // 10 ETH
  });

  await tx.wait();
  console.log("Successfully sent 10 ETH to", receiver);
}

main().catch(console.error);



