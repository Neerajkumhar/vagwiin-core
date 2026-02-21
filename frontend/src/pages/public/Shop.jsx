import React, { useState, useEffect } from 'react';
import {
    Filter,
    Search,
    ChevronDown,
    LayoutGrid,
    List,
    SlidersHorizontal,
    X,
    Star,
    Cpu,
    Monitor,
    HardDrive,
    Database,
    ArrowRight,
    Loader2
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import ProductCard from '../../components/ProductCard';
import productService from '../../services/productService';

const Shop = () => {
    const [viewMode, setViewMode] = useState('grid');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [sortBy, setSortBy] = useState('-createdAt');
    const [activeFilters, setActiveFilters] = useState({
        minPrice: 0,
        maxPrice: 200000
    });

    useEffect(() => {
        setCurrentPage(1); // Reset to first page when filters/search changes
    }, [activeFilters, searchTerm, sortBy]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchProducts();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [activeFilters, searchTerm, currentPage, sortBy]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = { ...activeFilters, page: currentPage, limit: 12, sort: sortBy };
            if (searchTerm) params.search = searchTerm;
            const response = await productService.getAllProducts(params);
            if (response.status === 'success') {
                setProducts(response.data.products);
                setTotalPages(response.pagination?.totalPages || 1);
                setTotalResults(response.pagination?.totalProducts || 0);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePriceChange = (e) => {
        const val = e.target.value;
        setActiveFilters(prev => ({ ...prev, maxPrice: val }));
    };

    const handleFilterClick = (filterName, option) => {
        const key = filterName.toLowerCase();
        setActiveFilters(prev => {
            if (prev[key] === option) {
                const newFilters = { ...prev };
                delete newFilters[key];
                return newFilters;
            }
            return { ...prev, [key]: option };
        });
    };

    const filters = [
        { name: 'Brand', options: ['Acer', 'Apple', 'ASUS', 'Dell', 'Fujitsu', 'HP', 'Huawei', 'Lenovo', 'LG', 'Microsoft', 'MSI', 'Razer', 'Samsung', 'VAIO', 'Xiaomi'] },
        { name: 'RAM', options: ['8GB', '16GB', '32GB'] },
        { name: 'Storage', options: ['256GB', '512GB', '1TB'] },
        { name: 'Grade', options: ['A', 'B', 'C', 'Premium'] },
    ];

    return (
        <div className="min-h-screen bg-[#f8fbff] flex flex-col font-sans">
            <Navbar />

            {/* Shop Header */}
            <div className="bg-white border-b border-gray-100 py-8 md:py-12">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
                        <div>
                            <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">Explore the Catalog</h1>
                            <p className="text-gray-500 font-medium text-xs md:text-sm mt-1 md:mt-2">Premium Refurbished Laptops at Unbeatable Prices.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search model, brand..."
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all font-sans"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={() => setIsFilterOpen(true)}
                                className="lg:hidden p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100"
                            >
                                <SlidersHorizontal size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 sm:px-6 py-8 md:py-12 max-w-7xl flex-1">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* PC Filters Sidebar */}
                    <aside className="hidden lg:block w-72 shrink-0 space-y-10">
                        <div>
                            <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                <div className="w-6 h-0.5 bg-blue-600"></div> Filters
                            </h3>

                            <div className="space-y-8">
                                {filters.map((filter, i) => (
                                    <div key={i} className="space-y-4">
                                        <h4 className="text-sm font-black text-gray-900">{filter.name}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {filter.options.map((opt, j) => (
                                                <button
                                                    key={j}
                                                    onClick={() => handleFilterClick(filter.name, opt)}
                                                    className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all ${activeFilters[filter.name.toLowerCase()] === opt ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-100 text-gray-500 hover:border-blue-600 hover:text-blue-600'}`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-sm font-black text-gray-900">Price Range</h4>
                                        <span className="text-xs font-black text-blue-600">₹{Number(activeFilters.minPrice || 0).toLocaleString()} - ₹{Number(activeFilters.maxPrice || 200000).toLocaleString()}</span>
                                    </div>
                                    <div className="px-2 space-y-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Min Price</span>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100000"
                                                step="5000"
                                                value={activeFilters.minPrice || 0}
                                                onChange={(e) => setActiveFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                                                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Max Price</span>
                                            <input
                                                type="range"
                                                min="10000"
                                                max="200000"
                                                step="5000"
                                                value={activeFilters.maxPrice || 200000}
                                                onChange={handlePriceChange}
                                                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                            />
                                        </div>
                                        <div className="flex justify-between mt-2 text-[10px] font-black text-gray-400">
                                            <span>₹0</span>
                                            <span>₹2,00,000</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Promo Promo Card */}
                        <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-600/40 transition-all duration-700"></div>
                            <h3 className="text-lg font-black mb-4 relative z-10">Certified Quality</h3>
                            <p className="text-xs font-medium text-gray-400 mb-6 relative z-10 leading-relaxed">Every laptop undergoes 45+ strict quality checks before shipping.</p>
                            <button className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-widest relative z-10 group/link">
                                Learn More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </aside>

                    {/* Product Catalog main area */}
                    <div className="flex-1 space-y-8">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-400 font-medium italic">Showing <span className="text-gray-900 font-black not-italic">{totalResults}</span> results found</p>
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:flex items-center bg-white p-1 rounded-xl border border-gray-100">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-400'}`}
                                    >
                                        <LayoutGrid size={18} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-400'}`}
                                    >
                                        <List size={18} />
                                    </button>
                                </div>
                                <div className="relative group">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="appearance-none bg-white border border-gray-100 pl-6 pr-12 py-3 rounded-2xl text-xs font-black text-gray-900 outline-none focus:ring-4 focus:ring-blue-50 transition-all cursor-pointer"
                                    >
                                        <option value="-createdAt">Newest First</option>
                                        <option value="price">Price: Low to High</option>
                                        <option value="-price">Price: High to Low</option>
                                        <option value="rating">Popularity</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-600 transition-colors" size={14} />
                                </div>
                            </div>
                        </div>

                        {/* Results Grid */}
                        {loading ? (
                            <div className="py-20 flex flex-col items-center justify-center gap-4 w-full">
                                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                                <p className="text-gray-500 font-bold">Fetching latest products...</p>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="py-20 flex flex-col items-center justify-center gap-4 w-full text-gray-400">
                                <LayoutGrid size={48} />
                                <p className="text-gray-500 font-bold">No products found matching your filters.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-8">
                                {products.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pt-12 flex items-center justify-center gap-3">
                                {[...Array(totalPages)].map((_, i) => {
                                    const pageNum = i + 1;
                                    // Simple logic to show only some pages if totalPages is large
                                    if (
                                        totalPages > 7 &&
                                        pageNum !== 1 &&
                                        pageNum !== totalPages &&
                                        Math.abs(pageNum - currentPage) > 1
                                    ) {
                                        if (pageNum === 2 || pageNum === totalPages - 1) {
                                            return <span key={pageNum} className="text-gray-300">...</span>;
                                        }
                                        return null;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => {
                                                setCurrentPage(pageNum);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all ${currentPage === pageNum
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                                                : 'bg-white border border-gray-100 text-gray-400 hover:border-blue-600 hover:text-blue-600'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Mobile Filter Slideover */}
            {isFilterOpen && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
                    <div className="relative w-full max-w-sm bg-white h-full shadow-2xl p-10 overflow-y-auto animate-in slide-in-from-right duration-300">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Filters</h2>
                            <button onClick={() => setIsFilterOpen(false)} className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-red-500 transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-10">
                            {filters.map((filter, i) => (
                                <div key={i} className="space-y-4">
                                    <h4 className="text-sm font-black text-gray-900">{filter.name}</h4>
                                    <div className="flex flex-wrap gap-2 text-sans">
                                        {filter.options.map((opt, j) => (
                                            <button
                                                key={j}
                                                onClick={() => handleFilterClick(filter.name, opt)}
                                                className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all ${activeFilters[filter.name.toLowerCase()] === opt ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-gray-50 text-gray-500 hover:border-blue-600 hover:text-blue-600 hover:bg-white border border-transparent'}`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-sm font-black text-gray-900">Price Range</h4>
                                    <span className="text-xs font-black text-blue-600">₹{Number(activeFilters.minPrice || 0).toLocaleString()} - ₹{Number(activeFilters.maxPrice || 200000).toLocaleString()}</span>
                                </div>
                                <div className="px-2 space-y-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Min Price</span>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100000"
                                            step="5000"
                                            value={activeFilters.minPrice || 0}
                                            onChange={(e) => setActiveFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Max Price</span>
                                        <input
                                            type="range"
                                            min="10000"
                                            max="200000"
                                            step="5000"
                                            value={activeFilters.maxPrice || 200000}
                                            onChange={handlePriceChange}
                                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                    </div>
                                    <div className="flex justify-between mt-2 text-[10px] font-black text-gray-400">
                                        <span>₹0</span>
                                        <span>₹2,00,000</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 active:scale-95 transition-all"
                            >
                                Show Results
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Shop;
