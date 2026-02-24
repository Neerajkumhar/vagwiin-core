import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Menu, ShoppingCart, LogOut, ShieldCheck, Check } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import TopBar from './TopBar';
import authService from '../services/authService';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';

const Navbar = ({ onToggleSidebar }) => {
    const { settings } = useSettings();
    const { cartCount, refreshCart } = useCart();
    const location = useLocation();
    const navigate = useNavigate();
    const user = authService.getCurrentUser();
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    useEffect(() => {
        if (settings?.siteName) {
            document.title = `${settings.siteName} | Premium Heritage Tech`;
        }
    }, [settings?.siteName]);

    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Poll for new notifications every 10 seconds
            const interval = setInterval(fetchNotifications, 10000);
            return () => clearInterval(interval);
        }
    }, [user?.id]);

    const fetchNotifications = async () => {
        try {
            const data = await authService.getNotifications();
            console.log('Fetched notifications:', data.notifications?.length);
            setNotifications(data.notifications || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await authService.markNotificationAsRead(id);
            setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        authService.logout();
        refreshCart();
        navigate('/login');
    };

    const isAdminOrTechPage = location.pathname.startsWith('/admin') ||
        location.pathname.startsWith('/technician') ||
        location.pathname === '/orders' ||
        location.pathname.startsWith('/order/') ||
        location.pathname === '/inventory';

    return (
        <header className="sticky top-0 z-50">
            {!isAdminOrTechPage && <TopBar />}
            <nav className="flex items-center justify-between px-4 md:px-6 py-4 bg-white/90 backdrop-blur-md border-b border-gray-100">
                <div className="flex items-center gap-3">
                    {isAdminOrTechPage && (
                        <button
                            onClick={onToggleSidebar}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
                        >
                            <Menu size={22} />
                        </button>
                    )}
                    <Link to="/" className="flex items-center shrink-0">
                        <img src="/img/logo.png" alt="Vagwiin Logo" className="h-7 md:h-10 w-auto object-contain" />
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
                    <Link to="/" className={`transition-colors ${isActive('/') ? 'text-blue-600' : 'hover:text-blue-600'}`}>Home</Link>
                    <Link to="/shop" className={`transition-colors ${isActive('/shop') ? 'text-blue-600' : 'hover:text-blue-600'}`}>Shop</Link>
                    <Link to="/warranty" className={`transition-colors ${isActive('/warranty') ? 'text-blue-600' : 'hover:text-blue-600'}`}>Warranty</Link>
                    <Link to="/about" className={`transition-colors ${isActive('/about') ? 'text-blue-600' : 'hover:text-blue-600'}`}>About</Link>
                    <Link to="/contact" className={`transition-colors ${isActive('/contact') ? 'text-blue-600' : 'hover:text-blue-600'}`}>Contact</Link>
                    {user && (
                        <Link to="/my-orders" className={`transition-colors ${isActive('/my-orders') ? 'text-blue-600' : 'hover:text-blue-600'}`}>My Orders</Link>
                    )}
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    {user && (
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="hidden sm:block p-2 hover:bg-gray-100 rounded-full transition-colors relative"
                            >
                                <Bell size={20} className="text-gray-600" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
                                    <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Notifications</h3>
                                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{unreadCount} New</span>
                                    </div>
                                    <div className="max-h-[400px] overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-10 text-center">
                                                <p className="text-xs text-gray-400 font-medium">No notifications yet</p>
                                            </div>
                                        ) : (
                                            notifications.map((n) => (
                                                <div
                                                    key={n._id}
                                                    className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-4 items-start ${!n.read ? 'bg-blue-50/30' : ''}`}
                                                >
                                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${n.type === 'success' ? 'bg-green-100 text-green-600' :
                                                        n.type === 'warning' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                                                        }`}>
                                                        {n.type === 'success' ? <Check size={14} /> : <Bell size={14} />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs font-bold text-gray-800 mb-0.5">{n.title}</p>
                                                        <p className="text-[10px] text-gray-500 leading-relaxed mb-2">{n.message}</p>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-[8px] font-bold text-gray-400 uppercase">
                                                                {new Date(n.createdAt).toLocaleDateString()}
                                                            </span>
                                                            {!n.read && (
                                                                <button
                                                                    onClick={() => markAsRead(n._id)}
                                                                    className="text-[8px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                                                                >
                                                                    Mark as read
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                        <ShoppingCart size={20} className="text-gray-600" />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">{cartCount}</span>
                    </Link>

                    <div className="h-6 w-[1px] bg-gray-200 mx-1 md:mx-2 hidden sm:block"></div>

                    {user ? (
                        <div className="flex items-center gap-1 md:gap-3">
                            {user.role === 'admin' && (
                                <Link
                                    to="/admin"
                                    className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all border border-slate-800 shadow-sm"
                                >
                                    <ShieldCheck size={14} className="text-blue-400" />
                                    Admin Panel
                                </Link>
                            )}
                            {user.role === 'technician' && (
                                <Link
                                    to="/technician"
                                    className="hidden lg:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
                                >
                                    <ShieldCheck size={14} />
                                    Technician Panel
                                </Link>
                            )}
                            <Link to="/profile" className="flex items-center gap-2 p-1 pr-2 md:pr-3 hover:bg-gray-100 rounded-full transition-all cursor-pointer border border-transparent hover:border-gray-200">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${user?.fullName || 'User'}&background=0D8ABC&color=fff`}
                                    alt="Profile"
                                    className="w-7 h-7 md:w-8 md:h-8 rounded-full"
                                />
                                <span className="hidden lg:block text-sm font-bold text-gray-700">{(user?.fullName || 'User').split(' ')[0]}</span>
                            </Link>
                            {!isAdminOrTechPage && (
                                <button onClick={toggleMenu} className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <Menu size={24} className="text-gray-600" />
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Link to="/login" className="hidden sm:block text-gray-600 font-semibold hover:text-blue-600 transition-colors px-2">
                                Sign In
                            </Link>
                            <Link to="/signup" className="hidden sm:block bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-200 active:scale-95">
                                Join Us
                            </Link>
                            <button onClick={toggleMenu} className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Menu size={24} className="text-gray-600" />
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[60] md:hidden animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/5 backdrop-blur-sm" onClick={toggleMenu} />
                    <div className="absolute right-0 top-0 bottom-0 w-3/4 max-w-sm bg-white shadow-2xl animate-in slide-in-from-right-full duration-300">
                        <div className="p-6 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-8">
                                <span className="font-black text-xl text-gray-900 tracking-tighter italic">{settings.siteName.toUpperCase()}.</span>
                                <button onClick={toggleMenu} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                                    <LogOut size={20} className="rotate-180" />
                                </button>
                            </div>

                            <div className="flex flex-col gap-1">
                                <Link onClick={toggleMenu} to="/" className={`p-4 rounded-2xl font-bold transition-all ${isActive('/') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>Home</Link>
                                <Link onClick={toggleMenu} to="/shop" className={`p-4 rounded-2xl font-bold transition-all ${isActive('/shop') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>Shop</Link>
                                <Link onClick={toggleMenu} to="/warranty" className={`p-4 rounded-2xl font-bold transition-all ${isActive('/warranty') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>Warranty Status</Link>
                                <Link onClick={toggleMenu} to="/about" className={`p-4 rounded-2xl font-bold transition-all ${isActive('/about') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>About Us</Link>
                                <Link onClick={toggleMenu} to="/contact" className={`p-4 rounded-2xl font-bold transition-all ${isActive('/contact') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>Contact</Link>
                            </div>

                            <div className="mt-auto pt-8 border-t border-gray-100 flex flex-col gap-4">
                                {!user ? (
                                    <>
                                        <Link onClick={toggleMenu} to="/login" className="w-full py-4 text-center font-bold text-gray-600 border-2 border-gray-100 rounded-2xl hover:bg-gray-50 transition-all">Sign In</Link>
                                        <Link onClick={toggleMenu} to="/signup" className="w-full py-4 text-center font-bold text-white bg-blue-600 rounded-2xl shadow-lg shadow-blue-100 active:scale-95 transition-all">Create Account</Link>
                                    </>
                                ) : (
                                    <button onClick={() => { handleLogout(); toggleMenu(); }} className="w-full py-4 flex items-center justify-center gap-2 font-bold text-red-500 bg-red-50 rounded-2xl active:scale-95 transition-all">
                                        <LogOut size={18} />
                                        Log Out
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
