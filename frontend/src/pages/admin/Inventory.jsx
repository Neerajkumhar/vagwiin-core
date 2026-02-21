import React, { useState, useEffect } from 'react';
import {
    Package,
    Plus,
    Search,
    Filter,
    Edit3,
    Trash2,
    Eye,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Laptop,
    Box,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Database,
    Cpu,
    Monitor,
    HardDrive,
    ShieldCheck,
    Globe,
    Weight,
    Link2,
    ListChecks,
    Loader2
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import SidebarAdmin from '../../components/SidebarAdmin';
import productService from '../../services/productService';
import product1 from '../../assets/images/product_1.png';
import product2 from '../../assets/images/product_2.png';

const Inventory = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editProductId, setEditProductId] = useState(null);
    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({
        sku: '',
        name: '',
        brand: '',
        os: '',
        cpu: '',
        gpu: '',
        display: '',
        storage: '',
        ram: '',
        warranty: '',
        weight: '',
        connectivity: '',
        highlights: '',
        description: '',
        grade: 'A',
        price: '',
        stock: ''
    });

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const response = await productService.getAllProducts();
            if (response.status === 'success') {
                setInventory(response.data.products);
            }
        } catch (error) {
            console.error('Failed to fetch inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);

            // 1. Upload images to Cloudinary (only if new files are selected)
            let imageUrls = isEditing ? formData.images : [];
            const filesToUpload = images.map(img => img.file).filter(file => file);

            if (filesToUpload.length > 0) {
                const uploadRes = await productService.uploadImages(filesToUpload);
                if (uploadRes.status === 'success') {
                    imageUrls = isEditing ? [...imageUrls, ...uploadRes.urls] : uploadRes.urls;
                }
            }

            // 2. Prepare final product data
            const productData = {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock),
                highlights: typeof formData.highlights === 'string' ? formData.highlights.split(',').map(h => h.trim()).filter(h => h !== '') : formData.highlights,
                images: imageUrls
            };

            let response;
            if (isEditing) {
                response = await productService.updateProduct(editProductId, productData);
            } else {
                response = await productService.createProduct(productData);
            }

            if (response.status === 'success') {
                setIsAddModalOpen(false);
                setIsEditing(false);
                setEditProductId(null);
                fetchInventory();
                // Reset form
                resetForm();
            }
        } catch (error) {
            console.error('Failed to save product:', error);
            const errorMsg = error.response?.data?.message || error.message;
            alert('Failed to save product: ' + errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            sku: '', name: '', brand: '', os: '', cpu: '', gpu: '',
            display: '', storage: '', ram: '', warranty: '',
            weight: '', connectivity: '', highlights: '', description: '',
            grade: 'A', price: '', stock: ''
        });
        setImages([]);
    };

    const handleEdit = (product) => {
        setFormData({
            ...product,
            highlights: product.highlights.join(', ')
        });
        setImages(product.images.map(url => ({ url, file: null })));
        setIsEditing(true);
        setEditProductId(product._id);
        setIsAddModalOpen(true);
    };

    const handleView = (id) => {
        window.open(`/product/${id}`, '_blank');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productService.deleteProduct(id);
                fetchInventory();
            } catch (error) {
                console.error('Failed to delete product:', error);
            }
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        // In a real app, upload these to a server
        const newImages = files.map(file => ({
            url: URL.createObjectURL(file), // This is temporary for preview
            file: file
        }));
        setImages(prev => [...prev, ...newImages]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const inventoryStats = [
        { label: 'Total Items', value: inventory.reduce((acc, p) => acc + (p.stock || 0), 0).toString(), icon: Box, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Low Stock', value: inventory.filter(p => p.status === 'Low Stock').length.toString(), icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Out of Stock', value: inventory.filter(p => p.status === 'Out of Stock').length.toString(), icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
        { label: 'Total Value', value: `₹${(inventory.reduce((acc, p) => acc + (p.price * p.stock), 0) / 100000).toFixed(1)}L`, icon: Database, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Available': return 'bg-green-100 text-green-700 border-green-200';
            case 'Low Stock': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Out of Stock': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="h-screen bg-[#f8fbff] flex flex-col overflow-hidden">
            <div className="shrink-0">
                <Navbar />
            </div>

            <div className="flex flex-1 overflow-hidden">
                <SidebarAdmin />

                <main className="flex-1 overflow-y-auto p-6">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 mb-2">Inventory Management</h1>
                            <p className="text-gray-500 font-medium">Add, track and manage your refurbished laptop stock.</p>
                        </div>
                        <button
                            onClick={() => {
                                resetForm();
                                setIsEditing(false);
                                setIsAddModalOpen(true);
                            }}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95 text-sm"
                        >
                            <Plus size={20} /> Add New Product
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {inventoryStats.map((stat, i) => (
                            <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl`}>
                                        <stat.icon size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
                                        <p className="text-xl font-black text-gray-900">{stat.value}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Filters & Search */}
                    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm mb-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-96">
                            <input
                                type="text"
                                placeholder="Search by SKU, Model or Brand..."
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all">
                                <Filter size={18} /> Filter Status
                            </button>
                            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all">
                                <Database size={18} /> Grade All
                            </button>
                        </div>
                    </div>

                    {/* Inventory Table */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50">
                                    <tr className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                        <th className="px-6 py-4">Product Info</th>
                                        <th className="px-4 py-4">Configuration</th>
                                        <th className="px-4 py-4">Grade</th>
                                        <th className="px-4 py-4">Stock</th>
                                        <th className="px-4 py-4 text-right">Selling Price</th>
                                        <th className="px-4 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-right">Quick Op</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="7" className="py-20 text-center">
                                                <div className="flex flex-col items-center justify-center gap-4">
                                                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                                                    <p className="text-sm font-bold text-gray-400">Loading Inventory...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : inventory.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="py-20 text-center">
                                                <div className="flex flex-col items-center justify-center gap-4 text-gray-400">
                                                    <Box size={40} />
                                                    <p className="text-sm font-bold">No products found in inventory.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : inventory.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                                        <tr key={item._id} className="hover:bg-gray-50/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gray-50 rounded-xl p-1.5 border border-gray-100 shrink-0">
                                                        <img src={item.images?.[0] || product1} alt={item.name} className="w-full h-full object-contain" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-gray-900 leading-tight mb-0.5">{item.name}</h4>
                                                        <p className="text-[10px] text-blue-500 font-bold uppercase">{item.sku}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-xs font-bold text-gray-700">{item.ram} RAM</span>
                                                    <span className="text-[10px] text-gray-400 font-medium uppercase">{item.storage} SSD</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black italic">
                                                    Grade {item.grade}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`text-sm font-black ${item.stock < 5 ? 'text-orange-500' : 'text-gray-900'}`}>
                                                    {item.stock} Units
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-right font-black text-gray-900 whitespace-nowrap">
                                                ₹{item.price.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(item.status)}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleView(item._id)}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                                                    >
                                                        <Edit3 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                                <div className="group-hover:hidden">
                                                    <MoreVertical size={18} className="text-gray-300 ml-auto" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                            <p className="text-sm text-gray-400 font-medium italic">Managed by Vagwiin Core Intelligence</p>
                            <div className="flex items-center gap-2">
                                <button className="p-2 border border-gray-200 rounded-xl text-gray-400 hover:bg-white transition-all">
                                    <ChevronLeft size={20} />
                                </button>
                                <button className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100">1</button>
                                <button className="p-2 border border-gray-200 rounded-xl text-gray-400 hover:bg-white transition-all">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Add Product Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-white/20 h-[90vh] flex flex-col">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-start bg-gradient-to-r from-gray-50 to-white shrink-0">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">{isEditing ? 'Edit Inventory' : 'Add New Inventory'}</h2>
                                <p className="text-sm text-gray-400 font-bold mt-1 uppercase tracking-widest">{isEditing ? 'Modify Product Specification' : 'Complete Product Specification'}</p>
                            </div>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all text-gray-500"
                            >
                                <XCircle size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="p-8 overflow-y-auto space-y-10 custom-scrollbar">
                            {/* Section 1: Basic Identity */}
                            <div className="space-y-6">
                                <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-6 h-0.5 bg-blue-600"></div> Product Identity
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SKU ID</label>
                                        <input name="sku" value={formData.sku} onChange={handleInputChange} required type="text" placeholder="LAP-101" className="px-5 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
                                    </div>
                                    <div className="flex flex-col gap-2 md:col-span-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                            <Laptop size={12} /> Model Name
                                        </label>
                                        <input name="name" value={formData.name} onChange={handleInputChange} required type="text" placeholder="e.g. Latitude 7490" className="px-5 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Brand</label>
                                        <select name="brand" value={formData.brand} onChange={handleInputChange} required className="px-5 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all">
                                            <option value="">Select Brand</option>
                                            <option>Acer</option>
                                            <option>Apple</option>
                                            <option>ASUS</option>
                                            <option>Dell</option>
                                            <option>Fujitsu</option>
                                            <option>HP</option>
                                            <option>Huawei</option>
                                            <option>Lenovo</option>
                                            <option>LG</option>
                                            <option>Microsoft</option>
                                            <option>MSI</option>
                                            <option>Razer</option>
                                            <option>Samsung</option>
                                            <option>VAIO</option>
                                            <option>Xiaomi</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Technical Specs */}
                            <div className="space-y-6">
                                <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-6 h-0.5 bg-blue-600"></div> Technical Specifications
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                            <Cpu size={12} /> CPU Detail
                                        </label>
                                        <input name="cpu" value={formData.cpu} onChange={handleInputChange} required type="text" placeholder="Intel Core i7-8650U..." className="px-5 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                            <Monitor size={12} /> Graphics Card
                                        </label>
                                        <input name="gpu" value={formData.gpu} onChange={handleInputChange} type="text" placeholder="Intel UHD Graphics 620..." className="px-5 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                            <Monitor size={12} /> Display Detail
                                        </label>
                                        <input name="display" value={formData.display} onChange={handleInputChange} type="text" placeholder='14" Full HD Anti-Glare...' className="px-5 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                            <HardDrive size={12} /> Storage (e.g. 512GB)
                                        </label>
                                        <input name="storage" value={formData.storage} onChange={handleInputChange} required type="text" placeholder="256GB / 512GB SSD..." className="px-5 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                            <Database size={12} /> RAM (e.g. 16GB)
                                        </label>
                                        <input name="ram" value={formData.ram} onChange={handleInputChange} required type="text" placeholder="8GB / 16GB DDR4..." className="px-5 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                            <Globe size={12} /> OS
                                        </label>
                                        <input name="os" value={formData.os} onChange={handleInputChange} type="text" placeholder="e.g. Windows 10 Pro" className="px-5 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Logistics & Connectivity */}
                            <div className="space-y-6">
                                <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-6 h-0.5 bg-blue-600"></div> Logistics & Media
                                </h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                                    <Weight size={12} /> Weight
                                                </label>
                                                <input name="weight" value={formData.weight} onChange={handleInputChange} type="text" placeholder="e.g. 1.4kg" className="px-5 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                                    <Link2 size={12} /> Connectivity
                                                </label>
                                                <input name="connectivity" value={formData.connectivity} onChange={handleInputChange} type="text" placeholder="USB 3.0, HDMI, Wi-Fi..." className="px-5 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                                <ListChecks size={12} /> Why Choose This? (Highlights, Comma Separated)
                                            </label>
                                            <textarea name="highlights" value={formData.highlights} onChange={handleInputChange} placeholder="Warranty: 6 Months, Weight: 1.4kg..." className="px-5 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all h-24 resize-none" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                                <ShieldCheck size={12} /> Warranty Info
                                            </label>
                                            <input name="warranty" value={formData.warranty} onChange={handleInputChange} type="text" placeholder="6 Months / 1 Year..." className="px-5 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            {images.map((img, idx) => (
                                                <div key={idx} className="relative aspect-square bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden group/img">
                                                    <img src={img.url} alt="preview" className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (img.file) {
                                                                removeImage(idx);
                                                            } else {
                                                                // If it's an existing image from DB
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    images: prev.images.filter((_, i) => i !== idx - images.filter(x => x.file).length)
                                                                }));
                                                                setImages(prev => prev.filter((_, i) => i !== idx));
                                                            }
                                                        }}
                                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover/img:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                            <label className="aspect-square bg-blue-50/50 rounded-2xl border-2 border-dashed border-blue-100 flex flex-col items-center justify-center text-center group hover:border-blue-400 transition-all cursor-pointer">
                                                <input
                                                    type="file"
                                                    multiple
                                                    className="hidden"
                                                    onChange={handleImageChange}
                                                    accept="image/*"
                                                />
                                                <div className="p-3 bg-white rounded-xl shadow-sm text-blue-600 mb-2 group-hover:scale-110 transition-transform">
                                                    <Plus size={24} />
                                                </div>
                                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider">Add Images</span>
                                            </label>
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-medium text-center">Upload multiple product shots from different angles.</p>
                                        <div className="flex flex-col gap-2 mt-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">General Description</label>
                                            <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Overall product condition and extra details..." className="px-5 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-blue-50 transition-all h-32 resize-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Pricing & Finalization */}
                            <div className="pt-10 border-t border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Grade</label>
                                    <div className="flex gap-1.5">
                                        {['A', 'B', 'C', 'Premium'].map(g => (
                                            <button
                                                key={g}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, grade: g }))}
                                                className={`flex-1 py-3 border rounded-xl text-xs font-black transition-all ${formData.grade === g ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-100 hover:bg-gray-50'}`}
                                            >
                                                {g}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price (INR)</label>
                                    <input name="price" value={formData.price} onChange={handleInputChange} required type="number" placeholder="38500" className="px-5 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-black text-gray-900 outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Initial Stock</label>
                                    <input name="stock" value={formData.stock} onChange={handleInputChange} required type="number" placeholder="10" className="px-5 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-black text-gray-900 outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full py-4 bg-blue-600 text-white rounded-[20px] font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 size={18} /> {isEditing ? 'Update Inventory' : 'Add to Inventory'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
