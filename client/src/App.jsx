import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import Complaints from './pages/Complaints';
import Register from './pages/Register';
import ComplaintDetails from './pages/ComplaintDetails';
import Blockchain from './pages/Blockchain';
import NotFound from './pages/NotFound';
export default function App() { return <BrowserRouter><Routes><Route element={<AppLayout />}><Route path="/" element={<Dashboard />} /><Route path="/complaints" element={<Complaints />} /><Route path="/complaints/:id" element={<ComplaintDetails />} /><Route path="/register" element={<Register />} /><Route path="/admin" element={<Complaints admin />} /><Route path="/blockchain" element={<Blockchain />} /><Route path="/404" element={<NotFound />} /><Route path="*" element={<Navigate to="/404" replace />} /></Route></Routes></BrowserRouter>; }