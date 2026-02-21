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
        <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-100 transition-all group flex flex-col">
            <div className="p-3 md:p-6 pb-2 relative overflow-hidden bg-gray-50/50">
                <Link to={`/product/${product._id}`}>
                    <img
                        src={(product.images && product.images[0] && product.images[0] !== "") ? product.images[0] : 'https://placehold.co/600x400?text=No+Image'}
                        alt={product.name}
                        className="w-full h-32 md:h-48 object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                </Link>
                <button
                    onClick={handleAddToCart}
                    className="absolute bottom-2 right-2 md:bottom-4 md:right-4 p-2 md:p-3 bg-blue-600 text-white rounded-lg md:rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all md:translate-y-12 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
                >
                    <ShoppingCart size={16} className="md:w-5 md:h-5" />
                </button>
            </div>

            <div className="p-6 pt-4 flex flex-col gap-3 flex-1">
                <div>
                    <Link to={`/product/${product._id}`}>
                        <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
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
                        <span className="text-base md:text-2xl font-black text-gray-900">
                            ₹{product.price.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-1">
                            <Star size={12} className="fill-yellow-400 text-yellow-400" />
                            <span className="text-[10px] font-bold text-gray-400">{product.rating || '4.5'}</span>
                        </div>
                    </div>

                    <div className="px-2 md:px-3 py-0.5 md:py-1 bg-green-50 text-green-600 text-[8px] md:text-[10px] font-bold rounded-full uppercase tracking-wider">
                        Grade {product.grade}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
