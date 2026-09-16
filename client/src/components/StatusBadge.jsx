import { statusClass } from '../utils/format';

export default function StatusBadge({ status }) { return <span className={`status-badge ${statusClass[status] || 'status-pending'}`}><span />{status}</span>; }