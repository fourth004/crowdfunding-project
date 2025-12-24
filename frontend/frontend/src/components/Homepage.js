/*


// src/components/Homepage.js
import React, { useState, useEffect } from "react";
import { connectWallet, getConnectedAccounts } from "../utils/blockchain";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [wallets, setWallets] = useState([]); // { address, signer }
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If MetaMask already has connected accounts, show them on load (optional)
    (async () => {
      const accounts = await getConnectedAccounts();
      if (accounts.length > 0 && wallets.length === 0) {
        // try to connect once to populate signer/contract for first account
        try {
          const data = await connectWallet();
          if (data && data.address) {
            setWallets(prev => {
              // avoid duplicates
              if (prev.find(w => w.address === data.address)) return prev;
              return [...prev, { address: data.address, signer: data.signer }];
            });
          }
        } catch (e) {
          // ignore
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConnectPrimary = async () => {
    setLoading(true);
    try {
      const data = await connectWallet();
      if (!data) return;
      setWallets(prev => {
        if (prev.find(w => w.address === data.address)) return prev;
        return [...prev, { address: data.address, signer: data.signer }];
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWallet = async () => {
    // To add another wallet using MetaMask, user must switch accounts in MetaMask
    // We'll call connectWallet again (MetaMask will prompt or just return the selected account)
    setLoading(true);
    try {
      const data = await connectWallet();
      if (!data) return;
      setWallets(prev => {
        if (prev.find(w => w.address === data.address)) {
          alert("This wallet is already added. Switch account in MetaMask to add another.");
          return prev;
        }
        return [...prev, { address: data.address, signer: data.signer }];
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveWallet = (addr) => {
    setWallets(prev => prev.filter(w => w.address !== addr));
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.brand}>EduFund</h1>
        <nav style={styles.nav}>
          <button style={styles.navBtn} onClick={() => navigate("/create")}>
            Create Campaign
          </button>
          <button style={styles.navBtn} onClick={() => navigate("/donate")}>
            Donate
          </button>
        </nav>
      </header>

      <main style={styles.hero}>
        <div style={styles.left}>
          <h2 style={styles.title}>Join the community funding education</h2>
          <p style={styles.subtitle}>
            A decentralized crowdfunding platform helping students and institutions raise funds on-chain.
          </p>

          <div style={styles.cardRow}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Start a Campaign</h3>
              <p style={styles.cardText}>Create a campaign to raise funds for educational causes.</p>
              <button style={styles.cardBtn} onClick={() => navigate("/create")}>Create</button>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Donate</h3>
              <p style={styles.cardText}>Browse active campaigns and donate in ETH.</p>
              <button style={styles.cardBtn} onClick={() => navigate("/donate")}>Donate</button>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Wallets</h3>
              <p style={styles.cardText}>Connect multiple wallets. Switch accounts in MetaMask to add another.</p>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={styles.cardBtn} onClick={handleConnectPrimary} disabled={loading}>
                  {loading ? "Connecting..." : "Connect Wallet"}
                </button>
                <button style={styles.cardBtnOutline} onClick={handleAddWallet} disabled={loading}>
                  {loading ? "..." : "Add Wallet"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside style={styles.right}>
          <div style={styles.walletPanel}>
            <h4 style={{ margin: 0, marginBottom: 12 }}>Connected Wallets</h4>
            {wallets.length === 0 ? (
              <p style={styles.muted}>No wallets connected yet.</p>
            ) : (
              <ul style={styles.walletList}>
                {wallets.map((w, idx) => (
                  <li key={w.address} style={styles.walletItem}>
                    <div>
                      <div style={styles.walletAddr}>{w.address}</div>
                      <div style={styles.walletMeta}>Wallet #{idx + 1}</div>
                    </div>
                    <div style={styles.walletActions}>
                      <button style={styles.smallBtn} onClick={() => navigator.clipboard.writeText(w.address)}>
                        Copy
                      </button>
                      <button style={styles.smallBtnDanger} onClick={() => handleRemoveWallet(w.address)}>
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div style={{ marginTop: 12 }}>
              <small style={styles.muted}>
                Tip: To add another wallet, switch account in MetaMask and click <strong>Add Wallet</strong>.
              </small>
            </div>

            <div style={{ marginTop: 18 }}>
              {wallets.length >= 2 ? (
                <div style={styles.readyBanner}>You have {wallets.length} wallets connected — ready to create/donate.</div>
              ) : (
                <div style={styles.warnBanner}>Add at least 2 wallets to enable some multi-wallet flows.</div>
              )}
            </div>
          </div>
        </aside>

        


      </main>


      <footer style={styles.footer}>
        <small style={styles.muted}>EduFund · Decentralized crowdfunding for education</small>
      </footer>
    </div>


  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#020617",
    color: "#e6eef8",
    padding: 24,
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  brand: {
    color: "#93c5fd",
    fontSize: 22,
    fontWeight: 800,
  },
  nav: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  },
  navBtn: {
    background: "transparent",
    color: "#cfe6ff",
    padding: "8px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.04)",
    cursor: "pointer",
    fontWeight: 600,
  },

  hero: {
    display: "grid",
    gridTemplateColumns: "1fr 360px",
    gap: 24,
    alignItems: "start",
  },
  left: {
    paddingRight: 12,
  },
  right: {},
  title: {
    fontSize: 40,
    margin: "6px 0 12px",
    color: "#eaf2ff",
  },
  subtitle: {
    color: "#9fb3d8",
    maxWidth: 700,
    marginBottom: 24,
  },
  cardRow: {
    display: "flex",
    gap: 16,
    marginTop: 12,
  },
  card: {
    background: "#071029",
    padding: 18,
    borderRadius: 14,
    flex: "1 1 0",
    boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
  },
  cardTitle: {
    margin: 0,
    fontSize: 18,
    color: "#cfe6ff",
  },
  cardText: {
    color: "#9fb3d8",
    marginTop: 8,
    marginBottom: 12,
    fontSize: 14,
  },
  cardBtn: {
    background: "linear-gradient(135deg,#1e3a8a,#2563eb)",
    color: "white",
    padding: "10px 14px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
  },
  cardBtnOutline: {
    background: "transparent",
    color: "#cfe6ff",
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.06)",
    cursor: "pointer",
    fontWeight: 700,
  },

  walletPanel: {
    background: "#071226",
    padding: 18,
    borderRadius: 12,
    minHeight: 220,
    boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
  },
  muted: { color: "#8ea1c4", fontSize: 13 },

  walletList: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 },
  walletItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "#041022", borderRadius: 8 },
  walletAddr: { fontSize: 13, fontWeight: 700, color: "#eaf2ff" },
  walletMeta: { fontSize: 12, color: "#8ea1c4" },
  walletActions: { display: "flex", gap: 8 },
  smallBtn: { padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)", background: "transparent", cursor: "pointer", color: "#cfe6ff" },
  smallBtnDanger: { padding: "6px 10px", borderRadius: 8, border: "none", background: "#7f1d1d", cursor: "pointer", color: "#fff" },

  readyBanner: { marginTop: 6, padding: 8, background: "#073023", color: "#94f5c6", borderRadius: 8 },
  warnBanner: { marginTop: 6, padding: 8, background: "#2a1720", color: "#f4b3c0", borderRadius: 8 },

  footer: { marginTop: 40, textAlign: "center", color: "#7f9bbf" },
};
*/


import React, { useState, useEffect } from "react";
import { connectWallet, getConnectedAccounts } from "../utils/blockchain";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const accounts = await getConnectedAccounts();
      if (accounts.length > 0 && wallets.length === 0) {
        const data = await connectWallet();
        setWallets([{ address: data.address, signer: data.signer }]);
      }
    })();
  }, []);

  const handleConnectWallet = async () => {
  setLoading(true);
  try {
    if (!window.ethereum) throw new Error("MetaMask not installed");

    // This forces MetaMask to prompt for accounts
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const currentAccount = accounts[0];

    setWallets([{ address: currentAccount, signer: null }]); // update connected wallet
    alert(`Connected to ${currentAccount}`);
  } catch (err) {
    console.error(err);
    alert(err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={pageStyle}>
      <header style={headerStyle}>
        <h1>EduFund</h1>
        <p>A decentralized platform to support education. Connect your wallet, create campaigns, or donate!</p>
      </header>

      <div style={buttonRow}>
        <button style={btnStyle} onClick={() => navigate("/create")}>Create Campaign</button>
        <button style={btnStyle} onClick={() => navigate("/donate")}>Donate</button>
        <button style={btnStyle} onClick={handleConnectWallet} disabled={loading}>
          {loading ? "Connecting..." : "Connect Wallet"}
        </button>
      </div>

      <section style={{ textAlign: "center", marginTop: 40 }}>
        <h2>Connected Wallets</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {wallets.map((w, i) => (
            <li key={i} style={{ padding: 6 }}>{w.address}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#0d1117",
  color: "#f0f6fc",
  fontFamily: "Arial, sans-serif",
  padding: 32,
};

const headerStyle = { textAlign: "center", marginBottom: 40 };
const buttonRow = { display: "flex", justifyContent: "center", gap: "20px" };
const btnStyle = {
  padding: "12px 24px",
  fontSize: "1rem",
  backgroundColor: "#1f6feb",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};


