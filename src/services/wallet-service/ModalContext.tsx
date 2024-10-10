/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable no-unused-vars */
import React, { useState, useCallback, useEffect } from 'react';

export type ModalContentType = any;

type ModalContextProps = {
  closeModal: () => void;
  showModal: () => void;
  isModalShowed: boolean;
  modalContent: ModalContentType;
  setModalContent: (el: ModalContentType) => void;
};

export const ModalContext = React.createContext<ModalContextProps>({
  closeModal: () => undefined,
  showModal: () => undefined,
  isModalShowed: false,
  modalContent: '',
  setModalContent: () => undefined,
});

const ModalProvider = ({ children }: { children: React.ReactElement }) => {
  const [isModalShowed, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContentType>(<p>Modal is empty!</p>);
  useEffect(() => {
    console.log(modalContent);
  }, [modalContent]);
  const showModal = useCallback(() => {
    setShowModal(true);
  }, [setShowModal]);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, [setShowModal]);

  return (
    <ModalContext.Provider
      value={{
        closeModal,
        showModal,
        isModalShowed,
        modalContent,
        setModalContent,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
