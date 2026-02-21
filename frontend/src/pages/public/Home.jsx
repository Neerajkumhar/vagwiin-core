import React from 'react';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import BrandFilters from '../../components/BrandFilters';
import Sidebar from '../../components/Sidebar';
import ProductGrid from '../../components/ProductGrid';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Home = () => {
    const [selectedBrand, setSelectedBrand] = useState('All');

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
            <Navbar />

            <main>
                <Hero />

                <section className="container mx-auto px-4 sm:px-6 py-8 lg:py-16">
                    <div className="mb-8 md:mb-12">
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Featured Products</h2>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                        <div className="hidden lg:block">
                            <Sidebar onFilterChange={setSelectedBrand} />
                        </div>
                        <div className="lg:hidden mb-8">
                            <BrandFilters layout="horizontal" onFilterChange={setSelectedBrand} />
                        </div>

                        <div className="flex-1">
                            <ProductGrid brand={selectedBrand} />
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-gray-50 border-t border-gray-100 py-12 mt-20">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-gray-400 text-sm">
                        © 2026 Vagwiin Refurbished Laptops. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
