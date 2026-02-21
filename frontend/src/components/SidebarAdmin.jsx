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
    MessageSquare
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const SidebarAdmin = () => {
    const location = useLocation();

    return (
        <aside className="w-56 bg-slate-900 text-slate-300 flex flex-col h-full shrink-0 border-r border-slate-800">
            <div className="p-4 space-y-1">
                <SidebarLink icon={LayoutDashboard} label="Dashboard" to="/admin" active={location.pathname === '/admin'} />
                <SidebarLink icon={Home} label="Home" to="/" />

                <SidebarLink icon={Package} label="Inventory" to="/inventory" active={location.pathname === '/inventory'} />
                <SidebarLink icon={ShoppingBag} label="Orders" to="/orders" active={location.pathname === '/orders'} />
                <SidebarLink icon={CheckCircle2} label="Delivered" to="/admin/delivered" active={location.pathname === '/admin/delivered'} />
                <SidebarLink icon={ShieldCheck} label="Warranties" to="/admin/warranties" active={location.pathname === '/admin/warranties'} />
                <SidebarLink icon={MessageSquare} label="Complaints" to="/admin/complaints" active={location.pathname === '/admin/complaints'} />
                <SidebarLink icon={Wrench} label="Technicians" to="/admin/technicians" active={location.pathname === '/admin/technicians'} />
                <SidebarLink icon={Users} label="Customers" to="/admin/customers" active={location.pathname === '/admin/customers'} />
                <SidebarLink icon={BarChart3} label="Analytics" to="/admin/analytics" active={location.pathname === '/admin/analytics'} />
                <SidebarLink icon={Settings} label="Settings" to="/admin" active={location.pathname === '/settings'} />
            </div>

            <div className="mt-auto p-4 border-t border-slate-800">
                <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium hover:bg-slate-800 rounded-xl transition-colors">
                    <UserSquare2 size={18} />
                    Manage Users
                </button>
            </div>
        </aside>
    );
};

const SidebarLink = ({ icon: Icon, label, to = "#", active = false }) => (
    <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${active
            ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
    >
        <Icon size={18} />
        {label}
    </Link>
);

export default SidebarAdmin;
