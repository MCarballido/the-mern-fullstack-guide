import { createContext } from "react";

export const AuthContext = createContext({
  // Context initial value
  isLoggedIn: false,
  userId: null,
  token: null,
  login: () => {},
  logout: () => {}
});
