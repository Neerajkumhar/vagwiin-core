import React from 'react';
import { useSettings } from '../context/SettingsContext';
import authService from '../services/authService';
import { Hammer, Loader2 } from 'lucide-react';

const MaintenanceWrapper = ({ children }) => {
    const { settings, loading } = useSettings();
    const user = authService.getCurrentUser();
    const isAdmin = user && user.role === 'admin';

    if (loading) {
        return (
            <div className="h-screen bg-[#f8fbff] flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                <p className="text-gray-500 font-bold italic tracking-widest text-[10px] md:text-sm">INITIALIZING CORE SYSTEMS...</p>
            </div>
        );
    }

    // If maintenance mode is ON and user is NOT an admin, show maintenance page
    if (settings.maintenanceMode && !isAdmin) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center font-sans">
                <div className="max-w-2xl">
                    <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(37,99,235,0.5)] animate-bounce">
                        <Hammer className="text-white" size={48} />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter italic">VAGWIIN<span className="text-blue-600">.</span></h1>
                    <h2 className="text-2xl md:text-3xl font-black text-blue-400 mb-8 uppercase tracking-[0.2em]">Maintenance Mode</h2>
                    <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed mb-12">
                        We are currently performing scheduled technical upgrades to provide you with a more premium heritage tech experience. We'll be back shortly.
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <div className="px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Status</p>
                            <p className="text-white font-black">Upgrading Modules</p>
                        </div>
                        <div className="px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Priority</p>
                            <p className="text-blue-500 font-black italic">ULTRA HIGH</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return children;
};

export default MaintenanceWrapper;
