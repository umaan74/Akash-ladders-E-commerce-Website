import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

export const useCompare = () => useContext(CompareContext);

export const CompareProvider = ({ children }) => {
  const [compareItems, setCompareItems] = useState(() => {
    try {
      const localData = localStorage.getItem('akash_compare');
      return localData ? JSON.parse(localData) : [];
    } catch (e) {
      console.error("Error reading compare items from localStorage", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('akash_compare', JSON.stringify(compareItems));
    } catch (e) {
      console.error("Error saving compare items to localStorage", e);
    }
  }, [compareItems]);

  const isInCompare = (productId) => {
    return compareItems.some(item => item.id === productId);
  };

  const addToCompare = (product) => {
    if (compareItems.length >= 4) {
      alert("You can compare a maximum of 4 ladders at a time.");
      return false;
    }
    if (!isInCompare(product.id)) {
      setCompareItems(prev => [...prev, product]);
      return true;
    }
    return false;
  };

  const removeFromCompare = (productId) => {
    setCompareItems(prev => prev.filter(item => item.id !== productId));
  };

  const toggleCompare = (product) => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  return (
    <CompareContext.Provider value={{
      compareItems,
      addToCompare,
      removeFromCompare,
      isInCompare,
      toggleCompare,
      clearCompare,
      getCompareCount: () => compareItems.length
    }}>
      {children}
    </CompareContext.Provider>
  );
};
