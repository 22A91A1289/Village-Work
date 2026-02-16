import React, { createContext, useState, useContext, useCallback, useRef } from 'react';
import ConfirmModal from '../components/ConfirmModal';

const ConfirmModalContext = createContext(null);

export const ConfirmModalProvider = ({ children }) => {
  const onConfirmRef = useRef(null);
  const onCancelRef = useRef(null);

  const [modalState, setModalState] = useState({
    visible: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    destructive: false,
  });

  const showConfirm = useCallback((options) => {
    const {
      title,
      message,
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      onConfirm,
      onCancel,
      destructive = false,
    } = options;

    onConfirmRef.current = onConfirm;
    onCancelRef.current = onCancel;

    setModalState({
      visible: true,
      title,
      message,
      confirmText,
      cancelText,
      destructive,
    });
  }, []);

  const hideModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, visible: false }));
  }, []);

  const handleConfirm = useCallback(() => {
    hideModal();
    onConfirmRef.current?.();
    onConfirmRef.current = null;
    onCancelRef.current = null;
  }, [hideModal]);

  const handleCancel = useCallback(() => {
    hideModal();
    onCancelRef.current?.();
    onConfirmRef.current = null;
    onCancelRef.current = null;
  }, [hideModal]);

  return (
    <ConfirmModalContext.Provider value={{ showConfirm }}>
      {children}
      <ConfirmModal
        visible={modalState.visible}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        destructive={modalState.destructive}
      />
    </ConfirmModalContext.Provider>
  );
};

export const useConfirmModal = () => {
  const context = useContext(ConfirmModalContext);
  if (!context) {
    throw new Error('useConfirmModal must be used within ConfirmModalProvider');
  }
  return context;
};
