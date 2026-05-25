import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Trash2, CheckCircle, Clock, XCircle, LogOut, Calendar, Phone, Mail, MessageSquare, Download, X, Eye, FileText, Award, User, EyeOff } from 'lucide-react';
import { Section, Button } from '../components/ui/Layout';
import { Reservation } from '../types';
import { supabase } from '../utils/supabase';

const AdminDashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [contacts, setContacts] = useState<any[]>([]);
    const [testResults, setTestResults] = useState<any[]>([]);
    
    const [activeTab, setActiveTab] = useState<'reservations' | 'contacts' | 'test_results'>('reservations');
    const [warningBanner, setWarningBanner] = useState('');

    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [modalType, setModalType] = useState<string>('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>('All');

    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [profileUpdateMsg, setProfileUpdateMsg] = useState('');
    const [profileUpdateError, setProfileUpdateError] = useState('');

    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showProfilePassword, setShowProfilePassword] = useState(false);

    useEffect(() => {
        // Check active session on mount
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setIsAuthenticated(true);
                loadData();
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuthenticated(!!session);
            if (session) loadData();
        });

        return () => subscription.unsubscribe();
    }, []);

    // Polling interval to auto-refresh data
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isAuthenticated) {
            interval = setInterval(() => {
                loadData();
            }, 5000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isAuthenticated]);

    useEffect(() => {
        checkOldData();
    }, [reservations, contacts, testResults]);

    const loadData = async () => {
        const { data: resData } = await supabase.from('reservations').select('*').order('created_at', { ascending: false });
        if (resData) setReservations(resData);
        
        const { data: contactData } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
        if (contactData) setContacts(contactData);

        const { data: testData } = await supabase.from('test_results').select('*').order('created_at', { ascending: false });
        if (testData) setTestResults(testData);

        // Auto-update the selectedUser if a modal is currently open
        setSelectedUser((prevUser: any) => {
            if (!prevUser) return prevUser;
            let freshUser = null;
            if (resData) freshUser = resData.find(r => r.id === prevUser.id);
            if (!freshUser && contactData) freshUser = contactData.find(c => c.id === prevUser.id);
            if (!freshUser && testData) freshUser = testData.find(t => t.id === prevUser.id);
            return freshUser || prevUser;
        });
    };

    const checkOldData = () => {
        if (reservations.length === 0 && contacts.length === 0 && testResults.length === 0) return;
        
        let oldestDate = new Date();
        const allData = [...reservations, ...contacts, ...testResults];
        
        allData.forEach(item => {
            const itemDate = new Date(item.created_at || item.date);
            if (itemDate < oldestDate) oldestDate = itemDate;
        });
        
        const daysOld = Math.floor((new Date().getTime() - oldestDate.getTime()) / (1000 * 3600 * 24));
        if (daysOld >= 25 && allData.length > 0) {
            setWarningBanner(`⚠️ CRITICAL WARNING: You have data that is ${daysOld} days old. It will be PERMANENTLY DELETED at 30 days! Please export your data now.`);
        } else {
            setWarningBanner('');
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                setLoginError(error.message || 'Invalid email or password');
            } else {
                setEmail('');
                setPassword('');
            }
        } catch (err) {
            setLoginError('An unexpected error occurred during login');
        }
    };

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
        } catch (e) {
            console.error(e);
        } finally {
            setIsAuthenticated(false);
            window.location.href = '/admin'; // Force hard reload to clear any cached states
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileUpdateMsg('');
        setProfileUpdateError('');

        if (!newEmail && !newPassword) {
            setProfileUpdateError('Please enter a new email or password to update.');
            return;
        }

        const updates: { email?: string, password?: string } = {};
        if (newEmail) updates.email = newEmail;
        if (newPassword) updates.password = newPassword;

        try {
            const { error } = await supabase.auth.updateUser(updates);
            if (error) {
                setProfileUpdateError(error.message);
            } else {
                setProfileUpdateMsg('Profile updated successfully!');
                setNewEmail('');
                setNewPassword('');
                setTimeout(() => {
                    setIsProfileModalOpen(false);
                    setProfileUpdateMsg('');
                }, 2000);
            }
        } catch (err) {
            setProfileUpdateError('An unexpected error occurred.');
        }
    };

    const formatExportData = (data: any[], tab: string) => {
        if (tab === 'reservations') {
            return data.map(r => ({
                "Date Submitted": new Date(r.created_at || r.date).toLocaleString(),
                "Name": r.name || '',
                "Email": r.email || '',
                "Phone": r.phone || '',
                "Course": r.course || '',
                "Level": r.level || '',
                "Preferred Time": r.time || '',
                "Status": r.status || '',
                "Message": r.message || ''
            }));
        }
        if (tab === 'contacts') {
            return data.map(c => ({
                "Date Submitted": new Date(c.created_at || c.date).toLocaleString(),
                "Name": c.name || '',
                "Email": c.email || '',
                "Subject": c.subject || '',
                "Status": c.status || '',
                "Message": c.message || ''
            }));
        }
        if (tab === 'test_results') {
            return data.map(t => ({
                "Date Submitted": new Date(t.created_at).toLocaleString(),
                "Name": t.name || '',
                "Email": t.email || '',
                "Phone": t.phone || '',
                "Test Status": t.status || '',
                "Overall Score": t.score !== null ? t.score : '',
                "CEFR Level": t.level || '',
                "Grammar": t.grammar_score !== null ? t.grammar_score : '',
                "Reading": t.reading_score !== null ? t.reading_score : '',
                "Listening": t.listening_score !== null ? t.listening_score : '',
                "Writing": t.writing_score !== null ? t.writing_score : '',
                "Reservation Course": t.reservation_course || '',
                "Reservation Level": t.reservation_level || '',
                "Reservation Time": t.reservation_time || '',
                "Reservation Status": t.reservation_status || '',
                "Reservation Message": t.reservation_message || '',
                "Certificate URL": t.certificate_url || ''
            }));
        }
        return data;
    };

    const exportToCSV = (data: any[], filename: string) => {
        if (!data || data.length === 0) {
            alert('No data to export!');
            return;
        }
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(obj => 
            Object.values(obj).map(val => 
                `"${String(val).replace(/"/g, '""')}"`
            ).join(',')
        );
        const csvContent = [headers, ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const updateResStatus = async (id: string, status: Reservation['status']) => {
        await supabase.from('reservations').update({ status }).eq('id', id);
        loadData();
        if (selectedUser?.id === id) setSelectedUser({...selectedUser, status});
    };

    const updateTestResStatus = async (id: string, status: string) => {
        await supabase.from('test_results').update({ reservation_status: status }).eq('id', id);
        loadData();
        if (selectedUser?.id === id) setSelectedUser({...selectedUser, reservation_status: status});
    };

    const deleteItem = async (table: string, id: string) => {
        if (window.confirm(`Are you sure you want to delete this record from ${table}?`)) {
            await supabase.from(table).delete().eq('id', id);
            loadData();
            if (selectedUser?.id === id) setSelectedUser(null);
        }
    };

    const filteredReservations = statusFilter === 'All' ? reservations : reservations.filter(r => r.status === statusFilter);
    const filteredContacts = statusFilter === 'All' ? contacts : contacts.filter(c => c.status === statusFilter);
    const filteredTestResults = statusFilter === 'All' ? testResults : testResults.filter(t => {
        if (statusFilter === 'Did Reservation') return !!t.reservation_course;
        if (statusFilter === 'Completed') return t.status === 'Completed' && !t.reservation_course;
        return t.status === statusFilter;
    });

    const getCurrentTabData = () => {
        if (activeTab === 'reservations') return filteredReservations;
        if (activeTab === 'contacts') return filteredContacts;
        if (activeTab === 'test_results') return filteredTestResults;
        return [];
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(getCurrentTabData().map((item: any) => item.id));
        } else {
            setSelectedIds([]);
        }
    };

    const toggleSelection = (id: string) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (window.confirm(`Are you sure you want to delete ${selectedIds.length} records?`)) {
            await supabase.from(activeTab).delete().in('id', selectedIds);
            loadData();
            setSelectedIds([]);
        }
    };

    const handleBulkStatusChange = async (newStatus: string) => {
        if (selectedIds.length === 0 || !newStatus) return;
        await supabase.from(activeTab).update({ status: newStatus }).in('id', selectedIds);
        loadData();
        setSelectedIds([]);
    };

    const getAvailableStatuses = () => {
        if (activeTab === 'reservations') return ['New', 'Contacted', 'Confirmed', 'Cancelled'];
        if (activeTab === 'contacts') return ['Unread', 'Read'];
        if (activeTab === 'test_results') return ['Started', 'Completed', 'Did Reservation'];
        return [];
    };

    const handleBulkExport = () => {
        if (selectedIds.length === 0) return;
        const dataToExport = getCurrentTabData().filter((item: any) => selectedIds.includes(item.id));
        exportToCSV(formatExportData(dataToExport, activeTab), `${activeTab}_selected`);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'New': 
            case 'Unread': 
            case 'Started': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'Contacted': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'Confirmed': 
            case 'Read': 
            case 'Completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'Cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const getSkillLevel = (scorePercent: number) => {
        if (scorePercent <= 20) return "A0";
        if (scorePercent <= 30) return "A1";
        if (scorePercent <= 50) return "A2";
        if (scorePercent <= 70) return "B1";
        if (scorePercent <= 85) return "B2";
        return "C1";
    };

    if (!isAuthenticated) {
        return (
            <div className="bg-dark-900 min-h-screen flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-dark-800 p-8 rounded-xl border border-gray-800 w-full max-w-md"
                >
                    <div className="flex justify-center mb-6">
                        <Shield className="w-12 h-12 text-orange-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-white text-center mb-6">Admin Login</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Email Address</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-dark-900 border border-gray-700 rounded p-2 text-white focus:border-orange-600 outline-none" required />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Password</label>
                            <div className="relative">
                                <input type={showLoginPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-dark-900 border border-gray-700 rounded p-2 pr-10 text-white focus:border-orange-600 outline-none" required />
                                <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                                    {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <Button type="submit" className="w-full">Login</Button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="bg-dark-900 min-h-screen pt-32 pb-12 px-4 relative">
            <div className="max-w-7xl mx-auto">
                {warningBanner && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-red-600/20 border border-red-500 text-red-200 p-4 rounded-lg mb-8 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <Trash2 className="text-red-400" />
                            <span className="font-bold">{warningBanner}</span>
                        </div>
                    </motion.div>
                )}

                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 relative z-40">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Dashboard</h1>
                    <div className="flex gap-4">
                        <button onClick={() => setIsProfileModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-md font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer relative z-50">
                            <User size={18} /> Profile
                        </button>
                        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-md font-medium text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors cursor-pointer relative z-50">
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 border-b border-gray-800 pb-2 gap-4">
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
                        <button onClick={() => { setActiveTab('reservations'); setSelectedIds([]); setStatusFilter('All'); }} className={`px-4 py-2 font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'reservations' ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-500/10' : 'text-gray-400 hover:text-gray-200'}`}>
                            Reservations ({reservations.length})
                        </button>
                        <button onClick={() => { setActiveTab('contacts'); setSelectedIds([]); setStatusFilter('All'); }} className={`px-4 py-2 font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'contacts' ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-500/10' : 'text-gray-400 hover:text-gray-200'}`}>
                            Messages ({contacts.length})
                        </button>
                        <button onClick={() => { setActiveTab('test_results'); setSelectedIds([]); setStatusFilter('All'); }} className={`px-4 py-2 font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'test_results' ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-500/10' : 'text-gray-400 hover:text-gray-200'}`}>
                            Test Results ({testResults.length})
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <select 
                            value={statusFilter} 
                            onChange={(e) => { setStatusFilter(e.target.value); setSelectedIds([]); }}
                            className="bg-dark-900 border border-gray-700 text-gray-300 rounded-md px-3 py-2 text-sm outline-none cursor-pointer"
                        >
                            <option value="All">All Statuses</option>
                            {getAvailableStatuses().map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>

                        <Button onClick={() => {
                            const dataToExport = getCurrentTabData();
                            exportToCSV(formatExportData(dataToExport, activeTab), `${activeTab}_${statusFilter.replace(/\s+/g, '_')}`);
                        }} className="flex items-center gap-2 whitespace-nowrap">
                            <Download size={18} /> Export All
                        </Button>
                    </div>
                </div>

                {selectedIds.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-orange-600/10 border border-orange-500/30 p-3 rounded-lg mb-6 flex items-center justify-between"
                    >
                        <span className="text-orange-400 font-medium ml-2">
                            {selectedIds.length} item(s) selected
                        </span>
                        <div className="flex gap-3 items-center flex-wrap">
                            <select 
                                onChange={(e) => handleBulkStatusChange(e.target.value)}
                                value=""
                                className="bg-dark-900 border border-orange-500/50 text-orange-400 rounded-md px-3 py-1.5 text-sm outline-none cursor-pointer hover:bg-orange-600/20"
                            >
                                <option value="" disabled>Change Status...</option>
                                {getAvailableStatuses().map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>

                            <Button variant="outline" size="sm" onClick={handleBulkExport} className="flex items-center gap-2 border-orange-500/50 text-orange-400 hover:bg-orange-600/20">
                                <Download size={16} /> Export Selected
                            </Button>
                            <Button size="sm" onClick={handleBulkDelete} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white shadow-none border-none">
                                <Trash2 size={16} /> Delete Selected
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* RESERVATIONS TAB */}
                {activeTab === 'reservations' && (
                    <div className="bg-dark-800 rounded-xl border border-gray-800 overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-dark-900/50 border-b border-gray-700 text-gray-400 text-sm uppercase tracking-wider">
                                        <th className="p-4 w-12">
                                            <input type="checkbox" onChange={(e) => handleSelectAll(e.target.checked)} checked={selectedIds.length > 0 && selectedIds.length === filteredReservations.length} className="w-4 h-4 rounded bg-dark-900 border-gray-700 text-orange-600 focus:ring-orange-600 focus:ring-offset-dark-800 cursor-pointer" />
                                        </th>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Course</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {filteredReservations.map((res) => (
                                        <tr key={res.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setSelectedUser(res)}>
                                            <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                                <input type="checkbox" checked={selectedIds.includes(res.id)} onChange={() => toggleSelection(res.id)} className="w-4 h-4 rounded bg-dark-900 border-gray-700 text-orange-600 focus:ring-orange-600 focus:ring-offset-dark-800 cursor-pointer" />
                                            </td>
                                            <td className="p-4 text-gray-400 text-sm whitespace-nowrap">{new Date(res.created_at || res.date).toLocaleDateString()}</td>
                                            <td className="p-4">
                                                <div className="text-white font-medium">{res.name}</div>
                                                <div className="text-gray-400 text-xs">{res.phone}</div>
                                            </td>
                                            <td className="p-4 text-gray-300 text-sm">{res.course}</td>
                                            <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(res.status)}`}>{res.status}</span></td>
                                            <td className="p-4 text-right">
                                                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedUser(res); setModalType('reservations'); }}>View</Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredReservations.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-500">No reservations found.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* CONTACTS TAB */}
                {activeTab === 'contacts' && (
                    <div className="bg-dark-800 rounded-xl border border-gray-800 overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-dark-900/50 border-b border-gray-700 text-gray-400 text-sm uppercase tracking-wider">
                                        <th className="p-4 w-12">
                                            <input type="checkbox" onChange={(e) => handleSelectAll(e.target.checked)} checked={selectedIds.length > 0 && selectedIds.length === filteredContacts.length} className="w-4 h-4 rounded bg-dark-900 border-gray-700 text-orange-600 focus:ring-orange-600 focus:ring-offset-dark-800 cursor-pointer" />
                                        </th>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Subject</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {filteredContacts.map((msg) => (
                                        <tr key={msg.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setSelectedUser(msg)}>
                                            <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                                <input type="checkbox" checked={selectedIds.includes(msg.id)} onChange={() => toggleSelection(msg.id)} className="w-4 h-4 rounded bg-dark-900 border-gray-700 text-orange-600 focus:ring-orange-600 focus:ring-offset-dark-800 cursor-pointer" />
                                            </td>
                                            <td className="p-4 text-gray-400 text-sm whitespace-nowrap">{new Date(msg.created_at).toLocaleDateString()}</td>
                                            <td className="p-4 text-white font-medium">{msg.name}</td>
                                            <td className="p-4 text-gray-300 text-sm">{msg.subject}</td>
                                            <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(msg.status)}`}>{msg.status}</span></td>
                                            <td className="p-4 text-right">
                                                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedUser(msg); setModalType('contacts'); }}>View</Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredContacts.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-500">No messages found.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TEST RESULTS TAB */}
                {activeTab === 'test_results' && (
                    <div className="bg-dark-800 rounded-xl border border-gray-800 overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-dark-900/50 border-b border-gray-700 text-gray-400 text-sm uppercase tracking-wider">
                                        <th className="p-4 w-12">
                                            <input type="checkbox" onChange={(e) => handleSelectAll(e.target.checked)} checked={selectedIds.length > 0 && selectedIds.length === filteredTestResults.length} className="w-4 h-4 rounded bg-dark-900 border-gray-700 text-orange-600 focus:ring-orange-600 focus:ring-offset-dark-800 cursor-pointer" />
                                        </th>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Name / Contact</th>
                                        <th className="p-4">Score</th>
                                        <th className="p-4">Level</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {filteredTestResults.map((test) => (
                                        <tr key={test.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => { setSelectedUser(test); setModalType('test_results'); }}>
                                            <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                                <input type="checkbox" checked={selectedIds.includes(test.id)} onChange={() => toggleSelection(test.id)} className="w-4 h-4 rounded bg-dark-900 border-gray-700 text-orange-600 focus:ring-orange-600 focus:ring-offset-dark-800 cursor-pointer" />
                                            </td>
                                            <td className="p-4 text-gray-400 text-sm whitespace-nowrap">{new Date(test.created_at).toLocaleDateString()}</td>
                                            <td className="p-4">
                                                <div className="text-white font-medium">{test.name}</div>
                                                <div className="text-gray-400 text-xs">{test.phone}</div>
                                            </td>
                                            <td className="p-4 text-orange-400 font-bold">{test.score ? `${test.score}/100` : '-'}</td>
                                            <td className="p-4 text-gray-300 font-medium">{test.level || <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(test.status)}`}>{test.status}</span>}</td>
                                            <td className="p-4 text-right">
                                                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedUser(test); setModalType('test_results'); }}>View details</Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredTestResults.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-500">No test results found.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* PROFILE MODAL */}
            <AnimatePresence>
                {isProfileModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setIsProfileModalOpen(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-dark-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-dark-800 z-10">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <User className="text-orange-500" size={24} /> Update Credentials
                                </h2>
                                <button onClick={() => setIsProfileModalOpen(false)} className="text-gray-400 hover:text-white bg-dark-900 p-2 rounded-full"><X size={20}/></button>
                            </div>
                            
                            <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
                                {profileUpdateMsg && <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-3 rounded text-sm text-center">{profileUpdateMsg}</div>}
                                {profileUpdateError && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded text-sm text-center">{profileUpdateError}</div>}
                                
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">New Email</label>
                                    <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Leave blank to keep current" className="w-full bg-dark-900 border border-gray-700 rounded p-2 text-white focus:border-orange-600 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">New Password</label>
                                    <div className="relative">
                                        <input type={showProfilePassword ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Leave blank to keep current" className="w-full bg-dark-900 border border-gray-700 rounded p-2 pr-10 text-white focus:border-orange-600 outline-none" />
                                        <button type="button" onClick={() => setShowProfilePassword(!showProfilePassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                                            {showProfilePassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-end gap-3">
                                    <Button variant="ghost" type="button" onClick={() => setIsProfileModalOpen(false)}>Cancel</Button>
                                    <Button type="submit">Save Changes</Button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MODAL POPUP */}
            <AnimatePresence>
                {selectedUser && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedUser(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-dark-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-dark-800/90 backdrop-blur z-10">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    {activeTab === 'reservations' && <Calendar className="text-orange-500"/>}
                                    {activeTab === 'contacts' && <MessageSquare className="text-orange-500"/>}
                                    {activeTab === 'test_results' && <Award className="text-orange-500"/>}
                                    {selectedUser.name}'s Info
                                </h2>
                                <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-white bg-dark-900 p-2 rounded-full"><X size={20}/></button>
                            </div>
                            
                            <div className="p-6 space-y-8">
                                {/* Basic Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-dark-900 p-4 rounded-lg border border-gray-800">
                                        <p className="text-gray-500 text-sm mb-1">Full Name</p>
                                        <p className="text-white font-medium flex items-center gap-2"><User size={14} className="text-gray-400"/> {selectedUser.name}</p>
                                    </div>
                                    <div className="bg-dark-900 p-4 rounded-lg border border-gray-800">
                                        <p className="text-gray-500 text-sm mb-1">Email Address</p>
                                        <p className="text-white font-medium flex items-center gap-2"><Mail size={14} className="text-gray-400"/> {selectedUser.email}</p>
                                    </div>
                                    <div className="bg-dark-900 p-4 rounded-lg border border-gray-800">
                                        <p className="text-gray-500 text-sm mb-1">Phone Number</p>
                                        <p className="text-white font-medium flex items-center gap-2"><Phone size={14} className="text-gray-400"/> {selectedUser.phone || 'N/A'}</p>
                                    </div>
                                    <div className="bg-dark-900 p-4 rounded-lg border border-gray-800">
                                        <p className="text-gray-500 text-sm mb-1">Submission Date</p>
                                        <p className="text-white font-medium flex items-center gap-2"><Calendar size={14} className="text-gray-400"/> {new Date(selectedUser.created_at || selectedUser.date).toLocaleString()}</p>
                                    </div>
                                    <div className="bg-dark-900 p-4 rounded-lg border border-gray-800">
                                        <p className="text-gray-500 text-sm mb-1">Status</p>
                                        <span className={`px-2 py-1 rounded-full text-xs border font-medium ${getStatusColor(selectedUser.status)}`}>{selectedUser.status}</span>
                                    </div>
                                </div>

                                {/* Dynamic Details based on type */}
                                {activeTab === 'reservations' && (
                                    <div className="bg-dark-900 p-6 rounded-lg border border-gray-800 space-y-4">
                                        <h3 className="text-lg font-bold text-orange-400 border-b border-gray-800 pb-2">Reservation Details</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><span className="text-gray-500 text-sm block">Course</span><span className="text-white font-medium">{selectedUser.course}</span></div>
                                            <div><span className="text-gray-500 text-sm block">Level</span><span className="text-white font-medium">{selectedUser.level}</span></div>
                                            <div><span className="text-gray-500 text-sm block">Preferred Time</span><span className="text-white font-medium">{selectedUser.time}</span></div>
                                        </div>
                                        {selectedUser.message && (
                                            <div className="pt-4 border-t border-gray-800">
                                                <span className="text-gray-500 text-sm block mb-1">Message</span>
                                                <p className="text-gray-300 italic">"{selectedUser.message}"</p>
                                            </div>
                                        )}
                                        
                                        <div className="flex gap-2 pt-4">
                                            {selectedUser.status !== 'Confirmed' && <Button size="sm" onClick={() => updateResStatus(selectedUser.id, 'Confirmed')} className="bg-green-600 hover:bg-green-700 text-white">Mark Confirmed</Button>}
                                            {selectedUser.status !== 'Contacted' && <Button size="sm" onClick={() => updateResStatus(selectedUser.id, 'Contacted')} className="bg-yellow-600 hover:bg-yellow-700 text-white">Mark Contacted</Button>}
                                            {selectedUser.status !== 'Cancelled' && <Button size="sm" onClick={() => updateResStatus(selectedUser.id, 'Cancelled')} className="bg-red-600 hover:bg-red-700 text-white border-none shadow-none">Mark Cancelled</Button>}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'contacts' && (
                                    <div className="bg-dark-900 p-6 rounded-lg border border-gray-800 space-y-4">
                                        <h3 className="text-lg font-bold text-orange-400 border-b border-gray-800 pb-2">Message Content</h3>
                                        <div>
                                            <span className="text-gray-500 text-sm block mb-1">Subject</span>
                                            <span className="text-white font-medium text-lg">{selectedUser.subject}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 text-sm block mb-1">Message</span>
                                            <p className="text-gray-300 bg-dark-800 p-4 rounded border border-gray-700 whitespace-pre-wrap">{selectedUser.message}</p>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'test_results' && (
                                    <div className="space-y-6">
                                        {selectedUser.reservation_course && (
                                            <div className="bg-dark-900 p-6 rounded-lg border border-orange-500/50">
                                                <h3 className="text-lg font-bold text-orange-400 border-b border-gray-800 pb-2 mb-4 flex items-center gap-2">
                                                    <Calendar size={18} /> Linked Course Reservation
                                                </h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div><span className="text-gray-500 text-sm block">Course</span><span className="text-white font-medium">{selectedUser.reservation_course}</span></div>
                                                    <div><span className="text-gray-500 text-sm block">Level</span><span className="text-white font-medium">{selectedUser.reservation_level}</span></div>
                                                    <div><span className="text-gray-500 text-sm block">Preferred Time</span><span className="text-white font-medium">{selectedUser.reservation_time}</span></div>
                                                    <div><span className="text-gray-500 text-sm block">Status</span><span className={`px-2 py-0.5 rounded-full text-[10px] border font-medium ${getStatusColor(selectedUser.reservation_status || 'New')}`}>{selectedUser.reservation_status || 'New'}</span></div>
                                                </div>
                                                {selectedUser.reservation_message && (
                                                    <div className="pt-4 border-t border-gray-800 mt-4">
                                                        <span className="text-gray-500 text-sm block mb-1">Message</span>
                                                        <p className="text-gray-300 italic">"{selectedUser.reservation_message}"</p>
                                                    </div>
                                                )}
                                                <div className="flex gap-2 pt-4 border-t border-gray-800 mt-4">
                                                    {selectedUser.reservation_status !== 'Confirmed' && <Button size="sm" onClick={() => updateTestResStatus(selectedUser.id, 'Confirmed')} className="bg-green-600 hover:bg-green-700 text-white">Mark Confirmed</Button>}
                                                    {selectedUser.reservation_status !== 'Contacted' && <Button size="sm" onClick={() => updateTestResStatus(selectedUser.id, 'Contacted')} className="bg-yellow-600 hover:bg-yellow-700 text-white">Mark Contacted</Button>}
                                                    {selectedUser.reservation_status !== 'Cancelled' && <Button size="sm" onClick={() => updateTestResStatus(selectedUser.id, 'Cancelled')} className="bg-red-600 hover:bg-red-700 text-white border-none shadow-none">Mark Cancelled</Button>}
                                                </div>
                                            </div>
                                        )}
                                        <div className="bg-dark-900 p-6 rounded-lg border border-gray-800">
                                            <h3 className="text-lg font-bold text-orange-400 border-b border-gray-800 pb-2 mb-4">Test Scores</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                                                <div className="text-center p-3 bg-dark-800 rounded border border-gray-700">
                                                    <div className="text-gray-400 text-xs uppercase mb-1">Overall</div>
                                                    <div className="text-xl font-bold text-white mb-1">{selectedUser.score || 0}/100</div>
                                                    <div className="text-xs font-bold text-orange-500">{selectedUser.status === 'Started' ? 'Pending' : getSkillLevel(selectedUser.score || 0)}</div>
                                                </div>
                                                <div className="text-center p-3 bg-dark-800 rounded border border-gray-700">
                                                    <div className="text-gray-400 text-xs uppercase mb-1">Grammar</div>
                                                    <div className="text-lg font-bold text-gray-300 mb-1">{selectedUser.grammar_score || 0}/100</div>
                                                    <div className="text-xs font-bold text-orange-500">{selectedUser.status === 'Started' ? 'Pending' : getSkillLevel(selectedUser.grammar_score || 0)}</div>
                                                </div>
                                                <div className="text-center p-3 bg-dark-800 rounded border border-gray-700">
                                                    <div className="text-gray-400 text-xs uppercase mb-1">Reading</div>
                                                    <div className="text-lg font-bold text-gray-300 mb-1">{selectedUser.reading_score || 0}/100</div>
                                                    <div className="text-xs font-bold text-orange-500">{selectedUser.status === 'Started' ? 'Pending' : getSkillLevel(selectedUser.reading_score || 0)}</div>
                                                </div>
                                                <div className="text-center p-3 bg-dark-800 rounded border border-gray-700">
                                                    <div className="text-gray-400 text-xs uppercase mb-1">Listening</div>
                                                    <div className="text-lg font-bold text-gray-300 mb-1">{selectedUser.listening_score || 0}/100</div>
                                                    <div className="text-xs font-bold text-orange-500">{selectedUser.status === 'Started' ? 'Pending' : getSkillLevel(selectedUser.listening_score || 0)}</div>
                                                </div>
                                                <div className="text-center p-3 bg-dark-800 rounded border border-gray-700">
                                                    <div className="text-gray-400 text-xs uppercase mb-1">Writing</div>
                                                    <div className="text-lg font-bold text-gray-300 mb-1">{selectedUser.writing_score || 0}/100</div>
                                                    <div className="text-xs font-bold text-orange-500">{selectedUser.status === 'Started' ? 'Pending' : getSkillLevel(selectedUser.writing_score || 0)}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between bg-orange-900/20 p-4 rounded-lg border border-orange-500/30">
                                                <span className="text-orange-200">CEFR Level Achieved:</span>
                                                <span className="text-2xl font-black text-orange-500">{selectedUser.level || 'Pending'}</span>
                                            </div>
                                        </div>

                                        {selectedUser.certificate_url && (
                                            <div className="bg-dark-900 p-6 rounded-lg border border-gray-800">
                                                <h3 className="text-lg font-bold text-orange-400 border-b border-gray-800 pb-2 mb-4 flex justify-between items-center">
                                                    Certificate
                                                    <a href={selectedUser.certificate_url} target="_blank" rel="noopener noreferrer" className="text-sm font-normal flex items-center gap-1 text-blue-400 hover:text-blue-300">
                                                        <FileText size={14} /> Open full PDF
                                                    </a>
                                                </h3>
                                                <div className="aspect-[1.414] w-full max-w-lg mx-auto bg-gray-800 rounded overflow-hidden">
                                                    <iframe src={`${selectedUser.certificate_url}#toolbar=0`} className="w-full h-full" title="Certificate PDF"></iframe>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                            </div>

                            <div className="p-4 border-t border-gray-800 flex justify-end gap-3 bg-dark-900 rounded-b-xl">
                                <Button variant="ghost" onClick={() => deleteItem(
                                    activeTab === 'reservations' ? 'reservations' : activeTab === 'contacts' ? 'contacts' : 'test_results',
                                    selectedUser.id
                                )} className="text-red-400 hover:text-red-300 hover:bg-red-900/20 flex items-center gap-2">
                                    <Trash2 size={16} /> Delete Record
                                </Button>
                                <Button onClick={() => setSelectedUser(null)}>Close</Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default AdminDashboard;