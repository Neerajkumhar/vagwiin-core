import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import Navbar from '../../components/Navbar';
import complaintService from '../../services/complaintService';
import { formatDate } from '../../utils/dateUtils';

const ComplaintDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [repairNotes, setRepairNotes] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [showSpareModal, setShowSpareModal] = useState(false);
    const [spareRequests, setSpareRequests] = useState([{ partName: '', quantity: 1 }]);

    useEffect(() => {
        fetchComplaint();
    }, [id]);

    const fetchComplaint = async () => {
        try {
            setLoading(true);
            const data = await complaintService.getComplaintById(id);
            setComplaint(data);
            setSelectedStatus(data.status);
            setRepairNotes(data.adminNotes || '');
        } catch (error) {
            console.error('Error fetching complaint:', error);
            alert('Failed to fetch complaint details');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            await complaintService.updateComplaintStatus(id, {
                status: selectedStatus,
                adminNotes: repairNotes
            });
            alert('Complaint updated successfully');
            fetchComplaint();
        } catch (error) {
            console.error('Error updating complaint:', error);
            alert('Failed to update complaint');
        }
    };

    const handleRequestSpare = async (e) => {
        e.preventDefault();
        try {
            await complaintService.requestSparePart(id, {
                spares: spareRequests
            });
            alert('Spare parts requested successfully');
            setSpareRequests([{ partName: '', quantity: 1 }]);
            setShowSpareModal(false);
            fetchComplaint();
        } catch (error) {
            console.error('Error requesting spare parts:', error);
            alert('Failed to request spare parts');
        }
    };

    const addSpareRow = () => {
        setSpareRequests([...spareRequests, { partName: '', quantity: 1 }]);
    };

    const removeSpareRow = (index) => {
        if (spareRequests.length > 1) {
            const newRequests = spareRequests.filter((_, i) => i !== index);
            setSpareRequests(newRequests);
        }
    };

    const updateSpareRequest = (index, field, value) => {
        const newRequests = [...spareRequests];
        newRequests[index][field] = value;
        setSpareRequests(newRequests);
    };

    const statusOptions = [
        'Pending',
        'In Progress',
        'Resolved',
        'Cancelled'
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Resolved': return 'bg-green-100 text-green-700 border-green-200';
            case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Pending': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getSpareStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-700';
            case 'Rejected': return 'bg-red-100 text-red-700';
            case 'Ordered': return 'bg-blue-100 text-blue-700';
            case 'Ready': return 'bg-purple-100 text-purple-700';
            default: return 'bg-orange-100 text-orange-700';
        }
    };

    if (loading) {
        return (
            <div className="h-screen bg-[#f8fbff] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!complaint) return null;

    // Safe icon helper
    const SafeIcon = ({ name, size = 24, className = "" }) => {
        const Icon = Lucide[name] || Lucide.HelpCircle || Lucide.AlertTriangle;
        return <Icon size={size} className={className} />;
    };

    return (
        <div className="min-h-screen bg-[#f8fbff] flex flex-col font-sans">
            <Navbar />

            <main className="flex-1 p-8 lg:p-12 max-w-7xl mx-auto w-full">
                {/* Spare Part Modal */}
                {showSpareModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-[40px] p-10 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Request Spare Parts</h2>
                                <button
                                    onClick={addSpareRow}
                                    className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest"
                                >
                                    <Lucide.Plus size={16} /> Add Part
                                </button>
                            </div>
                            <form onSubmit={handleRequestSpare} className="space-y-6">
                                <div className="space-y-4">
                                    {spareRequests.map((request, index) => (
                                        <div key={index} className="flex gap-4 items-end bg-gray-50 p-6 rounded-3xl relative group">
                                            <div className="flex-1">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Part Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={request.partName}
                                                    onChange={(e) => updateSpareRequest(index, 'partName', e.target.value)}
                                                    placeholder="e.g. 16GB DDR4 RAM"
                                                    className="w-full px-6 py-4 bg-white border-none rounded-2xl text-sm font-bold shadow-sm outline-none focus:ring-4 focus:ring-blue-50 transition-all"
                                                />
                                            </div>
                                            <div className="w-24">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Qty</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    required
                                                    value={request.quantity}
                                                    onChange={(e) => updateSpareRequest(index, 'quantity', parseInt(e.target.value))}
                                                    className="w-full px-6 py-4 bg-white border-none rounded-2xl text-sm font-bold shadow-sm outline-none focus:ring-4 focus:ring-blue-50 transition-all"
                                                />
                                            </div>
                                            {spareRequests.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeSpareRow(index)}
                                                    className="p-4 text-red-400 hover:text-red-600 transition-colors"
                                                >
                                                    <Lucide.Trash2 size={20} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowSpareModal(false);
                                            setSpareRequests([{ partName: '', quantity: 1 }]);
                                        }}
                                        className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                                    >
                                        Submit All Requests
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <Link to="/technician" className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-4 hover:underline">
                            <SafeIcon name="ChevronLeft" size={16} /> Back to Dashboard
                        </Link>
                        <div className="flex items-center gap-4">
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Case #{complaint._id.slice(-8).toUpperCase()}</h1>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(complaint.status)}`}>
                                {complaint.status}
                            </span>
                        </div>
                        <p className="text-gray-400 font-medium mt-1 italic flex items-center gap-2">
                            <SafeIcon name="Clock" size={16} /> Reported on {formatDate(complaint.createdAt)}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-6 py-4 bg-white border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm outline-none focus:ring-4 focus:ring-blue-50 transition-all appearance-none cursor-pointer pr-12 relative"
                        >
                            {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        <button
                            onClick={handleUpdate}
                            className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
                        >
                            Update Status
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Column 1 & 2: Main Repair Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Issue Overview */}
                        <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 blur-3xl rounded-full -mr-16 -mt-16"></div>
                            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3 relative z-10">
                                <SafeIcon name="AlertCircle" className="text-orange-500" /> Issue Description
                            </h3>
                            <div className="space-y-4 relative z-10">
                                <h4 className="text-lg font-bold text-gray-800">Reported Problem</h4>
                                <p className="text-gray-500 font-medium leading-relaxed">{complaint.issueDescription}</p>
                            </div>
                        </div>

                        {/* Technical Workbench */}
                        <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                <SafeIcon name="Wrench" className="text-blue-600" /> Technician Workbench
                            </h3>

                            <div className="space-y-8">
                                {/* Inspection Checklist */}
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">Initial Checklist</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            'Visual Inspection for physical damage',
                                            'Display Cable Connectivity',
                                            'GPU Stress Testing',
                                            'Battery Calibration Check'
                                        ].map((task, i) => (
                                            <label key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all cursor-pointer group">
                                                <input type="checkbox" className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-100" />
                                                <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">{task}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Notes Input */}
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Diagnostics & Repair Notes</p>
                                    <textarea
                                        value={repairNotes}
                                        onChange={(e) => setRepairNotes(e.target.value)}
                                        placeholder="Add technical findings, specific errors found, or parts used..."
                                        className="w-full h-48 p-8 bg-gray-50 border-none rounded-[32px] text-sm font-medium outline-none focus:ring-4 focus:ring-blue-50 transition-all resize-none italic"
                                    ></textarea>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={handleUpdate}
                                        className="flex-1 py-5 bg-gray-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-gray-200"
                                    >
                                        Save Workshop Notes
                                    </button>
                                    <button
                                        onClick={() => setShowSpareModal(true)}
                                        className="px-8 py-5 border-2 border-orange-100 text-orange-600 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-orange-50 transition-all active:scale-95"
                                    >
                                        Request Spares
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Spare Parts Section */}
                        <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                <SafeIcon name="Package" className="text-blue-600" /> Requested Spare Parts
                            </h3>
                            {complaint.requestedSpares?.length > 0 ? (
                                <div className="space-y-4">
                                    {complaint.requestedSpares.map((spare, idx) => (
                                        <div key={idx} className="p-6 bg-gray-50 rounded-3xl flex items-center justify-between group hover:bg-blue-50/50 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                                                    <SafeIcon name="Wrench" size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900">{spare.partName}</h4>
                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-tight">Quantity: {spare.quantity}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getSpareStatusColor(spare.status)}`}>
                                                    {spare.status}
                                                </span>
                                                <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-tight">{formatDate(spare.requestDate)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 border-2 border-dashed border-gray-100 rounded-[40px] text-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                        <SafeIcon name="PackageOpen" size={32} />
                                    </div>
                                    <p className="text-sm font-bold text-gray-400">No spare parts requested yet.</p>
                                    <button
                                        onClick={() => setShowSpareModal(true)}
                                        className="mt-4 text-xs font-black text-blue-600 uppercase tracking-widest hover:underline"
                                    >
                                        Request Now
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Recent Service History / Timeline */}
                        <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                <SafeIcon name="History" className="text-blue-600" /> Case Timeline
                            </h3>
                            <div className="space-y-8 relative">
                                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-50"></div>
                                <div className="flex gap-8 relative">
                                    <div className="w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center shrink-0 relative z-10 bg-blue-600 text-white">
                                        <div className="w-2 h-2 rounded-full bg-white"></div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">Complaint Registered</h4>
                                            <span className="text-[10px] font-bold text-gray-400">Customer</span>
                                        </div>
                                        <p className="text-xs text-blue-600 font-bold mt-1 tracking-tighter uppercase">{formatDate(complaint.createdAt)}</p>
                                    </div>
                                </div>
                                {complaint.assignedTechnician && (
                                    <div className="flex gap-8 relative">
                                        <div className="w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center shrink-0 relative z-10 bg-gray-100 text-gray-400">
                                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">Assigned to Technician</h4>
                                                <span className="text-[10px] font-bold text-gray-400">{complaint.assignedTechnician.fullName}</span>
                                            </div>
                                            <p className="text-xs text-blue-600 font-bold mt-1 tracking-tighter uppercase">{formatDate(complaint.updatedAt)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Sidebar Details */}
                    <div className="space-y-8">
                        {/* Device Info Card */}
                        <div className="bg-slate-900 p-10 rounded-[48px] text-white overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl -mr-16 -mt-16"></div>
                            <h3 className="text-lg font-black mb-10 flex items-center gap-3 relative z-10">
                                <SafeIcon name="Cpu" className="text-blue-400" /> System Specs
                            </h3>
                            <div className="space-y-8 relative z-10">
                                <div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 uppercase">Serial Number</p>
                                    <p className="text-xl font-black italic tracking-tight">{complaint.serialNumber}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1 uppercase">Warranty Plan</p>
                                        <p className="text-xs font-bold text-blue-400">{complaint.warranty?.planName || 'Standard Support'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1 uppercase">Diagnosis Date</p>
                                        <p className="text-xs font-bold text-white">{formatDate(complaint.diagnosisDate)}</p>
                                    </div>
                                </div>
                                <div className="pt-8 border-t border-white/10">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className={`text-[10px] font-black uppercase ${complaint.warranty?.status === 'Active' ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'} px-2 py-1 rounded`}>
                                            {complaint.warranty?.status || 'Active'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 font-medium">Expected coverage till {complaint.warranty ? formatDate(complaint.warranty.endDate) : 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Customer Overview */}
                        <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm group">
                            <h3 className="text-lg font-black text-gray-900 mb-8 flex items-center gap-3">
                                <SafeIcon name="User" className="text-blue-600 transition-transform group-hover:scale-110" /> Customer Info
                            </h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center text-xl font-black">
                                        {complaint.user?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-900 text-lg leading-tight">{complaint.user?.fullName || 'Anonymous User'}</h4>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-tight mt-1 italic">Vagwiin Member</p>
                                    </div>
                                </div>

                                <div className="space-y-4 text-sm font-medium">
                                    <div className="flex items-center gap-4 text-gray-600">
                                        <SafeIcon name="Mail" size={16} className="text-blue-500" />
                                        <span>{complaint.user?.email || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-600">
                                        <SafeIcon name="Phone" size={16} className="text-blue-500" />
                                        <span>{complaint.user?.phone || 'N/A'}</span>
                                    </div>
                                    <div className="flex gap-4 text-gray-600 leading-relaxed pt-2">
                                        <SafeIcon name="MapPin" size={16} className="text-blue-500 shrink-0 mt-1" />
                                        <span className="text-xs">{complaint.user?.address || 'No address provided'}</span>
                                    </div>
                                </div>

                                <button className="w-full mt-8 py-4 bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                                    Full Service History
                                </button>
                            </div>
                        </div>

                        {/* Fast Support Actions */}
                        <div className="bg-blue-600 p-8 rounded-[48px] text-white shadow-2xl shadow-blue-100">
                            <h4 className="text-md font-black mb-4 flex items-center gap-2">
                                <SafeIcon name="MessageSquare" size={18} /> Direct Support
                            </h4>
                            <p className="text-xs text-blue-100 font-medium leading-relaxed mb-6">Need to clarify something with the customer directly?</p>
                            <button className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl shadow-blue-800/20 active:scale-95">
                                Start Chat
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ComplaintDetail;
