import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', timeout: 15000 });
const unwrap = (request) => request.then(({ data }) => data);

export const getStats = () => unwrap(api.get('/complaints/stats'));
export const getComplaints = (params) => unwrap(api.get('/complaints', { params }));
export const getComplaint = (id) => unwrap(api.get(`/complaints/${id}`));
export const registerComplaint = (payload) => unwrap(api.post('/complaints', payload));
export const updateComplaintStatus = (id, status) => unwrap(api.put(`/complaints/${id}/status`, { status }));
export const getBlockchainInfo = () => unwrap(api.get('/complaints/blockchain'));
export const getHealth = () => unwrap(api.get('/health'));
export function messageFromError(error) { return error.response?.data?.message || error.message || 'Something went wrong.'; }