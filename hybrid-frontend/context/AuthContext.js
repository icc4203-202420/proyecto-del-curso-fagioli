import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [uid, setUID] = useState(null);
  const [token, setToken] = useState('');

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, uid, setUID, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
