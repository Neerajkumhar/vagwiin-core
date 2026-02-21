import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Star,
    ChevronRight,
    ShoppingCart,
    Zap,
    ShieldCheck,
    Globe,
    Heart,
    BarChart2,
    Truck,
    RotateCcw,
    CheckCircle2,
    Cpu,
    Monitor,
    HardDrive,
    Loader2
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import ProductCard from '../../components/ProductCard';
import productService from '../../services/productService';
import { useCart } from '../../context/CartContext';
import product1 from '../../assets/images/product_1.png';

const ProductDetail = () => {
    const { addToCart } = useCart();
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Specifications');
    const [selectedImg, setSelectedImg] = useState(0);
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                const response = await productService.getProductById(id);
                if (response.status === 'success') {
                    setProduct(response.data.product);
                }

                // Fetch related products (e.g., same brand)
                const brand = response.data.product.brand;
                const relatedRes = await productService.getAllProducts({ brand });
                if (relatedRes.status === 'success') {
                    setRelatedProducts(relatedRes.data.products.filter(p => p._id !== id).slice(0, 3));
                }
            } catch (error) {
                console.error('Failed to fetch product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fcfdff] flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                    <p className="text-gray-500 font-bold">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#fcfdff] flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <h2 className="text-2xl font-black text-gray-900">Product Not Found</h2>
                    <button onClick={() => navigate('/shop')} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold">Back to Shop</button>
                </div>
            </div>
        );
    }

    const thumbnails = product.images.length > 0 ? product.images : [product1];

    return (
        <div className="min-h-screen bg-[#fcfdff] font-sans">
            <Navbar />

            {/* Breadcrumbs */}
            <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center gap-2 text-[10px] md:text-sm text-gray-400 overflow-x-auto whitespace-nowrap scrollbar-hide">
                <a href="/" className="hover:text-blue-600 shrink-0">Home</a>
                <ChevronRight size={12} className="shrink-0" />
                <a href="/shop" className="hover:text-blue-600 shrink-0">Laptops</a>
                <ChevronRight size={12} className="shrink-0" />
                <span className="text-gray-600 font-medium truncate">{product.name}</span>
            </div>

            <main className="container mx-auto px-4 sm:px-6 py-4 md:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 bg-white p-4 sm:p-8 rounded-[32px] md:rounded-[40px] border border-gray-100 shadow-sm">
                    {/* Left: Image Gallery */}
                    <div className="flex flex-col gap-4 md:gap-6">
                        <div className="aspect-square bg-gray-50 rounded-2xl flex items-center justify-center p-6 md:p-12 overflow-hidden border border-gray-50 group">
                            <img
                                src={(thumbnails[selectedImg] && thumbnails[selectedImg] !== "") ? thumbnails[selectedImg] : product1}
                                alt="Main Product"
                                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-2 md:gap-4 text-sans">
                            {thumbnails.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImg(idx)}
                                    className={`aspect-square rounded-xl p-1 md:p-2 border-2 transition-all ${selectedImg === idx ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-blue-200'
                                        }`}
                                >
                                    <img src={(img && img !== "") ? img : product1} alt="Thumb" className="w-full h-full object-contain" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col gap-6 md:gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-3 md:mb-4">
                                <div className="flex items-center gap-1 text-yellow-400">
                                    {[...Array(Math.floor(product.rating || 4.5))].map((_, i) => <Star key={i} size={14} md:size={18} className="fill-current" />)}
                                </div>
                                <span className="text-[10px] md:text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 md:px-3 md:py-1 rounded-full uppercase tracking-wider">Grade {product.grade}</span>
                            </div>
                            <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-2 leading-tight">{product.name}</h1>
                            <div className="flex items-baseline gap-4 mt-2">
                                <span className="text-3xl md:text-4xl font-black text-blue-600">₹{product.price.toLocaleString()}</span>
                                <span className="text-gray-400 text-[10px] md:text-sm font-medium">{product.reviewsCount || 0} Reviews</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 font-sans">
                            {[
                                { icon: Cpu, label: 'Processor', value: product.cpu },
                                { icon: Monitor, label: 'Graphics', value: product.gpu || 'Integrated' },
                                { icon: Globe, label: 'Software', value: product.os || 'Windows 10' },
                                { icon: ShieldCheck, label: 'Coverage', value: product.warranty || '6mo Warranty' },
                            ].map((item, i) => (
                                <div key={i} className="p-3 md:p-4 bg-gray-50 rounded-2xl flex items-center gap-2 md:gap-3">
                                    <item.icon className="text-blue-500 shrink-0" size={18} md:size={24} />
                                    <div className="min-w-0">
                                        <p className="text-[8px] md:text-[10px] text-gray-400 font-bold uppercase truncate">{item.label}</p>
                                        <p className="text-[10px] md:text-sm font-bold text-gray-700 leading-tight truncate">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 md:gap-4">
                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                                <button
                                    onClick={async () => {
                                        const res = await addToCart(product._id, 1);
                                        if (res.success) {
                                            navigate('/cart');
                                        } else {
                                            if (res.message === 'Please login to add items to cart') {
                                                navigate('/login');
                                            }
                                        }
                                    }}
                                    className="flex-1 bg-blue-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200 text-sm md:text-base"
                                >
                                    <ShoppingCart size={18} md:size={20} /> Add to Cart
                                </button>
                                <button
                                    onClick={async () => {
                                        const res = await addToCart(product._id, 1);
                                        if (res.success) {
                                            navigate('/checkout');
                                        } else {
                                            if (res.message === 'Please login to add items to cart') {
                                                navigate('/login');
                                            }
                                        }
                                    }}
                                    className="flex-1 bg-blue-50 text-blue-700 font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-100 transition-all active:scale-95 text-sm md:text-base"
                                >
                                    <Zap size={18} md:size={20} /> Buy Now
                                </button>
                            </div>
                            <div className="flex gap-3 md:gap-4">
                                <button className="flex-1 border border-gray-100 py-3 rounded-2xl flex items-center justify-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 hover:text-blue-600 transition-all">
                                    <Heart size={16} /> Wishlist
                                </button>
                                <button className="flex-1 border border-gray-100 py-3 rounded-2xl flex items-center justify-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 hover:text-blue-600 transition-all">
                                    <BarChart2 size={16} /> Compare
                                </button>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-y-3 md:gap-y-4 pt-4 md:pt-6 border-t border-gray-50">
                            {[
                                { icon: Truck, text: 'Free Shipping' },
                                { icon: ShieldCheck, text: '6-Month Warranty' },
                                { icon: RotateCcw, text: '7-Day Return' },
                                { icon: CheckCircle2, text: 'Secure Payment' },
                            ].map((badge, i) => (
                                <div key={i} className="flex items-center gap-2 text-[10px] md:text-sm font-bold text-gray-500">
                                    <badge.icon className="text-green-500" size={14} md:size={18} /> {badge.text}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Details Tabs */}
                <div className="mt-8 md:mt-16 bg-white rounded-[32px] md:rounded-[40px] border border-gray-100 p-6 md:p-10 shadow-sm">
                    <div className="flex gap-6 md:gap-12 border-b border-gray-50 mb-6 md:mb-10 overflow-x-auto whitespace-nowrap scrollbar-hide">
                        {['Overview', 'Specifications', 'Warranty', 'Reviews'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 font-black text-xs md:text-sm transition-all relative uppercase tracking-widest ${activeTab === tab ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full"></div>}
                            </button>
                        ))}
                    </div>

                    <div className="mt-4 md:mt-8">
                        {activeTab === 'Specifications' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 animate-in fade-in duration-500">
                                <div>
                                    <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-6 md:mb-8">Technical Specifications</h3>
                                    <div className="flex flex-col gap-3 md:gap-4 font-sans">
                                        {[
                                            { label: 'Brand', value: product.brand },
                                            { label: 'Model', value: product.name },
                                            { label: 'CPU Detail', value: product.cpu },
                                            { label: 'Graphics Card', value: product.gpu || 'Integrated' },
                                            { label: 'Storage', value: product.storage },
                                            { label: 'RAM', value: product.ram },
                                            { label: 'OS', value: product.os || 'Windows 10 Pro' },
                                            { label: 'Display', value: product.display || '14" Full HD' },
                                            { label: 'Grade', value: product.grade },
                                        ].map((spec, i) => (
                                            <div key={i} className="flex justify-between py-1 text-xs md:text-sm">
                                                <span className="text-gray-400 font-bold uppercase tracking-tighter shrink-0">{spec.label}:</span>
                                                <span className="text-gray-900 font-bold text-right ml-4">{spec.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="hidden lg:block">
                                    <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-6 md:mb-8">Key Highlights</h3>
                                    <div className="grid grid-cols-1 gap-3 md:gap-4">
                                        {(product.highlights && product.highlights.length > 0 ? product.highlights : [
                                            `${product.brand} Premium Power`,
                                            `High-Performance ${product.ram}`,
                                            `Vivid ${product.display || 'Full HD'} Display`,
                                            `Grade: ${product.grade}`,
                                        ]).map((point, i) => (
                                            <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl group transition-all hover:bg-blue-50 border border-transparent hover:border-blue-100">
                                                <CheckCircle2 className="text-blue-500 group-hover:scale-110 transition-transform" size={18} md:size={20} />
                                                <span className="text-xs md:text-sm font-bold text-gray-700">{point}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Overview' && (
                            <div className="animate-in fade-in duration-500 max-w-3xl">
                                <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-6 md:mb-8">Product Overview</h3>
                                <div className="space-y-6">
                                    {product.description ? (
                                        <p className="text-gray-600 leading-relaxed font-medium">{product.description}</p>
                                    ) : (
                                        <p className="text-gray-600 leading-relaxed font-medium">
                                            The {product.name} is a high-performance refurbished laptop by {product.brand}.
                                            Expertly tested and graded as {product.grade}, this machine features {product.cpu},
                                            backed by {product.ram} of memory and {product.storage} of fast storage.
                                            Perfect for professionals and students seeking power without compromise.
                                        </p>
                                    )}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                                        {(product.highlights && product.highlights.length > 0 ? product.highlights : [
                                            'Premium Refurbished Build',
                                            'Verified 45-Point Quality Check',
                                            'Ready to Use with Pre-installed OS',
                                            'Sustainability-first Choice'
                                        ]).map((point, i) => (
                                            <div key={i} className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                                <CheckCircle2 className="text-blue-600" size={18} />
                                                <span className="text-xs md:text-sm font-bold text-blue-900">{point}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Warranty' && (
                            <div className="animate-in fade-in duration-500 max-w-2xl">
                                <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-6 md:mb-8">Warranty & Support</h3>
                                <div className="bg-slate-900 rounded-[32px] p-8 md:p-10 text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-3xl -mr-32 -mt-32"></div>
                                    <div className="relative z-10">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                                            <ShieldCheck size={14} /> Official Vagwiin Warranty
                                        </div>
                                        <h4 className="text-3xl font-black mb-4">{product.warranty || '6 Months'} Standard Warranty</h4>
                                        <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
                                            Every product sold through VAGWIIN-CORE is covered by our comprehensive warranty.
                                            This includes protection against hardware defects and malfunctions during the coverage period.
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3 text-xs md:text-sm font-bold">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div> 100% Parts & Labor Cover
                                            </div>
                                            <div className="flex items-center gap-3 text-xs md:text-sm font-bold">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div> Priority Support Access
                                            </div>
                                            <div className="flex items-center gap-3 text-xs md:text-sm font-bold">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div> Free Return Shipping
                                            </div>
                                            <div className="flex items-center gap-3 text-xs md:text-sm font-bold">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div> Original Spare Parts
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Reviews' && (
                            <div className="animate-in fade-in duration-500 py-12 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center text-gray-300 mb-6">
                                    <Star size={40} />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 mb-2">No Reviews Yet</h3>
                                <p className="text-gray-400 text-sm max-w-sm">
                                    Be the first to review this {product.name}! Your feedback helps other premium customers make better choices.
                                </p>
                                <button className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all">
                                    Write a Review
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                <section className="mt-12 md:mt-20">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">You May Also Like</h2>
                            <p className="text-gray-400 font-medium text-xs md:text-sm mt-1">Recommended for your needs.</p>
                        </div>
                        <button onClick={() => navigate('/shop')} className="hidden sm:flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest hover:translate-x-1 transition-transform">
                            View Shop <ChevronRight size={18} />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
                        {relatedProducts.map(p => <ProductCard key={p._id} product={p} />)}
                    </div>
                </section>
            </main>

            <footer className="bg-white border-t border-gray-50 py-12 mt-20">
                <div className="container mx-auto px-6 text-center text-gray-300 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">
                    © 2026 VAGWIIN-CORE. PREMIUM REFURBISHED TECHNOLOGY.
                </div>
            </footer>
        </div>
    );
};

export default ProductDetail;
