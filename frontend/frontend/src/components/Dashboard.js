import React, { useState } from "react";
import { connectWallet } from "../utils/blockchain";
import CampaignForm from "./CampaignForm";
import AdminPanel from "./AdminPanel";

export default function Dashboard() {
  const [account, setAccount] = useState("");

  const connect = async () => {
    const data = await connectWallet();
    if (!data || !data.signer) return;

    const address = await data.signer.getAddress();
    setAccount(address);
  };

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <header style={styles.header}>
        <div style={styles.brand}>🚀 EduFund</div>
        <button style={styles.walletBtn} onClick={connect}>
          {account ? "✅ Wallet Connected" : "🔗 Connect Wallet"}
        </button>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>🎓 Decentralized Education Crowdfunding</h1>
        <p style={styles.heroText}>
          Empower students. Fund dreams. Powered by blockchain.
        </p>
      </section>

      {/* About Section */}
      <section style={styles.about}>
        <h2 style={styles.aboutTitle}>🌍 About EduFund</h2>
        <p style={styles.aboutText}>
          EduFund is a decentralized crowdfunding platform designed to help
          students and institutions raise funds transparently using blockchain.
        </p>
      </section>

      {/* Feature Cards */}
      <section style={styles.cards}>
        <div style={styles.card}>
          <h3>📌 Create Campaign</h3>
          <p>Launch secure education campaigns</p>
        </div>

        <div style={styles.card}>
          <h3>💰 Donate Crypto</h3>
          <p>Support students with transparency</p>
        </div>

        <div style={styles.card}>
          <h3>📊 Live Tracking</h3>
          <p>Track real-time donation progress</p>
        </div>
      </section>

      {/* Admin + Campaign Form */}
      <AdminPanel />
      <CampaignForm />

      {account && (
        <p style={styles.accountText}>🔐 Connected: {account}</p>
      )}
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "Segoe UI, sans-serif",
    background: "linear-gradient(135deg, #0f172a, #020617)",
    minHeight: "100vh",
    padding: "20px 40px",
    color: "white",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "linear-gradient(135deg, #020617, #02061799)",
    padding: "20px 40px",
    borderRadius: "20px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
    backdropFilter: "blur(8px)",
  },

  brand: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#93c5fd",
  },

  walletBtn: {
    background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
    color: "white",
    border: "none",
    padding: "16px 34px",
    borderRadius: "16px",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "0 12px 40px rgba(37,99,235,0.5)",
  },

  hero: {
    textAlign: "center",
    margin: "80px 0",
  },

  heroTitle: {
    fontSize: "46px",
    fontWeight: "900",
    marginBottom: "20px",
  },

  heroText: {
    fontSize: "20px",
    color: "#cbd5f5",
  },

  about: {
    textAlign: "center",
    margin: "60px 0",
    padding: "30px",
    background: "linear-gradient(135deg, #020617, #020617cc)",
    borderRadius: "20px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.7)",
  },

  aboutTitle: {
    fontSize: "30px",
    fontWeight: "800",
    color: "#93c5fd",
    marginBottom: "10px",
  },

  aboutText: {
    fontSize: "18px",
    color: "#cbd5f5",
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "30px",
    marginBottom: "50px",
  },

  card: {
    background: "linear-gradient(135deg, #020617, #020617cc)",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.7)",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  accountText: {
    textAlign: "center",
    marginTop: "40px",
    fontSize: "14px",
    color: "#94a3b8",
  },
};
