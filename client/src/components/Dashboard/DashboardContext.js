import React, { createContext, useContext, useState } from 'react';

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
  const [item, setItem] = useState(null);
  const [data, setData] = useState(null);

  const showItem = (item, data = null) => {
    setItem(item);
    setData(data); // Set the additional data
  };

  return (
    <DashboardContext.Provider value={{ item, data, showItem }}>
      {children}
    </DashboardContext.Provider>
  );
};
