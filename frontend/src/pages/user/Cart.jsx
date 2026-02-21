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

            <main className="container mx-auto px-6 py-12 max-w-7xl">
                <div className="flex flex-col gap-2 mb-10">
                    <h1 className="text-4xl font-black text-gray-900 leading-tight">Shopping Cart</h1>
                    <p className="text-gray-500 font-medium flex items-center gap-2">
                        You have <span className="text-blue-600 font-bold">{cartItems.length} items</span> in your selection.
                    </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                    {/* Items List */}
                    <div className="xl:col-span-2 space-y-6">
                        {cartItems.map((item) => (
                            <div key={item._id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-8 group hover:shadow-md transition-all duration-300">
                                {/* Product Image */}
                                <div className="w-32 h-32 bg-gray-50 rounded-2xl p-4 border border-gray-100 shrink-0 group-hover:scale-105 transition-transform duration-500">
                                    <img
                                        src={(item.product?.images && item.product.images[0] && item.product.images[0] !== "") ? item.product.images[0] : 'https://placehold.co/600x400?text=No+Image'}
                                        alt={item.product?.name || 'Product'}
                                        className="w-full h-full object-contain"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="text-xl font-black text-gray-900 mb-1 leading-tight">{item.product.name}</h3>
                                    <p className="text-sm text-gray-400 font-medium mb-3">{item.product.cpu} / {item.product.ram} / {item.product.storage}</p>
                                    <div className="flex items-center justify-center sm:justify-start gap-4">
                                        <div className="bg-green-50 text-green-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                            <ShieldCheck size={12} /> Certified
                                        </div>
                                        <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                            <RefreshCcw size={12} /> Grade {item.product.grade}
                                        </div>
                                    </div>
                                </div>

                                {/* Quantity Selector */}
                                <div className="flex items-center gap-1 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                                    <button
                                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                        className="w-10 h-10 flex items-center justify-center bg-white rounded-xl text-gray-500 hover:text-blue-600 shadow-sm transition-all active:scale-90"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="w-10 text-center font-black text-gray-900">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                        className="w-10 h-10 flex items-center justify-center bg-white rounded-xl text-gray-500 hover:text-blue-600 shadow-sm transition-all active:scale-90"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                {/* Price & Remove */}
                                <div className="sm:text-right flex flex-col items-center sm:items-end gap-3 min-w-[150px]">
                                    <div className="text-right">
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">₹{item.product.price.toLocaleString()} x {item.quantity}</p>
                                        <p className="text-2xl font-black text-gray-900">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.product._id)}
                                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Cart Benefits */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 font-sans">
                            <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-50">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                                    <Truck className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-gray-900">Free Shipping</p>
                                    <p className="text-xs text-gray-400 font-medium">Pan India Delivery</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-50">
                                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                                    <ShieldCheck className="text-green-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-gray-900">Safe Checkout</p>
                                    <p className="text-xs text-gray-400 font-medium">Secure Payments</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-50">
                                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                                    <RefreshCcw className="text-purple-600" size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-gray-900">6mo Warranty</p>
                                    <p className="text-xs text-gray-400 font-medium">On Every Laptop</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 p-8 rounded-[40px] text-white overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-3xl -mr-32 -mt-32 group-hover:bg-blue-600/30 transition-all duration-1000"></div>

                            <h3 className="text-2xl font-black mb-10 relative z-10">Order Summary</h3>

                            <div className="space-y-6 relative z-10">
                                <div className="flex justify-between items-center text-gray-400">
                                    <span className="font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                                    <span className="text-lg font-black text-white">₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-400">
                                    <span className="font-bold uppercase tracking-widest text-[10px]">Shipping</span>
                                    <span className="text-lg font-black text-green-400">Free</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-400">
                                    <span className="font-bold uppercase tracking-widest text-[10px]">GST (18%)</span>
                                    <span className="text-lg font-black text-white">₹{gst.toLocaleString()}</span>
                                </div>

                                <div className="pt-8 border-t border-white/10 flex flex-col gap-2">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-lg font-black uppercase tracking-tighter">Total</span>
                                        <span className="text-3xl font-black text-blue-400">₹{total.toLocaleString()}</span>
                                    </div>

                                    <button
                                        onClick={() => navigate('/checkout')}
                                        className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-3 relative overflow-hidden group/btn active:scale-95"
                                    >
                                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                                        <span className="relative z-10 uppercase tracking-widest text-xs">Checkout Now</span>
                                        <ArrowRight size={20} className="relative z-10" />
                                    </button>

                                    <Link to="/" className="text-center text-gray-500 hover:text-white text-xs font-bold transition-all mt-4 py-2 border border-transparent hover:border-white/5 rounded-xl">
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Promo Code Card */}
                        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm relative group">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Have a Promo Code?</h4>
                            <div className="flex items-center gap-3">
                                <div className="relative flex-1">
                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="ENTER CODE"
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-xs font-black placeholder:font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                </div>
                                <button className="px-6 py-3 bg-gray-900 text-white text-xs font-black rounded-2xl hover:bg-black transition-all active:scale-95">
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
