import { createContext, useContext, useEffect, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [walletAddress, setWalletAddress] = useState('');
  const [toast, setToast] = useState(null);

  const notify = (message, type = 'success') => setToast({ message, type });
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 4200);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    if (!window.ethereum) return undefined;
    const update = (accounts) => setWalletAddress(accounts[0] || '');
    window.ethereum.request({ method: 'eth_accounts' }).then(update).catch(() => {});
    window.ethereum.on('accountsChanged', update);
    return () => window.ethereum.removeListener('accountsChanged', update);
  }, []);

  async function connectWallet() {
    if (!window.ethereum) { notify('MetaMask is not installed in this browser.', 'error'); return; }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0] || '');
      notify('Wallet connected.');
    } catch { notify('Your wallet connection was rejected.', 'error'); }
  }

  return <AppContext.Provider value={{ walletAddress, connectWallet, notify }}>{children}{toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);