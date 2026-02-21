import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Package,
    Search,
    Plus,
    Filter,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Eye,
    Edit3,
    Trash2,
    Clock,
    XCircle,
    Truck,
    Download,
    Calendar,
    Loader2,
    RefreshCw
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import SidebarAdmin from '../../components/SidebarAdmin';
import orderService from '../../services/orderService';
import { formatDate } from '../../utils/dateUtils';

const Orders = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        processing: 0,
        shipped: 0,
        cancelled: 0
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await orderService.getAllOrders();
            const activeOrders = data.filter(o => o.status !== 'Delivered');
            setOrders(activeOrders);
            calculateStats(activeOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (data) => {
        const stats = {
            total: data.length,
            processing: data.filter(o => o.status === 'Processing').length,
            shipped: data.filter(o => o.status === 'Shipped').length,
            cancelled: data.filter(o => o.status === 'Cancelled').length
        };
        setStats(stats);
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await orderService.updateOrderStatus(id, newStatus);
            fetchOrders(); // Refresh list
        } catch (error) {
            console.error('Error updating status:', error);
            const message = error.response?.data?.message || 'Failed to update status';
            alert(message);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Shipped': return 'bg-green-100 text-green-700 border-green-200';
            case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Delivered': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const filteredOrders = orders.filter(order =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.user && order.user.fullName && order.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const orderStatsItems = [
        { label: 'Total Orders', value: stats.total, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Processing', value: stats.processing, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Shipped', value: stats.shipped, icon: Truck, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Cancelled', value: stats.cancelled, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
    ];

    return (
        <div className="h-screen bg-[#f8fbff] flex flex-col overflow-hidden font-sans">
            <div className="shrink-0">
                <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                <SidebarAdmin isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
                        <div>
                            <h1 className="text-xl md:text-3xl font-black text-gray-900 mb-1 tracking-tight">Order Management</h1>
                            <p className="text-xs md:text-sm text-gray-500 font-medium">Manage and track all customer orders from the database.</p>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3">
                            <button
                                onClick={fetchOrders}
                                className="p-2 md:p-3 bg-white border border-gray-100 rounded-xl md:rounded-2xl text-gray-600 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                                title="Refresh Data"
                            >
                                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                            </button>
                            <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-100 rounded-xl md:rounded-2xl text-gray-600 font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95">
                                <Download size={16} /> Export
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
                        {orderStatsItems.map((stat, i) => (
                            <div key={i} className="bg-white p-4 md:p-5 rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                                    <div className={`w-10 h-10 md:w-14 md:h-14 ${stat.bg} ${stat.color} rounded-xl md:rounded-2xl flex items-center justify-center shrink-0`}>
                                        <stat.icon size={20} className="md:w-6 md:h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5 md:mb-1">{stat.label}</p>
                                        <p className="text-sm md:text-xl font-black text-gray-900">{stat.value}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Filters & Search */}
                    <div className="bg-white p-2 md:p-3 rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm mb-6 flex flex-col lg:flex-row gap-2 md:gap-3 items-center justify-between">
                        <div className="relative w-full lg:max-w-md">
                            <input
                                type="text"
                                placeholder="Search by Order ID or Client Name..."
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl md:rounded-2xl text-xs md:text-sm font-bold text-gray-700 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        </div>
                        <div className="flex items-center gap-2 w-full lg:w-auto">
                            <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 text-gray-600 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-all">
                                <Calendar size={14} /> Date Range
                            </button>
                            <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 text-gray-600 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-all">
                                <Filter size={14} /> Filter
                            </button>
                        </div>
                    </div>

                    {/* Orders Table */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32">
                                <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                                <p className="text-gray-400 font-bold">Synchronizing with database...</p>
                            </div>
                        ) : filteredOrders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-32">
                                <p className="text-gray-400 font-bold">No orders found.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50/50">
                                        <tr className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                                            <th className="px-6 py-4">Order ID</th>
                                            <th className="px-4 py-4">Client</th>
                                            <th className="px-4 py-4">Total Items</th>
                                            <th className="px-4 py-4">Date</th>
                                            <th className="px-4 py-4 text-right">Amount</th>
                                            <th className="px-4 py-4 text-center">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredOrders.map((order) => (
                                            <tr key={order._id} className="hover:bg-gray-50/30 transition-colors group">
                                                <td className="px-6 py-4 text-sm font-black text-blue-600">#{order._id.slice(-8).toUpperCase()}</td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                                            {order.shippingAddress.fullName ? order.shippingAddress.fullName.split(' ').map(n => n[0]).join('') : 'U'}
                                                        </div>
                                                        <span className="text-sm font-bold text-gray-700">
                                                            {order.shippingAddress.fullName || 'Anonymous'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className="text-sm font-medium text-gray-600">{order.items.length} Product(s)</span>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-400 font-medium">{formatDate(order.createdAt)}</span>
                                                </td>
                                                <td className="px-4 py-4 text-right whitespace-nowrap">
                                                    <span className="text-sm font-black text-gray-900">₹{order.totalPrice.toLocaleString()}</span>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{order.paymentMethod}</p>
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border cursor-pointer outline-none focus:ring-2 focus:ring-blue-100 ${getStatusStyle(order.status)}`}
                                                    >
                                                        <option value="Processing">Processing</option>
                                                        <option value="Shipped">Shipped</option>
                                                        <option value="Delivered">Delivered</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => navigate(`/order/${order._id}`)}
                                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                            title="View Invoice/Details"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Archive">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination (Visual only for now) */}
                        {!loading && orders.length > 0 && (
                            <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                                <p className="text-sm text-gray-400 font-medium">Showing {filteredOrders.length} of {orders.length} results</p>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 border border-gray-200 rounded-xl text-gray-400 hover:bg-white transition-all">
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100">1</button>
                                    <button className="p-2 border border-gray-200 rounded-xl text-gray-400 hover:bg-white transition-all">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Orders;
