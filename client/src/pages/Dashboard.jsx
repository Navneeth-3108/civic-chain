import { ArrowUpRight, CheckCircle2, Clock3, FileText, RefreshCw, Timer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getComplaints, getStats, messageFromError } from '../services/api';
import { formatDate } from '../utils/format';
import StatusBadge from '../components/StatusBadge';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { useApp } from '../context/AppContext';

export default function Dashboard() {
  const [stats, setStats] = useState(null); const [recent, setRecent] = useState([]); const [loading, setLoading] = useState(true); const { notify } = useApp();
  async function load() { try { const [statData, complaintData] = await Promise.all([getStats(), getComplaints({ limit: 5 })]); setStats(statData.stats); setRecent(complaintData.complaints); } catch (error) { notify(messageFromError(error), 'error'); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);
  if (loading) return <Loading label="Loading dashboard" />;
  const cards = [{ label: 'Total complaints', value: stats?.total || 0, icon: FileText, tone: 'blue' }, { label: 'Pending review', value: stats?.pending || 0, icon: Clock3, tone: 'amber' }, { label: 'In progress', value: stats?.inProgress || 0, icon: Timer, tone: 'violet' }, { label: 'Resolved', value: stats?.resolved || 0, icon: CheckCircle2, tone: 'green' }];
  return <div className="stack"><section className="welcome-row"><div><p className="eyebrow">OVERVIEW</p><h2>Good day, coordinator.</h2><p className="muted">A clear view of the issues your community has raised.</p></div><button className="icon-button" onClick={load} title="Refresh dashboard"><RefreshCw size={17} /></button></section>
    <section className="stat-grid">{cards.map(({ label, value, icon: Icon, tone }) => <div className="stat-card" key={label}><div className={`stat-icon ${tone}`}><Icon size={19} /></div><div><span>{label}</span><strong>{value}</strong></div><ArrowUpRight size={16} className="stat-arrow" /></div>)}</section>
    <section className="content-grid"><div className="panel recent-panel"><div className="panel-heading"><div><p className="eyebrow">LATEST ACTIVITY</p><h3>Recent complaints</h3></div><Link to="/complaints" className="text-link">View all <ArrowUpRight size={15} /></Link></div>{recent.length ? <div className="activity-list">{recent.map((item) => <Link className="activity-item" to={`/complaints/${item.complaintId}`} key={item.complaintId}><div className="activity-number">#{String(item.complaintId).padStart(3, '0')}</div><div className="activity-copy"><strong>{item.title}</strong><span>{formatDate(item.timestamp)}</span></div><StatusBadge status={item.status} /></Link>)}</div> : <EmptyState />}</div><div className="panel distribution"><p className="eyebrow">STATUS DISTRIBUTION</p><h3>Resolution pulse</h3><div className="donut-wrap"><div className="donut"><strong>{stats?.total || 0}</strong><span>total</span></div><div className="legend"><div><i className="legend-dot pending" />Pending <b>{stats?.pending || 0}</b></div><div><i className="legend-dot progress" />In progress <b>{stats?.inProgress || 0}</b></div><div><i className="legend-dot resolved" />Resolved <b>{stats?.resolved || 0}</b></div></div></div></div></section>
  </div>;
}