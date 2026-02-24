import React, { useState, useEffect } from 'react';
import {
    Save,
    Globe,
    Mail,
    Phone,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Shield,
    Layout,
    Loader2,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import SidebarAdmin from '../../components/SidebarAdmin';
import settingsService from '../../services/settingsService';
import { useSettings } from '../../context/SettingsContext';

const Settings = () => {
    const { refreshSettings } = useSettings();
    const [settings, setSettings] = useState({
        siteName: '',
        contactEmail: '',
        contactPhone: '',
        address: '',
        socialLinks: {
            facebook: '',
            twitter: '',
            instagram: '',
            linkedin: ''
        },
        maintenanceMode: false,
        homepageBannerText: '',
        currency: 'INR'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await settingsService.getSettings();
            if (response.status === 'success') {
                setSettings(response.data.settings);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            setMessage({ type: 'error', text: 'Failed to load settings.' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setSettings(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setSettings(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            setMessage({ type: '', text: '' });
            const response = await settingsService.updateSettings(settings);
            if (response.status === 'success') {
                setMessage({ type: 'success', text: 'Settings updated successfully!' });
                refreshSettings();
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            }
        } catch (error) {
            console.error('Error updating settings:', error);
            setMessage({ type: 'error', text: 'Failed to update settings.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen bg-[#f8fbff] flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                <p className="text-gray-500 font-bold italic tracking-widest text-[10px] md:text-sm">LOADING SYSTEM CONFIGURATION...</p>
            </div>
        );
    }

    return (
        <div className="h-screen bg-[#f8fbff] flex flex-col overflow-hidden font-sans">
            <div className="shrink-0">
                <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                <SidebarAdmin isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 md:mb-12">
                            <div>
                                <h1 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                    Global Settings
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">Core Config</span>
                                </h1>
                                <p className="text-xs md:text-sm text-gray-400 font-medium tracking-wide mt-1">Configure your enterprise-wide parameters and preferences.</p>
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={saving}
                                className="flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                {saving ? 'Saving...' : 'Save Configuration'}
                            </button>
                        </div>

                        {message.text && (
                            <div className={`mb-8 p-4 rounded-3xl flex items-center gap-4 border ${message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
                                } animate-in fade-in slide-in-from-top-4 duration-500`}>
                                {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                                <p className="text-sm font-bold tracking-tight">{message.text}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8 pb-12">
                            {/* General Information */}
                            <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm transition-all hover:shadow-xl duration-500">
                                <h3 className="text-lg font-black text-gray-900 mb-8 flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                        <Globe size={20} />
                                    </div>
                                    Enterprise Identity
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Site Name</label>
                                        <input
                                            type="text"
                                            name="siteName"
                                            value={settings.siteName}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 font-bold focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-300"
                                            placeholder="Enter site name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Homepage Banner Text</label>
                                        <input
                                            type="text"
                                            name="homepageBannerText"
                                            value={settings.homepageBannerText}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 font-bold focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-300"
                                            placeholder="Banner welcome text"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Default Currency</label>
                                        <select
                                            name="currency"
                                            value={settings.currency}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 font-bold focus:ring-2 focus:ring-blue-500 transition-all"
                                        >
                                            <option value="INR">INR (₹)</option>
                                            <option value="USD">USD ($)</option>
                                            <option value="EUR">EUR (€)</option>
                                            <option value="GBP">GBP (£)</option>
                                        </select>
                                    </div>
                                </div>
                            </section>

                            {/* Contact Details */}
                            <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm transition-all hover:shadow-xl duration-500">
                                <h3 className="text-lg font-black text-gray-900 mb-8 flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                        <Mail size={20} />
                                    </div>
                                    Communication Nodes
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                            <input
                                                type="email"
                                                name="contactEmail"
                                                value={settings.contactEmail}
                                                onChange={handleChange}
                                                className="w-full pl-14 pr-5 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 font-bold focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-300"
                                                placeholder="support@enterprise.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Phone</label>
                                        <div className="relative">
                                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                            <input
                                                type="text"
                                                name="contactPhone"
                                                value={settings.contactPhone}
                                                onChange={handleChange}
                                                className="w-full pl-14 pr-5 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 font-bold focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-300"
                                                placeholder="+91 000 000 0000"
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">HQ Address</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                            <input
                                                type="text"
                                                name="address"
                                                value={settings.address}
                                                onChange={handleChange}
                                                className="w-full pl-14 pr-5 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 font-bold focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-300"
                                                placeholder="Street, City, State, ZIP"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Social Presence */}
                            <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm transition-all hover:shadow-xl duration-500">
                                <h3 className="text-lg font-black text-gray-900 mb-8 flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                        <Linkedin size={20} />
                                    </div>
                                    Social Ecosystem
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-blue-600">Facebook</label>
                                        <div className="relative group">
                                            <div className="absolute left-0 top-0 bottom-0 w-14 flex items-center justify-center bg-gray-50 text-gray-400 group-focus-within:bg-blue-600 group-focus-within:text-white transition-all rounded-l-2xl">
                                                <Facebook size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                name="socialLinks.facebook"
                                                value={settings.socialLinks.facebook}
                                                onChange={handleChange}
                                                className="w-full pl-19 pr-5 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 font-bold focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-300"
                                                placeholder="Profile URL"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-sky-400">Twitter (X)</label>
                                        <div className="relative group">
                                            <div className="absolute left-0 top-0 bottom-0 w-14 flex items-center justify-center bg-gray-50 text-gray-400 group-focus-within:bg-sky-500 group-focus-within:text-white transition-all rounded-l-2xl">
                                                <Twitter size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                name="socialLinks.twitter"
                                                value={settings.socialLinks.twitter}
                                                onChange={handleChange}
                                                className="w-full pl-19 pr-5 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 font-bold focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-300"
                                                placeholder="Profile URL"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-pink-500">Instagram</label>
                                        <div className="relative group">
                                            <div className="absolute left-0 top-0 bottom-0 w-14 flex items-center justify-center bg-gray-50 text-gray-400 group-focus-within:bg-pink-500 group-focus-within:text-white transition-all rounded-l-2xl">
                                                <Instagram size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                name="socialLinks.instagram"
                                                value={settings.socialLinks.instagram}
                                                onChange={handleChange}
                                                className="w-full pl-19 pr-5 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 font-bold focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-300"
                                                placeholder="Profile URL"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-blue-700">LinkedIn</label>
                                        <div className="relative group">
                                            <div className="absolute left-0 top-0 bottom-0 w-14 flex items-center justify-center bg-gray-50 text-gray-400 group-focus-within:bg-blue-700 group-focus-within:text-white transition-all rounded-l-2xl">
                                                <Linkedin size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                name="socialLinks.linkedin"
                                                value={settings.socialLinks.linkedin}
                                                onChange={handleChange}
                                                className="w-full pl-19 pr-5 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 font-bold focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-300"
                                                placeholder="Profile URL"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* System Security & Availability */}
                            <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm transition-all hover:shadow-xl duration-500 overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[100px] -mr-10 -mt-10"></div>
                                <h3 className="text-lg font-black text-gray-900 mb-8 flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                        <Shield size={20} />
                                    </div>
                                    System Protocol
                                </h3>
                                <div className="flex flex-col md:flex-row gap-12">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100 group transition-all hover:bg-red-50 hover:border-red-100">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-white text-gray-400 group-hover:text-red-500 rounded-xl shadow-sm transition-colors">
                                                    <Layout size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 text-sm">Maintenance Mode</p>
                                                    <p className="text-[10px] text-gray-400 font-medium">Suspend public access while updating.</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="maintenanceMode"
                                                    checked={settings.maintenanceMode}
                                                    onChange={handleChange}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-red-600 transition-all"></div>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-1/3 p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50">
                                        <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">System Health</h4>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-gray-500 font-bold">API Status</span>
                                                <span className="px-2 py-0.5 bg-green-500 text-white rounded-md font-black italic tracking-tighter">ONLINE</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-gray-500 font-bold">Database</span>
                                                <span className="px-2 py-0.5 bg-blue-500 text-white rounded-md font-black italic tracking-tighter">SECURED</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-gray-500 font-bold">Last Synchronized</span>
                                                <span className="text-gray-900 font-black">Just now</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Settings;
