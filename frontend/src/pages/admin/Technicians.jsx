import React, { useState, useEffect } from 'react';
import {
    Wrench,
    Plus,
    Search,
    Filter,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Star,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Award,
    Activity,
    Clock,
    CheckCircle2,
    X,
    Loader2,
    Lock
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import SidebarAdmin from '../../components/SidebarAdmin';
import userService from '../../services/userService';
import { formatDate } from '../../utils/dateUtils';

const Technicians = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [technicians, setTechnicians] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        specialty: ''
    });

    useEffect(() => {
        fetchTechnicians();
    }, []);

    const fetchTechnicians = async () => {
        try {
            setLoading(true);
            const response = await userService.getAllTechnicians();
            if (response.status === 'success') {
                setTechnicians(response.data.technicians);
            }
        } catch (error) {
            console.error('Failed to fetch technicians:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddTechnician = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const response = await userService.addTechnician(formData);
            if (response.status === 'success') {
                setIsAddModalOpen(false);
                setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    password: '',
                    specialty: ''
                });
                fetchTechnicians();
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add technician');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredTechnicians = technicians.filter(tech =>
        tech.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tech.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const techStats = [
        { label: 'Total Technicians', value: technicians.length, icon: Wrench, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Available Now', value: technicians.filter(t => t.isAvailable).length, icon: Activity, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Avg. Rating', value: '4.8', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        { label: 'Completed Repairs', value: '842', icon: CheckCircle2, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    const getStatusStyle = (tech) => {
        if (!tech.isAvailable) return 'bg-red-100 text-red-700 border-red-200';
        return 'bg-green-100 text-green-700 border-green-200';
    };

    return (
        <div className="h-screen bg-[#f8fbff] flex flex-col overflow-hidden">
            <div className="shrink-0">
                <Navbar />
            </div>

            <div className="flex flex-1 overflow-hidden">
                <SidebarAdmin />

                <main className="flex-1 overflow-y-auto p-6 font-sans relative">
                    {/* Background Decorative Gradient */}
                    <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-500/5 blur-[120px] rounded-full -mr-20 -mt-20 pointer-events-none"></div>

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 mb-2">Technician Management</h1>
                            <p className="text-gray-500 font-medium">Manage your service experts and track their performance.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95 text-sm"
                            >
                                <Plus size={18} /> Add Technician
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 relative z-10">
                        {techStats.map((stat, i) => (
                            <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl`}>
                                        <stat.icon size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
                                        <p className="text-xl font-black text-gray-900">{stat.value}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Filters & Search */}
                    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm mb-4 flex flex-col md:flex-row gap-4 items-center justify-between relative z-10">
                        <div className="relative w-full md:w-96">
                            <input
                                type="text"
                                placeholder="Search by name, email or specialty..."
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all">
                                <Filter size={18} /> Filters
                            </button>
                        </div>
                    </div>

                    {/* Technicians List */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-10 relative z-10">
                        {loading ? (
                            <div className="py-20 flex flex-col items-center justify-center gap-4">
                                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Technicians...</p>
                            </div>
                        ) : filteredTechnicians.length === 0 ? (
                            <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                                <Wrench size={48} className="mb-4 opacity-20" />
                                <p className="font-bold">No Technicians Found</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50/50">
                                        <tr className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                                            <th className="px-6 py-4">Technician Info</th>
                                            <th className="px-4 py-4">Specialty</th>
                                            <th className="px-4 py-4">Performance</th>
                                            <th className="px-4 py-4 text-center">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredTechnicians.map((tech) => (
                                            <tr key={tech._id} className="hover:bg-gray-50/30 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black overflow-hidden relative">
                                                            <img
                                                                src={`https://ui-avatars.com/api/?name=${tech.fullName}&background=random&color=fff`}
                                                                alt={tech.fullName}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-black text-gray-900 leading-tight mb-0.5">{tech.fullName}</h4>
                                                            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">{tech.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-gray-700">{tech.specialty || 'Generalist'}</span>
                                                        <span className="text-[10px] text-gray-400 font-medium">Joined {formatDate(tech.createdAt)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-1">
                                                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                                        <span className="text-sm font-black text-gray-900">{tech.rating || '5.0'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(tech)}`}>
                                                        {tech.isAvailable ? 'Available' : 'Busy/Away'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                                            <MoreVertical size={18} />
                                                        </button>
                                                    </div>
                                                    <div className="group-hover:hidden">
                                                        <MoreVertical size={18} className="text-gray-300 ml-auto" />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Add Technician Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Add New Technician</h2>
                                <p className="text-sm text-gray-500 font-medium">Create a new expert account.</p>
                            </div>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="p-2 hover:bg-white rounded-full transition-all text-gray-400 shadow-sm border border-gray-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleAddTechnician} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                        <input
                                            type="text"
                                            name="fullName"
                                            required
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            placeholder="John Doe"
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-gray-300"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Email ID</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="tech@vagwiin.com"
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-gray-300"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+91 00000 00000"
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-gray-300"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Specialty</label>
                                    <div className="relative">
                                        <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                        <input
                                            type="text"
                                            name="specialty"
                                            value={formData.specialty}
                                            onChange={handleInputChange}
                                            placeholder="e.g. MacBook Expert"
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-gray-300"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Initial Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        minLength="6"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Min. 6 characters"
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-gray-300"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Create Expert'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Technicians;
