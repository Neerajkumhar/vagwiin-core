import React, { useState, useEffect } from 'react';
import {
    Package,
    Search,
    ChevronRight,
    Clock,
    CheckCircle2,
    Truck,
    ArrowRight,
    Filter,
    Eye,
    ShoppingBag,
    Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import orderService from '../../services/orderService';
import authService from '../../services/authService';
import { formatDate } from '../../utils/dateUtils';

const MyOrders = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (!user) {
            navigate('/login');
            return;
        }
        fetchOrders();
    }, [navigate]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await orderService.getMyOrders();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Shipped': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Delivered': return 'bg-green-50 text-green-600 border-green-100';
            case 'Processing': return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    const filteredOrders = orders.filter(order =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8fbff] flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                <p className="text-gray-500 font-bold">Loading your orders...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fbff] flex flex-col font-sans">
            <Navbar />

            <main className="container mx-auto px-4 sm:px-6 py-8 md:py-12 max-w-5xl">
                {/* Header Area */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 md:mb-12">
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">My Orders</h1>
                        <p className="text-gray-500 font-medium mt-1 text-sm md:text-base">Track history and status of all your purchases.</p>
                    </div>

                    <div className="relative w-full lg:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search Order ID..."
                            className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-white border border-gray-100 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold shadow-sm outline-none focus:ring-4 focus:ring-blue-50 transition-all font-mono"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4 md:space-y-6">
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white rounded-[24px] md:rounded-[32px] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300"
                            >
                                <div className="p-5 md:p-8 flex flex-col md:flex-row items-center gap-5 md:gap-8">
                                    {/* Order Preview Image */}
                                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-50 rounded-xl md:rounded-2xl p-3 border border-gray-100 shrink-0 group-hover:scale-105 transition-transform">
                                        <img
                                            src={order.items[0]?.image || ''}
                                            alt="order-preview"
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                e.target.src = 'https://placehold.co/600x400?text=Product';
                                            }}
                                        />
                                    </div>

                                    {/* Order Core Info */}
                                    <div className="flex-1 text-center md:text-left space-y-2 w-full min-w-0">
                                        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 md:gap-3">
                                            <span className="text-base md:text-lg font-black text-gray-900 truncate w-full sm:w-auto font-mono">{order._id}</span>
                                            <span className={`px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-wider border whitespace-nowrap ${getStatusStyle(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-center md:justify-start gap-3 md:gap-4 text-[10px] md:text-sm text-gray-400 font-bold italic">
                                            <span className="flex items-center gap-1.5"><Clock size={12} md:size={14} /> {formatDate(order.createdAt)}</span>
                                            <span className="flex items-center gap-1.5"><Package size={12} md:size={14} /> {order.items.length} Items</span>
                                        </div>
                                    </div>

                                    {/* Price and Action */}
                                    <div className="w-full md:w-auto flex flex-row md:flex-col items-center justify-between md:justify-end gap-4 md:gap-4 md:min-w-[150px] border-t md:border-none pt-4 md:pt-0">
                                        <div className="text-left md:text-right">
                                            <p className="text-[8px] md:text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5 md:mb-1">Total Amount</p>
                                            <p className="text-lg md:text-2xl font-black text-blue-600 font-mono">₹{order.totalPrice.toLocaleString()}</p>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/my-order/${order._id}`)}
                                            className="px-6 py-2.5 md:py-3 bg-gray-900 text-white rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 transition-all active:scale-95 shrink-0"
                                        >
                                            <Eye size={14} /> <span className="hidden sm:inline">Order</span> Details
                                        </button>
                                    </div>
                                </div>

                                {/* Bottom Status Progress Line (Minimalist) */}
                                <div className="px-5 md:px-8 pb-5 md:pb-6">
                                    <div className="h-1 md:h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-1000 ${order.status === 'Delivered' ? 'w-full bg-green-500' :
                                            order.status === 'Shipped' ? 'w-2/3 bg-blue-500' :
                                                order.status === 'Cancelled' ? 'w-full bg-red-500' : 'w-1/3 bg-orange-500'
                                            }`}></div>
                                    </div>
                                    <div className="flex justify-between mt-2 md:mt-3 text-[8px] md:text-[10px] font-black text-gray-300 uppercase tracking-tighter">
                                        <span className={order.status === 'Processing' ? 'text-orange-500' : ''}>Processing</span>
                                        <span className={order.status === 'Shipped' ? 'text-blue-500' : ''}>Shipped</span>
                                        <span className={order.status === 'Delivered' ? 'text-green-500' : ''}>Delivered</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16 md:py-20 bg-white rounded-[32px] md:rounded-[40px] border border-gray-50 shadow-sm px-6">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShoppingBag size={28} md:size={32} className="text-blue-600" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-2">No orders found</h3>
                            <p className="text-sm md:text-base text-gray-400 font-medium mb-8">You haven't placed any orders yet.</p>
                            <Link to="/shop" className="inline-block px-8 py-3.5 md:py-4 bg-blue-600 text-white rounded-xl md:rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 uppercase tracking-widest text-[10px] md:text-xs">
                                Start Shopping
                            </Link>
                        </div>
                    )}
                </div>

                {/* Support Card */}
                <div className="mt-12 md:mt-16 bg-slate-900 rounded-[32px] md:rounded-[40px] p-8 md:p-10 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-3xl -mr-32 -mt-32"></div>
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 relative z-10">
                        <div className="text-center lg:text-left">
                            <h3 className="text-xl md:text-2xl font-black mb-2">Need help with an order?</h3>
                            <p className="text-sm md:text-base text-gray-400 font-medium">Our support team is available to assist with your purchases.</p>
                        </div>
                        <button className="w-full lg:w-auto px-8 md:px-10 py-3.5 md:py-4 bg-white text-slate-900 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-blue-50 transition-all active:scale-95 whitespace-nowrap">
                            Contact Support
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MyOrders;
