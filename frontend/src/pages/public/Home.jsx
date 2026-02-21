import React from 'react';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import CategoryFilters from '../../components/CategoryFilters';
import Sidebar from '../../components/Sidebar';
import ProductGrid from '../../components/ProductGrid';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
            <Navbar />

            <main>
                <Hero />

                <section className="container mx-auto px-6 py-16">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
                        <CategoryFilters />
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12">
                        <Sidebar />
                        <div className="flex-1">
                            <ProductGrid />

                            <div className="mt-20">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900">Related Refurbished Laptops</h2>
                                    <Link to="/shop" className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
                                        See All
                                    </Link>
                                </div>
                                <ProductGrid />
                            </div>
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
