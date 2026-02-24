import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ChevronLeft,
    Package,
    Truck,
    MapPin,
    CreditCard,
    Calendar,
    Mail,
    Phone,
    Printer,
    Clock,
    CheckCircle2,
    Loader2,
    Trash2
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import SidebarAdmin from '../../components/SidebarAdmin';
import orderService from '../../services/orderService';
import { useSettings } from '../../context/SettingsContext';
import { formatDate } from '../../utils/dateUtils';

const OrderDetail = () => {
    const { settings, currencySymbol } = useSettings();
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [itemSerials, setItemSerials] = useState({});
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const data = await orderService.getOrderDetails(id);
            setOrder(data);

            const initialSerials = {};
            data.items.forEach(item => {
                // Pre-fill with existing serials or empty strings based on quantity
                const existing = item.serialNumbers || [];
                initialSerials[item._id] = Array.from({ length: item.quantity }, (_, i) => existing[i] || '');
            });
            setItemSerials(initialSerials);
        } catch (error) {
            console.error('Error fetching order details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSerial = async () => {
        // Validation: Ensure all serials are filled
        for (const item of order.items) {
            const serials = itemSerials[item._id];
            if (!serials || serials.some(s => !s.trim())) {
                alert(`Please enter model numbers for all units of ${item.name}`);
                return;
            }
        }

        try {
            setUpdating(true);
            await orderService.updateOrderSerialNumber(id, itemSerials);
            await fetchOrderDetails();
            alert('Model numbers updated and order marked as Shipped');
        } catch (error) {
            console.error('Error updating serial numbers:', error);
            alert(error.response?.data?.message || 'Failed to update model numbers');
        } finally {
            setUpdating(false);
        }
    };

    const handleSerialChange = (itemId, index, value) => {
        setItemSerials(prev => ({
            ...prev,
            [itemId]: prev[itemId].map((sn, i) => i === index ? value : sn)
        }));
    };

    const handleUpdateStatus = async (newStatus) => {
        try {
            setUpdating(true);
            await orderService.updateOrderStatus(id, newStatus);
            await fetchOrderDetails();
            alert(`Order marked as ${newStatus}`);
        } catch (error) {
            console.error('Error updating status:', error);
            alert(error.response?.data?.message || 'Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteOrder = async () => {
        if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
            try {
                setUpdating(true);
                await orderService.deleteOrder(id);
                navigate('/orders');
            } catch (error) {
                console.error('Error deleting order:', error);
                const message = error.response?.data?.message || 'Failed to delete order';
                alert(message);
            } finally {
                setUpdating(false);
            }
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

    if (loading) {
        return (
            <div className="h-screen bg-[#f8fbff] flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                <p className="text-gray-400 font-bold tracking-widest uppercase text-[10px] md:text-xs italic">Retrieving Order Data...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="h-screen bg-[#f8fbff] flex flex-col items-center justify-center p-6 text-center">
                <p className="text-gray-500 font-bold text-xl mb-4">Order not found</p>
                <Link to="/orders" className="text-blue-600 font-bold hover:underline flex items-center gap-2">
                    <ChevronLeft size={20} /> Back to Orders
                </Link>
            </div>
        );
    }

    return (
        <div className="h-screen bg-[#f8fbff] flex flex-col overflow-hidden font-sans">
            {/* Minimal Print Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    body { background: white !important; font-family: 'Inter', sans-serif !important; }
                    .no-print { display: none !important; }
                    #print-section { display: block !important; visibility: visible !important; }
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    @page { margin: 20mm; }
                }
                #print-section { display: none; }
            `}} />

            <div className="shrink-0 no-print">
                <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                <div className="no-print">
                    <SidebarAdmin isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                </div>

                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 no-print">
                    {/* Header with Navigation */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 md:mb-10">
                        <div>
                            <Link to="/orders" className="flex items-center gap-2 text-blue-600 font-black text-[10px] md:text-sm mb-2 md:mb-4 hover:underline uppercase tracking-widest">
                                <ChevronLeft size={16} /> Back to Orders
                            </Link>
                            <div className="flex flex-wrap items-center gap-3 md:gap-4">
                                <h1 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight">Order #{order._id.slice(-8).toUpperCase()}</h1>
                                <span className={`px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                            <p className="text-[10px] md:text-xs text-gray-400 font-bold mt-1.5 flex items-center gap-2 uppercase tracking-wide">
                                <Calendar size={14} /> Placed on {formatDate(order.createdAt)}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3">
                            <button
                                onClick={handleDeleteOrder}
                                disabled={updating}
                                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-red-100 text-red-600 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-red-50 transition-all active:scale-95"
                            >
                                <Trash2 size={18} /> Delete Record
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95"
                            >
                                <Printer size={18} /> Print Invoice
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Right Content: Order Items & Summary */}
                        <div className="xl:col-span-2 space-y-8">
                            {/* Items Card */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-2 font-sans">
                                        <Package size={20} className="text-blue-600" /> Order Items
                                    </h3>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{order.items.length} Products</span>
                                </div>
                                <div className="divide-y divide-gray-50">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="p-6 flex items-center gap-4 group">
                                            <div className="w-16 h-16 bg-gray-50 rounded-2xl p-2 border border-gray-100 shrink-0 group-hover:scale-105 transition-transform">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-md font-black text-gray-900 mb-1 leading-tight">{item.name}</h4>
                                                <p className="text-xs text-gray-400 font-medium uppercase tracking-tighter">Certified Refurbished</p>
                                            </div>
                                            <div className="text-right whitespace-nowrap">
                                                <p className="text-sm font-black text-gray-900 mb-1">{currencySymbol}{item.price.toLocaleString()} x {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-gray-50/50 px-6 py-6 flex justify-end border-t border-gray-50 font-sans">
                                    <div className="w-full max-w-xs space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                                            <span className="text-gray-700 font-black">{currencySymbol}{order.subtotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Shipping</span>
                                            <span className="text-green-500 font-black">FREE</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">GST (18%)</span>
                                            <span className="text-gray-700 font-black">{currencySymbol}{order.taxPrice.toLocaleString()}</span>
                                        </div>
                                        <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                                            <span className="text-lg font-black text-gray-900 uppercase tracking-tighter">Total Payable</span>
                                            <span className="text-2xl font-black text-blue-600">{currencySymbol}{order.totalPrice.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                                        <Truck size={20} className="text-blue-600" /> Delivery Details
                                    </h3>
                                    <div className="space-y-6">
                                        <div className="flex gap-4 font-sans text-xs">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                                                <MapPin size={18} className="text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Dest Address</p>
                                                <p className="text-sm font-bold text-gray-700 leading-relaxed font-sans">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm font-sans">
                                    <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                                        <CreditCard size={20} className="text-blue-600" /> Payment Info
                                    </h3>
                                    <div className="space-y-6">
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                                                <CreditCard size={18} className="text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Method</p>
                                                <p className="text-sm font-black text-gray-700 uppercase">{order.paymentMethod}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer & Tracking */}
                        <div className="space-y-6 font-sans">
                            <div className="bg-slate-900 p-6 rounded-2xl text-white overflow-hidden relative group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-600/30 transition-all duration-700"></div>
                                <h3 className="text-sm font-black mb-6 relative z-10 uppercase tracking-widest text-blue-400">Customer Profile</h3>
                                <div className="space-y-6 relative z-10 font-sans">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-xl font-black">
                                            {order.shippingAddress.fullName.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-lg leading-tight">{order.shippingAddress.fullName}</h4>
                                            <p className="text-[10px] text-blue-400 font-bold uppercase mt-1 italic tracking-widest">Verified Buyer</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4 pt-4 border-t border-white/10 text-xs">
                                        <div className="flex items-center gap-3">
                                            <Mail size={16} className="text-gray-500" />
                                            <span className="font-bold text-gray-300">{order.shippingAddress.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone size={16} className="text-gray-500" />
                                            <span className="font-bold text-gray-300">{order.shippingAddress.phone}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm font-sans">
                                <h3 className="text-lg font-black text-gray-900 mb-8 flex items-center gap-2">
                                    <Clock size={20} className="text-blue-600" /> Order History
                                </h3>
                                <div className="space-y-8 relative">
                                    <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-100"></div>

                                    {order.status === 'Delivered' && (
                                        <div className="flex gap-6 relative">
                                            <div className="w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shrink-0 shadow-sm relative z-10 bg-green-600 text-white">
                                                <CheckCircle2 size={14} strokeWidth={3} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-gray-900">Delivered</h4>
                                                <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-tighter">Package Handed Over</p>
                                            </div>
                                        </div>
                                    )}

                                    {(order.status === 'Shipped' || order.status === 'Delivered') && (
                                        <div className="flex gap-6 relative">
                                            <div className="w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shrink-0 shadow-sm relative z-10 bg-blue-600 text-white">
                                                <Truck size={14} strokeWidth={3} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-gray-900">Shipped</h4>
                                                <div className="mt-1 flex flex-wrap gap-1">
                                                    {order.items.flatMap(item => item.serialNumbers || []).map((sn, sIdx) => (
                                                        <span key={sIdx} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[8px] font-black uppercase tracking-tighter">
                                                            {sn}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-6 relative">
                                        <div className="w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shrink-0 shadow-sm relative z-10 bg-slate-400 text-white">
                                            <Package size={14} strokeWidth={3} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-gray-900">Order Placed</h4>
                                            <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-tighter">{formatDate(order.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Admin Actions */}
                                <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
                                    {order.status === 'Processing' && (
                                        <div className="space-y-6">
                                            {order.items.map((item) => (
                                                <div key={item._id} className="space-y-3">
                                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{item.name}</p>
                                                    <div className="space-y-2">
                                                        {itemSerials[item._id]?.map((sn, idx) => (
                                                            <div key={idx} className="relative">
                                                                <label className="absolute left-4 top-2 text-[8px] font-black text-gray-400 uppercase">Unit {idx + 1}</label>
                                                                <input
                                                                    type="text"
                                                                    value={sn}
                                                                    onChange={(e) => handleSerialChange(item._id, idx, e.target.value)}
                                                                    placeholder={`Enter Model Number for Unit ${idx + 1}`}
                                                                    className="w-full px-4 pt-6 pb-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                onClick={handleUpdateSerial}
                                                disabled={updating}
                                                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                                            >
                                                {updating ? 'Processing...' : 'Verify & Ship Order'}
                                            </button>
                                        </div>
                                    )}

                                    {order.status === 'Shipped' && (
                                        <button
                                            onClick={() => handleUpdateStatus('Delivered')}
                                            disabled={updating}
                                            className="w-full py-4 bg-green-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-200 disabled:opacity-50"
                                        >
                                            {updating ? 'Processing...' : 'Mark as Delivered'}
                                        </button>
                                    )}

                                    {order.status === 'Delivered' && (
                                        <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-3">
                                            <CheckCircle2 className="text-green-600" size={20} />
                                            <div className="text-xs font-bold text-green-700">
                                                Warranty Active (6 Months)
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* THE ACTUAL SIMPLE PRINT INVOICE SECTION (ONLY VISIBLE ON PRINT) */}
            <div id="print-section" className="p-10 text-slate-900 font-sans">
                <div className="flex justify-between items-start mb-10 pb-6 border-b border-gray-200">
                    <div>
                        <img src="/img/logo.png" alt="Logo" className="h-12 w-auto mb-2" />
                        <h1 className="text-xl font-black uppercase tracking-tighter">{settings.siteName}</h1>
                        <p className="text-[10px] text-gray-500 font-bold">Premium Refurbished Electronics</p>
                    </div>
                    <div className="text-right whitespace-nowrap">
                        <h2 className="text-2xl font-black text-gray-900">INVOICE</h2>
                        <p className="text-sm font-bold text-gray-500">#{order._id}</p>
                        <p className="text-sm font-bold text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-10 mb-10 font-sans">
                    <div>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">BILL TO</h4>
                        <p className="text-sm font-black text-gray-900">{order.shippingAddress.fullName}</p>
                        <p className="text-[11px] text-gray-600 leading-normal">
                            {order.shippingAddress.address}<br />
                            {order.shippingAddress.city}<br />
                            Phone: {order.shippingAddress.phone}
                        </p>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">AUTHORIZED SELLER</h4>
                        <p className="text-sm font-black text-gray-900">{settings.siteName} Core Pvt Ltd.</p>
                        <p className="text-[11px] text-gray-600 leading-normal">
                            {settings.address}<br />
                            Email: {settings.contactEmail}
                        </p>
                    </div>
                </div>

                <table className="w-full border-collapse mb-10 font-sans">
                    <thead>
                        <tr className="border-b-2 border-slate-900">
                            <th className="py-3 text-left text-[11px] font-black uppercase tracking-wider">Item Description</th>
                            <th className="py-3 text-center text-[11px] font-black uppercase tracking-wider w-16">Qty</th>
                            <th className="py-3 text-right text-[11px] font-black uppercase tracking-wider w-24">Price</th>
                            <th className="py-3 text-right text-[11px] font-black uppercase tracking-wider w-24">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {order.items.map((item, idx) => (
                            <tr key={idx}>
                                <td className="py-4">
                                    <p className="font-black text-gray-900 text-xs">{item.name}</p>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Certified Refurbished</p>
                                    {item.serialNumbers?.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {item.serialNumbers.map((sn, sIdx) => (
                                                <span key={sIdx} className="px-1.5 py-0.5 bg-gray-50 border border-gray-100 rounded text-[7px] font-black text-gray-600 uppercase">
                                                    SN: {sn}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </td>
                                <td className="py-4 text-center text-xs font-bold text-gray-600">{item.quantity}</td>
                                <td className="py-4 text-right text-xs font-bold text-gray-600">{currencySymbol}{item.price.toLocaleString()} x {item.quantity}</td>
                                <td className="py-4 text-right text-xs font-black text-gray-900">{currencySymbol}{(item.price * item.quantity).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-end pt-6 border-t border-gray-100 font-sans">
                    <div className="w-64 space-y-2">
                        <div className="flex justify-between text-xs font-bold text-gray-500 uppercase">
                            <span>Subtotal</span>
                            <span className="text-gray-900">{currencySymbol}{order.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-gray-500 uppercase pb-4">
                            <span>Tax (GST 18%)</span>
                            <span className="text-gray-900">{currencySymbol}{order.taxPrice.toLocaleString()}</span>
                        </div>
                        <div className="pt-4 border-t-2 border-slate-900 flex justify-between items-center">
                            <span className="text-sm font-black uppercase">Grand Total</span>
                            <span className="text-2xl font-black text-slate-900">{currencySymbol}{order.totalPrice.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-20 pt-10 border-t border-gray-100 text-center font-sans">
                    <p className="text-[10px] text-gray-400 font-bold italic underline">Computer Generated Invoice - No Signature Required</p>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
