import React from 'react';
import { ShieldCheck, ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroLaptop from '../assets/images/hero_laptop.png';
import { useSettings } from '../context/SettingsContext';

const Hero = () => {
    const { settings, currencySymbol } = useSettings();
    const navigate = useNavigate();

    return (
        <section className="relative bg-[#ffffff] pt-12 lg:pt-20 pb-16 lg:pb-32 overflow-hidden">
            {/* Background Blob Decorations */}
            <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-50/60 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            <div className="absolute bottom-[5%] right-[-5%] w-[35%] h-[35%] bg-indigo-50/60 rounded-full blur-[100px] -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
                    {/* Content Column */}
                    <div className="w-full lg:w-1/2 text-center lg:text-left z-10">
                        {/* Trust Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full mb-8 animate-fade-in-down border border-blue-100 shadow-sm">
                            <ShieldCheck size={16} className="text-blue-500" />
                            <span className="text-xs font-black uppercase tracking-widest">Premium Quality Certified</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tight">
                            Next-Gen <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Refurbished</span> <br />
                            <span className="relative">
                                {settings.siteName}
                                <svg className="absolute -bottom-2 left-0 w-full h-3 text-blue-200/60 -z-10" viewBox="0 0 400 20" fill="currentColor">
                                    <path d="M0 10 Q100 0 200 10 Q300 20 400 10" stroke="currentColor" strokeWidth="10" fill="none" />
                                </svg>
                            </span>
                        </h1>

                        <p className="text-base md:text-lg text-gray-500 mb-10 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed italic">
                            {settings.homepageBannerText}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                            <button
                                onClick={() => navigate('/shop')}
                                className="w-full sm:w-auto px-8 py-5 bg-blue-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-[0_20px_50px_rgba(37,99,235,0.2)] active:scale-95 flex items-center justify-center gap-3 group"
                            >
                                Explore Shop
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <div className="flex flex-col items-center lg:items-start gap-1 ml-0 lg:ml-6">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                                    ))}
                                    <span className="text-sm font-black text-gray-900 ml-2">4.9/5</span>
                                </div>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Trusted by 2,500+ Professionals</span>
                            </div>
                        </div>
                    </div>

                    {/* Image Column */}
                    <div className="w-full lg:w-1/2 relative group">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100/40 to-indigo-100/40 rounded-[60px] blur-3xl -z-10 group-hover:scale-110 transition-transform duration-1000"></div>
                        <div className="relative transform hover:scale-[1.02] transition-transform duration-700">
                            <img
                                src={heroLaptop}
                                alt="Premium Refurbished Laptop"
                                className="w-full h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)] animate-float"
                            />

                            {/* Floating UI Elements */}
                            <div className="absolute -top-10 -right-5 md:right-10 px-6 py-4 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 animate-bounce-slow hidden sm:block">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                                        <ShieldCheck className="text-green-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Warranty</p>
                                        <p className="text-sm font-black text-gray-900">1 Year Onsite</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -bottom-10 -left-5 px-6 py-4 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 animate-float-slow hidden sm:block" style={{ animationDelay: '1s' }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                        <div className="text-blue-600 font-black text-lg font-sans">{currencySymbol}</div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Savings</p>
                                        <p className="text-sm font-black text-gray-900">Up to 60% OFF</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

