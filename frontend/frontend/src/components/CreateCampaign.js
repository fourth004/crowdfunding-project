/*import React from "react";
import CampaignForm from "./CampaignForm";

export default function CreateCampaign() {
  return (
    <div style={{ background: "#020617", minHeight: "100vh", padding: 40 }}>
      <h1 style={{ color: "#93c5fd" }}>Create a Campaign</h1>
      <CampaignForm />
    </div>
  );
}


// src/components/CreateCampaign.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { connectWallet } from "../utils/blockchain";
import ABIFile from "../CrowdfundingABI.json";

export default function CreateCampaign() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // connect to signer & contract
      const data = await connectWallet();
      if (!data || !data.contract) {
        alert("Please connect a wallet first");
        setLoading(false);
        return;
      }
      const contract = data.contract;
      // Example: adapt this call to your contract method signature
      // Suppose createCampaign(string title, uint goalWei)
      const goalWei = (BigInt(Math.floor(Number(goal) * 1e18))).toString(); // example convert ETH to wei
      const tx = await contract.createCampaign(title, goalWei); // update to actual method
      await tx.wait();
      alert("Campaign created! Transaction confirmed.");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error creating campaign. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <button style={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div style={styles.container}>
        <h2 style={styles.title}>Create Campaign</h2>
        <form style={styles.form} onSubmit={handleCreate}>
          <label style={styles.label}>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} style={styles.input} required />

          <label style={styles.label}>Goal (ETH)</label>
          <input value={goal} onChange={(e) => setGoal(e.target.value)} style={styles.input} required type="number" step="0.01" />

          <button style={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Campaign"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", padding: 24, background: "#020617", color: "#e6eef8" },
  backBtn: { marginBottom: 16, background: "transparent", border: "none", color: "#93c5fd", cursor: "pointer", fontSize: 16 },
  container: { maxWidth: 720, margin: "0 auto", background: "#071226", padding: 20, borderRadius: 12 },
  title: { marginTop: 0 },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  label: { color: "#9fb3d8", fontSize: 13 },
  input: { padding: 12, borderRadius: 8, border: "1px solid rgba(255,255,255,0.04)", background: "#021124", color: "#e6eef8" },
  submitBtn: { marginTop: 8, padding: "10px 14px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#1e3a8a,#2563eb)", color: "white", cursor: "pointer" },
};








import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { connectWallet, contract as connectedContract, signer as connectedSigner } from "../utils/blockchain";
import { ethers } from "ethers";

export default function CreateCampaign() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [durationValue, setDurationValue] = useState(1);
  const [durationUnit, setDurationUnit] = useState("days");
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);

  // Connect wallet only once
  useEffect(() => {
    (async () => {
      try {
        const { contract: c, signer: s } = await connectWallet();
        setContract(c);
        setSigner(s);
      } catch (err) {
        console.error("Wallet connection failed:", err);
      }
    })();
  }, []);

  const convertToSeconds = (value, unit) => {
    switch (unit) {
      case "minutes": return value * 60;
      case "hours": return value * 3600;
      case "days": return value * 3600 * 24;
      case "months": return value * 3600 * 24 * 30;
      case "years": return value * 3600 * 24 * 365;
      default: return value * 3600;
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!contract || !signer) {
      alert("Wallet not connected!");
      setLoading(false);
      return;
    }

    if (!title || !description || !goal || durationValue < 1) {
      alert("Please fill all fields correctly");
      setLoading(false);
      return;
    }

    try {
      const durationSeconds = convertToSeconds(durationValue, durationUnit);

      console.log("Creating campaign with:", { title, description, goal, durationSeconds });

      const tx = await contract.createCampaign(
        title,
        description,
        ethers.parseEther(goal),
        BigInt(durationSeconds)
      );

      await tx.wait();
      alert("Campaign created successfully!");
      navigate("/donate");

    } catch (err) {
      console.error(err);
      if (err.code === 4001) {
        alert("Transaction rejected by user in MetaMask");
      } else {
        alert("Failed to create campaign. Check console.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <h2>Create New Campaign</h2>
      <form onSubmit={handleCreate} style={styles.form}>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} style={styles.input} required />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} style={styles.textarea} required />
        <input type="number" step="0.01" placeholder="Goal (ETH)" value={goal} onChange={e => setGoal(e.target.value)} style={styles.input} required />
        <div style={styles.durationRow}>
          <input type="number" min="1" value={durationValue} onChange={e => setDurationValue(Math.max(1, Number(e.target.value)))} style={{ ...styles.input, marginBottom: 0 }} required />
          <select value={durationUnit} onChange={e => setDurationUnit(e.target.value)} style={styles.select}>
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
            <option value="months">Months</option>
            <option value="years">Years</option>
          </select>
        </div>
        <button type="submit" disabled={loading} style={styles.button}>{loading ? "Creating..." : "Create Campaign"}</button>
      </form>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#0d1117", color: "#f0f6fc", padding: 32 },
  form: { maxWidth: 520, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 },
  input: { padding: 12, borderRadius: 8, border: "1px solid #30363d", background: "#111827", color: "#fff" },
  textarea: { padding: 12, borderRadius: 8, border: "1px solid #30363d", background: "#111827", color: "#fff", minHeight: 120 },
  durationRow: { display: "flex", gap: 10 },
  select: { padding: 12, borderRadius: 8, border: "1px solid #30363d", background: "#111827", color: "#fff" },
  button: { marginTop: 10, padding: 14, borderRadius: 8, border: "none", background: "#1f6feb", color: "#fff", fontSize: 16, cursor: "pointer" },
};



*/

import React, { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "../utils/constants";

export default function CreateCampaign() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [durationValue, setDurationValue] = useState(1);
  const [durationUnit, setDurationUnit] = useState("days");
  const [loading, setLoading] = useState(false);

  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const wallet = new ethers.Wallet(
    "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
    provider
  );
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

  const convertToSeconds = (value, unit) => {
    switch (unit) {
      case "minutes": return value * 60;
      case "hours": return value * 3600;
      case "days": return value * 3600 * 24;
      case "months": return value * 3600 * 24 * 30;
      case "years": return value * 3600 * 24 * 365;
      default: return value * 3600 * 24;
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const durationSeconds = BigInt(convertToSeconds(durationValue, durationUnit));
      if (!title || !description || !goal || durationSeconds <= 0n) {
        alert("Fill all fields correctly!");
        setLoading(false);
        return;
      }
      const tx = await contract.createCampaign(
        title,
        description,
        ethers.parseEther(goal),
        durationSeconds
      );
      await tx.wait();
      alert("Campaign created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to create campaign. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <h2>Create New Campaign</h2>
      <form onSubmit={handleCreate} style={styles.form}>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} style={styles.input} required />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} style={styles.textarea} required />
        <input type="number" step="0.01" placeholder="Goal (ETH)" value={goal} onChange={e => setGoal(e.target.value)} style={styles.input} required />
        <div style={styles.durationRow}>
          <input type="number" min="1" value={durationValue} onChange={e => setDurationValue(Math.max(1, Number(e.target.value)))} style={{ ...styles.input, marginBottom: 0 }} required />
          <select value={durationUnit} onChange={e => setDurationUnit(e.target.value)} style={styles.select}>
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
            <option value="months">Months</option>
            <option value="years">Years</option>
          </select>
        </div>
        <button type="submit" disabled={loading} style={styles.button}>{loading ? "Creating..." : "Create Campaign"}</button>
      </form>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#0d1117", color: "#f0f6fc", padding: 32, fontFamily: "Arial, sans-serif" },
  form: { maxWidth: 520, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 },
  input: { padding: 12, borderRadius: 8, border: "1px solid #30363d", background: "#111827", color: "#fff" },
  textarea: { padding: 12, borderRadius: 8, border: "1px solid #30363d", background: "#111827", color: "#fff", minHeight: 120 },
  durationRow: { display: "flex", gap: 10 },
  select: { padding: 12, borderRadius: 8, border: "1px solid #30363d", background: "#111827", color: "#fff" },
  button: { marginTop: 10, padding: 14, borderRadius: 8, border: "none", background: "#1f6feb", color: "#fff", fontSize: 16, cursor: "pointer" },
};
