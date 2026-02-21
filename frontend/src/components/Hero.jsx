import React from 'react';
import heroLaptop from '../assets/images/hero_laptop.png';

const Hero = () => {
    return (
        <section className="relative bg-[#fcfdff] py-16 overflow-hidden">
            <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12">
                <div className="max-w-2xl text-center lg:text-left">
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
                        Buy Refurbished <br />
                        <span className="text-blue-600">Laptops</span> with <br />
                        <span className="text-blue-400">Warranty</span>
                    </h1>
                    <p className="text-lg text-gray-500 mb-10 max-w-lg mx-auto lg:mx-0">
                        Exclusively curated selection of high-performance refurbished laptops
                        that meet our rigorous quality standards. Save big, work smart.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                        <button className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95">
                            Shop Now
                        </button>
                        <button className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all active:scale-95">
                            Warranty Info
                        </button>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute -inset-20 bg-blue-100/50 rounded-full blur-3xl -z-10"></div>
                    <img
                        src={heroLaptop}
                        alt="Hero Laptop"
                        className="w-full max-w-xl animate-float drop-shadow-2xl"
                    />
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-1/4 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -z-10"></div>
        </section>
    );
};

export default Hero;
