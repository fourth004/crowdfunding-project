import React, { useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import ABI from "../CrowdfundingABI.json";

export default function CampaignForm() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [goalEth, setGoalEth] = useState("");
  const [durationHours, setDurationHours] = useState(24);

  async function createOnChain() {
    if (!window.ethereum) return alert("Install MetaMask");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const addr = await signer.getAddress();

    const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
    if (!CONTRACT_ADDRESS) return alert("Missing contract address");

    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    const tx = await contract.createCampaign(
      title,
      desc,
      ethers.parseEther(goalEth),
      durationHours * 3600
    );

    const receipt = await tx.wait();

    let cid = null;
    for (const e of receipt.logs) {
      if (e.fragment?.name === "CampaignCreated") {
        cid = Number(e.args[0]);
        break;
      }
    }

    await axios.post("/api/campaigns/create", {
      contract_id: cid,
      title,
      description: desc,
      creator: addr,
      goal: ethers.parseEther(goalEth).toString(),
      deadline: Math.floor(Date.now() / 1000) + durationHours * 3600,
    });

    alert("✅ Campaign created with ID: " + cid);
  }

  return (
    <div style={styles.formBox}>
      <h2 style={styles.heading}>🚀 Start a Campaign</h2>

      <input
        placeholder="Campaign Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={styles.input}
      />

      <textarea
        placeholder="Campaign Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        style={styles.textarea}
      />

      <div style={styles.row}>
        <input
          placeholder="Goal (ETH)"
          value={goalEth}
          onChange={(e) => setGoalEth(e.target.value)}
          style={styles.smallInput}
        />

        <input
          type="number"
          value={durationHours}
          onChange={(e) => setDurationHours(e.target.value)}
          style={styles.smallInput}
        />
        <span style={{ color: "#cbd5f5" }}>hours</span>
      </div>

      <button onClick={createOnChain} style={styles.button}>
        🚀 Create Campaign
      </button>
    </div>
  );
}

const styles = {
  formBox: {
    background: "linear-gradient(135deg, #020617, #020617dd)",
    padding: "30px",
    borderRadius: "20px",
    marginTop: "40px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.7)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  heading: {
    marginBottom: "20px",
    color: "#93c5fd",
  },
  input: {
    width: "100%",
    padding: "16px",
    borderRadius: "12px",
    border: "none",
    marginBottom: "16px",
    background: "#0f172a",
    color: "white",
  },
  textarea: {
    width: "100%",
    padding: "16px",
    borderRadius: "12px",
    border: "none",
    minHeight: "120px",
    background: "#0f172a",
    color: "white",
    marginBottom: "16px",
  },
  row: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginBottom: "20px",
  },
  smallInput: {
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "#0f172a",
    color: "white",
    width: "140px",
  },
  button: {
    width: "100%",
    background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
    color: "white",
    border: "none",
    padding: "18px",
    borderRadius: "16px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 12px 40px rgba(37,99,235,0.5)",
  },
};
