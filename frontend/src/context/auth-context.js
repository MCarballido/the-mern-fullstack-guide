import { createContext } from "react";

export const AuthContext = createContext({
  // Context initial value
  isLoggedIn: false,
  login: () => {},
  logout: () => {}
});
