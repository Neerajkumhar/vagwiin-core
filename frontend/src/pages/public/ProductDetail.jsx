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
            <div className="container mx-auto px-6 py-4 flex items-center gap-2 text-sm text-gray-400">
                <a href="/" className="hover:text-blue-600">Home</a>
                <ChevronRight size={14} />
                <a href="/shop" className="hover:text-blue-600">Laptops</a>
                <ChevronRight size={14} />
                <span className="text-gray-600 font-medium">{product.name}</span>
            </div>

            <main className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    {/* Left: Image Gallery */}
                    <div className="flex flex-col gap-6">
                        <div className="aspect-square bg-gray-50 rounded-2xl flex items-center justify-center p-12 overflow-hidden border border-gray-50 group">
                            <img
                                src={(thumbnails[selectedImg] && thumbnails[selectedImg] !== "") ? thumbnails[selectedImg] : product1}
                                alt="Main Product"
                                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {thumbnails.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImg(idx)}
                                    className={`aspect-square rounded-xl p-2 border-2 transition-all ${selectedImg === idx ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-blue-200'
                                        }`}
                                >
                                    <img src={(img && img !== "") ? img : product1} alt="Thumb" className="w-full h-full object-contain" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex items-center gap-1 text-yellow-400">
                                    {[...Array(Math.floor(product.rating || 4.5))].map((_, i) => <Star key={i} size={18} className="fill-current" />)}
                                    {product.rating % 1 !== 0 && <Star size={18} className="text-gray-300" />}
                                </div>
                                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Grade {product.grade}</span>
                            </div>
                            <h1 className="text-4xl font-black text-gray-900 mb-2">{product.name}</h1>
                            <div className="flex items-baseline gap-4">
                                <span className="text-4xl font-black text-blue-600">₹{product.price.toLocaleString()}</span>
                                <span className="text-gray-400 text-sm font-medium">{product.reviewsCount || 0} Reviews</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-3">
                                <Cpu className="text-blue-500" size={24} />
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Processor</p>
                                    <p className="text-sm font-bold text-gray-700 leading-tight">{product.cpu}</p>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-3">
                                <Monitor className="text-blue-500" size={24} />
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Graphics</p>
                                    <p className="text-sm font-bold text-gray-700 leading-tight">{product.gpu || 'Integrated'}</p>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-3">
                                <Globe className="text-blue-500" size={24} />
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Software</p>
                                    <p className="text-sm font-bold text-gray-700">{product.os || 'Windows 10'}</p>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-3">
                                <ShieldCheck className="text-blue-500" size={24} />
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Coverage</p>
                                    <p className="text-sm font-bold text-gray-700">{product.warranty || '6mo Warranty'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-4">
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
                                    className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200"
                                >
                                    <ShoppingCart size={20} /> Add to Cart
                                </button>
                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="flex-1 bg-blue-50 text-blue-700 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-100 transition-all active:scale-95"
                                >
                                    <Zap size={20} /> Buy Now
                                </button>
                            </div>
                            <div className="flex gap-4">
                                <button className="flex-1 border border-gray-200 py-3 rounded-xl flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-50 transition-all">
                                    <Heart size={18} /> Wishlist
                                </button>
                                <button className="flex-1 border border-gray-200 py-3 rounded-xl flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-50 transition-all">
                                    <BarChart2 size={18} /> Compare
                                </button>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-y-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                                <Truck className="text-green-500" size={18} /> Free Shipping
                            </div>
                            <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                                <ShieldCheck className="text-green-500" size={18} /> 6 Months Warranty
                            </div>
                            <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                                <RotateCcw className="text-green-500" size={18} /> 7-Day Return Policy
                            </div>
                            <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                                <CheckCircle2 className="text-green-500" size={18} /> Secure Payment
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Tabs */}
                <div className="mt-16 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    <div className="flex gap-12 border-b border-gray-100 mb-8">
                        {['Overview', 'Specifications', 'Warranty', 'Reviews'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 font-bold text-sm transition-all relative ${activeTab === tab ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full"></div>}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 mb-8">Product Specifications</h3>
                            <div className="flex flex-col gap-4">
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
                                    <div key={i} className="flex justify-between py-1 text-sm">
                                        <span className="text-gray-400 font-medium">{spec.label}:</span>
                                        <span className="text-gray-900 font-bold">{spec.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-black text-gray-900 mb-8">Why Choose This?</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {(product.highlights && product.highlights.length > 0 ? product.highlights : [
                                    product.cpu,
                                    product.ram,
                                    product.os,
                                    `Warranty: ${product.warranty}`,
                                    `Grade: ${product.grade}`
                                ]).map((point, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl group transition-all hover:bg-blue-50">
                                        <CheckCircle2 className="text-blue-500 group-hover:scale-110 transition-transform" size={20} />
                                        <span className="text-sm font-bold text-gray-700">{point}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                <section className="mt-20">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-black text-gray-900">Related Laptops</h2>
                        <button className="text-blue-600 font-bold hover:underline flex items-center gap-1">
                            See All <ChevronRight size={18} />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {relatedProducts.map(p => <ProductCard key={p._id} product={p} />)}
                    </div>
                </section>
            </main>

            <footer className="bg-gray-50 border-t border-gray-100 py-12 mt-20">
                <div className="container mx-auto px-6 text-center text-gray-400 text-sm">
                    © 2026 Vagwiin Refurbished Laptops. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default ProductDetail;
