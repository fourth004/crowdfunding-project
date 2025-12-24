import React from "react";

export default function AdminPanel() {
  return (
    <div style={styles.box}>
      <h2 style={styles.heading}>🛡️ Admin Control Panel</h2>
      <p style={styles.text}>
        The admin can approve or manage campaigns using on-chain permissions.
        This ensures only verified campaigns go live.
      </p>
    </div>
  );
}

const styles = {
  box: {
    background: "linear-gradient(135deg, #020617, #020617dd)",
    padding: "24px",
    borderRadius: "20px",
    marginBottom: "30px",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.7)",
  },
  heading: {
    color: "#93c5fd",
    marginBottom: "10px",
  },
  text: {
    color: "#cbd5f5",
    fontSize: "15px",
    lineHeight: "1.6",
  },
};
