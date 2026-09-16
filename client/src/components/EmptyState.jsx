import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'No complaints found', message = 'New civic reports will appear here.' }) { return <div className="empty-state"><Inbox size={30} /><strong>{title}</strong><span>{message}</span></div>; }