import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "../utils/constants";
import { UserContext } from "../context/UserContext";

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const count = Number(await contract.campaignCount());
      const list = [];
      for (let i = 1; i <= count; i++) {
        const c = await contract.getCampaign(i);
        let state = Number(c.state || c[6]);
        let finalized = Boolean(c.finalized || c[7]);
        const deadline = Number(c.deadline || c[4]);
        const raised = Number(ethers.formatEther(c.raised || c[5]));
        const goal = Number(ethers.formatEther(c.goal || c[3]));
        const deadlinePassed = Date.now() / 1000 > deadline;
        if (!finalized && deadlinePassed) {
          state = raised >= goal ? 1 : 2;
        }
        const donors = await contract.getDonors(i);
        const userContribution = await contract.getContribution(i, currentUser.address);
        const myDonation = Number(ethers.formatEther(userContribution));

        list.push({
          id: i,
          creator: c.creator || c[0],
          title: c.title || c[1],
          description: c.description || c[2],
          goal,
          raised,
          deadline,
          state,
          finalized,
          donorCount: donors.length,
          myDonation,
        });
      }
      setCampaigns(list.reverse());
    } catch (err) {
      console.error("Failed to load campaigns:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

      useEffect(() => {
      const timer = setInterval(() => {
        setCampaigns(prev => [...prev]);
      }, 1000);
      return () => clearInterval(timer);
    }, []);
  const getStateInfo = (state) => {
    if (state === 0) return { label: "Ongoing", color: "#1f6feb", bg: "#0a1929", border: "#1e3a5f" };
    if (state === 1) return { label: "Successful", color: "#3fb950", bg: "#0a1a0d", border: "#1a3d22" };
    return { label: "Failed", color: "#f85149", bg: "#1a0a0a", border: "#3d1a1a" };
  };

  const getProgress = (raised, goal) => {
    if (!goal || goal === 0) return 0;
    return Math.min((raised / goal) * 100, 100).toFixed(1);
  };

  const filtered = campaigns.filter((c) => {
    if (filter === "all") return true;
    if (filter === "ongoing") return c.state === 0;
    if (filter === "successful") return c.state === 1;
    if (filter === "failed") return c.state === 2;
    if (filter === "mine") return c.creator?.toLowerCase() === currentUser?.address?.toLowerCase();
    return true;
  });

  const counts = {
    all: campaigns.length,
    ongoing: campaigns.filter(c => c.state === 0).length,
    successful: campaigns.filter(c => c.state === 1).length,
    failed: campaigns.filter(c => c.state === 2).length,
    mine: campaigns.filter(c => c.creator?.toLowerCase() === currentUser?.address?.toLowerCase()).length,
  };

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <button style={styles.backBtn} onClick={() => navigate("/")}>
          ← Back
        </button>
        <h1 style={styles.heading}>All Campaigns</h1>
        <div style={styles.userBadge}>
          <span style={styles.userDot} />
          {currentUser?.name}
        </div>
      </div>

      <div style={styles.filterRow}>
        {[
          { key: "all", label: "All" },
          { key: "ongoing", label: "Ongoing" },
          { key: "successful", label: "Successful" },
          { key: "failed", label: "Failed" },
          { key: "mine", label: "Mine" },
        ].map((f) => (
          <button
            key={f.key}
            style={{
              ...styles.filterBtn,
              ...(filter === f.key ? styles.filterBtnActive : {}),
            }}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
            <span style={{
              ...styles.filterCount,
              ...(filter === f.key ? styles.filterCountActive : {}),
            }}>
              {counts[f.key]}
            </span>
          </button>
        ))}
      </div>

      {loading && <p style={styles.emptyText}>Loading campaigns...</p>}

      {!loading && filtered.length === 0 && (
      <div style={styles.emptyState}>
    <p style={styles.emptyText}>
      {filter === "all" && "No campaigns yet."}
      {filter === "ongoing" && "No ongoing campaigns at the moment."}
      {filter === "successful" && "No successful campaigns yet."}
      {filter === "failed" && "No failed campaigns yet."}
      {filter === "mine" && "You haven't created any campaigns yet."}
    </p>
    {(filter === "all" || filter === "mine") && (
      <button style={styles.createBtn} onClick={() => navigate("/create")}>
        Create one now →
      </button>
    )}
  </div>
)}

      <div style={styles.grid}>
        {filtered.map((c) => {
          const stateInfo = getStateInfo(c.state);
          const progress = getProgress(c.raised, c.goal);
          const isCreator = c.creator?.toLowerCase() === currentUser?.address?.toLowerCase();
          const canDonate = c.state === 0 && !isCreator;

          return (
            <div key={c.id} style={styles.card}>
              <div style={styles.cardTop}>
                <div style={styles.titleRow}>
                  <h3 style={styles.title}>{c.title}</h3>
                  {isCreator && <span style={styles.yoursBadge}>Yours</span>}
                </div>
                <span style={{
                  ...styles.statusBadge,
                  color: stateInfo.color,
                  background: stateInfo.bg,
                  border: `1px solid ${stateInfo.border}`,
                }}>
                  {stateInfo.label}
                </span>
              </div>

              <p style={styles.description}>{c.description}</p>

              <div style={styles.progressBar}>
                <div style={{
                  ...styles.progressFill,
                  width: `${progress}%`,
                  background: stateInfo.color,
                }} />
              </div>

              <div style={styles.statsRow}>
                <div style={styles.stat}>
                  <span style={styles.statLabel}>Raised</span>
                  <span style={styles.statValue}>{c.raised.toFixed(3)} ETH</span>
                </div>
                <div style={styles.stat}>
                  <span style={styles.statLabel}>Goal</span>
                  <span style={styles.statValue}>{c.goal.toFixed(3)} ETH</span>
                </div>
                <div style={styles.stat}>
                  <span style={styles.statLabel}>Progress</span>
                  <span style={styles.statValue}>{progress}%</span>
                </div>
                <div style={styles.stat}>
                    <span style={styles.statLabel}>Deadline</span>
                    <span style={styles.statValue}>
                      {new Date(c.deadline * 1000).toLocaleDateString()}
                    </span>
                  </div>

                  <div style={styles.stat}>
                    <span style={styles.statLabel}>Donors</span>
                    <span style={styles.statValue}>{c.donorCount}</span>
                  </div>

                  {c.myDonation > 0 && (
                    <div style={styles.stat}>
                      <span style={styles.statLabel}>Your donation</span>
                      <span style={{ ...styles.statValue, color: "#3fb950" }}>
                        {c.myDonation.toFixed(3)} ETH
                      </span>
                    </div>
                  )}
                                </div>

              <div style={styles.creatorRow}>
                <span style={styles.creatorLabel}>Creator</span>
                <span style={styles.creatorAddress}>
                  {c.creator.slice(0, 6)}...{c.creator.slice(-4)}
                </span>
              </div>

              {canDonate && (
                <button style={styles.donateBtn} onClick={() => navigate("/donate")}>
                  Donate to this campaign →
                </button>
              )}

              {isCreator && c.state === 0 && (
                <div style={styles.ownerNote}>
                  You created this campaign — you cannot donate to your own campaign.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#080c14",
    color: "#e8edf5",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    padding: "32px 40px",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    maxWidth: "1100px",
    margin: "0 auto 28px",
  },
  backBtn: {
    background: "transparent",
    border: "1px solid #1e2d45",
    color: "#4a90d9",
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "0.9rem",
    cursor: "pointer",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  heading: {
    margin: 0,
    fontSize: "1.7rem",
    fontWeight: "700",
    color: "#f0f6fc",
    flex: 1,
  },
  userBadge: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    background: "#0d1526",
    border: "1px solid #1e2d45",
    borderRadius: "20px",
    padding: "8px 16px",
    fontSize: "0.9rem",
    color: "#7d8fa8",
  },
  userDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#3fb950",
    flexShrink: 0,
  },
  filterRow: {
    display: "flex",
    gap: "10px",
    maxWidth: "1100px",
    margin: "0 auto 24px",
    flexWrap: "wrap",
  },
  filterBtn: {
    padding: "8px 16px",
    background: "transparent",
    border: "1px solid #1e2d45",
    borderRadius: "20px",
    color: "#4a6080",
    fontSize: "0.88rem",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  filterBtnActive: {
    background: "#0d1526",
    border: "1px solid #1e3a5f",
    color: "#4a90d9",
  },
  filterCount: {
    background: "#1e2d45",
    color: "#4a6080",
    borderRadius: "10px",
    padding: "2px 8px",
    fontSize: "0.78rem",
    fontWeight: "700",
  },
  filterCountActive: {
    background: "#1e3a5f",
    color: "#4a90d9",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 0",
  },
  emptyText: {
    color: "#4a6080",
    fontSize: "1rem",
    margin: "0 0 12px",
    textAlign: "center",
  },
  createBtn: {
    background: "transparent",
    border: "none",
    color: "#1f6feb",
    fontSize: "0.95rem",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  grid: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  card: {
    background: "#0d1526",
    border: "1px solid #1e2d45",
    borderRadius: "14px",
    padding: "24px 28px",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "10px",
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flex: 1,
    minWidth: 0,
  },
  title: {
    margin: 0,
    fontSize: "1.15rem",
    fontWeight: "600",
    color: "#f0f6fc",
  },
  yoursBadge: {
    fontSize: "0.7rem",
    fontWeight: "700",
    color: "#4a90d9",
    background: "#0a1929",
    border: "1px solid #1e3a5f",
    borderRadius: "10px",
    padding: "3px 8px",
    flexShrink: 0,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  statusBadge: {
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "0.78rem",
    fontWeight: "600",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  description: {
    margin: "0 0 16px",
    fontSize: "0.92rem",
    color: "#7d8fa8",
    lineHeight: "1.6",
  },
  progressBar: {
    height: "5px",
    background: "#1e2d45",
    borderRadius: "4px",
    overflow: "hidden",
    marginBottom: "16px",
  },
  progressFill: {
    height: "100%",
    borderRadius: "4px",
    transition: "width 0.3s ease",
  },
  statsRow: {
    display: "flex",
    gap: "32px",
    marginBottom: "14px",
    flexWrap: "wrap",
  },
  stat: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },
  statLabel: {
    fontSize: "0.72rem",
    color: "#4a6080",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  statValue: {
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "#c9d1d9",
  },
  creatorRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "6px",
  },
  creatorLabel: {
    fontSize: "0.75rem",
    color: "#4a6080",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  creatorAddress: {
    fontSize: "0.82rem",
    color: "#4a90d9",
    fontFamily: "monospace",
  },
  donateBtn: {
    marginTop: "14px",
    width: "100%",
    padding: "12px",
    background: "#1f6feb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  ownerNote: {
    marginTop: "14px",
    padding: "12px 16px",
    background: "#0a1929",
    border: "1px solid #1e3a5f",
    borderRadius: "8px",
    fontSize: "0.85rem",
    color: "#4a6080",
    fontStyle: "italic",
  },
};