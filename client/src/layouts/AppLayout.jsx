import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Activity, BarChart3, Blocks, FilePlus2, LayoutDashboard, Menu, ShieldCheck, X } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { shortAddress } from '../utils/format';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/complaints', label: 'Complaints', icon: BarChart3 },
  { to: '/register', label: 'Register complaint', icon: FilePlus2 },
  { to: '/admin', label: 'Admin control', icon: ShieldCheck },
  { to: '/blockchain', label: 'Blockchain', icon: Blocks }
];

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const { walletAddress, connectWallet } = useApp();
  const location = useLocation();
  const title = links.find((link) => link.to === location.pathname)?.label || 'Complaint details';
  return <div className="app-shell">
    <aside className={open ? 'sidebar sidebar-open' : 'sidebar'}>
      <div className="brand"><div className="brand-mark"><Activity size={19} /></div><span>Civic<span>Chain</span></span><button className="mobile-close" onClick={() => setOpen(false)} aria-label="Close navigation"><X size={18} /></button></div>
      <div className="workspace-label">CIVIC OPERATIONS</div>
      <nav>{links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><Icon size={18} /><span>{label}</span></NavLink>)}</nav>
      <div className="sidebar-footer"><div className="network-dot" /><div><small>LOCAL NETWORK</small><strong>Hardhat node</strong></div></div>
    </aside>
    <main className="main-area">
      <header className="topbar"><button className="mobile-menu" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu size={21} /></button><div><span className="breadcrumb">CIVICCHAIN /</span><h1>{title}</h1></div><div className="top-actions"><span className="connection-pill"><span /> {walletAddress ? shortAddress(walletAddress) : 'Wallet not connected'}</span><button className="connect-button" onClick={connectWallet}>{walletAddress ? 'Connected' : 'Connect wallet'}</button></div></header>
      <div className="page-content"><Outlet /></div>
    </main>
  </div>;
}