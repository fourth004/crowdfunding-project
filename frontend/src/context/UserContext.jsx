// import { createContext, useState } from "react";
// import { users } from "../utils/users";

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] =
//     useState(users[0]);

//   return (
//     <UserContext.Provider
//       value={{
//         currentUser,
//         setCurrentUser,
//         users,
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };


import { createContext, useState } from "react";
import { users } from "../utils/users";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(users[0]);
  const [txHistory, setTxHistory] = useState([]);

  const addTx = (type, userName, campaignTitle, amount = null) => {
    const entry = {
      id: Date.now(),
      type,
      userName,
      campaignTitle,
      amount,
      timestamp: new Date(),
    };
    setTxHistory((prev) => [entry, ...prev]);
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        txHistory,
        addTx,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};