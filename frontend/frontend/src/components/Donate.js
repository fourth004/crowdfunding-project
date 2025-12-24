

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "../utils/constants";

export default function Donate() {
  const [campaigns, setCampaigns] = useState([]);
  const [amounts, setAmounts] = useState({});
  const [loading, setLoading] = useState(false);

  // Hardhat local provider and wallet setup
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const wallet = new ethers.Wallet(
    "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",//0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
    provider
  );
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

  // Load campaigns and auto-update state after deadline
  const loadCampaigns = async () => {
    try {
      const count = Number(await contract.campaignCount());
      const list = [];

      for (let i = 1; i <= count; i++) {
        const c = await contract.getCampaign(i);
        let finalized = Boolean(c.finalized || c[7]);
        let state = Number(c.state || c[6]);

        // Auto mark failed if deadline passed and not finalized
        if (!finalized && Date.now() / 1000 > Number(c.deadline || c[4])) {
          state = 2; // Failed
        }

        list.push({
          id: i,
          creator: c.creator || c[0],
          title: c.title || c[1],
          description: c.description || c[2],
          goal: ethers.formatEther(c.goal || c[3]),
          deadline: Number(c.deadline || c[4]),
          raised: ethers.formatEther(c.raised || c[5]),
          state,
          finalized,
        });
      }

      setCampaigns(list.reverse());
    } catch (err) {
      console.error("Load failed:", err);
    }
  };

  // Donate function
  const donate = async (id) => {
    const value = amounts[id];
    if (!value || Number(value) < 0.01) {
      alert("Minimum donation is 0.01 ETH");
      return;
    }

    setLoading(true);
    try {
      const tx = await contract.donate(id, { value: ethers.parseEther(value) });
      await tx.wait();
      setAmounts({ ...amounts, [id]: "" });
      loadCampaigns();
      alert("Donation successful!");
    } catch (err) {
      console.error(err);
      alert("Donation failed!");
    }
    setLoading(false);
  };

  // Finalize function
  const finalize = async (id) => {
    setLoading(true);
    try {
      await (await contract.finalizeCampaign(id)).wait();
      loadCampaigns();
      alert("Campaign finalized!");
    } catch (err) {
      console.error(err);
      alert("Finalize failed!");
    }
    setLoading(false);
  };

  // Withdraw refunds
  const withdraw = async (id) => {
    setLoading(true);
    try {
      await (await contract.withdrawRefund(id)).wait();
      loadCampaigns();
      alert("Refund withdrawn!");
    } catch (err) {
      console.error(err);
      alert("Withdraw failed!");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCampaigns();
    const interval = setInterval(loadCampaigns, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.page}>
      <h1>Donate to Campaigns</h1>

      {campaigns.length === 0 && <p>No campaigns yet</p>}

      {campaigns.map((c) => (
        <div key={c.id} style={styles.card}>
          <h3>{c.title}</h3>
          <p>{c.description}</p>
          <p>Goal: {c.goal} ETH</p>
          <p>Raised: {c.raised} ETH</p>
          <p>Deadline: {new Date(c.deadline * 1000).toLocaleString()}</p>
          <p>Creator: {c.creator}</p>
          <p>Status: {c.state === 0 ? "Ongoing" : c.state === 1 ? "Successful" : "Failed"}</p>

          <div style={styles.row}>
            <input
              style={styles.input}
              placeholder="ETH amount"
              value={amounts[c.id] || ""}
              onChange={(e) => setAmounts({ ...amounts, [c.id]: e.target.value })}
              disabled={Date.now() / 1000 > c.deadline || c.finalized || c.state === 2}
            />
            <button
              style={styles.button}
              disabled={loading || Date.now() / 1000 > c.deadline || c.finalized || c.state === 2}
              onClick={() => donate(c.id)}
            >
              Donate
            </button>
          </div>

          {!c.finalized && Date.now() / 1000 > c.deadline && (
            <button style={styles.button} onClick={() => finalize(c.id)}>
              Finalize
            </button>
          )}

          {c.finalized && c.state === 2 && (
            <button style={styles.button} onClick={() => withdraw(c.id)}>
              Withdraw Refund
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#020617", color: "#fff", padding: 32 },
  card: { background: "#071029", padding: 16, borderRadius: 12, marginBottom: 16 },
  row: { display: "flex", gap: 8, marginTop: 8 },
  input: { flex: 1, padding: 8, background: "#111827", color: "#fff", border: "1px solid #30363d", borderRadius: 6 },
  button: { padding: "8px 16px", background: "#1f6feb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", marginTop: 8 },
};
