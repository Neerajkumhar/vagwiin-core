import React from 'react';
import {
    LayoutDashboard,
    Home,
    Package,
    ShoppingBag,
    Wrench,
    Users,
    BarChart3,
    Settings,
    UserSquare2,
    ShieldCheck,
    CheckCircle2,
    MessageSquare,
    X,
    LogOut
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const SidebarAdmin = ({ isOpen, onClose }) => {
    const location = useLocation();

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-[70]
                w-64 lg:w-56 bg-white lg:bg-slate-900 
                flex flex-col h-full shrink-0 
                border-r border-gray-100 lg:border-slate-800
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 lg:p-4 border-b border-gray-50 lg:border-slate-800 flex items-center justify-between lg:block mb-2">
                    <span className="font-black text-xl lg:text-slate-100 tracking-tighter italic lg:hidden">ADMIN PANEL</span>
                    <button onClick={onClose} className="lg:hidden p-2 hover:bg-gray-100 rounded-xl text-gray-400">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-1">
                    <SidebarLink icon={LayoutDashboard} label="Dashboard" to="/admin" active={location.pathname === '/admin'} onClose={onClose} />
                    <SidebarLink icon={Home} label="Back to Site" to="/" onClose={onClose} />

                    <div className="my-6 lg:my-4">
                        <p className="px-4 text-[10px] font-black text-gray-400 lg:text-slate-500 uppercase tracking-widest mb-2">Management</p>
                        <SidebarLink icon={Package} label="Inventory" to="/inventory" active={location.pathname === '/inventory'} onClose={onClose} />
                        <SidebarLink icon={ShoppingBag} label="Orders" to="/orders" active={location.pathname === '/orders'} onClose={onClose} />
                        <SidebarLink icon={CheckCircle2} label="Delivered" to="/admin/delivered" active={location.pathname === '/admin/delivered'} onClose={onClose} />
                    </div>

                    <div className="my-6 lg:my-4">
                        <p className="px-4 text-[10px] font-black text-gray-400 lg:text-slate-500 uppercase tracking-widest mb-2">Support</p>
                        <SidebarLink icon={ShieldCheck} label="Warranties" to="/admin/warranties" active={location.pathname === '/admin/warranties'} onClose={onClose} />
                        <SidebarLink icon={MessageSquare} label="Complaints" to="/admin/complaints" active={location.pathname === '/admin/complaints'} onClose={onClose} />
                    </div>

                    <div className="my-6 lg:my-4">
                        <p className="px-4 text-[10px] font-black text-gray-400 lg:text-slate-500 uppercase tracking-widest mb-2">System</p>
                        <SidebarLink icon={Wrench} label="Technicians" to="/admin/technicians" active={location.pathname === '/admin/technicians'} onClose={onClose} />
                        <SidebarLink icon={Users} label="Customers" to="/admin/customers" active={location.pathname === '/admin/customers'} onClose={onClose} />
                        <SidebarLink icon={BarChart3} label="Analytics" to="/admin/analytics" active={location.pathname === '/admin/analytics'} onClose={onClose} />
                    </div>
                </div>

                <div className="mt-auto p-4 border-t border-gray-50 lg:border-slate-800 space-y-2">
                    <SidebarLink icon={Settings} label="Global Settings" to="/admin/settings" active={location.pathname === '/admin/settings'} onClose={onClose} />
                    <button className="flex lg:hidden items-center gap-3 w-full px-4 py-3 text-sm font-bold text-red-500 bg-red-50 rounded-xl transition-all active:scale-95">
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
};

const SidebarLink = ({ icon: Icon, label, to = "#", active = false, onClose }) => (
    <Link
        to={to}
        onClick={() => onClose && onClose()}
        className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${active
            ? 'bg-blue-600 lg:bg-blue-600/10 text-white lg:text-blue-400 border border-blue-500/20'
            : 'text-gray-500 lg:text-slate-400 hover:text-gray-900 lg:hover:text-white hover:bg-gray-50 lg:hover:bg-slate-800'
            }`}
    >
        <Icon size={18} />
        {label}
    </Link>
);

export default SidebarAdmin;
