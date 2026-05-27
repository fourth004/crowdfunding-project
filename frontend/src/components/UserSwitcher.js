// import React, { useContext } from "react";
// import { UserContext } from "../context/UserContext";

// export default function UserSwitcher() {
//   const {
//     users,
//     currentUser,
//     setCurrentUser,
//   } = useContext(UserContext);

//   return (
//     <div style={{ marginBottom: 20 }}>
//       <select
//         value={currentUser.name}
//         onChange={(e) => {
//           const selectedUser =
//             users.find(
//               (u) =>
//                 u.name === e.target.value
//             );

//           setCurrentUser(selectedUser);
//         }}
//         style={{
//           padding: 10,
//           borderRadius: 8,
//         }}
//       >
//         {users.map((user) => (
//           <option
//             key={user.name}
//             value={user.name}
//           >
//             {user.name}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }

import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function UserSwitcher() {
  const { users, currentUser, setCurrentUser } = useContext(UserContext);

  return (
    <select
      value={currentUser.name}
      onChange={(e) => {
        const selectedUser = users.find((u) => u.name === e.target.value);
        setCurrentUser(selectedUser);
      }}
      style={styles.select}
    >
      {users.map((user) => (
        <option key={user.name} value={user.name}>
          {user.name}
        </option>
      ))}
    </select>
  );
}

const styles = {
  select: {
    padding: "6px 12px",
    borderRadius: "8px",
    border: "1px solid #1e3a5f",
    background: "#0a1929",
    color: "#4a90d9",
    fontSize: "0.85rem",
    fontWeight: "600",
    cursor: "pointer",
    outline: "none",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
};