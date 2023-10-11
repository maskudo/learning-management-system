import { createContext, useContext, useState } from 'react';

type IUserContext = {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
};
export const UserContext = createContext<IUserContext | null>(null);
export default function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('Context cannot be used outside the provider.');
  }
  return context;
}
