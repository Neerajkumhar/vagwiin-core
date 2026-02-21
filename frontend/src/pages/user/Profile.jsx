import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User as UserIcon,
    Package,
    Mail,
    Phone,
    MapPin,
    Camera,
    ShieldCheck,
    Bell,
    Settings,
    LogOut,
    ChevronRight,
    CheckCircle2,
    Lock,
    Fingerprint,
    Wrench
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import authService from '../../services/authService';

const Profile = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        profileImg: ''
    });

    const [tempData, setTempData] = useState({ ...userData });

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
        } else {
            setUser(currentUser);
            const initialData = {
                name: currentUser?.fullName || 'User',
                email: currentUser?.email || '',
                phone: currentUser?.phone || '',
                address: currentUser?.address || '',
                profileImg: `https://ui-avatars.com/api/?name=${currentUser?.fullName || 'User'}&background=0D8ABC&color=fff&size=128`
            };
            setUserData(initialData);
            setTempData(initialData);
        }
    }, [navigate]);

    const handleSave = async () => {
        try {
            const response = await authService.updateProfile({
                userId: user.id,
                fullName: tempData.name,
                phone: tempData.phone,
                address: tempData.address
            });

            if (response.status === 'success') {
                setUserData({ ...tempData });
                setIsEditing(false);
                // Dispatch event to update navbar if necessary
                window.dispatchEvent(new Event('storage'));
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#f8fbff] flex flex-col font-sans">
            <Navbar />

            <main className="container mx-auto px-4 sm:px-6 py-6 md:py-12 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-10">

                    {/* Left Sidebar: Navigation & Quick Info */}
                    <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
                        <div className="bg-white rounded-[32px] md:rounded-[40px] border border-gray-100 shadow-sm overflow-hidden text-center p-6 md:p-8">
                            <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-6">
                                <img
                                    src={userData.profileImg}
                                    alt="Profile"
                                    className="w-full h-full rounded-full border-4 border-blue-50 shadow-lg object-cover"
                                />
                                <button className="absolute bottom-1 right-1 p-2 bg-blue-600 text-white rounded-full border-2 border-white hover:bg-blue-700 transition-all shadow-md">
                                    <Camera size={14} />
                                </button>
                            </div>
                            <h2 className="text-lg md:text-xl font-black text-gray-900 leading-tight">{userData.name}</h2>
                            <p className="text-[10px] md:text-xs text-blue-600 font-bold uppercase mt-1 tracking-widest">Premium Member</p>

                            <div className="mt-6 md:mt-8 pt-6 border-t border-gray-50 flex flex-col gap-2">
                                <button className="flex items-center justify-between p-3 md:p-4 bg-blue-50 text-blue-600 rounded-2xl text-sm font-bold transition-all">
                                    <div className="flex items-center gap-3">
                                        <UserIcon size={18} /> <span className="md:inline">Profile</span>
                                    </div>
                                    <ChevronRight size={14} />
                                </button>
                                {user?.role === 'admin' && (
                                    <button
                                        onClick={() => navigate('/admin')}
                                        className="flex items-center justify-between p-3 md:p-4 text-blue-600 bg-blue-50/50 hover:bg-blue-50 rounded-2xl text-sm font-bold transition-all border border-blue-100"
                                    >
                                        <div className="flex items-center gap-3">
                                            <ShieldCheck size={18} /> <span>Admin Panel</span>
                                        </div>
                                        <ChevronRight size={14} />
                                    </button>
                                )}
                                {user?.role === 'technician' && (
                                    <button
                                        onClick={() => navigate('/technician')}
                                        className="flex items-center justify-between p-3 md:p-4 text-blue-600 bg-blue-50/50 hover:bg-blue-50 rounded-2xl text-sm font-bold transition-all border border-blue-100"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Wrench size={18} /> <span>Technician Panel</span>
                                        </div>
                                        <ChevronRight size={14} />
                                    </button>
                                )}
                                <button
                                    onClick={() => navigate('/my-orders')}
                                    className="flex items-center justify-between p-3 md:p-4 text-gray-500 hover:bg-gray-50 rounded-2xl text-sm font-bold transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <Package size={18} /> <span>My Orders</span>
                                    </div>
                                    <ChevronRight size={14} />
                                </button>
                                <button className="flex items-center justify-between p-3 md:p-4 text-gray-500 hover:bg-gray-50 rounded-2xl text-sm font-bold transition-all">
                                    <div className="flex items-center gap-3">
                                        <Bell size={18} /> <span>Notifications</span>
                                    </div>
                                    <ChevronRight size={14} />
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center justify-between p-3 md:p-4 text-red-500 hover:bg-red-50 rounded-2xl text-sm font-bold transition-all mt-4 w-full"
                                >
                                    <div className="flex items-center gap-3">
                                        <LogOut size={18} /> Logout
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Verification Card */}
                        <div className="bg-slate-900 rounded-[32px] p-6 md:p-8 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl -mr-16 -mt-16"></div>
                            <h3 className="text-sm font-black mb-3 relative z-10 flex items-center gap-2">
                                <ShieldCheck size={18} className="text-blue-400" /> Account Status
                            </h3>
                            <p className="text-[11px] font-medium text-gray-400 mb-6 relative z-10 leading-relaxed">Your account is fully verified for priority shipping and warranty claims.</p>
                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 relative z-10 w-fit">
                                <CheckCircle2 size={14} className="text-green-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest">KYC Verified</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Content: Details & Editing */}
                    <div className="lg:col-span-3 space-y-6 md:space-y-8 order-1 lg:order-2">
                        <div className="bg-white rounded-[32px] md:rounded-[40px] border border-gray-100 shadow-sm p-6 md:p-10">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 md:mb-10">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Personal Details</h1>
                                    <p className="text-gray-400 font-medium text-xs md:text-sm mt-1">Manage your account information.</p>
                                </div>
                                <button
                                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                    className={`w-full sm:w-auto px-8 py-3 rounded-2xl font-black text-sm transition-all overflow-hidden relative group active:scale-95 ${isEditing ? 'bg-green-600 text-white shadow-xl shadow-green-100' : 'bg-gray-900 text-white'
                                        }`}
                                >
                                    <span className="relative z-10">{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                {/* Name Input */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                        <UserIcon size={12} /> Full Name
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={tempData.name}
                                            onChange={(e) => setTempData({ ...tempData, name: e.target.value })}
                                            className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all font-sans"
                                        />
                                    ) : (
                                        <div className="px-5 py-3 md:px-6 md:py-4 bg-gray-50 rounded-2xl text-sm font-bold text-gray-700">
                                            {userData.name}
                                        </div>
                                    )}
                                </div>

                                {/* Email Input */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                        <Mail size={12} /> Email Address
                                    </label>
                                    <div className="px-5 py-3 md:px-6 md:py-4 bg-gray-50 rounded-2xl text-sm font-bold text-gray-700 truncate">
                                        {userData.email}
                                    </div>
                                </div>

                                {/* User ID Input (Read Only) */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                        <Fingerprint size={12} /> System User ID
                                    </label>
                                    <div className="px-5 py-3 md:px-6 md:py-4 bg-blue-50/50 rounded-2xl text-xs md:text-sm font-mono font-bold text-blue-700 border border-blue-100 flex items-center justify-between gap-2 overflow-hidden">
                                        <span className="truncate">{user?.id || 'Loading...'}</span>
                                        <span className="shrink-0 text-[8px] md:text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full">Active</span>
                                    </div>
                                </div>

                                {/* Phone Input */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                        <Phone size={12} /> Phone Number
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={tempData.phone}
                                            onChange={(e) => setTempData({ ...tempData, phone: e.target.value })}
                                            className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all font-sans"
                                        />
                                    ) : (
                                        <div className="px-5 py-3 md:px-6 md:py-4 bg-gray-50 rounded-2xl text-sm font-bold text-gray-700">
                                            {userData.phone || <span className="text-gray-400 font-medium italic">Not set</span>}
                                        </div>
                                    )}
                                </div>

                                {/* Address Input */}
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                        <MapPin size={12} /> Default Shipping Address
                                    </label>
                                    {isEditing ? (
                                        <textarea
                                            value={tempData.address}
                                            onChange={(e) => setTempData({ ...tempData, address: e.target.value })}
                                            className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all font-sans h-24 resize-none"
                                        />
                                    ) : (
                                        <div className="px-5 py-3 md:px-6 md:py-4 bg-gray-50 rounded-2xl text-sm font-bold text-gray-700 leading-relaxed min-h-[56px]">
                                            {userData.address || <span className="text-gray-400 font-medium italic">No address provided yet</span>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Security Card */}
                        <div className="bg-white rounded-[32px] md:rounded-[40px] border border-gray-100 shadow-sm p-6 md:p-10">
                            <div className="flex items-center gap-4 mb-6 md:mb-8">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                                    <Lock size={20} md:size={24} />
                                </div>
                                <h2 className="text-lg md:text-xl font-black text-gray-900">Security & Privacy</h2>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-5 md:p-6 bg-gray-50 rounded-[24px] md:rounded-3xl">
                                <div>
                                    <h4 className="text-sm font-black text-gray-900 mb-1">Password</h4>
                                    <p className="text-[10px] md:text-xs text-gray-400 font-medium">Last changed 3 months ago</p>
                                </div>
                                <button className="w-full md:w-auto px-6 py-3 bg-white border border-gray-200 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-all">
                                    Update Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
