import React, { useState, useEffect } from 'react';
import {
    ShieldCheck,
    Search,
    Calendar,
    Clock,
    CheckCircle2,
    AlertCircle,
    Package,
    User,
    ChevronLeft,
    Loader2
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import SidebarAdmin from '../../components/SidebarAdmin';
import warrantyService from '../../services/warrantyService';
import { formatDate } from '../../utils/dateUtils';
import WarrantyResult from '../../components/WarrantyResult';

const ActiveWarranties = () => {
    const [warranties, setWarranties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedWarranty, setSelectedWarranty] = useState(null);

    useEffect(() => {
        fetchWarranties();
    }, []);

    const fetchWarranties = async () => {
        try {
            setLoading(true);
            const data = await warrantyService.getAllWarranties();
            setWarranties(data);
        } catch (error) {
            console.error('Error fetching warranties:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredWarranties = warranties.filter(w =>
        w.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="h-screen bg-[#f8fbff] flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                <p className="text-gray-500 font-bold tracking-widest uppercase text-[10px] md:text-sm">Loading Warranties...</p>
            </div>
        );
    }

    return (
        <div className="h-screen bg-[#f8fbff] flex flex-col overflow-hidden font-sans">
            <div className="shrink-0">
                <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                <SidebarAdmin isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 md:mb-10">
                        <div>
                            <h1 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight">Active Warranties</h1>
                            <p className="text-xs md:text-sm text-gray-400 font-medium">Manage and track product warranties</p>
                        </div>

                        <div className="relative w-full lg:max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by Serial, Customer or Product..."
                                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-xs md:text-sm font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {selectedWarranty ? (
                            <div className="bg-white p-2 md:p-8 rounded-[48px] border border-gray-100 shadow-xl overflow-hidden">
                                <WarrantyResult
                                    data={selectedWarranty}
                                    onBack={() => setSelectedWarranty(null)}
                                    isAdmin={true}
                                />
                            </div>
                        ) : filteredWarranties.length > 0 ? (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-gray-50/50 text-[10px] text-gray-400 font-black uppercase tracking-widest border-b border-gray-50">
                                                <th className="px-6 py-4">Serial Number</th>
                                                <th className="px-6 py-4">Product</th>
                                                <th className="px-6 py-4">Customer</th>
                                                <th className="px-6 py-4">Warranty Plan</th>
                                                <th className="px-6 py-4">Coverage Period</th>
                                                <th className="px-6 py-4 text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {filteredWarranties.map((warranty) => (
                                                <tr
                                                    key={warranty._id}
                                                    className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                                                    onClick={() => setSelectedWarranty(warranty)}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                                <ShieldCheck size={18} />
                                                            </div>
                                                            <span className="font-black text-gray-900">{warranty.serialNumber}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <Package size={14} className="text-gray-400" />
                                                            <span className="text-sm font-bold text-gray-700 truncate max-w-[200px]">{warranty.product.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold text-gray-900">{warranty.user.fullName}</span>
                                                            <span className="text-[10px] text-gray-400 font-medium">{warranty.user.email}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg uppercase tracking-wider">
                                                            {warranty.planName}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] text-gray-400 font-black uppercase">Start</span>
                                                                <span className="text-xs font-bold text-gray-700">{formatDate(warranty.startDate)}</span>
                                                            </div>
                                                            <div className="w-4 h-px bg-gray-200"></div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] text-gray-400 font-black uppercase">End</span>
                                                                <span className="text-xs font-bold text-gray-700">{formatDate(warranty.endDate)}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${warranty.status === 'Active'
                                                            ? 'bg-green-50 text-green-700 border-green-100'
                                                            : 'bg-red-50 text-red-700 border-red-100'
                                                            }`}>
                                                            {warranty.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-[40px] border border-dashed border-gray-200 p-20 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                    <ShieldCheck size={40} className="text-gray-300" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 mb-2">No active warranties found</h3>
                                <p className="text-gray-400 text-sm max-w-sm font-medium">
                                    {searchTerm ? `No results for "${searchTerm}". Try a different search term.` : "When orders are marked as delivered, their warranties will appear here."}
                                </p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ActiveWarranties;
