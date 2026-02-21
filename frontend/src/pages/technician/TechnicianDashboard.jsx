import * as Lucide from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import complaintService from '../../services/complaintService';
import { formatDate } from '../../utils/dateUtils';

const TechnicianDashboard = () => {
    const navigate = useNavigate();
    const [filterStatus, setFilterStatus] = useState('All');
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const data = await complaintService.getAssignedComplaints();
            setComplaints(data);
        } catch (error) {
            console.error('Error fetching complaints:', error);
        } finally {
            setLoading(false);
        }
    };

    // Safe icon helper
    const SafeIcon = ({ name, size = 24, className = "" }) => {
        const Icon = Lucide[name] || Lucide.HelpCircle || Lucide.AlertTriangle;
        return <Icon size={size} className={className} />;
    };

    const stats = [
        { label: 'Assigned', value: complaints.length.toString(), icon: 'Wrench', color: 'bg-blue-50 text-blue-600' },
        { label: 'Pending', value: complaints.filter(c => c.status === 'Pending').length.toString(), icon: 'Clock', color: 'bg-orange-50 text-orange-600' },
        { label: 'Completed', value: complaints.filter(c => c.status === 'Resolved').length.toString(), icon: 'CircleCheck', color: 'bg-green-50 text-green-600' },
        { label: 'Rating', value: user?.rating?.toString() || '5.0', icon: 'CircleAlert', color: 'bg-purple-50 text-purple-600' }
    ];

    const filteredComplaints = complaints.filter(c => {
        if (filterStatus === 'All') return true;
        if (filterStatus === 'Completed') return c.status === 'Resolved';
        return c.status === filterStatus;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'In Progress': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Resolved': return 'bg-green-50 text-green-600 border-green-100';
            case 'Pending': return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    if (loading) {
        return (
            <div className="h-screen bg-[#f8fbff] flex flex-col items-center justify-center">
                <Lucide.Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                <p className="text-gray-400 font-bold tracking-widest uppercase text-[10px] md:text-sm italic">Synchronizing Tasks...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fbff] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
            <div className="shrink-0">
                <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                {/* For technicians we might not need the admin sidebar, but the navbar toggle is active.
                    If we want a sidebar for tech too, we should include it.
                    SidebarAdmin already has routes for complaints.
                */}
                <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 md:mb-12">
                        <div>
                            <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">Assigned Tasks</h1>
                            <div className="flex items-center gap-2 md:gap-3 text-gray-400 font-medium mt-1 italic text-[10px] md:text-xs">
                                <SafeIcon name="Calendar" size={14} />
                                <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-blue-400"></span>
                                <span>Technician Node #04</span>
                            </div>
                        </div>
                        <div className="w-full lg:w-auto">
                            <div className="relative">
                                <Lucide.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="text" placeholder="Search task ID..." className="pl-12 pr-6 py-3.5 bg-white border border-gray-100 rounded-2xl text-xs md:text-sm font-bold shadow-sm outline-none focus:ring-4 focus:ring-blue-50 transition-all w-full lg:w-64" />
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
                        {stats.map((stat, i) => (
                            <div key={i} className="bg-white p-5 md:p-8 rounded-3xl md:rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group">
                                <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.color} rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform`}>
                                    <SafeIcon name={stat.icon} size={20} />
                                </div>
                                <p className="text-[10px] md:text-sm font-black text-gray-400 uppercase tracking-widest leading-none">{stat.label}</p>
                                <h3 className="text-xl md:text-3xl font-black text-gray-900 mt-2">{stat.value}</h3>
                            </div>
                        ))}
                    </div>

                    {/* Tasks List */}
                    <div className="bg-white rounded-[32px] md:rounded-[48px] border border-gray-100 shadow-sm overflow-hidden mb-12">
                        <div className="p-6 md:p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                <SafeIcon name="Clock" className="text-blue-600" /> Recent Complaints
                            </h2>
                            <div className="flex items-center gap-1.5 md:gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
                                {['All', 'Pending', 'In Progress', 'Completed'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setFilterStatus(tab)}
                                        className={`px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterStatus === tab ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left font-sans text-sm">
                                <thead className="bg-gray-50 border-y border-gray-100">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Task Detail</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Priority</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right pr-12">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredComplaints.map((complaint) => (
                                        <tr key={complaint._id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center shrink-0 border border-gray-100">
                                                        <SafeIcon name="Monitor" size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-gray-400 uppercase tracking-tight">#{complaint._id.slice(-8).toUpperCase()}</p>
                                                        <p className="text-sm font-black text-gray-900 leading-tight">{complaint.serialNumber}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <p className="text-xs text-blue-600 font-medium line-clamp-1 italic">{complaint.issueDescription}</p>
                                                            {complaint.requestedSpares?.length > 0 && (
                                                                <span className="bg-orange-100 text-orange-600 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter shrink-0">
                                                                    Spare
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="font-bold text-gray-700">{complaint.user?.fullName}</div>
                                                <div className="text-xs text-gray-400 font-medium">{formatDate(complaint.createdAt)}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(complaint.status)}`}>
                                                    {complaint.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${complaint.status === 'Pending' ? 'bg-red-500' : 'bg-green-500'}`}></span>
                                                    <span className="text-xs font-bold text-gray-600">{complaint.status === 'Pending' ? 'Priority' : 'Normal'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right pr-12">
                                                <button
                                                    onClick={() => navigate(`/technician/complaint/${complaint._id}`)}
                                                    className="p-3 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50/30 transition-all active:scale-95 shadow-sm"
                                                >
                                                    <SafeIcon name="ChevronRight" size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Insights */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                        <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                <SafeIcon name="MessageSquare" className="text-blue-600" /> Recent Service Notes
                            </h3>
                            <div className="space-y-6">
                                <div className="p-6 bg-gray-50 rounded-3xl relative">
                                    <p className="text-sm text-gray-700 leading-relaxed font-medium capitalize">"Replaced thermal paste on Samsung Galaxy Book. CPU temperatures now stable."</p>
                                    <span className="text-[10px] text-gray-400 font-black uppercase mt-3 block tracking-wider">Worker ID: TK-2041 • 2 Hours Ago</span>
                                </div>
                                <div className="p-6 bg-gray-50 rounded-3xl relative">
                                    <p className="text-sm text-gray-700 leading-relaxed font-medium capitalize">"Awaiting replacement part for Dell Latitude. Arrival ETA: tomorrow."</p>
                                    <span className="text-[10px] text-gray-400 font-black uppercase mt-3 block tracking-wider">Worker ID: TK-2041 • Yesterday</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 p-10 rounded-[48px] text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-3xl -mr-32 -mt-32"></div>
                            <h3 className="text-xl font-black mb-4 relative z-10 flex items-center gap-3">
                                <SafeIcon name="LayoutDashboard" className="text-blue-400" /> Technician Insight
                            </h3>
                            <p className="text-sm text-gray-400 font-medium mb-10 relative z-10">You are in the top 5% of our experts this month. Keep up the precision work!</p>

                            <div className="grid grid-cols-2 gap-8 relative z-10">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Repair Speed</p>
                                    <div className="text-4xl font-black text-white italic">2.4<span className="text-lg text-gray-500 not-italic ml-2">Days</span></div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Repair Success</p>
                                    <div className="text-4xl font-black text-blue-400 italic">98%<span className="text-lg text-gray-500 not-italic ml-2">Avg</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default TechnicianDashboard;
