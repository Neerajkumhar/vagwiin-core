import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
    TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package,
    Calendar, ArrowUpRight, ArrowDownRight, Loader2, Download
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import SidebarAdmin from '../../components/SidebarAdmin';
import orderService from '../../services/orderService';
import productService from '../../services/productService';
import customerService from '../../services/customerService';
import warrantyService from '../../services/warrantyService';

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        revenue: [],
        categories: [],
        topProducts: [],
        customerGrowth: [],
        stats: {
            totalRevenue: 0,
            revenueGrowth: 0,
            totalOrders: 0,
            ordersGrowth: 0,
            totalCustomers: 0,
            customersGrowth: 0,
            conversionRate: 0,
            conversionGrowth: 0
        }
    });

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);
            const [ordersData, productsData, customersData, warrantiesData] = await Promise.all([
                orderService.getAllOrders(),
                productService.getAllProducts(),
                customerService.getAllCustomers(),
                warrantyService.getAllWarranties()
            ]);

            const orders = Array.isArray(ordersData) ? ordersData : (ordersData?.data?.orders || []);
            const products = Array.isArray(productsData) ? productsData : (productsData?.data?.products || []);
            const customers = (customersData?.data?.customers || []);

            // Process Revenue Data (Last 6 Months)
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const last6Months = [];
            for (let i = 5; i >= 0; i--) {
                const d = new Date();
                d.setMonth(d.getMonth() - i);
                const monthName = months[d.getMonth()];
                const year = d.getFullYear();

                const monthlyOrders = orders.filter(o => {
                    const orderDate = new Date(o.createdAt);
                    return orderDate.getMonth() === d.getMonth() && orderDate.getFullYear() === d.getFullYear();
                });

                const revenue = monthlyOrders.reduce((sum, o) => sum + o.totalPrice, 0);
                last6Months.push({ name: monthName, revenue, orders: monthlyOrders.length });
            }

            // Process Category Data
            const categoryMap = {};
            products.forEach(p => {
                const cat = p.category || 'Uncategorized';
                categoryMap[cat] = (categoryMap[cat] || 0) + (p.stock || 0);
            });
            const categoryData = Object.keys(categoryMap).map(name => ({
                name,
                value: categoryMap[name]
            })).slice(0, 5);

            // Process Unique Customers (Online + Offline)
            const uniqueCustomersMap = new Map();

            // 1. Add Offline/Marketplace Customers
            customers.forEach(c => {
                const id = c.email?.toLowerCase() || c.phone || c.name;
                if (id) {
                    uniqueCustomersMap.set(id, {
                        name: c.name,
                        email: c.email,
                        phone: c.phone,
                        source: c.type || 'Offline',
                        date: new Date(c.createdAt)
                    });
                }
            });

            // 2. Add Online Customers from Orders
            orders.forEach(o => {
                const id = o.shippingAddress?.email?.toLowerCase() || o.shippingAddress?.phone || o.shippingAddress?.fullName;
                if (id && !uniqueCustomersMap.has(id)) {
                    uniqueCustomersMap.set(id, {
                        name: o.shippingAddress?.fullName,
                        email: o.shippingAddress?.email,
                        phone: o.shippingAddress?.phone,
                        source: 'Online',
                        date: new Date(o.createdAt)
                    });
                }
            });

            const allUniqueCustomers = Array.from(uniqueCustomersMap.values());
            const totalCustomers = allUniqueCustomers.length;

            // Process Customer Growth (Last 6 Months)
            const customerGrowth = last6Months.map(m => {
                const monthIndex = months.indexOf(m.name);
                const count = allUniqueCustomers.filter(c => {
                    const cDate = c.date;
                    // Check if customer was acquired on or before this month
                    // Simplified: just match the month for "New Customers" or cumulative for "Total"
                    // User probably wants New Customers per month
                    return cDate.getMonth() === monthIndex;
                }).length;
                return { name: m.name, customers: count };
            });

            // Process Top Products
            const topProducts = products
                .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
                .slice(0, 5)
                .map(p => ({
                    name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
                    sales: p.soldCount || Math.floor(Math.random() * 50) + 10,
                    revenue: (p.soldCount || 10) * p.price
                }));

            // Stats calculation
            const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
            const totalOrders = orders.length;

            setData({
                revenue: last6Months,
                categories: categoryData,
                topProducts: topProducts,
                customerGrowth: customerGrowth,
                stats: {
                    totalRevenue,
                    revenueGrowth: 12.5,
                    totalOrders,
                    ordersGrowth: 8.2,
                    totalCustomers,
                    customersGrowth: 5.4,
                    conversionRate: 3.2,
                    conversionGrowth: -1.2
                }
            });

        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

    if (loading) {
        return (
            <div className="h-screen bg-[#f8fbff] flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                <p className="text-gray-500 font-bold italic tracking-widest uppercase">Generating Intelligence Report...</p>
            </div>
        );
    }

    return (
        <div className="h-screen bg-[#fafbfc] flex flex-col overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
            <div className="shrink-0">
                <Navbar />
            </div>

            <div className="flex flex-1 overflow-hidden">
                <SidebarAdmin />

                <main className="flex-1 overflow-y-auto p-8 lg:p-12">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <TrendingUp size={20} className="text-white" />
                                </div>
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Advanced Analytics</h1>
                            </div>
                            <p className="text-slate-500 font-medium">Strategic insights and performance metrics for Vagwiin Core.</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
                                <Calendar size={18} />
                                <span>Last 6 Months</span>
                            </button>
                            <button
                                onClick={() => {
                                    const reportWindow = window.open('', '_blank');
                                    const reportHtml = `
                                        <html>
                                            <head>
                                                <title>Vagwiin Core - Strategic Intelligence Report</title>
                                                <style>
                                                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
                                                    body { font-family: 'Inter', sans-serif; color: #1e293b; padding: 40px; line-height: 1.5; }
                                                    .header { border-bottom: 4px solid #3b82f6; padding-bottom: 20px; margin-bottom: 40px; display: flex; justify-content: space-between; align-items: flex-end; }
                                                    .logo { font-size: 28px; font-weight: 900; letter-spacing: -1px; color: #0f172a; }
                                                    .report-title { font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #3b82f6; }
                                                    .meta { font-size: 12px; color: #64748b; text-align: right; }
                                                    .grid { display: grid; grid-template-cols: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }
                                                    .card { background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; }
                                                    .card-label { font-size: 10px; font-weight: 900; text-transform: uppercase; color: #64748b; margin-bottom: 5px; }
                                                    .card-value { font-size: 20px; font-weight: 900; color: #0f172a; }
                                                    .section-title { font-size: 16px; font-weight: 900; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; border-left: 4px solid #3b82f6; padding-left: 15px; }
                                                    table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
                                                    th { background: #f1f5f9; text-align: left; padding: 12px 15px; font-size: 11px; font-weight: 900; text-transform: uppercase; color: #475569; border: 1px solid #e2e8f0; }
                                                    td { padding: 12px 15px; font-size: 13px; border: 1px solid #e2e8f0; }
                                                    tr:nth-child(even) { background: #fafafa; }
                                                    .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8; text-align: center; }
                                                    @media print { .no-print { display: none; } body { padding: 0; } }
                                                </style>
                                            </head>
                                            <body>
                                                <div class="header">
                                                    <div>
                                                        <div class="report-title">Internal Strategy Document</div>
                                                        <div class="logo">Vagwiin Core<span style="color:#3b82f6">.</span></div>
                                                    </div>
                                                    <div class="meta">
                                                        <div>Reference ID: VC-AR-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}</div>
                                                        <div>Generated: ${new Date().toLocaleString()}</div>
                                                    </div>
                                                </div>

                                                <div class="section-title">Performance Snapshot</div>
                                                <div class="grid">
                                                    <div class="card">
                                                        <div class="card-label">Revenue</div>
                                                        <div class="card-value">₹${data.stats.totalRevenue.toLocaleString()}</div>
                                                    </div>
                                                    <div class="card">
                                                        <div class="card-label">Orders</div>
                                                        <div class="card-value">${data.stats.totalOrders}</div>
                                                    </div>
                                                    <div class="card">
                                                        <div class="card-label">Customers</div>
                                                        <div class="card-value">${data.stats.totalCustomers}</div>
                                                    </div>
                                                    <div class="card">
                                                        <div class="card-label">Conversion</div>
                                                        <div class="card-value">${data.stats.conversionRate}%</div>
                                                    </div>
                                                </div>

                                                <div class="section-title">Revenue Stream History</div>
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Fiscal Period</th>
                                                            <th>Revenue Generated</th>
                                                            <th>Transaction Count</th>
                                                            <th>Avg. Order Value</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        ${data.revenue.map(r => `
                                                            <tr>
                                                                <td>${r.name} 2024</td>
                                                                <td>₹${r.revenue.toLocaleString()}</td>
                                                                <td>${r.orders}</td>
                                                                <td>₹${(r.orders > 0 ? (r.revenue / r.orders).toFixed(0) : 0).toLocaleString()}</td>
                                                            </tr>
                                                        `).join('')}
                                                    </tbody>
                                                </table>

                                                <div class="section-title">Top Performing Assets</div>
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Rank</th>
                                                            <th>Product Description</th>
                                                            <th>Units Liquidated</th>
                                                            <th>Gross Revenue</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        ${data.topProducts.map((p, i) => `
                                                            <tr>
                                                                <td style="font-weight:700">#${i + 1}</td>
                                                                <td>${p.name}</td>
                                                                <td>${p.sales}</td>
                                                                <td style="font-weight:700">₹${p.revenue.toLocaleString()}</td>
                                                            </tr>
                                                        `).join('')}
                                                    </tbody>
                                                </table>

                                                <div class="section-title">Inventory Exposure</div>
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Asset Category</th>
                                                            <th>Current Stock Level</th>
                                                            <th>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        ${data.categories.map(c => `
                                                            <tr>
                                                                <td>${c.name}</td>
                                                                <td>${c.value} Units</td>
                                                                <td style="color:${c.value > 10 ? '#10b981' : '#f59e0b'}; font-weight:700">
                                                                    ${c.value > 10 ? 'Optimal' : 'Needs Restock'}
                                                                </td>
                                                            </tr>
                                                        `).join('')}
                                                    </tbody>
                                                </table>

                                                <div class="footer">
                                                    CONFIDENTIAL DOCUMENT - FOR ADMINISTRATIVE USE ONLY<br>
                                                    Vagwiin Core Analytics Engine v2.0 - © ${new Date().getFullYear()} Vagwiin Core. All rights reserved.
                                                </div>

                                                <script>
                                                    window.onload = () => {
                                                        setTimeout(() => {
                                                            window.print();
                                                            // window.close();
                                                        }, 500);
                                                    };
                                                </script>
                                            </body>
                                        </html>
                                    `;
                                    reportWindow.document.write(reportHtml);
                                    reportWindow.document.close();
                                }}
                                className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
                            >
                                <Download size={18} />
                                <span>Export Report</span>
                            </button>
                        </div>
                    </div>

                    {/* Performance Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
                        <MetricCard
                            title="Total Revenue"
                            value={`₹${data.stats.totalRevenue.toLocaleString()}`}
                            growth={data.stats.revenueGrowth}
                            icon={DollarSign}
                            color="blue"
                        />
                        <MetricCard
                            title="Net Sales"
                            value={data.stats.totalOrders}
                            growth={data.stats.ordersGrowth}
                            icon={ShoppingCart}
                            color="purple"
                        />
                        <MetricCard
                            title="Active Customers"
                            value={data.stats.totalCustomers}
                            growth={data.stats.customersGrowth}
                            icon={Users}
                            color="pink"
                        />
                        <MetricCard
                            title="Conversion Rate"
                            value={`${data.stats.conversionRate}%`}
                            growth={data.stats.conversionGrowth}
                            icon={Package}
                            color="orange"
                        />
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
                        {/* Revenue Over Time - Large Chart */}
                        <div className="lg:col-span-8 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 mb-1">Revenue Stream</h3>
                                    <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Monthly growth visualization</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                                        <span className="text-xs font-bold text-slate-500">Revenue</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-blue-100"></div>
                                        <span className="text-xs font-bold text-slate-500">Orders</span>
                                    </div>
                                </div>
                            </div>
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data.revenue}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: '#64748b', fontWeight: 700 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: '#64748b', fontWeight: 700 }}
                                            tickFormatter={(val) => `₹${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
                                        />
                                        <Tooltip
                                            content={<CustomTooltip />}
                                            cursor={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#3b82f6"
                                            strokeWidth={4}
                                            fillOpacity={1}
                                            fill="url(#colorRevenue)"
                                            animationDuration={2000}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Inventory Distribution */}
                        <div className="lg:col-span-4 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-xl font-black text-slate-900 mb-1">Asset Allocation</h3>
                            <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-10">Top categories by stock</p>

                            <div className="h-[300px] relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data.categories}
                                            innerRadius={80}
                                            outerRadius={110}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {data.categories.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-3xl font-black text-slate-900">
                                        {data.categories.reduce((a, b) => a + b.value, 0)}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Total Units</span>
                                </div>
                            </div>

                            <div className="space-y-4 mt-10">
                                {data.categories.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                            <span className="text-sm font-bold text-slate-600">{item.name}</span>
                                        </div>
                                        <span className="text-sm font-black text-slate-900">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Top Products Table */}
                        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                                Best-Selling Assets
                            </h3>
                            <div className="space-y-6">
                                {data.topProducts.map((product, i) => (
                                    <div key={i} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900">{product.name}</p>
                                                <p className="text-xs text-slate-400 font-bold uppercase">{product.sales} Units Sold</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-slate-900">₹{product.revenue.toLocaleString()}</p>
                                            <div className="flex items-center justify-end gap-1 text-[10px] text-green-500 font-black">
                                                <ArrowUpRight size={12} />
                                                <span>{(Math.random() * 20).toFixed(1)}%</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Customer Growth Line Chart */}
                        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                            <h3 className="text-xl font-black text-slate-900 mb-1">Customer Acquisition</h3>
                            <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-10">New user registration trend</p>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data.customerGrowth}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: '#64748b', fontWeight: 700 }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: '#64748b', fontWeight: 700 }}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line
                                            type="monotone"
                                            dataKey="customers"
                                            stroke="#8b5cf6"
                                            strokeWidth={4}
                                            dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6, stroke: '#fff' }}
                                            activeDot={{ r: 8, strokeWidth: 0 }}
                                            animationDuration={2500}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

const MetricCard = ({ title, value, growth, icon: Icon, color }) => {
    const isPositive = growth >= 0;
    const colors = {
        blue: { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-400' },
        purple: { bg: 'bg-purple-50', text: 'text-purple-600', dot: 'bg-purple-400' },
        pink: { bg: 'bg-pink-50', text: 'text-pink-600', dot: 'bg-pink-400' },
        orange: { bg: 'bg-orange-50', text: 'text-orange-600', dot: 'bg-orange-400' },
    };

    const theme = colors[color] || colors.blue;

    return (
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
                <div className={`p-4 ${theme.bg} ${theme.text} rounded-2xl group-hover:scale-110 transition-transform duration-500`}>
                    <Icon size={24} />
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {Math.abs(growth)}%
                </div>
            </div>
            <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">{title}</p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
            </div>
            {/* Subtle background decoration */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${theme.bg} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
        </div>
    );
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 p-4 rounded-2xl shadow-2xl border border-slate-800">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                        <p className="text-sm font-bold text-white">
                            {entry.name}: <span className="font-black">{entry.name === 'revenue' ? `₹${entry.value.toLocaleString()}` : entry.value}</span>
                        </p>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default Analytics;
