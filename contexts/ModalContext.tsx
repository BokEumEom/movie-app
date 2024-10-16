// contexts/ModalContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ModalContextProps {
  showAddToListModal: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [showAddToListModal, setShowAddToListModal] = useState(false);

  const openModal = () => setShowAddToListModal(true);
  const closeModal = () => setShowAddToListModal(false);

  return (
    <ModalContext.Provider value={{ showAddToListModal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
