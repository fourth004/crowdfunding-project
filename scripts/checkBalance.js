// Hardhat v3 + ESM compatible
const rpcUrl = "http://127.0.0.1:8545";

async function main() {
  const response = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_getBalance",
      params: [
        "0x70997970c51812dc3a010c7d01b50e0d17dc79c8", // account address
        "latest"
      ]
    })
  });

  const data = await response.json();

  // balance is returned in HEX wei
  const balanceWeiHex = data.result;
  const balanceWei = BigInt(balanceWeiHex);
  const balanceEth = Number(balanceWei) / 1e18;

  console.log("Balance:", balanceEth, "ETH");
}

main();
