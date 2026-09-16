export const shortAddress = (value = '') => value ? `${value.slice(0, 6)}...${value.slice(-4)}` : 'Not connected';
export const formatDate = (value) => value ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value)) : 'Unknown';
export const statusClass = { Pending: 'status-pending', 'In Progress': 'status-progress', Resolved: 'status-resolved' };
export const transactionUrl = (hash) => hash ? `https://sepolia.etherscan.io/tx/${hash}` : '#';