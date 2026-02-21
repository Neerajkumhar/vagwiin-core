import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import productService from '../services/productService';

const ProductGrid = ({ brand = 'All' }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const filters = brand !== 'All' ? { brand } : {};
                const response = await productService.getAllProducts(filters);

                // Backend returns { status: 'success', data: { products: [...] } }
                if (response.data && response.data.products) {
                    setProducts(response.data.products);
                } else if (response.products) {
                    setProducts(response.products);
                } else if (Array.isArray(response)) {
                    setProducts(response);
                }

                setError(null);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [brand]);

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-gray-50 rounded-2xl h-64 animate-pulse"></div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-600 p-8 rounded-2xl text-center font-bold">
                {error}. Please check your connection.
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="bg-gray-50 text-gray-400 p-16 rounded-2xl text-center font-medium">
                No products found for this category.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
            {products.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
};

export default ProductGrid;
