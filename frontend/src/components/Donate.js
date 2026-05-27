

// import React, { useEffect, useState } from "react";
// import { ethers } from "ethers";
// import { CONTRACT_ADDRESS, ABI } from "../utils/constants";
// import { useContext } from "react";
// import { UserContext } from "../context/UserContext";

// export default function Donate() {
//   const [campaigns, setCampaigns] = useState([]);
//   const [amounts, setAmounts] = useState({});
//   const [loading, setLoading] = useState(false);
//   const { currentUser } =
//   useContext(UserContext);
//   if (!currentUser) {
//   return <div>Loading user...</div>;
// }
//   // Hardhat local provider and wallet setup
//   const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
//   const wallet = new ethers.Wallet(
//   currentUser.privateKey,
//   provider
// );
//   const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

//   // Load campaigns and auto-update state after deadline
//   const loadCampaigns = async () => {
//     try {
//       const count = Number(await contract.campaignCount());
//       const list = [];

//       for (let i = 1; i <= count; i++) {
//         const c = await contract.getCampaign(i);
//         let finalized = Boolean(c.finalized || c[7]);
//         let state = Number(c.state || c[6]);

//         // Auto mark failed if deadline passed and not finalized
//         const deadlinePassed = Date.now() / 1000 > Number(c.deadline || c[4]);
//         const raisedAmount = Number(ethers.formatEther(c.raised || c[5]));
//         const goalAmount = Number(ethers.formatEther(c.goal || c[3]));

//         if (!finalized && deadlinePassed) {
//           if (raisedAmount >= goalAmount) {
//             state = 1; // Successful
//           } else {
//             state = 2; // Failed
//           }
//         }

//         list.push({
//           id: i,
//           creator: c.creator || c[0],
//           title: c.title || c[1],
//           description: c.description || c[2],
//           goal: ethers.formatEther(c.goal || c[3]),
//           deadline: Number(c.deadline || c[4]),
//           raised: ethers.formatEther(c.raised || c[5]),
//           state,
//           finalized,
//         });
//       }

//       setCampaigns(list.reverse());
//     } catch (err) {
//       console.error("Load failed:", err);
//     }
//   };

//   // Donate function
//   const donate = async (id) => {
//     const value = amounts[id];
//     if (!value || Number(value) < 0.01) {
//       alert("Minimum donation is 0.01 ETH");
//       return;
//     }

//     setLoading(true);
//     try {
//             console.log(
//         "Donation happening from:",
//         currentUser.name,
//         wallet.address
//       );
//       const tx = await contract.donate(id, { value: ethers.parseEther(value) });
//       await tx.wait();
//               console.log(
//           `${currentUser.name} donated ${value} ETH`
//         );
//       setAmounts({ ...amounts, [id]: "" });
//       loadCampaigns();
//       alert("Donation successful!");
//     } catch (err) {
//       console.error(err);
//       alert("Donation failed!");
//     }
//     setLoading(false);
//   };

//   // Finalize function
//   const finalize = async (id) => {
//     setLoading(true);
//     try {
//       await (await contract.finalizeCampaign(id)).wait();
//       loadCampaigns();
//       alert("Campaign finalized!");
//     } catch (err) {
//       console.error(err);
//       alert("Finalize failed!");
//     }
//     setLoading(false);
//   };

//   // Withdraw refunds
//   const withdraw = async (id) => {
//     setLoading(true);
//     try {
//           console.log(
//       "Refund withdrawn by:",
//       currentUser.name,
//       wallet.address
//       );
      
//       await (await contract.withdrawRefund(id)).wait();
//       loadCampaigns();
//       alert("Refund withdrawn!");
//         const after =
//       await provider.getBalance(
//         wallet.address
//       );
//                 console.log(
//           `${currentUser.name} successfully received refund`
//         );

//         console.log(
//           `Refunded Campaign ID: ${id}`
//         );
            
        
//     } catch (err) {
//       console.error(err);
//       alert("Withdraw failed!");
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     loadCampaigns();
//     const interval = setInterval(loadCampaigns, 10000);
//     return () => clearInterval(interval);
//   }, [currentUser]);

//   return (
//     <div style={styles.page}>
//       <h1>Donate to Campaigns</h1>

//       {campaigns.length === 0 && <p>No campaigns yet</p>}

//       {campaigns.map((c) => (
//         <div key={c.id} style={styles.card}>
//           <h3>{c.title}</h3>
//           <p>{c.description}</p>
//           <p>Goal: {c.goal} ETH</p>
//           <p>Raised: {c.raised} ETH</p>
//           <p>Deadline: {new Date(c.deadline * 1000).toLocaleString()}</p>
//           <p>Creator: {c.creator}</p>
//           <p>Status: {c.state === 0 ? "Ongoing" : c.state === 1 ? "Successful" : "Failed"}</p>

//           <div style={styles.row}>
//             <input
//               style={styles.input}
//               placeholder="ETH amount"
//               value={amounts[c.id] || ""}
//               onChange={(e) => setAmounts({ ...amounts, [c.id]: e.target.value })}
//               disabled={Date.now() / 1000 > c.deadline || c.finalized || c.state === 2}
//             />
//             <button
//               style={styles.button}
//               disabled={loading || Date.now() / 1000 > c.deadline || c.finalized || c.state === 2}
//               onClick={() => donate(c.id)}
//             >
//               Donate
//             </button>
//           </div>

//           {!c.finalized && Date.now() / 1000 > c.deadline && (
//             <button style={styles.button} onClick={() => finalize(c.id)}>
//               Finalize
//             </button>
//           )}

//           {c.finalized && c.state === 2 && Number(c.raised) > 0 &&(
//             <button style={styles.button} onClick={() => withdraw(c.id)}>
//               Withdraw Refund
//             </button>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

// const styles = {
//   page: { minHeight: "100vh", background: "#020617", color: "#fff", padding: 32 },
//   card: { background: "#071029", padding: 16, borderRadius: 12, marginBottom: 16 },
//   row: { display: "flex", gap: 8, marginTop: 8 },
//   input: { flex: 1, padding: 8, background: "#111827", color: "#fff", border: "1px solid #30363d", borderRadius: 6 },
//   button: { padding: "8px 16px", background: "#1f6feb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", marginTop: 8 },
// };



// import React, { useEffect, useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { ethers } from "ethers";
// import { CONTRACT_ADDRESS, ABI } from "../utils/constants";
// import { UserContext } from "../context/UserContext";

// export default function Donate() {
//   const { currentUser, addTx } = useContext(UserContext);

//   const [campaigns, setCampaigns] = useState([]);
//   const [amounts, setAmounts] = useState({});
//   const [loading, setLoading] = useState(false);
//   const { currentUser } = useContext(UserContext);
//   const navigate = useNavigate();

//   if (!currentUser) return <div style={styles.page}>Loading user...</div>;

//   const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
//   const wallet = new ethers.Wallet(currentUser.privateKey, provider);
//   const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

//   const loadCampaigns = async () => {
//     try {
//       const count = Number(await contract.campaignCount());
//       const list = [];
//       for (let i = 1; i <= count; i++) {
//         const c = await contract.getCampaign(i);
//         let finalized = Boolean(c.finalized || c[7]);
//         let state = Number(c.state || c[6]);
//         const deadlinePassed = Date.now() / 1000 > Number(c.deadline || c[4]);
//         const raisedAmount = Number(ethers.formatEther(c.raised || c[5]));
//         const goalAmount = Number(ethers.formatEther(c.goal || c[3]));
//         if (!finalized && deadlinePassed) {
//           state = raisedAmount >= goalAmount ? 1 : 2;
//         }
//         list.push({
//           id: i,
//           creator: c.creator || c[0],
//           title: c.title || c[1],
//           description: c.description || c[2],
//           goal: ethers.formatEther(c.goal || c[3]),
//           deadline: Number(c.deadline || c[4]),
//           raised: ethers.formatEther(c.raised || c[5]),
//           state,
//           finalized,
//         });
//       }
//       setCampaigns(list.reverse());
//     } catch (err) {
//       console.error("Load failed:", err);
//     }
//   };

//   const donate = async (id) => {
//     const value = amounts[id];
//     if (!value || Number(value) < 0.01) {
//       alert("Minimum donation is 0.01 ETH");
//       return;
//     }
//     setLoading(true);
//     try {
//       console.log("Donation from:", currentUser.name, wallet.address);
//       const tx = await contract.donate(id, { value: ethers.parseEther(value) });
//       await tx.wait();

//       addTx("donated", currentUser.name, c.title, value);

//       console.log(`${currentUser.name} donated ${value} ETH`);
//       setAmounts({ ...amounts, [id]: "" });
//       loadCampaigns();
//       alert("Donation successful!");
//     } catch (err) {
//       console.error(err);
//       alert("Donation failed!");
//     }
//     setLoading(false);
//   };

//   const finalize = async (id) => {
//     setLoading(true);
//     try {
//       await (await contract.finalizeCampaign(id)).wait();
//       loadCampaigns();
//       alert("Campaign finalized!");
//     } catch (err) {
//       console.error(err);
//       alert("Finalize failed!");
//     }
//     setLoading(false);
//   };

//   const withdraw = async (id) => {
//     setLoading(true);
//     try {
//       console.log("Refund withdrawn by:", currentUser.name, wallet.address);
//       await (await contract.withdrawRefund(id)).wait();
//       loadCampaigns();
//       alert("Refund withdrawn!");
//       console.log(`${currentUser.name} received refund for Campaign ID: ${id}`);
//     } catch (err) {
//       console.error(err);
//       alert("Withdraw failed!");
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     loadCampaigns();
//     const interval = setInterval(loadCampaigns, 10000);
//     return () => clearInterval(interval);
//   }, [currentUser]);

//   const getStateLabel = (state) => {
//     if (state === 0) return { label: "Ongoing", color: "#1f6feb", bg: "#0a1929", border: "#1e3a5f" };
//     if (state === 1) return { label: "Successful", color: "#3fb950", bg: "#0a1a0d", border: "#1a3d22" };
//     return { label: "Failed", color: "#f85149", bg: "#1a0a0a", border: "#3d1a1a" };
//   };

//   const getProgress = (raised, goal) => {
//     const pct = (Number(raised) / Number(goal)) * 100;
//     return Math.min(pct, 100).toFixed(1);
//   };

//   return (
//     <div style={styles.page}>
//       <div style={styles.topBar}>
//         <button style={styles.backBtn} onClick={() => navigate("/")}>
//           ← Back
//         </button>
//         <h1 style={styles.heading}>Campaigns</h1>
//         <div style={styles.userBadge}>
//           <span style={styles.userDot} />
//           {currentUser.name}
//         </div>
//       </div>

//       {campaigns.length === 0 && (
//         <p style={styles.empty}>No campaigns yet. Be the first to create one!</p>
//       )}

//       <div style={styles.grid}>
//         {campaigns.map((c) => {
//           const stateInfo = getStateLabel(c.state);
//           const progress = getProgress(c.raised, c.goal);
//           const expired = Date.now() / 1000 > c.deadline;
//           const canDonate = !expired && !c.finalized && c.state === 0;

//           return (
//             <div key={c.id} style={styles.card}>
//               <div style={styles.cardHeader}>
//                 <div>
//                   <h3 style={styles.cardTitle}>{c.title}</h3>
//                   <p style={styles.cardDesc}>{c.description}</p>
//                 </div>
//                 <span style={{
//                   ...styles.statusBadge,
//                   color: stateInfo.color,
//                   background: stateInfo.bg,
//                   border: `1px solid ${stateInfo.border}`,
//                 }}>
//                   {stateInfo.label}
//                 </span>
//               </div>

//               <div style={styles.progressBar}>
//                 <div style={{ ...styles.progressFill, width: `${progress}%`, background: stateInfo.color }} />
//               </div>

//               <div style={styles.statsRow}>
//                 <div style={styles.stat}>
//                   <span style={styles.statLabel}>Raised</span>
//                   <span style={styles.statValue}>{Number(c.raised).toFixed(3)} ETH</span>
//                 </div>
//                 <div style={styles.stat}>
//                   <span style={styles.statLabel}>Goal</span>
//                   <span style={styles.statValue}>{Number(c.goal).toFixed(3)} ETH</span>
//                 </div>
//                 <div style={styles.stat}>
//                   <span style={styles.statLabel}>Progress</span>
//                   <span style={styles.statValue}>{progress}%</span>
//                 </div>
//               </div>

//               <div style={styles.metaRow}>
//                 <span style={styles.metaItem}>
//                   🕐 {new Date(c.deadline * 1000).toLocaleString()}
//                 </span>
//                 <span style={styles.metaItem} title={c.creator}>
//                   👤 {c.creator.slice(0, 6)}...{c.creator.slice(-4)}
//                 </span>
//               </div>

//               {canDonate && (
//                 <div style={styles.donateRow}>
//                   <input
//                     style={styles.input}
//                     placeholder="ETH amount (min 0.01)"
//                     value={amounts[c.id] || ""}
//                     onChange={(e) => setAmounts({ ...amounts, [c.id]: e.target.value })}
//                     type="number"
//                     step="0.01"
//                     min="0.01"
//                   />
//                   <button
//                     style={styles.donateBtn}
//                     disabled={loading}
//                     onClick={() => donate(c.id)}
//                   >
//                     {loading ? "..." : "Donate"}
//                   </button>
//                 </div>
//               )}

//               {!c.finalized && expired && (
//                 <button style={styles.finalizeBtn} onClick={() => finalize(c.id)} disabled={loading}>
//                   Finalize Campaign
//                 </button>
//               )}

//               {c.finalized && c.state === 2 && Number(c.raised) > 0 && (
//                 <button style={styles.refundBtn} onClick={() => withdraw(c.id)} disabled={loading}>
//                   Withdraw Refund
//                 </button>
//               )}
//             </div>
//           );
//         })}
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
//     padding: "24px",
//   },
//   topBar: {
//     display: "flex",
//     alignItems: "center",
//     gap: "16px",
//     marginBottom: "28px",
//   },
//   backBtn: {
//     background: "transparent",
//     border: "1px solid #1e2d45",
//     color: "#4a90d9",
//     borderRadius: "8px",
//     padding: "7px 14px",
//     fontSize: "0.85rem",
//     cursor: "pointer",
//     fontFamily: "'Segoe UI', system-ui, sans-serif",
//   },
//   heading: {
//     margin: 0,
//     fontSize: "1.4rem",
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
//     padding: "6px 14px",
//     fontSize: "0.85rem",
//     color: "#7d8fa8",
//   },
//   userDot: {
//     width: "7px",
//     height: "7px",
//     borderRadius: "50%",
//     background: "#3fb950",
//     flexShrink: 0,
//   },
//   empty: {
//     textAlign: "center",
//     color: "#4a6080",
//     marginTop: "60px",
//     fontSize: "1rem",
//   },
//   grid: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "16px",
//     maxWidth: "700px",
//     margin: "0 auto",
//   },
//   card: {
//     background: "#0d1526",
//     border: "1px solid #1e2d45",
//     borderRadius: "14px",
//     padding: "20px",
//   },
//   cardHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     gap: "12px",
//     marginBottom: "14px",
//   },
//   cardTitle: {
//     margin: "0 0 4px",
//     fontSize: "1.05rem",
//     fontWeight: "600",
//     color: "#f0f6fc",
//   },
//   cardDesc: {
//     margin: 0,
//     fontSize: "0.85rem",
//     color: "#7d8fa8",
//     lineHeight: "1.5",
//   },
//   statusBadge: {
//     padding: "4px 10px",
//     borderRadius: "20px",
//     fontSize: "0.75rem",
//     fontWeight: "600",
//     whiteSpace: "nowrap",
//     flexShrink: 0,
//   },
//   progressBar: {
//     height: "4px",
//     background: "#1e2d45",
//     borderRadius: "4px",
//     overflow: "hidden",
//     marginBottom: "14px",
//   },
//   progressFill: {
//     height: "100%",
//     borderRadius: "4px",
//     transition: "width 0.3s ease",
//   },
//   statsRow: {
//     display: "flex",
//     gap: "16px",
//     marginBottom: "12px",
//   },
//   stat: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "2px",
//   },
//   statLabel: {
//     fontSize: "0.7rem",
//     color: "#4a6080",
//     textTransform: "uppercase",
//     letterSpacing: "0.5px",
//   },
//   statValue: {
//     fontSize: "0.9rem",
//     fontWeight: "600",
//     color: "#c9d1d9",
//   },
//   metaRow: {
//     display: "flex",
//     gap: "16px",
//     marginBottom: "14px",
//     flexWrap: "wrap",
//   },
//   metaItem: {
//     fontSize: "0.78rem",
//     color: "#4a6080",
//   },
//   donateRow: {
//     display: "flex",
//     gap: "10px",
//     marginTop: "8px",
//   },
//   input: {
//     flex: 1,
//     padding: "10px 12px",
//     background: "#0a1929",
//     border: "1px solid #1e3a5f",
//     borderRadius: "8px",
//     color: "#e8edf5",
//     fontSize: "0.9rem",
//     outline: "none",
//     fontFamily: "'Segoe UI', system-ui, sans-serif",
//   },
//   donateBtn: {
//     padding: "10px 20px",
//     background: "#1f6feb",
//     color: "#fff",
//     border: "none",
//     borderRadius: "8px",
//     fontSize: "0.9rem",
//     fontWeight: "600",
//     cursor: "pointer",
//     fontFamily: "'Segoe UI', system-ui, sans-serif",
//   },
//   finalizeBtn: {
//     width: "100%",
//     padding: "10px",
//     background: "transparent",
//     border: "1px solid #2d4a6a",
//     color: "#4a90d9",
//     borderRadius: "8px",
//     fontSize: "0.9rem",
//     fontWeight: "600",
//     cursor: "pointer",
//     marginTop: "8px",
//     fontFamily: "'Segoe UI', system-ui, sans-serif",
//   },
//   refundBtn: {
//     width: "100%",
//     padding: "10px",
//     background: "transparent",
//     border: "1px solid #3d1a1a",
//     color: "#f85149",
//     borderRadius: "8px",
//     fontSize: "0.9rem",
//     fontWeight: "600",
//     cursor: "pointer",
//     marginTop: "8px",
//     fontFamily: "'Segoe UI', system-ui, sans-serif",
//   },
// };


// import React, { useEffect, useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { ethers } from "ethers";
// import { CONTRACT_ADDRESS, ABI } from "../utils/constants";
// import { UserContext } from "../context/UserContext";

// export default function Donate() {
//   const { currentUser, addTx } = useContext(UserContext);
//   const [campaigns, setCampaigns] = useState([]);
//   const [amounts, setAmounts] = useState({});
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   if (!currentUser) return <div style={styles.page}>Loading user...</div>;

//   const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
//   const wallet = new ethers.Wallet(currentUser.privateKey, provider);
//   const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

//   const loadCampaigns = async () => {
//     try {
//       const count = Number(await contract.campaignCount());
//       const list = [];
//       for (let i = 1; i <= count; i++) {
//         const c = await contract.getCampaign(i);
//         let finalized = Boolean(c.finalized || c[7]);
//         let state = Number(c.state || c[6]);
//         const deadlinePassed = Date.now() / 1000 > Number(c.deadline || c[4]);
//         const raisedAmount = Number(ethers.formatEther(c.raised || c[5]));
//         const goalAmount = Number(ethers.formatEther(c.goal || c[3]));
//         if (!finalized && deadlinePassed) {
//           state = raisedAmount >= goalAmount ? 1 : 2;
//         }

//         // Fetch how much the current user donated to this campaign
//         const userContribution = await contract.getContribution(i, currentUser.address);
//         const userDonated = Number(ethers.formatEther(userContribution)) > 0;

//         list.push({
//           id: i,
//           creator: c.creator || c[0],
//           title: c.title || c[1],
//           description: c.description || c[2],
//           goal: ethers.formatEther(c.goal || c[3]),
//           deadline: Number(c.deadline || c[4]),
//           raised: ethers.formatEther(c.raised || c[5]),
//           state,
//           finalized,
//           userDonated,
//         });
//       }
//       setCampaigns(list.reverse());
//     } catch (err) {
//       console.error("Load failed:", err);
//     }
//   };

//   const donate = async (id, campaignTitle) => {
//     const value = amounts[id];
//     if (!value || Number(value) < 0.01) {
//       alert("Minimum donation is 0.01 ETH");
//       return;
//     }
//     setLoading(true);
//     try {
//       console.log("Donation from:", currentUser.name, wallet.address);
//       const tx = await contract.donate(id, { value: ethers.parseEther(value) });
//       await tx.wait();
//       addTx("donated", currentUser.name, campaignTitle, value);
//       console.log(`${currentUser.name} donated ${value} ETH`);
//       setAmounts({ ...amounts, [id]: "" });
//       loadCampaigns();
//       alert("Donation successful!");
//     } catch (err) {
//       console.error(err);
//       alert("Donation failed!");
//     }
//     setLoading(false);
//   };

//   const finalize = async (id, campaignTitle) => {
//     setLoading(true);
//     try {
//       await (await contract.finalizeCampaign(id)).wait();
//       addTx("finalized", currentUser.name, campaignTitle);
//       loadCampaigns();
//       alert("Campaign finalized!");
//     } catch (err) {
//       console.error(err);
//       alert("Finalize failed!");
//     }
//     setLoading(false);
//   };

//   const withdraw = async (id, campaignTitle) => {
//     setLoading(true);
//     try {
//       console.log("Refund withdrawn by:", currentUser.name, wallet.address);
//       await (await contract.withdrawRefund(id)).wait();
//       addTx("refunded", currentUser.name, campaignTitle);
//       loadCampaigns();
//       alert("Refund withdrawn!");
//       console.log(`${currentUser.name} received refund for Campaign ID: ${id}`);
//     } catch (err) {
//       console.error(err);
//       alert("Withdraw failed!");
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     loadCampaigns();
//     const interval = setInterval(loadCampaigns, 10000);
//     return () => clearInterval(interval);
//   }, [currentUser]);

//   const getStateLabel = (state) => {
//     if (state === 0) return { label: "Ongoing", color: "#1f6feb", bg: "#0a1929", border: "#1e3a5f" };
//     if (state === 1) return { label: "Successful", color: "#3fb950", bg: "#0a1a0d", border: "#1a3d22" };
//     return { label: "Failed", color: "#f85149", bg: "#1a0a0a", border: "#3d1a1a" };
//   };

//   const getProgress = (raised, goal) => {
//     const pct = (Number(raised) / Number(goal)) * 100;
//     return Math.min(pct, 100).toFixed(1);
//   };

//   return (
//     <div style={styles.page}>
//       <div style={styles.topBar}>
//         <button style={styles.backBtn} onClick={() => navigate("/")}>
//           ← Back
//         </button>
//         <h1 style={styles.heading}>Donate to Campaigns</h1>
//         <div style={styles.userBadge}>
//           <span style={styles.userDot} />
//           {currentUser.name}
//         </div>
//       </div>

//       {campaigns.length === 0 && (
//         <p style={styles.empty}>No campaigns yet. Be the first to create one!</p>
//       )}

//       <div style={styles.grid}>
//         {campaigns.map((c) => {
//           const stateInfo = getStateLabel(c.state);
//           const progress = getProgress(c.raised, c.goal);
//           const expired = Date.now() / 1000 > c.deadline;
//           const isCreator = c.creator?.toLowerCase() === currentUser?.address?.toLowerCase();
//           const canDonate = !expired && !c.finalized && c.state === 0 && !isCreator;

//           return (
//             <div key={c.id} style={styles.card}>
//               <div style={styles.cardHeader}>
//                 <div>
//                   <h3 style={styles.cardTitle}>{c.title}</h3>
//                   <p style={styles.cardDesc}>{c.description}</p>
//                 </div>
//                 <span style={{
//                   ...styles.statusBadge,
//                   color: stateInfo.color,
//                   background: stateInfo.bg,
//                   border: `1px solid ${stateInfo.border}`,
//                 }}>
//                   {stateInfo.label}
//                 </span>
//               </div>

//               <div style={styles.progressBar}>
//                 <div style={{ ...styles.progressFill, width: `${progress}%`, background: stateInfo.color }} />
//               </div>

//               <div style={styles.statsRow}>
//                 <div style={styles.stat}>
//                   <span style={styles.statLabel}>Raised</span>
//                   <span style={styles.statValue}>{Number(c.raised).toFixed(3)} ETH</span>
//                 </div>
//                 <div style={styles.stat}>
//                   <span style={styles.statLabel}>Goal</span>
//                   <span style={styles.statValue}>{Number(c.goal).toFixed(3)} ETH</span>
//                 </div>
//                 <div style={styles.stat}>
//                   <span style={styles.statLabel}>Progress</span>
//                   <span style={styles.statValue}>{progress}%</span>
//                 </div>
//               </div>

//               <div style={styles.metaRow}>
//                 <span style={styles.metaItem}>
//                   🕐 {new Date(c.deadline * 1000).toLocaleString()}
//                 </span>
//                 <span style={styles.metaItem} title={c.creator}>
//                   👤 {c.creator.slice(0, 6)}...{c.creator.slice(-4)}
//                 </span>
//               </div>

//               {canDonate && (
//                 <div style={styles.donateRow}>
//                   <input
//                     style={styles.input}
//                     placeholder="ETH amount (min 0.01)"
//                     value={amounts[c.id] || ""}
//                     onChange={(e) => setAmounts({ ...amounts, [c.id]: e.target.value })}
//                     type="number"
//                     step="0.01"
//                     min="0.01"
//                   />
//                   <button
//                     style={styles.donateBtn}
//                     disabled={loading}
//                     onClick={() => donate(c.id, c.title)}
//                   >
//                     {loading ? "..." : "Donate"}
//                   </button>
//                 </div>
//               )}

//               {isCreator && c.state === 0 && !expired && (
//                 <div style={styles.ownerNote}>
//                   You created this campaign — you cannot donate to your own campaign.
//                 </div>
//               )}

//               {!c.finalized && expired && (
//                 <button style={styles.finalizeBtn} onClick={() => finalize(c.id, c.title)} disabled={loading}>
//                   Finalize Campaign
//                 </button>
//               )}

//               {/* Only show Withdraw if: finalized, failed, AND current user actually donated */}
//               {c.finalized && c.state === 2 && c.userDonated && (
//                 <button style={styles.refundBtn} onClick={() => withdraw(c.id, c.title)} disabled={loading}>
//                   Withdraw Refund
//                 </button>
//               )}

//               {/* Show a note to non-donors on failed campaigns */}
//               {c.finalized && c.state === 2 && !c.userDonated && (
//                 <div style={styles.noDonationNote}>
//                   This campaign failed — you did not donate to this campaign.
//                 </div>
//               )}

//             </div>
//           );
//         })}
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
//     marginBottom: "28px",
//     maxWidth: "1100px",
//     margin: "0 auto 28px",
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
//   empty: {
//     textAlign: "center",
//     color: "#4a6080",
//     marginTop: "60px",
//     fontSize: "1rem",
//   },
//   grid: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "18px",
//     maxWidth: "1100px",
//     margin: "0 auto",
//   },
//   card: {
//     background: "#0d1526",
//     border: "1px solid #1e2d45",
//     borderRadius: "14px",
//     padding: "24px 28px",
//   },
//   cardHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     gap: "12px",
//     marginBottom: "16px",
//   },
//   cardTitle: {
//     margin: "0 0 6px",
//     fontSize: "1.15rem",
//     fontWeight: "600",
//     color: "#f0f6fc",
//   },
//   cardDesc: {
//     margin: 0,
//     fontSize: "0.92rem",
//     color: "#7d8fa8",
//     lineHeight: "1.6",
//   },
//   statusBadge: {
//     padding: "5px 12px",
//     borderRadius: "20px",
//     fontSize: "0.78rem",
//     fontWeight: "600",
//     whiteSpace: "nowrap",
//     flexShrink: 0,
//   },
//   progressBar: {
//     height: "5px",
//     background: "#1e2d45",
//     borderRadius: "4px",
//     overflow: "hidden",
//     marginBottom: "16px",
//   },
//   progressFill: {
//     height: "100%",
//     borderRadius: "4px",
//     transition: "width 0.3s ease",
//   },
//   statsRow: {
//     display: "flex",
//     gap: "32px",
//     marginBottom: "14px",
//   },
//   stat: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "3px",
//   },
//   statLabel: {
//     fontSize: "0.72rem",
//     color: "#4a6080",
//     textTransform: "uppercase",
//     letterSpacing: "0.5px",
//   },
//   statValue: {
//     fontSize: "0.95rem",
//     fontWeight: "600",
//     color: "#c9d1d9",
//   },
//   metaRow: {
//     display: "flex",
//     gap: "20px",
//     marginBottom: "14px",
//     flexWrap: "wrap",
//   },
//   metaItem: {
//     fontSize: "0.85rem",
//     color: "#4a6080",
//   },
//   donateRow: {
//     display: "flex",
//     gap: "10px",
//     marginTop: "8px",
//   },
//   input: {
//     flex: 1,
//     padding: "11px 14px",
//     background: "#0a1929",
//     border: "1px solid #1e3a5f",
//     borderRadius: "8px",
//     color: "#e8edf5",
//     fontSize: "0.95rem",
//     outline: "none",
//     fontFamily: "'Segoe UI', system-ui, sans-serif",
//   },
//   donateBtn: {
//     padding: "11px 24px",
//     background: "#1f6feb",
//     color: "#fff",
//     border: "none",
//     borderRadius: "8px",
//     fontSize: "0.95rem",
//     fontWeight: "600",
//     cursor: "pointer",
//     fontFamily: "'Segoe UI', system-ui, sans-serif",
//   },
//   ownerNote: {
//     marginTop: "12px",
//     padding: "12px 16px",
//     background: "#0a1929",
//     border: "1px solid #1e3a5f",
//     borderRadius: "8px",
//     fontSize: "0.85rem",
//     color: "#4a6080",
//     fontStyle: "italic",
//   },
//   noDonationNote: {
//     marginTop: "12px",
//     padding: "12px 16px",
//     background: "#1a0a0a",
//     border: "1px solid #3d1a1a",
//     borderRadius: "8px",
//     fontSize: "0.85rem",
//     color: "#6b2f2f",
//     fontStyle: "italic",
//   },
//   finalizeBtn: {
//     width: "100%",
//     padding: "12px",
//     background: "transparent",
//     border: "1px solid #2d4a6a",
//     color: "#4a90d9",
//     borderRadius: "8px",
//     fontSize: "0.95rem",
//     fontWeight: "600",
//     cursor: "pointer",
//     marginTop: "10px",
//     fontFamily: "'Segoe UI', system-ui, sans-serif",
//   },
//   refundBtn: {
//     width: "100%",
//     padding: "12px",
//     background: "transparent",
//     border: "1px solid #3d1a1a",
//     color: "#f85149",
//     borderRadius: "8px",
//     fontSize: "0.95rem",
//     fontWeight: "600",
//     cursor: "pointer",
//     marginTop: "10px",
//     fontFamily: "'Segoe UI', system-ui, sans-serif",
//   },
// };


import React, {
  useEffect,
  useState,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import {
  CONTRACT_ADDRESS,
  ABI,
} from "../utils/constants";
import { UserContext } from "../context/UserContext";

export default function Donate() {
  const { currentUser, addTx } =
    useContext(UserContext);

  const [campaigns, setCampaigns] =
    useState([]);

  const [amounts, setAmounts] =
    useState({});

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();

  if (!currentUser)
    return (
      <div style={styles.page}>
        Loading user...
      </div>
    );

  const provider =
    new ethers.JsonRpcProvider(
      "http://127.0.0.1:8545"
    );

  const wallet = new ethers.Wallet(
    currentUser.privateKey,
    provider
  );

  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    ABI,
    wallet
  );

  const loadCampaigns = async () => {
    try {
      const count = Number(
        await contract.campaignCount()
      );

      const list = [];

      for (
        let i = 1;
        i <= count;
        i++
      ) {
        const c =
          await contract.getCampaign(i);

        let finalized = Boolean(
          c.finalized || c[7]
        );

        let state = Number(
          c.state || c[6]
        );

        const deadlinePassed =
          Date.now() / 1000 >
          Number(c.deadline || c[4]);

        const raisedAmount = Number(
          ethers.formatEther(
            c.raised || c[5]
          )
        );

        const goalAmount = Number(
          ethers.formatEther(
            c.goal || c[3]
          )
        );

        if (
          !finalized &&
          deadlinePassed
        ) {
          state =
            raisedAmount >= goalAmount
              ? 1
              : 2;
        }

        // BLOCKCHAIN TRACKING
        const userContribution =
          await contract.getContribution(
            i,
            currentUser.address
          );

        const userDonated =
          userContribution > 0n;

        // if contribution is 0 but
        // refund event exists,
        // user already refunded
        const refundEvents =
          await contract.queryFilter(
            contract.filters.RefundWithdrawn(
              i,
              currentUser.address
            )
          );

        const alreadyRefunded =
          refundEvents.length > 0;

        // all refunded if failed
        // finalized campaign has
        // 0 raised amount
        const allRefunded =
          finalized &&
          state === 2 &&
          raisedAmount === 0;

        list.push({
          id: i,
          creator:
            c.creator || c[0],

          title:
            c.title || c[1],

          description:
            c.description || c[2],

          goal: ethers.formatEther(
            c.goal || c[3]
          ),

          deadline: Number(
            c.deadline || c[4]
          ),

          raised:
            ethers.formatEther(
              c.raised || c[5]
            ),

          state,
          finalized,
          userDonated,
          alreadyRefunded,
          allRefunded,
        });
      }

      setCampaigns(list.reverse());
    } catch (err) {
      console.error(
        "Load failed:",
        err
      );
    }
  };

  const donate = async (
    id,
    campaignTitle
  ) => {
    const value = amounts[id];

    if (
      !value ||
      Number(value) < 0.01
    ) {
      alert(
        "Minimum donation is 0.01 ETH"
      );

      return;
    }

    setLoading(true);

    try {
      console.log(
        "Donation from:",
        currentUser.name,
        wallet.address
      );

      const tx =
        await contract.donate(id, {
          value:
            ethers.parseEther(
              value
            ),
        });

      await tx.wait();

      addTx(
        "donated",
        currentUser.name,
        campaignTitle,
        value
      );

      console.log(
        `${currentUser.name} donated ${value} ETH`
      );

      setAmounts({
        ...amounts,
        [id]: "",
      });

      loadCampaigns();

      alert(
        "Donation successful!"
      );
    } catch (err) {
      console.error(err);

      alert("Donation failed!");
    }

    setLoading(false);
  };

  const finalize = async (
    id,
    campaignTitle
  ) => {
    setLoading(true);

    try {
      await (
        await contract.finalizeCampaign(
          id
        )
      ).wait();

      addTx(
        "finalized",
        currentUser.name,
        campaignTitle
      );

      loadCampaigns();

      alert(
        "Campaign finalized!"
      );
    } catch (err) {
      console.error(err);

      alert("Finalize failed!");
    }

    setLoading(false);
  };

  const withdraw = async (
    id,
    campaignTitle
  ) => {
    setLoading(true);

    try {
      console.log(
        "Refund withdrawn by:",
        currentUser.name,
        wallet.address
      );

      await (
        await contract.withdrawRefund(
          id
        )
      ).wait();

      addTx(
        "refunded",
        currentUser.name,
        campaignTitle
      );

      loadCampaigns();

      alert(
        "Refund withdrawn!"
      );

      console.log(
        `${currentUser.name} received refund for Campaign ID: ${id}`
      );
    } catch (err) {
      console.error(err);

      alert("Withdraw failed!");
    }

    setLoading(false);
  };

  useEffect(() => {
    loadCampaigns();

    const interval =
      setInterval(
        loadCampaigns,
        10000
      );

    return () =>
      clearInterval(interval);
  }, [currentUser]);

  const getStateLabel = (
    state
  ) => {
    if (state === 0)
      return {
        label: "Ongoing",
        color: "#1f6feb",
        bg: "#0a1929",
        border: "#1e3a5f",
      };

    if (state === 1)
      return {
        label: "Successful",
        color: "#3fb950",
        bg: "#0a1a0d",
        border: "#1a3d22",
      };

    return {
      label: "Failed",
      color: "#f85149",
      bg: "#1a0a0a",
      border: "#3d1a1a",
    };
  };

  const getProgress = (
    raised,
    goal
  ) => {
    const pct =
      (Number(raised) /
        Number(goal)) *
      100;

    return Math.min(
      pct,
      100
    ).toFixed(1);
  };

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <button
          style={styles.backBtn}
          onClick={() =>
            navigate("/")
          }
        >
          ← Back
        </button>

        <h1 style={styles.heading}>
          Donate to Campaigns
        </h1>

        <div style={styles.userBadge}>
          <span
            style={styles.userDot}
          />

          {currentUser.name}
        </div>
      </div>

      {campaigns.length === 0 && !loading && (
        <p style={styles.empty}>
          No campaigns yet. Be the
          first to create one!
          <div> 
            <button style={styles.createBtn} onClick={() => navigate("/create")}>
            Create one now →
          </button>
          </div>
          
        </p>

        

      )}

      <div style={styles.grid}>
        {campaigns.map((c) => {
          const stateInfo =
            getStateLabel(c.state);

          const progress =
            getProgress(
              c.raised,
              c.goal
            );

          const expired =
            Date.now() / 1000 >
            c.deadline;

          const isCreator =
            c.creator?.toLowerCase() ===
            currentUser?.address?.toLowerCase();

          const canDonate =
            !expired &&
            !c.finalized &&
            c.state === 0 &&
            !isCreator;

          return (
            <div
              key={c.id}
              style={styles.card}
            >
              <div
                style={
                  styles.cardHeader
                }
              >
                <div>
                  <h3
                    style={
                      styles.cardTitle
                    }
                  >
                    {c.title}
                  </h3>

                  <p
                    style={
                      styles.cardDesc
                    }
                  >
                    {
                      c.description
                    }
                  </p>
                </div>

                <span
                  style={{
                    ...styles.statusBadge,
                    color:
                      stateInfo.color,
                    background:
                      stateInfo.bg,
                    border: `1px solid ${stateInfo.border}`,
                  }}
                >
                  {
                    stateInfo.label
                  }
                </span>
              </div>

              <div
                style={
                  styles.progressBar
                }
              >
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${progress}%`,
                    background:
                      stateInfo.color,
                  }}
                />
              </div>

              <div
                style={
                  styles.statsRow
                }
              >
                <div
                  style={styles.stat}
                >
                  <span
                    style={
                      styles.statLabel
                    }
                  >
                    Raised
                  </span>

                  <span
                    style={
                      styles.statValue
                    }
                  >
                    {Number(
                      c.raised
                    ).toFixed(3)}{" "}
                    ETH
                  </span>
                </div>

                <div
                  style={styles.stat}
                >
                  <span
                    style={
                      styles.statLabel
                    }
                  >
                    Goal
                  </span>

                  <span
                    style={
                      styles.statValue
                    }
                  >
                    {Number(
                      c.goal
                    ).toFixed(3)}{" "}
                    ETH
                  </span>
                </div>

                <div
                  style={styles.stat}
                >
                  <span
                    style={
                      styles.statLabel
                    }
                  >
                    Progress
                  </span>

                  <span
                    style={
                      styles.statValue
                    }
                  >
                    {progress}%
                  </span>
                </div>
              </div>

              <div
                style={
                  styles.metaRow
                }
              >
                <span
                  style={
                    styles.metaItem
                  }
                >
                  🕐{" "}
                  {new Date(
                    c.deadline *
                      1000
                  ).toLocaleString()}
                </span>

                <span
                  style={
                    styles.metaItem
                  }
                  title={c.creator}
                >
                  👤{" "}
                  {c.creator.slice(
                    0,
                    6
                  )}
                  ...
                  {c.creator.slice(
                    -4
                  )}
                </span>
              </div>

              {canDonate && (
                <div
                  style={
                    styles.donateRow
                  }
                >
                  <input
                    style={
                      styles.input
                    }
                    placeholder="ETH amount"
                    value={
                      amounts[
                        c.id
                      ] || ""
                    }
                    onChange={(e) =>
                      setAmounts({
                        ...amounts,
                        [c.id]:
                          e.target
                            .value,
                      })
                    }
                    type="number"
                    step="0.01"
                    min="0.01"
                  />

                  <button
                    style={
                      styles.donateBtn
                    }
                    disabled={
                      loading
                    }
                    onClick={() =>
                      donate(
                        c.id,
                        c.title
                      )
                    }
                  >
                    {loading
                      ? "..."
                      : "Donate"}
                  </button>
                </div>
              )}

              {isCreator &&
                c.state === 0 &&
                !expired && (
                  <div
                    style={
                      styles.ownerNote
                    }
                  >
                    You created this
                    campaign — you
                    cannot donate to
                    your own
                    campaign.
                  </div>
                )}

              {!c.finalized &&
                expired && (
                  <button
                    style={
                      styles.finalizeBtn
                    }
                    onClick={() =>
                      finalize(
                        c.id,
                        c.title
                      )
                    }
                    disabled={
                      loading
                    }
                  >
                    Finalize Campaign
                  </button>
                )}

              {/* REFUND BUTTON */}
              {c.finalized &&
                c.state === 2 &&
                c.userDonated &&
                !c.alreadyRefunded && (
                  <button
                    style={
                      styles.refundBtn
                    }
                    onClick={() =>
                      withdraw(
                        c.id,
                        c.title
                      )
                    }
                    disabled={
                      loading
                    }
                  >
                    Withdraw Refund
                  </button>
                )}

              {/* ALREADY REFUNDED */}
              {c.finalized &&
                c.state === 2 &&
                c.alreadyRefunded && (
                  <div
                    style={
                      styles.ownerNote
                    }
                  >
                    You have already
                    withdrawn your
                    refund.
                  </div>
                )}

              {/* NON DONOR */}
              {c.finalized &&
                c.state === 2 &&
                !c.userDonated &&
                !c.alreadyRefunded &&
                !c.allRefunded && (
                  <div
                    style={
                      styles.noDonationNote
                    }
                  >
                    This campaign
                    failed — you did
                    not donate to this
                    campaign.
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
    fontFamily:
      "'Segoe UI', system-ui, sans-serif",
    padding: "32px 40px",
  },

  topBar: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "28px",
    maxWidth: "1100px",
    margin: "0 auto 28px",
  },

  backBtn: {
    background: "transparent",
    border: "1px solid #1e2d45",
    color: "#4a90d9",
    borderRadius: "8px",
    padding: "8px 16px",
    cursor: "pointer",
  },

  heading: {
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
  },

  userDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#3fb950",
  },

  empty: {
    textAlign: "center",
    marginTop: "60px",
  },

  grid: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    maxWidth: "1100px",
    margin: "0 auto",
  },

  card: {
    background: "#0d1526",
    border: "1px solid #1e2d45",
    borderRadius: "14px",
    padding: "24px 28px",
  },

  cardHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    gap: "12px",
    marginBottom: "16px",
  },

  cardTitle: {
    margin: "0 0 6px",
  },

  cardDesc: {
    color: "#7d8fa8",
  },

  statusBadge: {
    padding: "6px 14px",
    borderRadius: "999px",
    fontSize: "0.78rem",
    fontWeight: "600",
    whiteSpace: "nowrap",
    alignSelf: "flex-start",
    height: "fit-content",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
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
  },

  statsRow: {
    display: "flex",
    gap: "32px",
    marginBottom: "14px",
  },

  stat: {
    display: "flex",
    flexDirection: "column",
  },

  statLabel: {
    fontSize: "0.72rem",
    color: "#4a6080",
  },

  statValue: {
    fontWeight: "600",
  },

  metaRow: {
    display: "flex",
    gap: "20px",
    marginBottom: "14px",
  },

  metaItem: {
    fontSize: "0.85rem",
    color: "#4a6080",
  },

  donateRow: {
    display: "flex",
    gap: "10px",
    marginTop: "8px",
  },

  input: {
    flex: 1,
    padding: "11px 14px",
    background: "#0a1929",
    border: "1px solid #1e3a5f",
    borderRadius: "8px",
    color: "#fff",
  },

  donateBtn: {
    padding: "11px 24px",
    background: "#1f6feb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  ownerNote: {
    marginTop: "12px",
    padding: "12px 16px",
    background: "#0a1929",
    border: "1px solid #1e3a5f",
    borderRadius: "8px",
    fontSize: "0.85rem",
    color: "#4a6080",
  },

  noDonationNote: {
    marginTop: "12px",
    padding: "12px 16px",
    background: "#1a0a0a",
    border: "1px solid #3d1a1a",
    borderRadius: "8px",
    fontSize: "0.85rem",
    color: "#f85149",
  },

  finalizeBtn: {
    width: "100%",
    padding: "12px",
    background: "transparent",
    border: "1px solid #2d4a6a",
    color: "#4a90d9",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px",
  },

  refundBtn: {
    width: "100%",
    padding: "12px",
    background: "transparent",
    border: "1px solid #3d1a1a",
    color: "#f85149",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px",
  },
  createBtn: {
    padding: "12px",
    background: "transparent",
    border: "none",
    color: "#1f6feb",
    fontSize: "0.95rem",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
};