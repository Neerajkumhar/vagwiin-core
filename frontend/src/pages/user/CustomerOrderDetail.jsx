import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Package,
    Printer,
    MapPin,
    CreditCard,
    Calendar,
    Clock,
    Loader2,
    RefreshCcw
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import orderService from '../../services/orderService';
import authService from '../../services/authService';
import { formatDate } from '../../utils/dateUtils';

const CustomerOrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (!user) {
            navigate('/login');
            return;
        }
        fetchOrderDetails();
    }, [id, navigate]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const data = await orderService.getOrderDetails(id);
            setOrder(data);
        } catch (error) {
            console.error('Error fetching order details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                <p className="text-gray-500 font-medium">Loading order...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                <p className="text-gray-500 font-bold text-xl mb-4">Order not found</p>
                <Link to="/my-orders" className="text-blue-600 font-bold hover:underline flex items-center gap-2">
                    <ChevronLeft size={20} /> Back to My Orders
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fbff] flex flex-col font-sans">
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

            <div className="no-print">
                <Navbar />
            </div>

            <main className="container mx-auto px-4 sm:px-6 py-6 md:py-10 max-w-5xl no-print">
                <Link to="/my-orders" className="flex items-center gap-2 text-blue-600 font-bold text-xs md:text-sm mb-6 hover:underline w-fit">
                    <ChevronLeft size={14} md:size={16} /> Back to My Orders
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-8">
                    <div className="text-center md:text-left">
                        <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight font-mono">Order #{order._id}</h1>
                        <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                {order.status}
                            </span>
                            <p className="text-gray-400 text-xs md:text-sm font-medium flex items-center gap-1">
                                <Calendar size={14} /> {formatDate(order.createdAt)}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => window.print()}
                        className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 bg-slate-900 text-white rounded-xl md:rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95 text-xs md:text-sm"
                    >
                        <Printer size={16} md:size={18} /> Print Invoice
                    </button>
                </div>

                {/* Allocated Model Number Section */}
                {order.items.some(i => i.serialNumbers?.length > 0) && (
                    <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl border border-blue-100 shadow-sm mb-8 group hover:border-blue-200 transition-colors animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 rounded-xl md:rounded-2xl flex items-center justify-center text-blue-600">
                                <Package size={20} md:size={24} />
                            </div>
                            <div>
                                <h3 className="text-[8px] md:text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-0.5 md:mb-1">Allocated Model Numbers</h3>
                                <p className="text-[10px] md:text-xs font-bold text-gray-500 italic">Unique identifiers for your hardware units</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                            {order.items.map(item => (
                                item.serialNumbers?.map((sn, idx) => (
                                    <div key={`${item._id}-${idx}`} className="bg-gray-50 p-4 rounded-xl md:rounded-2xl border border-gray-100 flex flex-col gap-1 hover:bg-white transition-colors">
                                        <span className="text-[7px] md:text-[8px] font-black text-gray-400 uppercase tracking-widest">{item.name} (Unit {idx + 1})</span>
                                        <span className="text-xs md:text-sm font-black text-gray-900 tracking-tight uppercase font-mono">{sn}</span>
                                    </div>
                                ))
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Left: Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-[24px] md:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                                <h3 className="text-xs md:text-sm font-black text-gray-900 flex items-center gap-2">
                                    <Package size={14} md:size={16} className="text-blue-600" /> Order Items
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="p-4 md:p-6 flex flex-row items-center gap-4 md:gap-6">
                                        <div className="w-14 h-14 md:w-16 md:h-16 bg-gray-50 rounded-xl md:rounded-2xl p-2 border border-gray-100 shrink-0 flex items-center justify-center">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-900 text-xs md:text-sm leading-tight truncate">{item.name}</h4>
                                            <p className="text-[10px] md:text-xs text-gray-400 font-bold mt-1">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="font-black text-gray-900 text-xs md:text-sm whitespace-nowrap font-mono">₹{item.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Summary */}
                    <div className="space-y-6">
                        <div className="bg-white p-5 md:p-6 rounded-[24px] md:rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="text-xs md:text-sm font-black text-gray-900 mb-6 flex items-center gap-2">
                                <CreditCard size={14} md:size={16} className="text-blue-600" /> Summary
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900 font-mono">₹{order.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                    <span>Tax (GST 18%)</span>
                                    <span className="text-gray-900 font-mono">₹{order.taxPrice.toLocaleString()}</span>
                                </div>
                                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-xs md:text-sm font-black uppercase">Grand Total</span>
                                    <span className="text-lg md:text-xl font-black text-blue-600 font-mono">₹{order.totalPrice.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-5 md:p-6 rounded-[24px] md:rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="text-xs md:text-sm font-black text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin size={14} md:size={16} className="text-blue-600" /> Shipping
                            </h3>
                            <div className="text-[11px] md:text-xs font-medium text-gray-600 space-y-1">
                                <p className="font-black text-gray-900 text-xs md:text-sm mb-1">{order.shippingAddress.fullName}</p>
                                <p className="leading-relaxed">{order.shippingAddress.address}</p>
                                <p>{order.shippingAddress.city}</p>
                                <p className="pt-2 font-black text-gray-400 border-t border-gray-50 mt-2">T: {order.shippingAddress.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* THE ACTUAL SIMPLE PRINT INVOICE SECTION (ONLY VISIBLE ON PRINT) */}
            <div id="print-section" className="p-10 text-slate-900">
                <div className="flex justify-between items-start mb-10 pb-6 border-b border-gray-200">
                    <div>
                        <img src="/img/logo.png" alt="Logo" className="h-12 w-auto mb-2" />
                        <h1 className="text-xl font-black uppercase tracking-tighter">Vagwiin Core</h1>
                        <p className="text-[10px] text-gray-500 font-bold">Premium Refurbished Electronics</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-black text-gray-900">INVOICE</h2>
                        <p className="text-sm font-bold text-gray-500">#{order._id}</p>
                        <p className="text-sm font-bold text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-10 mb-10">
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
                        <p className="text-sm font-black text-gray-900">Vagwiin Core Pvt Ltd.</p>
                        <p className="text-[11px] text-gray-600 leading-normal">
                            Sector 45, Gurgaon, Haryana, 122003<br />
                            GST: 06ABCDE1234F1Z5<br />
                            Email: support@vagwiin.com
                        </p>
                    </div>
                </div>

                <table className="w-full border-collapse mb-10">
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
                                <td className="py-4 text-right text-xs font-bold text-gray-600">₹{item.price.toLocaleString()} x {item.quantity}</td>
                                <td className="py-4 text-right text-xs font-black text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-end pt-6 border-t border-gray-100">
                    <div className="w-64 space-y-2">
                        <div className="flex justify-between text-xs font-bold text-gray-500 uppercase">
                            <span>Subtotal</span>
                            <span className="text-gray-900">₹{order.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-gray-500 uppercase pb-4">
                            <span>Tax (GST 18%)</span>
                            <span className="text-gray-900">₹{order.taxPrice.toLocaleString()}</span>
                        </div>
                        <div className="pt-4 border-t-2 border-slate-900 flex justify-between items-center">
                            <span className="text-sm font-black uppercase">Grand Total</span>
                            <span className="text-2xl font-black text-slate-900">₹{order.totalPrice.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-20 pt-10 border-t border-gray-100 text-center">
                    <p className="text-[10px] text-gray-400 font-bold italic underline">Computer Generated Invoice - No Signature Required</p>
                </div>
            </div>
        </div>
    );
};

export default CustomerOrderDetail;
