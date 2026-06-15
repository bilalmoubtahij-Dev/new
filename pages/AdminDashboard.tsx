import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Trash2, CheckCircle, Clock, XCircle, LogOut, Calendar, Phone, Mail, MessageSquare, Download, X, Eye, FileText, Award, User, EyeOff, RefreshCcw, ChevronRight, ChevronLeft } from 'lucide-react';
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
    const [dealStatusFilter, setDealStatusFilter] = useState<string>('All');
    const [userCategoryFilter, setUserCategoryFilter] = useState<string>('External Users');
    const [showUserHistory, setShowUserHistory] = useState(false);

    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [profileUpdateMsg, setProfileUpdateMsg] = useState('');
    const [profileUpdateError, setProfileUpdateError] = useState('');

    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showProfilePassword, setShowProfilePassword] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

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
        setIsLoggingIn(true);
        
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
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
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
        const { error } = await supabase.from('reservations').update({ status }).eq('id', id);
        if (error) { alert("Error updating status: " + error.message); console.error(error); return; }
        loadData();
        if (selectedUser?.id === id) setSelectedUser({...selectedUser, status});
    };

    const updateTestResStatus = async (id: string, status: string) => {
        const { error } = await supabase.from('test_results').update({ reservation_status: status }).eq('id', id);
        if (error) { alert("Error updating reservation status: " + error.message); console.error(error); return; }
        loadData();
        if (selectedUser?.id === id) setSelectedUser({...selectedUser, reservation_status: status});
    };

    const updateTestDealStatus = async (id: string, deal_status: string) => {
        const { error } = await supabase.from('test_results').update({ deal_status }).eq('id', id);
        if (error) { alert("Error updating deal status: " + error.message); console.error(error); return; }
        loadData();
        if (selectedUser?.id === id) setSelectedUser({...selectedUser, deal_status});
    };

    const deleteItem = async (table: string, id: string) => {
        if (window.confirm(`Are you sure you want to delete this record from ${table}?`)) {
            await supabase.from(table).delete().eq('id', id);
            loadData();
            if (selectedUser?.id === id) setSelectedUser(null);
        }
    };

    const handleViewContact = async (msg: any) => {
        setSelectedUser(msg);
        setModalType('contacts');
        
        if (msg.status === 'Unread' || !msg.status) {
            const { error } = await supabase.from('contacts').update({ status: 'Read' }).eq('id', msg.id);
            if (!error) {
                loadData();
                setSelectedUser({ ...msg, status: 'Read' });
            }
        }
    };

    const filteredReservations = statusFilter === 'All' ? reservations : reservations.filter(r => r.status === statusFilter);
    const filteredContacts = statusFilter === 'All' ? contacts : contacts.filter(c => c.status === statusFilter);
    
    // Deduplicate testResults to get uniqueTestResults (most recent per email+phone)
    const uniqueTestResults = Object.values(testResults.reduce((acc, t) => {
        const key = `${t.email}-${t.phone}`;
        if (!acc[key]) acc[key] = t;
        return acc;
    }, {} as Record<string, any>));

    const filteredTestResults = uniqueTestResults.filter((t: any) => {
        let testStatusMatch = true;
        if (statusFilter === 'Did Reservation') testStatusMatch = !!t.reservation_course;
        else if (statusFilter !== 'All') testStatusMatch = t.status === statusFilter;

        let dealStatusMatch = true;
        if (dealStatusFilter !== 'All') dealStatusMatch = (t.deal_status || 'Pending') === dealStatusFilter;

        let categoryMatch = true;
        if (userCategoryFilter === 'External Users') categoryMatch = !t.is_school_student;
        else if (userCategoryFilter === 'School Students') categoryMatch = !!t.is_school_student;

        return testStatusMatch && dealStatusMatch && categoryMatch;
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
        if (activeTab === 'test_results') {
            await supabase.from(activeTab).update({ deal_status: newStatus }).in('id', selectedIds);
        } else {
            await supabase.from(activeTab).update({ status: newStatus }).in('id', selectedIds);
        }
        loadData();
        setSelectedIds([]);
    };

    const getFilterStatuses = () => {
        if (activeTab === 'reservations') return ['Pending', 'Contacted', 'Deal Closed', 'Lost'];
        if (activeTab === 'contacts') return ['Unread', 'Read'];
        if (activeTab === 'test_results') return ['Started', 'Completed', 'Did Reservation'];
        return [];
    };

    const getBulkUpdateStatuses = () => {
        if (activeTab === 'reservations') return ['Pending', 'Contacted', 'Deal Closed', 'Lost'];
        if (activeTab === 'contacts') return ['Unread', 'Read'];
        if (activeTab === 'test_results') return ['Pending', 'Contacted', 'Deal Closed', 'Lost'];
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
            case 'Started': 
            case 'Pending': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'Contacted': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'Confirmed': 
            case 'Read': 
            case 'Completed': 
            case 'Deal Closed': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'Cancelled': 
            case 'Lost': return 'bg-red-500/20 text-red-400 border-red-500/30';
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
                        <Button type="submit" className="w-full" disabled={isLoggingIn}>
                            {isLoggingIn ? 'Logging in...' : 'Login'}
                        </Button>
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

                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 relative">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Dashboard</h1>
                    <div className="flex gap-4">
                        <button onClick={() => setIsProfileModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-md font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer relative">
                            <User size={18} /> Profile
                        </button>
                        <button onClick={handleLogout} disabled={isLoggingOut} className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors relative ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                            <LogOut size={18} /> {isLoggingOut ? 'Logging out...' : 'Logout'}
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
                        <button onClick={() => { setActiveTab('test_results'); setSelectedIds([]); setStatusFilter('All'); setDealStatusFilter('All'); setUserCategoryFilter('External Users'); }} className={`px-4 py-2 font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'test_results' ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-500/10' : 'text-gray-400 hover:text-gray-200'}`}>
                            Test Results ({uniqueTestResults.length})
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        <select 
                            value={statusFilter} 
                            onChange={(e) => { setStatusFilter(e.target.value); setSelectedIds([]); }}
                            className="flex-1 md:flex-none bg-dark-900 border border-gray-700 text-gray-300 rounded-md px-2 md:px-3 py-2 text-sm outline-none cursor-pointer min-w-[130px]"
                        >
                            <option value="All">{activeTab === 'test_results' ? 'All Test Statuses' : 'All Statuses'}</option>
                            {getFilterStatuses().map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>

                        {activeTab === 'test_results' && (
                            <>
                                <select 
                                    value={userCategoryFilter} 
                                    onChange={(e) => { setUserCategoryFilter(e.target.value); setSelectedIds([]); }}
                                    className="flex-1 md:flex-none bg-dark-900 border border-gray-700 text-gray-300 rounded-md px-2 md:px-3 py-2 text-sm outline-none cursor-pointer min-w-[130px]"
                                >
                                    <option value="All Users">All Users</option>
                                    <option value="External Users">External Users</option>
                                    <option value="School Students">School Students</option>
                                </select>
                                <select 
                                    value={dealStatusFilter} 
                                    onChange={(e) => { setDealStatusFilter(e.target.value); setSelectedIds([]); }}
                                    className="flex-1 md:flex-none bg-dark-900 border border-gray-700 text-gray-300 rounded-md px-2 md:px-3 py-2 text-sm outline-none cursor-pointer min-w-[130px]"
                                >
                                    <option value="All">All Deal Statuses</option>
                                    {['Pending', 'Contacted', 'Deal Closed', 'Lost'].map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </>
                        )}

                        <Button onClick={() => {
                            const dataToExport = getCurrentTabData();
                            exportToCSV(formatExportData(dataToExport, activeTab), `${activeTab}_${statusFilter.replace(/\s+/g, '_')}`);
                        }} className="w-full sm:w-auto flex items-center justify-center gap-2 whitespace-nowrap mt-2 sm:mt-0">
                            <Download size={18} /> Export All
                        </Button>
                    </div>
                </div>

                {selectedIds.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-orange-600/10 border border-orange-500/30 p-3 rounded-lg mb-6 flex flex-col sm:flex-row items-center justify-between gap-3"
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
                                <option value="" disabled>Change {activeTab === 'test_results' ? 'Deal Status' : 'Status'}...</option>
                                {getBulkUpdateStatuses().map(status => (
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
                                    <tr className="bg-dark-900/50 border-b border-gray-700 text-gray-400 text-xs sm:text-sm uppercase tracking-wider">
                                        <th className="px-2 py-3 sm:p-4 w-10 sm:w-12 whitespace-nowrap">
                                            <input type="checkbox" onChange={(e) => handleSelectAll(e.target.checked)} checked={selectedIds.length > 0 && selectedIds.length === filteredReservations.length} className="w-4 h-4 rounded bg-dark-900 border-gray-700 text-orange-600 focus:ring-orange-600 focus:ring-offset-dark-800 cursor-pointer" />
                                        </th>
                                        <th className="px-2 py-3 sm:p-4 whitespace-nowrap">Date</th>
                                        <th className="px-2 py-3 sm:p-4 whitespace-nowrap">Name</th>
                                        <th className="px-2 py-3 sm:p-4 whitespace-nowrap">Course</th>
                                        <th className="px-2 py-3 sm:p-4 whitespace-nowrap">Deal Status</th>
                                        <th className="px-2 py-3 sm:p-4 text-right whitespace-nowrap">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {filteredReservations.map((res) => (
                                        <tr key={res.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setSelectedUser(res)}>
                                            <td className="px-2 py-3 sm:p-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                                <input type="checkbox" checked={selectedIds.includes(res.id)} onChange={() => toggleSelection(res.id)} className="w-4 h-4 rounded bg-dark-900 border-gray-700 text-orange-600 focus:ring-orange-600 focus:ring-offset-dark-800 cursor-pointer" />
                                            </td>
                                            <td className="px-2 py-3 sm:p-4 text-gray-400 text-xs sm:text-sm whitespace-nowrap">{new Date(res.created_at || res.date).toLocaleDateString('en-GB')}</td>
                                            <td className="px-2 py-3 sm:p-4 whitespace-nowrap">
                                                <div className="text-white font-medium text-sm sm:text-base">{res.name}</div>
                                                <div className="text-gray-400 text-xs">{res.phone}</div>
                                            </td>
                                            <td className="px-2 py-3 sm:p-4 text-gray-300 text-xs sm:text-sm whitespace-nowrap">{res.course}</td>
                                            <td className="px-2 py-3 sm:p-4 whitespace-nowrap"><span className={`px-2 py-1 rounded-full text-[10px] sm:text-xs border ${getStatusColor(res.status)}`}>{res.status}</span></td>
                                            <td className="px-2 py-3 sm:p-4 text-right whitespace-nowrap">
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
                                    <tr className="bg-dark-900/50 border-b border-gray-700 text-gray-400 text-xs sm:text-sm uppercase tracking-wider">
                                        <th className="px-2 py-3 sm:p-4 w-10 sm:w-12 whitespace-nowrap">
                                            <input type="checkbox" onChange={(e) => handleSelectAll(e.target.checked)} checked={selectedIds.length > 0 && selectedIds.length === filteredContacts.length} className="w-4 h-4 rounded bg-dark-900 border-gray-700 text-orange-600 focus:ring-orange-600 focus:ring-offset-dark-800 cursor-pointer" />
                                        </th>
                                        <th className="px-2 py-3 sm:p-4 whitespace-nowrap">Date</th>
                                        <th className="px-2 py-3 sm:p-4 whitespace-nowrap">Name</th>
                                        <th className="px-2 py-3 sm:p-4 whitespace-nowrap">Subject</th>
                                        <th className="px-2 py-3 sm:p-4 whitespace-nowrap">Status</th>
                                        <th className="px-2 py-3 sm:p-4 text-right whitespace-nowrap">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {filteredContacts.map((msg) => (
                                        <tr key={msg.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => handleViewContact(msg)}>
                                            <td className="px-2 py-3 sm:p-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                                <input type="checkbox" checked={selectedIds.includes(msg.id)} onChange={() => toggleSelection(msg.id)} className="w-4 h-4 rounded bg-dark-900 border-gray-700 text-orange-600 focus:ring-orange-600 focus:ring-offset-dark-800 cursor-pointer" />
                                            </td>
                                            <td className="px-2 py-3 sm:p-4 text-gray-400 text-xs sm:text-sm whitespace-nowrap">{new Date(msg.created_at).toLocaleDateString('en-GB')}</td>
                                            <td className="px-2 py-3 sm:p-4 text-white font-medium text-sm sm:text-base whitespace-nowrap">{msg.name}</td>
                                            <td className="px-2 py-3 sm:p-4 text-gray-300 text-xs sm:text-sm whitespace-nowrap">{msg.subject}</td>
                                            <td className="px-2 py-3 sm:p-4 whitespace-nowrap"><span className={`px-2 py-1 rounded-full text-[10px] sm:text-xs border ${getStatusColor(msg.status)}`}>{msg.status}</span></td>
                                            <td className="px-2 py-3 sm:p-4 text-right whitespace-nowrap">
                                                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleViewContact(msg); }}>View</Button>
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
                                    <tr className="bg-dark-900/50 border-b border-gray-700 text-gray-400 text-xs sm:text-sm uppercase tracking-wider">
                                        <th className="px-2 py-3 sm:p-4 w-10 sm:w-12 whitespace-nowrap">
                                            <input type="checkbox" onChange={(e) => handleSelectAll(e.target.checked)} checked={selectedIds.length > 0 && selectedIds.length === filteredTestResults.length} className="w-4 h-4 rounded bg-dark-900 border-gray-700 text-orange-600 focus:ring-orange-600 focus:ring-offset-dark-800 cursor-pointer" />
                                        </th>
                                        <th className="px-2 py-3 sm:p-4 whitespace-nowrap">Date</th>
                                        <th className="px-2 py-3 sm:p-4 whitespace-nowrap">Name / Contact</th>
                                        <th className="px-2 py-3 sm:p-4 whitespace-nowrap">Score</th>
                                        <th className="px-2 py-3 sm:p-4 whitespace-nowrap">Level</th>
                                        <th className="px-2 py-3 sm:p-4 whitespace-nowrap">Test Status</th>
                                        <th className="px-2 py-3 sm:p-4 whitespace-nowrap">Deal Status</th>
                                        <th className="px-2 py-3 sm:p-4 text-right whitespace-nowrap">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {filteredTestResults.map((test) => (
                                        <tr key={test.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => { setSelectedUser(test); setModalType('test_results'); }}>
                                            <td className="px-2 py-3 sm:p-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                                <input type="checkbox" checked={selectedIds.includes(test.id)} onChange={() => toggleSelection(test.id)} className="w-4 h-4 rounded bg-dark-900 border-gray-700 text-orange-600 focus:ring-orange-600 focus:ring-offset-dark-800 cursor-pointer" />
                                            </td>
                                            <td className="px-2 py-3 sm:p-4 text-gray-400 text-xs sm:text-sm whitespace-nowrap">{new Date(test.created_at).toLocaleDateString('en-GB')}</td>
                                            <td className="px-2 py-3 sm:p-4 whitespace-nowrap">
                                                <div className="text-white font-medium text-sm sm:text-base">{test.name}</div>
                                                <div className="text-gray-400 text-xs">{test.phone}</div>
                                            </td>
                                            <td className="px-2 py-3 sm:p-4 text-orange-400 font-bold whitespace-nowrap">{test.score ? `${test.score}/100` : '-'}</td>
                                            <td className="px-2 py-3 sm:p-4 text-gray-300 font-medium whitespace-nowrap">{test.level || '-'}</td>
                                            <td className="px-2 py-3 sm:p-4 whitespace-nowrap"><span className={`px-2 py-1 rounded-full text-[10px] sm:text-xs border ${getStatusColor(test.status)}`}>{test.status}</span></td>
                                            <td className="px-2 py-3 sm:p-4 whitespace-nowrap"><span className={`px-2 py-1 rounded-full text-[10px] sm:text-xs border ${getStatusColor(test.deal_status || 'Pending')}`}>{test.deal_status || 'Pending'}</span></td>
                                            <td className="px-2 py-3 sm:p-4 text-right whitespace-nowrap">
                                                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedUser(test); setModalType('test_results'); }}>View</Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredTestResults.length === 0 && <tr><td colSpan={8} className="p-8 text-center text-gray-500">No test results found.</td></tr>}
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
                        className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
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
                        className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedUser(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-dark-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-4 sm:p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-dark-800/90 backdrop-blur z-10 gap-2">
                                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 min-w-0 flex-1">
                                    {activeTab === 'reservations' && <Calendar className="text-orange-500 shrink-0" size={20} />}
                                    {activeTab === 'contacts' && <MessageSquare className="text-orange-500 shrink-0" size={20} />}
                                    {activeTab === 'test_results' && <Award className="text-orange-500 shrink-0" size={20} />}
                                    <span className="truncate" dir="auto">{selectedUser.name}</span>
                                    <span className="text-gray-400 text-sm font-normal shrink-0 hidden sm:inline">Details</span>
                                </h2>
                                <button onClick={() => { setSelectedUser(null); setShowUserHistory(false); }} className="text-gray-400 hover:text-white bg-dark-900 p-2 rounded-full shrink-0"><X size={20}/></button>
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
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                        
                                        <div className="flex flex-wrap gap-2 pt-4">
                                            {selectedUser.status !== 'Contacted' && <Button size="sm" onClick={() => updateResStatus(selectedUser.id, 'Contacted')} className="bg-yellow-600 hover:bg-yellow-700 text-white">Contacted</Button>}
                                            {selectedUser.status !== 'Deal Closed' && <Button size="sm" onClick={() => updateResStatus(selectedUser.id, 'Deal Closed')} className="bg-green-600 hover:bg-green-700 text-white">Deal Closed</Button>}
                                            {selectedUser.status !== 'Lost' && <Button size="sm" onClick={() => updateResStatus(selectedUser.id, 'Lost')} className="bg-red-600 hover:bg-red-700 text-white border-none shadow-none">Lost</Button>}
                                            {selectedUser.status !== 'Pending' && <Button size="sm" onClick={() => updateResStatus(selectedUser.id, 'Pending')} className="bg-gray-600 hover:bg-gray-700 text-white border-none shadow-none">Reset to Pending</Button>}
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
                                        {(() => {
                                            const userAttempts = testResults.filter(t => t.email === selectedUser.email && t.phone === selectedUser.phone);
                                            const latestAttemptId = userAttempts.length > 0 ? userAttempts[0].id : null;
                                            const isViewingLatest = selectedUser.id === latestAttemptId;

                                            if (userAttempts.length > 1 && !showUserHistory) {
                                                if (isViewingLatest) {
                                                    return (
                                                        <div 
                                                            onClick={() => setShowUserHistory(true)}
                                                            className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-yellow-500/20 transition-colors"
                                                        >
                                                            <div className="flex items-center gap-3 text-yellow-400">
                                                                <RefreshCcw size={20} />
                                                                <span className="font-bold">This user has attempted the test {userAttempts.length} times.</span>
                                                            </div>
                                                            <span className="text-yellow-400 text-sm flex items-center gap-1">View History <ChevronRight size={16} /></span>
                                                        </div>
                                                    );
                                                } else {
                                                    return (
                                                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg">
                                                            <div className="flex items-center gap-3 text-yellow-400">
                                                                <RefreshCcw size={20} />
                                                                <span className="font-bold">You are viewing an older attempt.</span>
                                                            </div>
                                                            <div className="flex gap-2 w-full sm:w-auto">
                                                                <Button variant="outline" size="sm" onClick={() => setShowUserHistory(true)} className="flex-1 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20">History</Button>
                                                                <Button size="sm" onClick={() => setSelectedUser(userAttempts[0])} className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white">Go to Latest</Button>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            }
                                            return null;
                                        })()}

                                        {showUserHistory ? (
                                            <div className="space-y-4">
                                                <Button variant="outline" size="sm" onClick={() => {
                                                    const latest = testResults.find(t => t.email === selectedUser.email && t.phone === selectedUser.phone);
                                                    if(latest) setSelectedUser(latest);
                                                    setShowUserHistory(false);
                                                }} className="flex items-center gap-2 mb-4">
                                                    <ChevronLeft size={16} /> Back to Latest Result
                                                </Button>
                                                <h3 className="text-lg font-bold text-orange-400 border-b border-gray-800 pb-2">Test History</h3>
                                                <div className="space-y-3">
                                                    {(() => {
                                                        const userAttempts = testResults.filter(t => t.email === selectedUser.email && t.phone === selectedUser.phone);
                                                        const latestAttemptId = userAttempts.length > 0 ? userAttempts[0].id : null;
                                                        return userAttempts.map((attempt: any) => (
                                                            <div key={attempt.id} className={`p-4 rounded-lg border ${attempt.id === selectedUser.id ? 'border-orange-500 bg-orange-500/10' : 'border-gray-800 bg-dark-900'} flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center`}>
                                                                <div>
                                                                    <div className="text-sm text-gray-400">{new Date(attempt.created_at).toLocaleString()} {attempt.id === latestAttemptId && <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">Latest</span>}</div>
                                                                    <div className="font-bold text-white mt-1">Score: <span className="text-orange-400">{attempt.score || 0}/100</span> ({attempt.level || 'Pending'})</div>
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <span className={`px-2 py-1 rounded-full text-[10px] sm:text-xs border ${getStatusColor(attempt.status)}`}>{attempt.status}</span>
                                                                    {attempt.id !== selectedUser.id ? (
                                                                        <Button size="sm" variant="outline" onClick={() => { setSelectedUser(attempt); setShowUserHistory(false); }}>View Full Details</Button>
                                                                    ) : (
                                                                        <span className="text-orange-400 text-xs font-medium px-3 py-1 bg-orange-500/10 rounded-full border border-orange-500/20">Currently Viewing</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ));
                                                    })()}
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                {selectedUser.reservation_course && (
                                                    <div className="bg-dark-900 p-6 rounded-lg border border-orange-500/50">
                                                        <h3 className="text-lg font-bold text-orange-400 border-b border-gray-800 pb-2 mb-4 flex items-center gap-2">
                                                            <Calendar size={18} /> Linked Course Reservation
                                                        </h3>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            <div><span className="text-gray-500 text-sm block">Course</span><span className="text-white font-medium">{selectedUser.reservation_course}</span></div>
                                                            <div><span className="text-gray-500 text-sm block">Level</span><span className="text-white font-medium">{selectedUser.reservation_level}</span></div>
                                                            <div><span className="text-gray-500 text-sm block">Preferred Time</span><span className="text-white font-medium">{selectedUser.reservation_time}</span></div>
                                                            <div><span className="text-gray-500 text-sm block">Status</span><span className={`px-2 py-0.5 rounded-full text-[10px] border font-medium ${getStatusColor(selectedUser.deal_status || 'Pending')}`}>{selectedUser.deal_status || 'Pending'}</span></div>
                                                        </div>
                                                        {selectedUser.reservation_message && (
                                                            <div className="pt-4 border-t border-gray-800 mt-4">
                                                                <span className="text-gray-500 text-sm block mb-1">Message</span>
                                                                <p className="text-gray-300 italic">"{selectedUser.reservation_message}"</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                <div className="bg-dark-900 p-6 rounded-lg border border-gray-800">
                                                    <h3 className="text-lg font-bold text-orange-400 border-b border-gray-800 pb-2 mb-4">Test Scores</h3>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
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
                                                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-800 mt-4">
                                                        <span className="text-gray-400 text-sm w-full mb-1">Update Deal Status:</span>
                                                        {(selectedUser.deal_status || 'Pending') !== 'Contacted' && <Button size="sm" onClick={() => updateTestDealStatus(selectedUser.id, 'Contacted')} className="bg-yellow-600 hover:bg-yellow-700 text-white">Contacted</Button>}
                                                        {(selectedUser.deal_status || 'Pending') !== 'Deal Closed' && <Button size="sm" onClick={() => updateTestDealStatus(selectedUser.id, 'Deal Closed')} className="bg-green-600 hover:bg-green-700 text-white">Deal Closed</Button>}
                                                        {(selectedUser.deal_status || 'Pending') !== 'Lost' && <Button size="sm" onClick={() => updateTestDealStatus(selectedUser.id, 'Lost')} className="bg-red-600 hover:bg-red-700 text-white border-none shadow-none">Lost</Button>}
                                                        {(selectedUser.deal_status || 'Pending') !== 'Pending' && <Button size="sm" onClick={() => updateTestDealStatus(selectedUser.id, 'Pending')} className="bg-gray-600 hover:bg-gray-700 text-white border-none shadow-none">Reset to Pending</Button>}
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
                                            </>
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
                                <Button onClick={() => { setSelectedUser(null); setShowUserHistory(false); }}>Close</Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default AdminDashboard;