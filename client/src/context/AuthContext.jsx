import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

function persistUsers(users) {
  localStorage.setItem("luna_users", JSON.stringify(users));
}

function persistUser(user) {
  if (user) {
    localStorage.setItem("luna_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("luna_user");
  }
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("luna_users");
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("luna_user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    persistUsers(users);
  }, [users]);

  useEffect(() => {
    persistUser(user);
  }, [user]);

  const syncUser = (updated) => {
    setUser(updated);
    setUsers((prevUsers) =>
      prevUsers.map((entry) => (entry.id === updated.id ? updated : entry)),
    );
  };

  const login = ({ email, password }) => {
    const account = users.find(
      (entry) =>
        entry.email === email.toLowerCase() && entry.password === password,
    );

    if (!account) {
      throw new Error("Invalid email or password");
    }

    setUser(account);
  };

  const signup = ({ name, email, password }) => {
    const cleanedEmail = email.toLowerCase();
    if (users.some((entry) => entry.email === cleanedEmail)) {
      throw new Error("Email is already registered");
    }

    const newUser = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}`,
      name,
      email: cleanedEmail,
      password,
      createdAt: new Date().toISOString(),
      orders: [],
      paymentHistory: [],
      addresses: [],
    };

    setUsers((prevUsers) => [...prevUsers, newUser]);
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    syncUser(updated);
  };

  const addOrder = (order) => {
    if (!user) return;

    const paymentRecord = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}`,
      orderId: order._id,
      date: order.createdAt,
      amount: order.total,
      method: order.paymentMethod,
      status: "Paid",
    };

    const updated = {
      ...user,
      orders: [order, ...(user.orders || [])],
      paymentHistory: [paymentRecord, ...(user.paymentHistory || [])],
    };

    syncUser(updated);
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    login,
    signup,
    logout,
    updateProfile,
    addOrder,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
