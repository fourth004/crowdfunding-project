// import React, { useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { UserContext } from "../context/UserContext";

// export default function TransactionHistory() {
//   const { txHistory, currentUser } = useContext(UserContext);
//   const navigate = useNavigate();

//   const getTimeAgo = (timestamp) => {
//     const seconds = Math.floor((new Date() - timestamp) / 1000);
//     if (seconds < 60) return `${seconds}s ago`;
//     const minutes = Math.floor(seconds / 60);
//     if (minutes < 60) return `${minutes}m ago`;
//     const hours = Math.floor(minutes / 60);
//     return `${hours}h ago`;
//   };

//   const getTypeInfo = (type) => {
//     switch (type) {
//       case "donated":
//         return { label: "Donated", color: "#1f6feb", bg: "#0a1929", border: "#1e3a5f", icon: "♡" };
//       case "created":
//         return { label: "Created", color: "#3fb950", bg: "#0a1a0d", border: "#1a3d22", icon: "＋" };
//       case "finalized":
//         return { label: "Finalized", color: "#e3b341", bg: "#1a1500", border: "#3d3000", icon: "✓" };
//       case "refunded":
//         return { label: "Refunded", color: "#f85149", bg: "#1a0a0a", border: "#3d1a1a", icon: "↩" };
//       default:
//         return { label: type, color: "#7d8fa8", bg: "#0d1526", border: "#1e2d45", icon: "·" };
//     }
//   };

//   return (
//     <div style={styles.page}>
//       <div style={styles.topBar}>
//         <button style={styles.backBtn} onClick={() => navigate("/")}>
//           ← Back
//         </button>
//         <h1 style={styles.heading}>Transaction History</h1>
//         <div style={styles.userBadge}>
//           <span style={styles.userDot} />
//           {currentUser?.name}
//         </div>
//       </div>

//       <div style={styles.container}>

//         <div style={styles.summaryRow}>
//           {["donated", "created", "finalized", "refunded"].map((type) => {
//             const info = getTypeInfo(type);
//             const count = txHistory.filter(t => t.type === type).length;
//             return (
//               <div key={type} style={styles.summaryCard}>
//                 <span style={{
//                   ...styles.summaryIcon,
//                   color: info.color,
//                   background: info.bg,
//                   border: `1px solid ${info.border}`,
//                 }}>
//                   {info.icon}
//                 </span>
//                 <div>
//                   <p style={styles.summaryCount}>{count}</p>
//                   <p style={styles.summaryLabel}>{info.label}</p>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         <div style={styles.divider} />

//         {txHistory.length === 0 && (
//           <div style={styles.emptyState}>
//             <p style={styles.emptyText}>No transactions yet.</p>
//             <p style={styles.emptySubText}>
//               Actions like donating, creating, finalizing, and withdrawing refunds will appear here.
//             </p>
//             <button style={styles.goBtn} onClick={() => navigate("/donate")}>
//               Go to Donate page →
//             </button>
//           </div>
//         )}

//         {txHistory.length > 0 && (
//           <div style={styles.list}>
//             <div style={styles.listHeader}>
//               <span style={styles.listHeaderText}>
//                 {txHistory.length} transaction{txHistory.length !== 1 ? "s" : ""} this session
//               </span>
//             </div>

//             {txHistory.map((tx) => {
//               const typeInfo = getTypeInfo(tx.type);
//               const isCurrentUser = tx.userName === currentUser?.name;

//               return (
//                 <div key={tx.id} style={{
//                   ...styles.txRow,
//                   ...(isCurrentUser ? styles.txRowHighlight : {}),
//                 }}>
//                   <div style={{
//                     ...styles.txIcon,
//                     color: typeInfo.color,
//                     background: typeInfo.bg,
//                     border: `1px solid ${typeInfo.border}`,
//                   }}>
//                     {typeInfo.icon}
//                   </div>

//                   <div style={styles.txMain}>
//                     <div style={styles.txTopLine}>
//                       <span style={styles.txUser}>{tx.userName}</span>
//                       <span style={styles.txVerb}>{typeInfo.label.toLowerCase()}</span>
//                       {tx.amount && (
//                         <span style={styles.txAmount}>{tx.amount} ETH</span>
//                       )}
//                       {tx.type === "donated" ? (
//                         <span style={styles.txPrep}>to</span>
//                       ) : tx.type === "refunded" ? (
//                         <span style={styles.txPrep}>from</span>
//                       ) : (
//                         <span style={styles.txPrep}>campaign</span>
//                       )}
//                       <span style={styles.txCampaign}>"{tx.campaignTitle}"</span>
//                     </div>
//                   </div>

//                   <div style={styles.txMeta}>
//                     {isCurrentUser && (
//                       <span style={styles.youBadge}>You</span>
//                     )}
//                     <span style={styles.txTime}>{getTimeAgo(tx.timestamp)}</span>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         <p style={styles.sessionNote}>
//            Transaction history resets on page refresh — this is a session log.
//           In a real deployment, all transactions are permanently recorded on the blockchain.
//         </p>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   page: {
//     minHeight: "100vh",
//     background: "#080c14",
//     color: "#e8edf5",
//     fontFamily: "'Segoe UI', system-ui, sans-serif",
//     padding: "32px 40px",
//   },
//   topBar: {
//     display: "flex",
//     alignItems: "center",
//     gap: "16px",
//     maxWidth: "1100px",
//     margin: "0 auto 32px",
//   },
//   backBtn: {
//     background: "transparent",
//     border: "1px solid #1e2d45",
//     color: "#4a90d9",
//     borderRadius: "8px",
//     padding: "8px 16px",
//     fontSize: "0.9rem",
//     cursor: "pointer",
//     fontFamily: "'Segoe UI', system-ui, sans-serif",
//   },
//   heading: {
//     margin: 0,
//     fontSize: "1.7rem",
//     fontWeight: "700",
//     color: "#f0f6fc",
//     flex: 1,
//   },
//   userBadge: {
//     display: "flex",
//     alignItems: "center",
//     gap: "7px",
//     background: "#0d1526",
//     border: "1px solid #1e2d45",
//     borderRadius: "20px",
//     padding: "8px 16px",
//     fontSize: "0.9rem",
//     color: "#7d8fa8",
//   },
//   userDot: {
//     width: "8px",
//     height: "8px",
//     borderRadius: "50%",
//     background: "#3fb950",
//     flexShrink: 0,
//   },
//   container: {
//     maxWidth: "1100px",
//     margin: "0 auto",
//   },
//   summaryRow: {
//     display: "flex",
//     gap: "16px",
//     marginBottom: "24px",
//     flexWrap: "wrap",
//   },
//   summaryCard: {
//     flex: 1,
//     minWidth: "160px",
//     background: "#0d1526",
//     border: "1px solid #1e2d45",
//     borderRadius: "12px",
//     padding: "18px 20px",
//     display: "flex",
//     alignItems: "center",
//     gap: "14px",
//   },
//   summaryIcon: {
//     width: "40px",
//     height: "40px",
//     borderRadius: "10px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: "1.1rem",
//     flexShrink: 0,
//   },
//   summaryCount: {
//     margin: 0,
//     fontSize: "1.5rem",
//     fontWeight: "700",
//     color: "#f0f6fc",
//     lineHeight: 1,
//   },
//   summaryLabel: {
//     margin: "4px 0 0",
//     fontSize: "0.75rem",
//     color: "#4a6080",
//     textTransform: "uppercase",
//     letterSpacing: "0.5px",
//   },
//   divider: {
//     height: "1px",
//     background: "#1e2d45",
//     margin: "8px 0 24px",
//   },
//   emptyState: {
//     textAlign: "center",
//     padding: "80px 0",
//   },
//   emptyText: {
//     color: "#4a6080",
//     fontSize: "1.1rem",
//     margin: "0 0 10px",
//   },
//   emptySubText: {
//     color: "#2d4060",
//     fontSize: "0.9rem",
//     margin: "0 0 24px",
//     maxWidth: "400px",
//     marginLeft: "auto",
//     marginRight: "auto",
//     lineHeight: "1.6",
//   },
//   goBtn: {
//     background: "transparent",
//     border: "none",
//     color: "#1f6feb",
//     fontSize: "0.95rem",
//     fontWeight: "600",
//     cursor: "pointer",
//     fontFamily: "'Segoe UI', system-ui, sans-serif",
//   },
//   list: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "2px",
//   },
//   listHeader: {
//     marginBottom: "12px",
//   },
//   listHeaderText: {
//     fontSize: "0.78rem",
//     color: "#2d4060",
//     textTransform: "uppercase",
//     letterSpacing: "0.5px",
//   },
//   txRow: {
//     display: "flex",
//     alignItems: "center",
//     gap: "16px",
//     padding: "16px 20px",
//     borderRadius: "10px",
//     background: "#0d1526",
//     border: "1px solid #1e2d45",
//     marginBottom: "8px",
//   },
//   txRowHighlight: {
//     border: "1px solid #1e3a5f",
//     background: "#0a1929",
//   },
//   txIcon: {
//     width: "38px",
//     height: "38px",
//     borderRadius: "9px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: "1.05rem",
//     flexShrink: 0,
//   },
//   txMain: {
//     flex: 1,
//     minWidth: 0,
//   },
//   txTopLine: {
//     display: "flex",
//     alignItems: "center",
//     gap: "6px",
//     flexWrap: "wrap",
//   },
//   txUser: {
//     fontSize: "0.95rem",
//     fontWeight: "700",
//     color: "#f0f6fc",
//   },
//   txVerb: {
//     fontSize: "0.95rem",
//     color: "#7d8fa8",
//   },
//   txAmount: {
//     fontSize: "0.95rem",
//     fontWeight: "700",
//     color: "#4a90d9",
//   },
//   txPrep: {
//     fontSize: "0.95rem",
//     color: "#7d8fa8",
//   },
//   txCampaign: {
//     fontSize: "0.95rem",
//     color: "#c9d1d9",
//     fontStyle: "italic",
//   },
//   txMeta: {
//     display: "flex",
//     alignItems: "center",
//     gap: "10px",
//     flexShrink: 0,
//   },
//   youBadge: {
//     fontSize: "0.7rem",
//     fontWeight: "700",
//     color: "#4a90d9",
//     background: "#0a1929",
//     border: "1px solid #1e3a5f",
//     borderRadius: "10px",
//     padding: "3px 9px",
//     textTransform: "uppercase",
//     letterSpacing: "0.5px",
//   },
//   txTime: {
//     fontSize: "0.82rem",
//     color: "#2d4060",
//   },
//   sessionNote: {
//     marginTop: "32px",
//     fontSize: "0.82rem",
//     color: "#2d4060",
//     lineHeight: "1.6",
//     textAlign: "center",
//   },
// };


import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "../utils/constants";
import { UserContext } from "../context/UserContext";
import { users } from "../utils/users";

export default function TransactionHistory() {
  const { currentUser } = useContext(UserContext);
  const [txHistory, setTxHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

        // fetch all 4 event types in parallel
        const [created, donated, finalized, refunded] = await Promise.all([
          contract.queryFilter(contract.filters.CampaignCreated()),
          contract.queryFilter(contract.filters.DonationReceived()),
          contract.queryFilter(contract.filters.CampaignFinalized()),
          contract.queryFilter(contract.filters.RefundWithdrawn()),
        ]);

        // get all hardhat accounts so we can map address → name
        //const accounts = await provider.listAccounts();
        // map address → name using your actual users list
        const getName = (address) => {
          const match = users.find(
            (u) => u.address?.toLowerCase() === address?.toLowerCase()
          );
          if (match) return match.name;
          return `${address?.slice(0, 6)}...${address?.slice(-4)}`;
        };

        // fetch campaign titles for all unique campaign IDs
        const allCampaignIds = new Set([
          ...donated.map((e) => Number(e.args.campaignId)),
          ...finalized.map((e) => Number(e.args.campaignId)),
          ...refunded.map((e) => Number(e.args.campaignId)),
        ]);

        const titleMap = {};
        await Promise.all(
          [...allCampaignIds].map(async (id) => {
            try {
              const c = await contract.getCampaign(id);
              titleMap[id] = c.title || c[1];
            } catch {
              titleMap[id] = `Campaign #${id}`;
            }
          })
        );

        // fetch block timestamps for accurate time display
        const allBlockNumbers = new Set([
          ...created.map((e) => e.blockNumber),
          ...donated.map((e) => e.blockNumber),
          ...finalized.map((e) => e.blockNumber),
          ...refunded.map((e) => e.blockNumber),
        ]);

        const blockTimestamps = {};
        await Promise.all(
          [...allBlockNumbers].map(async (bn) => {
            try {
              const block = await provider.getBlock(bn);
              blockTimestamps[bn] = block.timestamp * 1000;
            } catch {
              blockTimestamps[bn] = Date.now();
            }
          })
        );

        const events = [
          ...created.map((e) => ({
            id: `created-${e.transactionHash}`,
            type: "created",
            userName: getName(e.args.creator),
            address: e.args.creator,
            campaignTitle: e.args.title,
            amount: null,
            timestamp: blockTimestamps[e.blockNumber] || Date.now(),
            blockNumber: e.blockNumber,
            txHash: e.transactionHash,
          })),
          ...donated.map((e) => ({
            id: `donated-${e.transactionHash}`,
            type: "donated",
            userName: getName(e.args.donor),
            address: e.args.donor,
            campaignTitle: titleMap[Number(e.args.campaignId)] || `Campaign #${e.args.campaignId}`,
            amount: Number(ethers.formatEther(e.args.amount)).toFixed(3),
            timestamp: blockTimestamps[e.blockNumber] || Date.now(),
            blockNumber: e.blockNumber,
            txHash: e.transactionHash,
          })),
          ...finalized.map((e) => ({
            id: `finalized-${e.transactionHash}`,
            type: "finalized",
            userName: null,
            address: null,
            campaignTitle: titleMap[Number(e.args.campaignId)] || `Campaign #${e.args.campaignId}`,
            amount: null,
            timestamp: blockTimestamps[e.blockNumber] || Date.now(),
            blockNumber: e.blockNumber,
            txHash: e.transactionHash,
          })),
          ...refunded.map((e) => ({
            id: `refunded-${e.transactionHash}`,
            type: "refunded",
            userName: getName(e.args.donor),
            address: e.args.donor,
            campaignTitle: titleMap[Number(e.args.campaignId)] || `Campaign #${e.args.campaignId}`,
            amount: Number(ethers.formatEther(e.args.amount)).toFixed(3),
            timestamp: blockTimestamps[e.blockNumber] || Date.now(),
            blockNumber: e.blockNumber,
            txHash: e.transactionHash,
          })),
        ];

        // sort by block number, newest first
        events.sort((a, b) => b.blockNumber - a.blockNumber);
        setTxHistory(events);
      } catch (err) {
        console.error("Failed to load events:", err);
      }
      setLoading(false);
    };

    loadEvents();
  }, []);

  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getTypeInfo = (type) => {
    switch (type) {
      case "donated":
        return { label: "Donated", color: "#1f6feb", bg: "#0a1929", border: "#1e3a5f", icon: "♡" };
      case "created":
        return { label: "Created", color: "#3fb950", bg: "#0a1a0d", border: "#1a3d22", icon: "＋" };
      case "finalized":
        return { label: "Finalized", color: "#e3b341", bg: "#1a1500", border: "#3d3000", icon: "✓" };
      case "refunded":
        return { label: "Refunded", color: "#f85149", bg: "#1a0a0a", border: "#3d1a1a", icon: "↩" };
      default:
        return { label: type, color: "#7d8fa8", bg: "#0d1526", border: "#1e2d45", icon: "·" };
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <button style={styles.backBtn} onClick={() => navigate("/")}>
          ← Back
        </button>
        <h1 style={styles.heading}>Transaction History</h1>
        <div style={styles.userBadge}>
          <span style={styles.userDot} />
          {currentUser?.name}
        </div>
      </div>

      <div style={styles.container}>

        <div style={styles.summaryRow}>
          {["donated", "created", "finalized", "refunded"].map((type) => {
            const info = getTypeInfo(type);
            const count = txHistory.filter(t => t.type === type).length;
            return (
              <div key={type} style={styles.summaryCard}>
                <span style={{
                  ...styles.summaryIcon,
                  color: info.color,
                  background: info.bg,
                  border: `1px solid ${info.border}`,
                }}>
                  {info.icon}
                </span>
                <div>
                  <p style={styles.summaryCount}>{count}</p>
                  <p style={styles.summaryLabel}>{info.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div style={styles.divider} />

        {loading && (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>Loading transactions from blockchain...</p>
          </div>
        )}

        {!loading && txHistory.length === 0 && (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No transactions yet.</p>
            <p style={styles.emptySubText}>
              Actions like donating, creating, finalizing, and withdrawing refunds will appear here.
            </p>
            <button style={styles.goBtn} onClick={() => navigate("/donate")}>
              Go to Donate page →
            </button>
          </div>
        )}

        {!loading && txHistory.length > 0 && (
          <div style={styles.list}>
            <div style={styles.listHeader}>
              <span style={styles.listHeaderText}>
                {txHistory.length} transaction{txHistory.length !== 1 ? "s" : ""} on-chain
              </span>
            </div>

            {txHistory.map((tx) => {
              const typeInfo = getTypeInfo(tx.type);
              const isCurrentUser =
                tx.address?.toLowerCase() === currentUser?.address?.toLowerCase();

              return (
                <div key={tx.id} style={{
                  ...styles.txRow,
                  ...(isCurrentUser ? styles.txRowHighlight : {}),
                }}>
                  <div style={{
                    ...styles.txIcon,
                    color: typeInfo.color,
                    background: typeInfo.bg,
                    border: `1px solid ${typeInfo.border}`,
                  }}>
                    {typeInfo.icon}
                  </div>

                  <div style={styles.txMain}>
                    <div style={styles.txTopLine}>
                    {tx.type === "finalized" ? (
                      <>
                        <span style={styles.txCampaign}>"{tx.campaignTitle}"</span>
                        <span style={styles.txUser}>campaign finalized</span>
                      </>
                    ) : (
                      <>
                        <span style={styles.txUser}>{tx.userName}</span>
                        <span style={styles.txVerb}>{typeInfo.label.toLowerCase()}</span>
                        {tx.amount && (
                          <span style={styles.txAmount}>{tx.amount} ETH</span>
                        )}
                        {tx.type === "donated" && (
                          <span style={styles.txPrep}>to</span>
                        )}
                        {tx.type === "refunded" && (
                          <span style={styles.txPrep}>from</span>
                        )}
                        <span style={styles.txCampaign}>"{tx.campaignTitle}"</span>
                      </>
                    )}
                  </div>
                    <div style={styles.txHashRow}>
                      <span style={styles.txHashLabel}>tx: </span>
                      <span style={styles.txHash}>
                        {tx.txHash?.slice(0, 12)}...{tx.txHash?.slice(-8)}
                      </span>
                      <span style={styles.txBlock}>block #{tx.blockNumber}</span>
                    </div>
                  </div>

                  <div style={styles.txMeta}>
                    {isCurrentUser && (
                      <span style={styles.youBadge}>You</span>
                    )}
                    <span style={styles.txTime}>{getTimeAgo(tx.timestamp)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p style={styles.sessionNote}>
          ⛓ All transactions are read directly from the blockchain and persist for the duration of the Hardhat node session.
        </p>
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
    margin: "0 auto 32px",
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
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  summaryRow: {
    display: "flex",
    gap: "16px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  summaryCard: {
    flex: 1,
    minWidth: "160px",
    background: "#0d1526",
    border: "1px solid #1e2d45",
    borderRadius: "12px",
    padding: "18px 20px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  summaryIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.1rem",
    flexShrink: 0,
  },
  summaryCount: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#f0f6fc",
    lineHeight: 1,
  },
  summaryLabel: {
    margin: "4px 0 0",
    fontSize: "0.75rem",
    color: "#4a6080",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  divider: {
    height: "1px",
    background: "#1e2d45",
    margin: "8px 0 24px",
  },
  emptyState: {
    textAlign: "center",
    padding: "80px 0",
  },
  emptyText: {
    color: "#4a6080",
    fontSize: "1.1rem",
    margin: "0 0 10px",
  },
  emptySubText: {
    color: "#2d4060",
    fontSize: "0.9rem",
    margin: "0 0 24px",
    maxWidth: "400px",
    marginLeft: "auto",
    marginRight: "auto",
    lineHeight: "1.6",
  },
  goBtn: {
    background: "transparent",
    border: "none",
    color: "#1f6feb",
    fontSize: "0.95rem",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  listHeader: {
    marginBottom: "12px",
  },
  listHeaderText: {
    fontSize: "0.78rem",
    color: "#2d4060",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  txRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "16px 20px",
    borderRadius: "10px",
    background: "#0d1526",
    border: "1px solid #1e2d45",
    marginBottom: "8px",
  },
  txRowHighlight: {
    border: "1px solid #1e3a5f",
    background: "#0a1929",
  },
  txIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.05rem",
    flexShrink: 0,
  },
  txMain: {
    flex: 1,
    minWidth: 0,
  },
  txTopLine: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    flexWrap: "wrap",
  },
  txUser: {
    fontSize: "0.95rem",
    fontWeight: "700",
    color: "#f0f6fc",
  },
  txVerb: {
    fontSize: "0.95rem",
    color: "#7d8fa8",
  },
  txAmount: {
    fontSize: "0.95rem",
    fontWeight: "700",
    color: "#4a90d9",
  },
  txPrep: {
    fontSize: "0.95rem",
    color: "#7d8fa8",
  },
  txCampaign: {
    fontSize: "0.95rem",
    color: "#c9d1d9",
    fontStyle: "italic",
  },
  txHashRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "4px",
  },
  txHashLabel: {
    fontSize: "0.75rem",
    color: "#2d4060",
  },
  txHash: {
    fontSize: "0.75rem",
    color: "#2d4060",
    fontFamily: "monospace",
  },
  txBlock: {
    fontSize: "0.72rem",
    color: "#1e3a5f",
    background: "#0a1929",
    border: "1px solid #1e2d45",
    borderRadius: "6px",
    padding: "2px 7px",
  },
  txMeta: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexShrink: 0,
  },
  youBadge: {
    fontSize: "0.7rem",
    fontWeight: "700",
    color: "#4a90d9",
    background: "#0a1929",
    border: "1px solid #1e3a5f",
    borderRadius: "10px",
    padding: "3px 9px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  txTime: {
    fontSize: "0.82rem",
    color: "#2d4060",
  },
  sessionNote: {
    marginTop: "32px",
    fontSize: "0.82rem",
    color: "#2d4060",
    lineHeight: "1.6",
    textAlign: "center",
  },
};