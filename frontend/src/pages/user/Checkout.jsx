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
import Footer from '../../components/Footer';
import { useSettings } from '../../context/SettingsContext';
import cartService from '../../services/cartService';
import orderService from '../../services/orderService';
import authService from '../../services/authService';

const Checkout = () => {
    const { currencySymbol, formatPrice } = useSettings();
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
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: '',
        expiry: '',
        cvv: '',
        upiId: ''
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

    const handlePaymentChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'cardNumber') {
            // Remove all non-digit characters
            const digits = value.replace(/\D/g, '');
            // Limit to 16 digits
            const limitedDigits = digits.slice(0, 16);
            // Add space every 4 digits
            formattedValue = limitedDigits.match(/.{1,4}/g)?.join(' ') || limitedDigits;
        } else if (name === 'expiry') {
            // Remove all non-digit characters
            const digits = value.replace(/\D/g, '');
            // Limit to 4 digits (MMYY)
            const limitedDigits = digits.slice(0, 4);
            if (limitedDigits.length > 2) {
                formattedValue = `${limitedDigits.slice(0, 2)}/${limitedDigits.slice(2)}`;
            } else {
                formattedValue = limitedDigits;
            }
        } else if (name === 'cvv') {
            // Remove all non-digit characters and limit to 4 digits
            formattedValue = value.replace(/\D/g, '').slice(0, 4);
        } else if (name === 'upiId') {
            // Lowercase, remove spaces, and only allow alphanumeric, @, dot, and hyphen
            formattedValue = value.toLowerCase().replace(/\s/g, '').replace(/[^a-z0-7.@-]/g, '');
            // Ensure only one @ symbol
            const parts = formattedValue.split('@');
            if (parts.length > 2) {
                formattedValue = parts[0] + '@' + parts.slice(1).join('');
            }
        }

        setPaymentDetails(prev => ({
            ...prev,
            [name]: formattedValue
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

        // Validate payment details
        if (paymentMethod === 'card') {
            if (!paymentDetails.cardNumber || !paymentDetails.expiry || !paymentDetails.cvv) {
                alert('Please fill in all card details');
                return;
            }
        } else if (paymentMethod === 'upi') {
            if (!paymentDetails.upiId) {
                alert('Please enter your UPI ID');
                return;
            }
            // Simple regex for UPI validation: something@something
            const upiRegex = /^[\w.-]+@[\w.-]+$/;
            if (!upiRegex.test(paymentDetails.upiId)) {
                alert('Please enter a valid UPI ID (e.g. name@bank)');
                return;
            }
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
        <div className="min-h-screen bg-[#f8fbff] flex flex-col font-sans mb-10 md:mb-20">
            <Navbar />

            <main className="container mx-auto px-4 sm:px-6 py-6 md:py-12 max-w-7xl">
                {/* Back Link */}
                <Link to="/cart" className="flex items-center gap-2 text-blue-600 font-bold text-xs md:text-sm mb-6 md:mb-8 hover:underline group w-fit">
                    <ChevronLeft size={14} md:size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Cart
                </Link>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 md:gap-12">
                    {/* Left: Checkout Form */}
                    <div className="xl:col-span-2 space-y-6 md:space-y-8">
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Checkout</h1>

                        {/* 1. Shipping Information */}
                        <div className="bg-white p-5 md:p-8 rounded-[24px] md:rounded-[32px] border border-gray-100 shadow-sm space-y-6 md:space-y-8">
                            <div className="flex items-center gap-3 md:gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 rounded-xl md:rounded-2xl flex items-center justify-center">
                                    <MapPin className="text-blue-600" size={20} md:size={24} />
                                </div>
                                <h2 className="text-lg md:text-xl font-black text-gray-900">Shipping Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div className="flex flex-col gap-1.5 md:gap-2">
                                    <label className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={shippingInfo.fullName}
                                        onChange={handleInputChange}
                                        placeholder="Full Name"
                                        className="px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-none rounded-xl md:rounded-2xl text-xs md:text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5 md:gap-2">
                                    <label className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={shippingInfo.email}
                                        onChange={handleInputChange}
                                        placeholder="Email@example.com"
                                        className="px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-none rounded-xl md:rounded-2xl text-xs md:text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5 md:gap-2">
                                    <label className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={shippingInfo.phone}
                                        onChange={handleInputChange}
                                        placeholder="+91 90000 00000"
                                        className="px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-none rounded-xl md:rounded-2xl text-xs md:text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5 md:gap-2">
                                    <label className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={shippingInfo.city}
                                        onChange={handleInputChange}
                                        placeholder="City"
                                        className="px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-none rounded-xl md:rounded-2xl text-xs md:text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all"
                                    />
                                </div>
                                <div className="md:col-span-2 flex flex-col gap-1.5 md:gap-2">
                                    <label className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Street Address</label>
                                    <textarea
                                        name="address"
                                        value={shippingInfo.address}
                                        onChange={handleInputChange}
                                        placeholder="Complete address details..."
                                        className="px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-none rounded-xl md:rounded-2xl text-xs md:text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all h-20 md:h-24 resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Payment Method */}
                        <div className="bg-white p-5 md:p-8 rounded-[24px] md:rounded-[32px] border border-gray-100 shadow-sm space-y-6 md:space-y-8">
                            <div className="flex items-center gap-3 md:gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-50 rounded-xl md:rounded-2xl flex items-center justify-center">
                                    <CreditCard className="text-green-600" size={20} md:size={24} />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-lg md:text-xl font-black text-gray-900">Payment Selection</h2>
                                    <p className="text-[8px] md:text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-0.5 flex items-center gap-1">
                                        <Lock size={10} /> Secure 256-bit Encrypted
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                                {[
                                    { id: 'card', label: 'Credit Card', icon: CreditCard },
                                    { id: 'upi', label: 'UPI / PhonePe', icon: Wallet },
                                    { id: 'cod', label: 'Cash on Delivery', icon: MessageSquare }
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        type="button"
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`flex flex-row sm:flex-col items-center gap-3 p-4 md:p-6 rounded-xl md:rounded-2xl border-2 transition-all ${paymentMethod === method.id
                                            ? 'border-blue-600 bg-blue-50 sm:ring-4 sm:ring-blue-50'
                                            : 'border-gray-50 bg-gray-50 hover:bg-white hover:border-gray-200'
                                            }`}
                                    >
                                        <method.icon size={18} md:size={24} className={paymentMethod === method.id ? 'text-blue-600' : 'text-gray-400'} />
                                        <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest ${paymentMethod === method.id ? 'text-blue-900' : 'text-gray-500'}`}>
                                            {method.label}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {paymentMethod === 'card' && (
                                <div className="bg-gray-50 p-5 md:p-8 rounded-2xl md:rounded-3xl space-y-4 md:space-y-6 animate-in slide-in-from-top-2 duration-300">
                                    <div className="flex flex-col gap-1.5 md:gap-2">
                                        <label className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Card Number</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="cardNumber"
                                                value={paymentDetails.cardNumber}
                                                onChange={handlePaymentChange}
                                                maxLength="19"
                                                inputMode="numeric"
                                                placeholder="**** **** **** 4242"
                                                className="w-full pl-4 md:pl-6 pr-12 md:pr-14 py-3 md:py-4 bg-white border-2 border-transparent rounded-xl md:rounded-2xl text-xs md:text-sm font-bold text-gray-700 outline-none focus:border-blue-100 transition-all font-mono"
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                                                <div className="w-6 h-4 md:w-8 md:h-5 bg-gray-200 rounded"></div>
                                                <div className="w-6 h-4 md:w-8 md:h-5 bg-gray-200 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 md:gap-6">
                                        <div className="flex flex-col gap-1.5 md:gap-2">
                                            <label className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Expiry</label>
                                            <input
                                                type="text"
                                                name="expiry"
                                                value={paymentDetails.expiry}
                                                onChange={handlePaymentChange}
                                                maxLength="5"
                                                inputMode="numeric"
                                                placeholder="MM/YY"
                                                className="px-4 py-3 md:px-6 md:py-4 bg-white border-2 border-transparent rounded-xl md:rounded-2xl text-xs md:text-sm font-bold text-gray-700 outline-none focus:border-blue-100 transition-all font-mono"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5 md:gap-2">
                                            <label className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">CVV</label>
                                            <input
                                                type="text"
                                                name="cvv"
                                                value={paymentDetails.cvv}
                                                onChange={handlePaymentChange}
                                                maxLength="4"
                                                inputMode="numeric"
                                                placeholder="***"
                                                className="px-4 py-3 md:px-6 md:py-4 bg-white border-2 border-transparent rounded-xl md:rounded-2xl text-xs md:text-sm font-bold text-gray-700 outline-none focus:border-blue-100 transition-all font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {paymentMethod === 'upi' && (
                                <div className="bg-gray-50 p-5 md:p-8 rounded-2xl md:rounded-3xl space-y-4 md:space-y-6 animate-in slide-in-from-top-2 duration-300 text-center">
                                    <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Wallet className="text-blue-600" size={32} />
                                    </div>
                                    <div className="flex flex-col gap-1.5 md:gap-2 text-left">
                                        <label className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">UPI ID</label>
                                        <input
                                            type="text"
                                            name="upiId"
                                            value={paymentDetails.upiId}
                                            onChange={handlePaymentChange}
                                            placeholder="username@bank"
                                            className="w-full px-4 py-3 md:px-6 md:py-4 bg-white border-2 border-transparent rounded-xl md:rounded-2xl text-xs md:text-sm font-bold text-gray-700 outline-none focus:border-blue-100 transition-all font-mono"
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-medium">UPI ID usually looks like <span className="font-bold">name@upi</span> or <span className="font-bold">phone@okaxis</span></p>
                                </div>
                            )}

                            {paymentMethod === 'cod' && (
                                <div className="bg-gray-50 p-6 md:p-10 rounded-2xl md:rounded-3xl space-y-4 animate-in slide-in-from-top-2 duration-300 text-center">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                                        <Truck className="text-green-600" size={32} />
                                    </div>
                                    <h4 className="text-lg font-black text-gray-900 tracking-tight">Zero Advance Payment</h4>
                                    <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-sm mx-auto">
                                        Pay only when your premium device is delivered and inspected. Our agent will collect flow via Cash or UPI at your doorstep.
                                    </p>
                                    <div className="inline-block px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest mt-2">
                                        Safe & Secure
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="space-y-6 md:space-y-8">
                        <div className="bg-slate-900 p-6 md:p-8 rounded-[32px] md:rounded-[40px] text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-3xl -mr-32 -mt-32"></div>

                            <h3 className="text-xl font-black mb-6 md:mb-8 relative z-10">Order Summary</h3>

                            <div className="space-y-6 relative z-10">
                                <div className="space-y-4 max-h-48 md:max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    {cartData && cartData.items.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 md:gap-4">
                                            <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 rounded-xl p-2 shrink-0">
                                                <img src={item.product.images?.[0] || ''} alt={item.product.name} className="w-full h-full object-contain" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] md:text-xs font-bold text-white truncate">{item.product.name}</p>
                                                <p className="text-[8px] md:text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                                                    {formatPrice(item.product.price)} x {item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6 border-t border-white/10 space-y-3 md:space-y-4">
                                    <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        <span>Subtotal</span>
                                        <span className="text-white">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        <span>Shipping</span>
                                        <span className="text-green-400">FREE</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        <span>Tax (GST 18%)</span>
                                        <span className="text-white">{formatPrice(gst)}</span>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/10">
                                    <div className="flex justify-between items-center mb-6 md:mb-8">
                                        <span className="text-base md:text-lg font-black uppercase tracking-tighter">Net Payable</span>
                                        <span className="text-2xl md:text-3xl font-black text-blue-400 font-mono">{formatPrice(total)}</span>
                                    </div>

                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={loading}
                                        className="w-full py-4 md:py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl md:rounded-2xl font-black transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-3 active:scale-95 group/place text-[10px] md:text-xs uppercase tracking-widest"
                                    >
                                        {loading ? (
                                            <Loader2 className="animate-spin" size={18} md:size={20} />
                                        ) : (
                                            <>
                                                CONFIRM ORDER <ArrowRight size={18} md:size={20} className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-gray-100 shadow-sm space-y-4 md:space-y-6">
                            {[
                                { icon: ShieldCheck, title: 'Vagwiin Protected', desc: 'Secure Transaction', color: 'green' },
                                { icon: Truck, title: 'Express Delivery', desc: 'Safe & Fast', color: 'blue' },
                                { icon: CheckCircle2, title: '6mo Warranty', desc: 'Certified Quality', color: 'purple' }
                            ].map((badge, i) => (
                                <div key={i} className="flex items-center gap-3 md:gap-4">
                                    <badge.icon className={`text-${badge.color}-500 shrink-0`} size={20} md:size={24} />
                                    <div>
                                        <p className="text-xs md:text-sm font-black text-gray-900 leading-tight">{badge.title}</p>
                                        <p className="text-[10px] md:text-xs text-gray-400 font-medium">{badge.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Success Modal */}
            {isOrderSuccess && (
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-[32px] md:rounded-[48px] p-8 md:p-12 text-center shadow-2xl animate-in zoom-in duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 blur-2xl opacity-50"></div>

                        <div className="w-16 h-16 md:w-24 md:h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-inner">
                            <CheckCircle2 size={32} md:size={48} />
                        </div>

                        <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-3 md:mb-4 tracking-tight">Order Confirmed!</h2>
                        <p className="text-gray-500 font-bold text-base md:text-lg mb-1 md:mb-2">Thank you for your purchase.</p>
                        <p className="text-gray-400 font-medium text-xs md:text-sm mb-8 md:mb-10 leading-relaxed px-4 md:px-6">
                            Expect delivery in <span className="text-blue-600 font-black italic">3-4 business days</span>.
                            You'll receive a confirmation email shortly.
                        </p>

                        <div className="flex flex-col gap-3 md:gap-4">
                            <button
                                onClick={() => navigate('/')}
                                className="w-full py-4 md:py-5 bg-blue-600 text-white rounded-2xl md:rounded-3xl font-black text-xs md:text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
                            >
                                Continue Shopping
                            </button>
                            <button
                                onClick={() => navigate('/my-orders')}
                                className="w-full py-4 md:py-5 bg-gray-50 text-gray-600 rounded-2xl md:rounded-3xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                            >
                                View Order History
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div >
    );
};

export default Checkout;
