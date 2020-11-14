import React, { useState } from 'react';
import TransactionModal from 'components/TransactionModal';
import ModalContext from './context';

const modals = {
  transaction: TransactionModal,
};

const ModalProvider = props => {
  const makeInitialModalState = (acc, Modal, key) => {
    acc[key] = {
      show: false,
    };
    return acc;
  };
  const initialModalState = _.reduce(modals, makeInitialModalState, {});
  const [modalState, setModalState] = useState(initialModalState);

  const closeModal = key => {
    const currentState = _.clone(modalState);
    currentState[key].show = false;
    setModalState(currentState);
  };

  const openModal = (key, metadata) => {
    const currentState = _.clone(modalState);
    currentState[key].show = true;
    currentState[key].metadata = metadata;
    setModalState(currentState);
  };

  const renderModal = (Modal, key) => {
    const modalStateForKey = modalState[key];
    const { show, metadata } = modalStateForKey;
    return (
      <Modal
        key={key}
        show={show}
        metadata={metadata}
        onHide={() => closeModal(key)}
      />
    );
  };
  const modalEls = _.map(modals, renderModal);
  const { children } = props;

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modalEls}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
