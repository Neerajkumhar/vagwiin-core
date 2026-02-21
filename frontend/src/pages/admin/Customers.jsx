import React, { useState, useEffect } from 'react';
import {
    Users,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Trash2,
    Edit2,
    ShoppingBag,
    Store,
    Globe,
    TrendingUp,
    IndianRupee,
    Loader2,
    X
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import SidebarAdmin from '../../components/SidebarAdmin';
import customerService from '../../services/customerService';
import productService from '../../services/productService';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'Offline',
        email: '',
        phone: '',
        address: '',
        totalSales: 0,
        purchases: [] // Array of { product: id, quantity: n, price: p, name: s }
    });

    useEffect(() => {
        fetchCustomers();
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const data = await productService.getAllProducts();
            const safeProducts = Array.isArray(data) ? data : (data?.data?.products || []);
            setInventory(safeProducts);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        }
    };

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const data = await customerService.getAllCustomers();
            setCustomers(data.data.customers);
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await customerService.updateCustomer(currentCustomer._id, formData);
            } else {
                await customerService.createCustomer(formData);
            }
            setShowModal(false);
            resetForm();
            fetchCustomers();
            fetchInventory(); // Update inventory stock levels
        } catch (error) {
            console.error('Error saving customer:', error);
            alert(error.response?.data?.message || error.message || 'Error saving customer');
        }
    };

    const handleEdit = (customer) => {
        setCurrentCustomer(customer);
        setFormData({
            name: customer.name,
            type: customer.type,
            email: customer.email || '',
            phone: customer.phone || '',
            address: customer.address || '',
            totalSales: customer.totalSales || 0
        });
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await customerService.deleteCustomer(id);
                fetchCustomers();
            } catch (error) {
                console.error('Error deleting customer:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            type: 'Offline',
            email: '',
            phone: '',
            address: '',
            totalSales: 0,
            purchases: []
        });
        setIsEditing(false);
        setCurrentCustomer(null);
    };

    const addItem = () => {
        setFormData({
            ...formData,
            purchases: [...formData.purchases, { product: '', quantity: 1, price: 0, name: '' }]
        });
    };

    const removeItem = (index) => {
        const newPurchases = formData.purchases.filter((_, i) => i !== index);
        setFormData({ ...formData, purchases: newPurchases });
    };

    const handleItemChange = (index, field, value) => {
        const newPurchases = [...formData.purchases];
        if (field === 'product') {
            const selectedProd = inventory.find(p => p._id === value);
            newPurchases[index] = {
                ...newPurchases[index],
                product: value,
                name: selectedProd?.name || '',
                price: selectedProd?.price || 0
            };
        } else {
            newPurchases[index] = { ...newPurchases[index], [field]: value };
        }

        // Calculate total sales automatically
        const newTotal = newPurchases.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setFormData({ ...formData, purchases: newPurchases, totalSales: newTotal });
    };

    const filteredCustomers = customers.filter(customer => {
        const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesFilter = filterType === 'All' || customer.type === filterType;
        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: customers.length,
        offline: customers.filter(c => c.type === 'Offline').length,
        flipkart: customers.filter(c => c.type === 'Flipkart').length,
        amazon: customers.filter(c => c.type === 'Amazon').length,
        totalSales: customers.reduce((sum, c) => sum + (c.totalSales || 0), 0)
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'Offline': return <Store className="text-blue-500" size={18} />;
            case 'Flipkart': return <ShoppingBag className="text-orange-500" size={18} />;
            case 'Amazon': return <Globe className="text-yellow-600" size={18} />;
            default: return <Users className="text-gray-500" size={18} />;
        }
    };

    if (loading) {
        return (
            <div className="h-screen bg-[#f8fbff] flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                <p className="text-gray-500 font-bold italic tracking-widest uppercase text-[10px] md:text-xs">LOADING CUSTOMER DATA...</p>
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
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
                        <div>
                            <h1 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight">Customer Management</h1>
                            <p className="text-xs md:text-sm text-gray-400 font-medium">Manage and track your customers across platforms.</p>
                        </div>
                        <button
                            onClick={() => { resetForm(); setShowModal(true); }}
                            className="bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
                        >
                            <Plus size={18} />
                            Add Customer
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatCard label="Total Customers" value={stats.total} icon={Users} color="text-blue-600" bg="bg-blue-50" />
                        <StatCard label="Offline Store" value={stats.offline} icon={Store} color="text-indigo-600" bg="bg-indigo-50" />
                        <StatCard label="Flipkart Orders" value={stats.flipkart} icon={ShoppingBag} color="text-orange-600" bg="bg-orange-50" />
                        <StatCard label="Amazon Orders" value={stats.amazon} icon={Globe} color="text-yellow-600" bg="bg-yellow-50" />
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-medium text-sm text-gray-700"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            {['All', 'Offline', 'Flipkart', 'Amazon'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filterType === type
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Customers Table */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-black">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] border-b border-gray-50">
                                        <th className="p-6">Customer Details</th>
                                        <th className="p-6">Type</th>
                                        <th className="p-6">Contact Info</th>
                                        <th className="p-6">Total Sales</th>
                                        <th className="p-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 font-black ">
                                    {filteredCustomers.length > 0 ? (
                                        filteredCustomers.map((customer) => (
                                            <tr key={customer._id} className="group hover:bg-gray-50/50 transition-colors">
                                                <td className="p-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black">
                                                            {customer.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-gray-900">{customer.name}</p>
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {customer.purchases?.map((p, i) => (
                                                                    <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black rounded-md uppercase">
                                                                        {p.name} (x{p.quantity})
                                                                    </span>
                                                                ))}
                                                            </div>
                                                            <p className="text-[10px] text-gray-400 font-medium mt-1">Added on {new Date(customer.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex items-center gap-2">
                                                        {getTypeIcon(customer.type)}
                                                        <span className="text-xs font-bold text-gray-700">{customer.type}</span>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <p className="text-xs font-medium text-gray-600">{customer.email || 'No Email'}</p>
                                                    <p className="text-xs font-medium text-gray-600">{customer.phone || 'No Phone'}</p>
                                                </td>
                                                <td className="p-6">
                                                    <span className="text-sm font-black text-gray-900">₹{customer.totalSales?.toLocaleString() || 0}</span>
                                                </td>
                                                <td className="p-6 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEdit(customer)}
                                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(customer._id)}
                                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="p-20 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="p-4 bg-gray-50 rounded-full text-gray-300">
                                                        <Users size={48} />
                                                    </div>
                                                    <p className="text-gray-400 font-bold italic tracking-widest">NO CUSTOMERS FOUND</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Footer Addition Stats */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Total Platform Sales</p>
                                <h4 className="text-2xl font-black text-gray-900">₹{stats.totalSales.toLocaleString()}</h4>
                            </div>
                            <div className="p-4 bg-green-50 text-green-600 rounded-2xl">
                                <TrendingUp size={24} />
                            </div>
                        </div>
                        {/* Summary of Platform Distribution */}
                        <div className="md:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-3xl shadow-xl shadow-blue-200 flex items-center justify-around text-white">
                            <div className="text-center">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Offline</p>
                                <p className="text-2xl font-black">{Math.round((stats.offline / stats.total) * 100 || 0)}%</p>
                            </div>
                            <div className="w-px h-10 bg-white/20"></div>
                            <div className="text-center">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Flipkart</p>
                                <p className="text-2xl font-black">{Math.round((stats.flipkart / stats.total) * 100 || 0)}%</p>
                            </div>
                            <div className="w-px h-10 bg-white/20"></div>
                            <div className="text-center">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Amazon</p>
                                <p className="text-2xl font-black">{Math.round((stats.amazon / stats.total) * 100 || 0)}%</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal for Add/Edit Customer */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-4xl rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center text-black">
                            <h2 className="text-xl font-black text-gray-900">{isEditing ? 'Edit Customer' : 'Add New Customer'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-900"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Platform</label>
                                    <select
                                        name="type"
                                        className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-900 appearance-none"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                    >
                                        <option value="Offline">Offline Store</option>
                                        <option value="Flipkart">Flipkart</option>
                                        <option value="Amazon">Amazon</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-900"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-900"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+91 XXXXX XXXXX"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Sales (₹)</label>
                                    <input
                                        type="number"
                                        name="totalSales"
                                        readOnly={formData.purchases.length > 0}
                                        className={`w-full px-4 py-2.5 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-900 ${formData.purchases.length > 0 ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        value={formData.totalSales}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="md:col-span-3">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Shipping Address</label>
                                    <input
                                        name="address"
                                        className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-900"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Enter full delivery address..."
                                    />
                                </div>
                            </div>
                            {/* Product Selection Section */}
                            {!isEditing && (
                                <div className="col-span-2 pt-4 border-t border-gray-100">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Select Products</h3>
                                        <button
                                            type="button"
                                            onClick={addItem}
                                            className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                        >
                                            <Plus size={14} /> Add Item
                                        </button>
                                    </div>

                                    <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                        {formData.purchases.map((item, index) => (
                                            <div key={index} className="flex gap-3 items-end bg-gray-50 p-3 rounded-2xl">
                                                <div className="flex-1">
                                                    <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Model</label>
                                                    <select
                                                        className="w-full bg-white border-none rounded-xl text-xs font-bold p-2 focus:ring-1 focus:ring-blue-500"
                                                        value={item.product}
                                                        onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                                                    >
                                                        <option value="">Select Model</option>
                                                        {inventory.map(p => (
                                                            <option key={p._id} value={p._id} disabled={p.stock <= 0}>
                                                                {p.name} (Stock: {p.stock})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="w-20">
                                                    <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Qty</label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        className="w-full bg-white border-none rounded-xl text-xs font-bold p-2 focus:ring-1 focus:ring-blue-500"
                                                        value={item.quantity}
                                                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(index)}
                                                    className="p-2 text-red-400 hover:text-red-600 mb-0.5"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        {formData.purchases.length === 0 && (
                                            <p className="text-[10px] text-gray-400 italic text-center py-4">No products selected for this sale.</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="pt-6 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                                >
                                    {isEditing ? 'Update Customer' : 'Process Sale & Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ label, value, icon: Icon, color, bg }) => (
    <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
        <div className="flex justify-between items-start mb-6">
            <div className={`p-4 ${bg} ${color} rounded-2xl`}>
                <Icon size={20} />
            </div>
            <div className="w-12 h-12 bg-gray-50/50 rounded-full animate-pulse"></div>
        </div>
        <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{label}</h3>
        <p className="text-2xl font-black text-gray-900">{value}</p>
    </div>
);

export default Customers;
