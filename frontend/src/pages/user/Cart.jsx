import React, { useState, useEffect } from 'react';
import {
    Trash2,
    Minus,
    Plus,
    ArrowRight,
    ShoppingBag,
    ShieldCheck,
    Truck,
    RefreshCcw,
    Tag,
    Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useCart } from '../../context/CartContext';

const Cart = () => {
    const navigate = useNavigate();
    const { cart, loading, updateQuantity, removeFromCart } = useCart();
    const cartItems = cart?.items || [];

    const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const shipping = 0; // Free shipping
    const gst = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + gst;

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fcfdff] flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                    <p className="text-gray-500 font-bold">Loading your cart...</p>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-[#f8fbff] flex flex-col">
                <Navbar />
                <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                        <ShoppingBag size={48} className="text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 font-medium mb-8">Looks like you haven't added anything to your cart yet.</p>
                    <Link to="/" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2">
                        Start Shopping <ArrowRight size={18} />
                    </Link>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fbff] flex flex-col font-sans">
            <Navbar />

            <main className="container mx-auto px-4 sm:px-6 py-8 md:py-12 max-w-7xl">
                <div className="flex flex-col gap-1 md:gap-2 mb-8 md:mb-10">
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">Shopping Cart</h1>
                    <p className="text-xs md:text-sm text-gray-500 font-medium flex items-center gap-2">
                        You have <span className="text-blue-600 font-bold">{cartItems.length} items</span> in your selection.
                    </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 md:gap-10">
                    {/* Items List */}
                    <div className="xl:col-span-2 space-y-4 md:space-y-6">
                        {cartItems.map((item) => (
                            <div key={item._id} className="bg-white p-4 sm:p-6 rounded-[24px] md:rounded-[32px] border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-4 sm:gap-8 group hover:shadow-md transition-all duration-300 relative">
                                {/* Product Image */}
                                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-2xl p-3 border border-gray-100 shrink-0 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                                    <img
                                        src={(item.product?.images && item.product.images[0] && item.product.images[0] !== "") ? item.product.images[0] : 'https://placehold.co/600x400?text=No+Image'}
                                        alt={item.product?.name || 'Product'}
                                        className="w-full h-full object-contain"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1 text-center sm:text-left min-w-0">
                                    <h3 className="text-lg md:text-xl font-black text-gray-900 mb-1 leading-tight truncate">{item.product.name}</h3>
                                    <p className="text-[10px] md:text-sm text-gray-400 font-medium mb-3 truncate">{item.product.cpu} / {item.product.ram} / {item.product.storage}</p>
                                    <div className="flex items-center justify-center sm:justify-start gap-2 md:gap-4">
                                        <div className="bg-green-50 text-green-600 px-2 py-0.5 md:px-3 md:py-1 rounded-lg text-[8px] md:text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                            <ShieldCheck size={10} /> Certified
                                        </div>
                                        <div className="bg-blue-50 text-blue-600 px-2 py-0.5 md:px-3 md:py-1 rounded-lg text-[8px] md:text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                            <RefreshCcw size={10} /> Grade {item.product.grade}
                                        </div>
                                    </div>
                                </div>

                                {/* Controls Wrapper on Mobile */}
                                <div className="w-full sm:w-auto flex flex-row sm:flex-col items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0">
                                    {/* Quantity Selector */}
                                    <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl md:rounded-2xl border border-gray-100">
                                        <button
                                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-lg md:rounded-xl text-gray-500 hover:text-blue-600 shadow-sm transition-all active:scale-90"
                                        >
                                            <Minus size={14} md:size={18} />
                                        </button>
                                        <span className="w-8 md:w-10 text-center text-xs md:text-sm font-black text-gray-900">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-lg md:rounded-xl text-gray-500 hover:text-blue-600 shadow-sm transition-all active:scale-90"
                                        >
                                            <Plus size={14} md:size={18} />
                                        </button>
                                    </div>

                                    {/* Price & Remove */}
                                    <div className="flex flex-col items-end gap-1 md:gap-2">
                                        <div className="text-right">
                                            <p className="text-[8px] md:text-[10px] text-gray-400 font-black uppercase tracking-widest">₹{item.product.price.toLocaleString()}/unit</p>
                                            <p className="text-xl md:text-2xl font-black text-gray-900">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Absolute Remove Button on Mobile */}
                                <button
                                    onClick={() => removeFromCart(item.product._id)}
                                    className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 transition-colors sm:static sm:order-last"
                                >
                                    <Trash2 size={18} md:size={20} />
                                </button>
                            </div>
                        ))}

                        {/* Cart Benefits */}
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 pt-4 md:pt-6 font-sans">
                            {[
                                { icon: Truck, label: 'Free Shipping', desc: 'Secure Delivery', color: 'blue' },
                                { icon: ShieldCheck, label: 'Safe Checkout', desc: 'Secure Pay', color: 'green' },
                                { icon: RefreshCcw, label: '6mo Warranty', desc: 'Free Support', color: 'purple' }
                            ].map((benefit, i) => (
                                <div key={i} className={`flex items-center gap-2 md:gap-4 bg-white p-3 md:p-5 rounded-2xl border border-gray-50 ${i === 2 ? 'col-span-2 lg:col-span-1' : ''}`}>
                                    <div className={`w-10 h-10 md:w-12 md:h-12 bg-${benefit.color}-50 rounded-xl flex items-center justify-center shrink-0`}>
                                        <benefit.icon className={`text-${benefit.color}-600`} size={20} md:size={24} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs md:text-sm font-black text-gray-900 truncate">{benefit.label}</p>
                                        <p className="text-[8px] md:text-xs text-gray-400 font-medium truncate">{benefit.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 p-6 md:p-8 rounded-[32px] md:rounded-[40px] text-white overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-3xl -mr-32 -mt-32 group-hover:bg-blue-600/30 transition-all duration-1000"></div>

                            <h3 className="text-xl md:text-2xl font-black mb-6 md:mb-10 relative z-10">Order Summary</h3>

                            <div className="space-y-4 md:space-y-6 relative z-10">
                                <div className="flex justify-between items-center text-gray-400">
                                    <span className="font-bold uppercase tracking-widest text-[8px] md:text-[10px]">Subtotal</span>
                                    <span className="text-sm md:text-lg font-black text-white">₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-400">
                                    <span className="font-bold uppercase tracking-widest text-[8px] md:text-[10px]">Shipping</span>
                                    <span className="text-sm md:text-lg font-black text-green-400 font-mono tracking-widest">FREE</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-400">
                                    <span className="font-bold uppercase tracking-widest text-[8px] md:text-[10px]">GST (18%)</span>
                                    <span className="text-sm md:text-lg font-black text-white">₹{gst.toLocaleString()}</span>
                                </div>

                                <div className="pt-6 md:pt-8 border-t border-white/10 flex flex-col gap-2">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-base md:text-lg font-black uppercase tracking-tighter">Total</span>
                                        <span className="text-2xl md:text-3xl font-black text-blue-400 font-mono">₹{total.toLocaleString()}</span>
                                    </div>

                                    <button
                                        onClick={() => navigate('/checkout')}
                                        className="w-full py-4 md:py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-3 relative overflow-hidden group/btn active:scale-95"
                                    >
                                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                                        <span className="relative z-10 uppercase tracking-widest text-[10px] md:text-xs">Checkout Now</span>
                                        <ArrowRight size={18} md:size={20} className="relative z-10" />
                                    </button>

                                    <Link to="/shop" className="text-center text-gray-500 hover:text-white text-[10px] md:text-xs font-black uppercase tracking-widest transition-all mt-4 py-2 hover:bg-white/5 rounded-xl">
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Promo Code Card */}
                        <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-gray-100 shadow-sm relative group">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Have a Promo Code?</h4>
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="relative flex-1 min-w-0">
                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} md:size={16} />
                                    <input
                                        type="text"
                                        placeholder="ENTER CODE"
                                        className="w-full pl-10 md:pl-11 pr-4 py-2.5 md:py-3 bg-gray-50 border-none rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black placeholder:font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all font-mono"
                                    />
                                </div>
                                <button className="px-4 py-2.5 md:px-6 md:py-3 bg-gray-900 text-white text-[10px] md:text-xs font-black rounded-xl md:rounded-2xl hover:bg-black transition-all active:scale-95 shrink-0">
                                    APPLY
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main >
        </div >
    );
};

export default Cart;
