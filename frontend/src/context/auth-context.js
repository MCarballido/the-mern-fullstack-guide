import { createContext } from "react";

export const AuthContext = createContext({
  // Context initial value
  isLoggedIn: false,
  userId: null,
  login: () => {},
  logout: () => {}
});
