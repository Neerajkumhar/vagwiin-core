import React, { useState, useEffect } from 'react';
import {
    ChevronLeft,
    CreditCard,
    Truck,
    ShieldCheck,
    MapPin,
    CheckCircle2,
    Wallet,
    ArrowRight,
    Lock,
    MessageSquare,
    Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import cartService from '../../services/cartService';
import orderService from '../../services/orderService';
import authService from '../../services/authService';

const Checkout = () => {
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isOrderSuccess, setIsOrderSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cartLoading, setCartLoading] = useState(true);
    const [cartData, setCartData] = useState(null);
    const [shippingInfo, setShippingInfo] = useState({
        fullName: '',
        email: '',
        phone: '',
        city: '',
        address: ''
    });

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (!user) {
            navigate('/login');
            return;
        }

        // Initialize shipping info with user data if available
        setShippingInfo(prev => ({
            ...prev,
            fullName: user.name || '',
            email: user.email || ''
        }));

        fetchCart();
    }, [navigate]);

    const fetchCart = async () => {
        try {
            setCartLoading(true);
            const response = await cartService.getCart();
            if (response.status === 'success') {
                setCartData(response.data.cart);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setCartLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePlaceOrder = async () => {
        if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.phone || !shippingInfo.city || !shippingInfo.address) {
            alert('Please fill in all shipping details');
            return;
        }

        if (!cartData || cartData.items.length === 0) {
            alert('Your cart is empty');
            return;
        }

        try {
            setLoading(true);

            const subtotal = cartData.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
            const shippingPrice = 0;
            const taxPrice = Math.round(subtotal * 0.18);
            const totalPrice = subtotal + shippingPrice + taxPrice;

            const orderItems = cartData.items.map(item => ({
                product: item.product._id,
                name: item.product.name,
                price: item.product.price,
                image: item.product.images && item.product.images[0],
                quantity: item.quantity
            }));

            const orderData = {
                orderItems,
                shippingAddress: shippingInfo,
                paymentMethod,
                subtotal,
                shippingPrice,
                taxPrice,
                totalPrice
            };

            const result = await orderService.createOrder(orderData);
            if (result) {
                // Clear cart after successful order
                await cartService.clearCart();
                setIsOrderSuccess(true);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (cartLoading) {
        return (
            <div className="min-h-screen bg-[#f8fbff] flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                <p className="text-gray-500 font-bold">Loading checkout details...</p>
            </div>
        );
    }

    const subtotal = cartData ? cartData.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0) : 0;
    const shipping = 0;
    const gst = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + gst;

    return (
        <div className="min-h-screen bg-[#f8fbff] flex flex-col font-sans mb-20">
            <Navbar />

            <main className="container mx-auto px-6 py-12 max-w-7xl">
                {/* Back Link */}
                <Link to="/cart" className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-8 hover:underline group w-fit">
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Cart
                </Link>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                    {/* Left: Checkout Form */}
                    <div className="xl:col-span-2 space-y-8">
                        <h1 className="text-4xl font-black text-gray-900">Checkout</h1>

                        {/* 1. Shipping Information */}
                        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                                    <MapPin className="text-blue-600" size={24} />
                                </div>
                                <h2 className="text-xl font-black text-gray-900">Shipping Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={shippingInfo.fullName}
                                        onChange={handleInputChange}
                                        placeholder="Full Name"
                                        className="px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={shippingInfo.email}
                                        onChange={handleInputChange}
                                        placeholder="Email Address"
                                        className="px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={shippingInfo.phone}
                                        onChange={handleInputChange}
                                        placeholder="+91 98765 43210"
                                        className="px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={shippingInfo.city}
                                        onChange={handleInputChange}
                                        placeholder="City"
                                        className="px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all"
                                    />
                                </div>
                                <div className="md:col-span-2 flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Street Address</label>
                                    <textarea
                                        name="address"
                                        value={shippingInfo.address}
                                        onChange={handleInputChange}
                                        placeholder="House No, Building Name, Street"
                                        className="px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all h-24 resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Payment Method */}
                        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                                    <CreditCard className="text-green-600" size={24} />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-black text-gray-900">Payment Selection</h2>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-tight mt-1 flex items-center gap-1">
                                        <Lock size={12} /> Secure 256-bit Encrypted Transaction
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { id: 'card', label: 'Credit Card', icon: CreditCard },
                                    { id: 'upi', label: 'UPI / PhonePe', icon: Wallet },
                                    { id: 'cod', label: 'Cash on Delivery', icon: MessageSquare }
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        type="button"
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${paymentMethod === method.id
                                            ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-50'
                                            : 'border-gray-50 bg-gray-50 hover:bg-white hover:border-gray-200'
                                            }`}
                                    >
                                        <method.icon size={24} className={paymentMethod === method.id ? 'text-blue-600' : 'text-gray-400'} />
                                        <span className={`text-xs font-black uppercase tracking-widest ${paymentMethod === method.id ? 'text-blue-900' : 'text-gray-500'}`}>
                                            {method.label}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {paymentMethod === 'card' && (
                                <div className="bg-gray-50 p-8 rounded-3xl space-y-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Card Number</label>
                                        <div className="relative">
                                            <input type="text" placeholder="**** **** **** 4242" className="w-full pl-6 pr-14 py-4 bg-white border-2 border-transparent rounded-2xl text-sm font-bold text-gray-700 outline-none focus:border-blue-100 transition-all" />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                                                <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                                <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Expiry Date</label>
                                            <input type="text" placeholder="MM/YY" className="px-6 py-4 bg-white border-2 border-transparent rounded-2xl text-sm font-bold text-gray-700 outline-none focus:border-blue-100 transition-all" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CVV</label>
                                            <input type="text" placeholder="***" className="px-6 py-4 bg-white border-2 border-transparent rounded-2xl text-sm font-bold text-gray-700 outline-none focus:border-blue-100 transition-all" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="space-y-8">
                        <div className="bg-slate-900 p-8 rounded-[40px] text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-3xl -mr-32 -mt-32"></div>

                            <h3 className="text-xl font-black mb-8 relative z-10">Order Summary</h3>

                            <div className="space-y-6 relative z-10">
                                <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    {cartData && cartData.items.map((item, i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-white/10 rounded-xl p-2 shrink-0">
                                                <img src={item.product.images?.[0] || ''} alt={item.product.name} className="w-full h-full object-contain" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-white truncate">{item.product.name}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">
                                                    ₹{item.product.price.toLocaleString()} x {item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6 border-t border-white/10 space-y-4">
                                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        <span>Subtotal</span>
                                        <span className="text-white">₹{subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        <span>Shipping</span>
                                        <span className="text-green-400">FREE</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        <span>Tax (GST 18%)</span>
                                        <span className="text-white">₹{gst.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/10">
                                    <div className="flex justify-between items-center mb-8">
                                        <span className="text-lg font-black uppercase tracking-tighter">Net Payable</span>
                                        <span className="text-3xl font-black text-blue-400">₹{total.toLocaleString()}</span>
                                    </div>

                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={loading}
                                        className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-2xl font-black transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-3 active:scale-95 group/place"
                                    >
                                        {loading ? (
                                            <Loader2 className="animate-spin" size={20} />
                                        ) : (
                                            <>
                                                PLACE ORDER <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                            <div className="flex items-center gap-4">
                                <ShieldCheck className="text-green-500 shrink-0" size={24} />
                                <div>
                                    <p className="text-sm font-black text-gray-900 leading-tight">Vagwiin Protected</p>
                                    <p className="text-xs text-gray-400 font-medium">100% Secure Transaction</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Truck className="text-blue-500 shrink-0" size={24} />
                                <div>
                                    <p className="text-sm font-black text-gray-900 leading-tight">Express Shipping</p>
                                    <p className="text-xs text-gray-400 font-medium">Safe & Fast Delivery</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <CheckCircle2 className="text-purple-500 shrink-0" size={24} />
                                <div>
                                    <p className="text-sm font-black text-gray-900 leading-tight">6mo Warranty</p>
                                    <p className="text-xs text-gray-400 font-medium">On Every Certified Laptop</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Success Modal */}
            {isOrderSuccess && (
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-[48px] p-12 text-center shadow-2xl animate-in zoom-in duration-300 relative overflow-hidden">
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 blur-2xl opacity-50"></div>

                        <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <CheckCircle2 size={48} />
                        </div>

                        <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Your order is placed</h2>
                        <p className="text-gray-500 font-bold text-lg mb-2">Thank you for ordering.</p>
                        <p className="text-gray-400 font-medium text-sm mb-10 leading-relaxed px-6">
                            It will be delivered to you in <span className="text-blue-600 font-black italic">3 to 4 working days</span>.
                        </p>

                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => navigate('/')}
                                className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
                            >
                                Continue Shopping
                            </button>
                            <button
                                onClick={() => navigate('/my-orders')}
                                className="w-full py-5 bg-gray-50 text-gray-600 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                            >
                                Track My Orders
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
