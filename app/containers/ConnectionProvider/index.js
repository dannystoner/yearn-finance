import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { useSelector, useDispatch } from 'react-redux';
import { makeSelectDarkMode } from 'containers/ThemeProvider/selectors';
import { useInjectReducer } from 'utils/injectReducer';
import { initOnboard, initNotify } from './services';
import { connectionConnected, addressUpdated } from './actions';
import ConnectionContext from './context';
import reducer from './reducer';

export default function ConnectionProvider(props) {
  useInjectReducer({ key: 'connection', reducer });
  const { children } = props;
  const darkMode = useSelector(makeSelectDarkMode());
  const dispatch = useDispatch();
  const [address, setAddress] = useState(null);
  const [wallet, setWallet] = useState({});
  const [onboard, setOnboard] = useState(null);
  const [notify, setNotify] = useState(null);
  const [web3, setWeb3] = useState(null);

  const dispatchConnectionConnected = () => {
    dispatch(connectionConnected(address));
  };

  const initializeWallet = () => {
    const selectWallet = newWallet => {
      if (newWallet.provider) {
        const newWeb3 = new Web3(newWallet.provider);
        newWeb3.eth.net.isListening().then(dispatchConnectionConnected);
        setWallet(newWallet);
        setWeb3(newWeb3);
        window.localStorage.setItem('selectedWallet', newWallet.name);
      } else {
        setWallet({});
      }
    };
    const onboardConfig = {
      address: setAddress,
      wallet: selectWallet,
    };
    const newOnboard = initOnboard(onboardConfig, darkMode);
    setNotify(initNotify(darkMode));
    setOnboard(newOnboard);
  };

  const addressChanged = () => {
    if (address) {
      dispatch(addressUpdated(address));
    }
  };

  const reconnectWallet = () => {
    const previouslySelectedWallet = window.localStorage.getItem(
      'selectedWallet',
    );
    if (previouslySelectedWallet && onboard) {
      onboard.walletSelect(previouslySelectedWallet);
    }
  };

  const changeDarkMode = () => {
    if (onboard) {
      onboard.config({ darkMode });
    }
  };

  useEffect(initializeWallet, []);
  useEffect(reconnectWallet, [onboard]);
  useEffect(addressChanged, [address]);
  useEffect(changeDarkMode, [darkMode]);

  const selectWallet = () => {
    onboard.walletSelect();
  };

  return (
    <ConnectionContext.Provider
      value={{ onboard, wallet, address, selectWallet, web3, notify }}
    >
      {children}
    </ConnectionContext.Provider>
  );
}
