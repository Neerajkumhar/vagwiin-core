import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const result = await addToCart(product._id);
        if (result.success) {
            // Optional: Show a subtle success message if no toast is available
            // alert('Added to cart!');
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-100 transition-all group flex flex-col">
            <div className="p-6 pb-2 relative overflow-hidden bg-gray-50/50">
                <Link to={`/product/${product._id}`}>
                    <img
                        src={(product.images && product.images[0] && product.images[0] !== "") ? product.images[0] : 'https://placehold.co/600x400?text=No+Image'}
                        alt={product.name}
                        className="w-full h-48 object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                </Link>
                <button
                    onClick={handleAddToCart}
                    className="absolute bottom-4 right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all p-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 active:scale-95"
                >
                    <ShoppingCart size={20} />
                </button>
            </div>

            <div className="p-6 pt-4 flex flex-col gap-3 flex-1">
                <div>
                    <Link to={`/product/${product._id}`}>
                        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {product.name}
                        </h3>
                    </Link>
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-400 capitalize">
                        <span className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                            {product.ram}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                            {product.storage}
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                        <span className="text-2xl font-black text-gray-900">
                            ₹{product.price.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-1">
                            <Star size={12} className="fill-yellow-400 text-yellow-400" />
                            <span className="text-[10px] font-bold text-gray-400">{product.rating || '4.5'}</span>
                        </div>
                    </div>

                    <div className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                        Grade {product.grade}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
