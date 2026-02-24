import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Laptop,
    Plus,
    ArrowRight,
    ShoppingCart,
    Wrench,
    IndianRupee,
    ChevronLeft,
    ChevronRight,
    Loader2
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import SidebarAdmin from '../../components/SidebarAdmin';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import orderService from '../../services/orderService';
import productService from '../../services/productService';
import warrantyService from '../../services/warrantyService';
import customerService from '../../services/customerService';
import { formatDate } from '../../utils/dateUtils';
import { useSettings } from '../../context/SettingsContext';

const Admin = () => {
    const { settings, currencySymbol } = useSettings();
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [warranties, setWarranties] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [stats, setStats] = useState({
        totalProducts: 0,
        ordersToday: 0,
        pendingRepairs: 0,
        salesToday: 0
    });
    const [salesTrend, setSalesTrend] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [ordersData, productsData, warrantiesData, customersData] = await Promise.all([
                orderService.getAllOrders(),
                productService.getAllProducts(),
                warrantyService.getAllWarranties(),
                customerService.getAllCustomers()
            ]);

            // Handle direct array or nested JSend structure
            const safeOrders = Array.isArray(ordersData) ? ordersData : (ordersData?.data?.orders || []);
            const safeProducts = Array.isArray(productsData) ? productsData : (productsData?.data?.products || []);
            const safeWarranties = Array.isArray(warrantiesData) ? warrantiesData : (warrantiesData?.data?.warranties || []);
            const safeCustomers = Array.isArray(customersData?.data?.customers) ? customersData.data.customers : [];

            setOrders(safeOrders);
            setProducts(safeProducts);
            setWarranties(safeWarranties);
            setCustomers(safeCustomers);

            // Calculate basic stats (Integrated)
            const today = new Date().toDateString();
            const todayOrders = safeOrders.filter(o => new Date(o.createdAt).toDateString() === today);
            const todayCustomers = safeCustomers.filter(c => new Date(c.createdAt).toDateString() === today);

            const onlineTodaySales = todayOrders.reduce((sum, o) => sum + o.totalPrice, 0);
            const offlineTodaySales = todayCustomers.reduce((sum, c) => sum + (c.totalSales || 0), 0);
            const totalTodaySales = onlineTodaySales + offlineTodaySales;

            const totalStock = safeProducts.reduce((sum, p) => sum + (p.stock || 0), 0);
            setStats({
                totalProducts: totalStock,
                ordersToday: todayOrders.length + todayCustomers.length,
                pendingRepairs: safeWarranties.length,
                salesToday: totalTodaySales
            });

            // Calculate 7-day sales trend
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const last7Days = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dayName = days[date.getDay()];
                const dateString = date.toDateString();

                const daySalesOnline = safeOrders
                    .filter(o => new Date(o.createdAt).toDateString() === dateString)
                    .reduce((sum, o) => sum + o.totalPrice, 0);

                const daySalesOffline = safeCustomers
                    .filter(c => new Date(c.createdAt).toDateString() === dateString)
                    .reduce((sum, c) => sum + (c.totalSales || 0), 0);

                last7Days.push({ name: dayName, sales: daySalesOnline + daySalesOffline, online: daySalesOnline, offline: daySalesOffline });
            }
            setSalesTrend(last7Days);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const dashboardStats = [
        { label: 'Available Units', value: stats.totalProducts, icon: Laptop, color: 'text-blue-600', bg: 'bg-blue-50', dot: 'bg-blue-400' },
        { label: 'Orders Today', value: stats.ordersToday, icon: ShoppingCart, color: 'text-green-600', bg: 'bg-green-50', dot: 'bg-green-400' },
        { label: 'Pending Repairs', value: stats.pendingRepairs, icon: Wrench, color: 'text-orange-600', bg: 'bg-orange-50', dot: 'bg-orange-400' },
        { label: 'Sales Today', value: `${currencySymbol}${stats.salesToday.toLocaleString()}`, icon: ShoppingCart, color: 'text-purple-600', bg: 'bg-purple-50', dot: 'bg-purple-400' },
    ];

    const totalAvailableUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const onlineSoldUnits = orders
        .filter(o => ['Shipped', 'Delivered'].includes(o.status))
        .reduce((sum, o) => sum + (o.items?.reduce((iSum, item) => iSum + (item.quantity || 0), 0) || 0), 0);

    const offlineSoldUnits = customers.reduce((sum, c) => sum + (c.purchases?.reduce((iSum, p) => iSum + (p.quantity || 0), 0) || 0), 0);
    const totalSoldUnits = onlineSoldUnits + offlineSoldUnits;

    const inventoryData = [
        { name: 'Available Units', value: totalAvailableUnits, color: '#3b82f6' },
        { name: 'Units Sold', value: totalSoldUnits, color: '#2563eb' },
    ];

    if (loading) {
        return (
            <div className="h-screen bg-[#f8fbff] flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                <p className="text-gray-500 font-bold italic tracking-widest text-[10px] md:text-sm">SYNCHRONIZING CORE DATA...</p>
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
                    <div className="mb-8 md:mb-12">
                        <h1 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight">Enterprise Overview</h1>
                        <p className="text-xs md:text-sm text-gray-400 font-medium tracking-wide mt-1">Real-time metrics from {settings.siteName} Core database.</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {dashboardStats.map((stat, i) => (
                            <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl`}>
                                        <stat.icon size={20} />
                                    </div>
                                    <div className="w-12 h-12 bg-gray-50/50 rounded-full animate-pulse"></div>
                                </div>
                                <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{stat.label}</h3>
                                <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
                        {/* Inventory Overview */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-2">
                                <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                                Inventory Status
                            </h3>
                            <div className="h-56 flex items-center justify-center relative">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                    <PieChart>
                                        <Pie
                                            data={inventoryData}
                                            innerRadius={70}
                                            outerRadius={95}
                                            paddingAngle={8}
                                            dataKey="value"
                                        >
                                            {inventoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontWeight: 'bold' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-2xl font-black text-gray-900">{totalAvailableUnits + totalSoldUnits}</span>
                                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Total Units</span>
                                </div>
                            </div>
                            <div className="mt-8 grid grid-cols-2 gap-6">
                                {inventoryData.map((item, i) => (
                                    <div key={i} className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.name}</span>
                                        </div>
                                        <span className="text-lg font-black text-gray-900 ml-4">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sales Report */}
                        <div className="lg:col-span-3 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 mb-1 flex items-center gap-2">
                                        <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                                        Revenue Performance
                                    </h3>
                                    <p className="text-xs text-blue-500 font-bold uppercase tracking-widest">7-Day Sales Trend</p>
                                </div>
                                <div className="px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Total: {currencySymbol}{(orders.reduce((sum, o) => sum + o.totalPrice, 0) + customers.reduce((sum, c) => sum + (c.totalSales || 0), 0)).toLocaleString()}
                                </div>
                            </div>
                            <div className="h-56">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                    <BarChart data={salesTrend}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fbff" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 900 }} tickFormatter={(val) => `${currencySymbol}${val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val}`} />
                                        <Tooltip
                                            cursor={{ fill: '#f8fbff' }}
                                            contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontWeight: 'bold' }}
                                        />
                                        <Bar dataKey="sales" fill="#3b82f6" radius={[10, 10, 0, 0]} barSize={28}>
                                            {salesTrend.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index === 6 ? '#2563eb' : '#3b82f6'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Tables Row */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* Recent Orders */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                    <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                                    Recent Orders
                                </h3>
                                <Link to="/orders" className="text-blue-600 text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-1">
                                    Full Ledger <ArrowRight size={14} />
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] border-b border-gray-50">
                                            <th className="pb-6">TXN ID</th>
                                            <th className="pb-6">Customer</th>
                                            <th className="pb-6">Date</th>
                                            <th className="pb-6 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {orders.slice(0, 5).map((order) => (
                                            <tr key={order._id} className="group hover:bg-gray-50/50 transition-colors">
                                                <td className="py-6 text-sm font-black text-blue-600">#{order._id.slice(-6).toUpperCase()}</td>
                                                <td className="py-6 text-sm font-bold text-gray-700">{order.shippingAddress.fullName}</td>
                                                <td className="py-6 text-[10px] text-gray-400 font-black uppercase">{formatDate(order.createdAt)}</td>
                                                <td className="py-6 text-right">
                                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${order.status === 'Shipped' ? 'bg-green-50 text-green-600 border-green-100' :
                                                        order.status === 'Processing' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                            'bg-slate-50 text-slate-600 border-slate-100'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Inventory Status */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                    <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                                    Inventory Monitor
                                </h3>
                                <Link to="/inventory" className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all">
                                    <Plus size={20} />
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] border-b border-gray-50">
                                            <th className="pb-6">Asset ID</th>
                                            <th className="pb-6">Description</th>
                                            <th className="pb-6 text-right">Valuation</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {products.slice(0, 5).map((product) => (
                                            <tr key={product._id} className="group hover:bg-gray-50/50 transition-colors">
                                                <td className="py-6 text-sm font-black text-blue-600">#{product._id.slice(-4).toUpperCase()}</td>
                                                <td className="py-6">
                                                    <p className="text-sm font-bold text-gray-700 truncate max-w-[200px]">{product.name}</p>
                                                    <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                                                        Grade {product.grade || 'A'}
                                                    </span>
                                                </td>
                                                <td className="py-6 text-right text-sm font-black text-gray-900">{currencySymbol}{product.price.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Admin;
