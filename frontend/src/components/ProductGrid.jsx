import React from 'react';
import ProductCard from './ProductCard';
import product1 from '../assets/images/product_1.png';
import product2 from '../assets/images/product_2.png';

const ProductGrid = () => {
    const products = [
        {
            _id: 'mock1',
            name: 'Samsung Galaxy Book',
            ram: '16GB',
            storage: '512GB SSD',
            price: 49999,
            rating: 4.8,
            grade: 'Premium',
            images: [product1]
        },
        {
            _id: 'mock2',
            name: 'Dell Latitude 7490',
            ram: '8GB',
            storage: '256GB SSD',
            price: 42999,
            rating: 4.5,
            grade: 'A',
            images: [product2]
        },
        {
            _id: 'mock3',
            name: 'Lenovo ThinkPad X1',
            ram: '16GB',
            storage: '256GB SSD',
            price: 54999,
            rating: 4.7,
            grade: 'Premium',
            images: [product1]
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
};

export default ProductGrid;
