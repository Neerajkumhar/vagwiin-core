import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    MessageSquare,
    Clock,
    CheckCircle2,
    AlertCircle,
    Calendar,
    User,
    Hash,
    MoreVertical,
    Search,
    Filter,
    ArrowUpDown
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import SidebarAdmin from '../../components/SidebarAdmin';
import { formatDate } from '../../utils/dateUtils';
import complaintService from '../../services/complaintService';
import userService from '../../services/userService';

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        fetchComplaints();
        fetchTechnicians();
    }, []);

    const fetchTechnicians = async () => {
        try {
            const response = await userService.getAllTechnicians();
            setTechnicians(response.data.technicians);
        } catch (error) {
            console.error('Error fetching technicians:', error);
        }
    };

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const data = await complaintService.getAllComplaints();
            setComplaints(data);
        } catch (error) {
            console.error('Error fetching complaints:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await complaintService.updateComplaintStatus(id, { status: newStatus });
            fetchComplaints(); // Refresh list
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const assignTechnician = async (id, technicianId) => {
        try {
            await complaintService.updateComplaintStatus(id, { assignedTechnician: technicianId });
            fetchComplaints();
        } catch (error) {
            console.error('Error assigning technician:', error);
            alert('Failed to assign technician');
        }
    };

    const filteredComplaints = complaints.filter(c => {
        const matchesSearch = c.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'In Progress': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Resolved': return 'bg-green-50 text-green-600 border-green-100';
            case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    if (loading) {
        return (
            <div className="h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-slate-50 flex flex-col overflow-hidden font-sans text-slate-900">
            <Navbar />

            <div className="flex flex-1 overflow-hidden">
                <SidebarAdmin />

                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">
                                    Complaints & Diagnosis
                                </h1>
                                <p className="text-slate-500 font-medium">
                                    Manage and track customer service requests.
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        {complaints.filter(c => c.status === 'Pending').length} Pending
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Search and Filters */}
                        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm mb-6 flex flex-wrap items-center gap-4">
                            <div className="relative flex-1 min-w-[300px]">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by serial number or customer..."
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Filter size={18} className="text-slate-400" />
                                <select
                                    className="bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="All">All Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        {/* Complaints List */}
                        <div className="grid grid-cols-1 gap-6">
                            {filteredComplaints.length === 0 ? (
                                <div className="bg-white p-20 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                                    <div className="bg-slate-50 p-6 rounded-full mb-4">
                                        <MessageSquare size={40} className="text-slate-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Complaints Found</h3>
                                    <p className="text-slate-500 max-w-xs">
                                        There are no diagnosis requests matching your current filters.
                                    </p>
                                </div>
                            ) : (
                                filteredComplaints.map((complaint) => (
                                    <div key={complaint._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                                        <div className="p-6">
                                            <div className="flex flex-col lg:flex-row justify-between gap-6">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(complaint.status)}`}>
                                                            {complaint.status}
                                                        </span>
                                                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                                            <Clock size={14} />
                                                            {formatDate(complaint.createdAt)}
                                                        </span>
                                                    </div>

                                                    <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                                                        {complaint.serialNumber}
                                                        <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded uppercase tracking-wider">
                                                            Serial Number
                                                        </span>
                                                    </h3>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                        <div className="flex items-start gap-3">
                                                            <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                                                                <User size={18} />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</p>
                                                                <p className="font-bold text-slate-700">{complaint.user?.fullName || 'Anonymous'}</p>
                                                                <p className="text-xs text-slate-500">{complaint.user?.email}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <div className="bg-orange-50 p-2 rounded-xl text-orange-600">
                                                                <Calendar size={18} />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Diagnosis Schedule</p>
                                                                <p className="font-bold text-slate-700">{formatDate(complaint.diagnosisDate)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <div className="bg-purple-50 p-2 rounded-xl text-purple-600">
                                                                <AlertCircle size={18} />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Technician</p>
                                                                <p className="font-bold text-slate-700">{complaint.assignedTechnician?.fullName || 'Not Assigned'}</p>
                                                                {complaint.assignedTechnician && <p className="text-xs text-slate-500">{complaint.assignedTechnician.phone}</p>}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Issue Description</p>
                                                        <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                                                            "{complaint.issueDescription}"
                                                        </p>
                                                    </div>

                                                    {/* Spare Parts Requests */}
                                                    {complaint.requestedSpares?.length > 0 && (
                                                        <div className="mt-6 border-t border-slate-100 pt-6">
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                                <Hash size={12} className="text-blue-500" />
                                                                Requested Spare Parts ({complaint.requestedSpares.length})
                                                            </p>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {complaint.requestedSpares.map((spare, idx) => (
                                                                    <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                                                                        <div className="flex justify-between items-start mb-3">
                                                                            <div>
                                                                                <p className="font-bold text-slate-900 text-sm">{spare.partName}</p>
                                                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Qty: {spare.quantity}</p>
                                                                            </div>
                                                                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${spare.status === 'Approved' ? 'bg-green-50 text-green-600' :
                                                                                    spare.status === 'Rejected' ? 'bg-red-50 text-red-600' :
                                                                                        spare.status === 'Ordered' ? 'bg-blue-50 text-blue-600' :
                                                                                            spare.status === 'Ready' ? 'bg-purple-50 text-purple-600' :
                                                                                                'bg-orange-50 text-orange-600'
                                                                                }`}>
                                                                                {spare.status}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <select
                                                                                className="flex-1 bg-slate-50 border-none rounded-lg px-2 py-1.5 text-[10px] font-bold text-slate-600 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                                                                                value={spare.status}
                                                                                onChange={async (e) => {
                                                                                    try {
                                                                                        await complaintService.updateSparePartStatus(complaint._id, spare._id, { status: e.target.value });
                                                                                        fetchComplaints();
                                                                                    } catch (err) {
                                                                                        alert('Failed to update spare status');
                                                                                    }
                                                                                }}
                                                                            >
                                                                                <option value="Pending">Pending</option>
                                                                                <option value="Approved">Approve</option>
                                                                                <option value="Ordered">Mark Ordered</option>
                                                                                <option value="Ready">Mark Ready</option>
                                                                                <option value="Rejected">Reject</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="lg:w-64 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-6">
                                                    <div className="mb-6">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Assign Technician</p>
                                                        <select
                                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 focus:ring-2 focus:ring-blue-500 cursor-pointer mb-4"
                                                            value={complaint.assignedTechnician?._id || ''}
                                                            onChange={(e) => assignTechnician(complaint._id, e.target.value)}
                                                        >
                                                            <option value="">Select Technician</option>
                                                            {technicians.map(tech => (
                                                                <option key={tech._id} value={tech._id}>
                                                                    {tech.fullName} ({tech.specialty || 'General'})
                                                                </option>
                                                            ))}
                                                        </select>

                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Quick Actions</p>
                                                        <div className="space-y-2">
                                                            {complaint.status === 'Pending' && (
                                                                <button
                                                                    onClick={() => updateStatus(complaint._id, 'In Progress')}
                                                                    className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                                                >
                                                                    <Clock size={16} /> Mark In Progress
                                                                </button>
                                                            )}
                                                            {complaint.status !== 'Resolved' && (
                                                                <button
                                                                    onClick={() => updateStatus(complaint._id, 'Resolved')}
                                                                    className="w-full py-2.5 bg-green-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                                                >
                                                                    <CheckCircle2 size={16} /> Mark Resolved
                                                                </button>
                                                            )}
                                                            {complaint.status !== 'Cancelled' && (
                                                                <button
                                                                    onClick={() => updateStatus(complaint._id, 'Cancelled')}
                                                                    className="w-full py-2.5 bg-white border border-slate-200 text-slate-400 rounded-xl text-xs font-black uppercase tracking-widest hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all"
                                                                >
                                                                    Cancel Ticket
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="mt-6 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                        <span>Ticket ID</span>
                                                        <span>#{complaint._id.slice(-8).toUpperCase()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Complaints;
