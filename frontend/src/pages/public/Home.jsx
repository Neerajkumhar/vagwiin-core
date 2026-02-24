import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import BrandFilters from '../../components/BrandFilters';
import Sidebar from '../../components/Sidebar';
import ProductGrid from '../../components/ProductGrid';
import Footer from '../../components/Footer';
import {
    Zap,
    ShieldCheck,
    Headphones,
    RotateCcw,
    MessageSquare,
    Send
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const Home = () => {
    const { settings } = useSettings();
    const [selectedBrand, setSelectedBrand] = useState('All');

    const benefits = [
        {
            icon: <Zap className="text-blue-600" size={24} />,
            title: "Performance First",
            desc: "Every laptop is benchmarked to ensure it hits peak performance levels."
        },
        {
            icon: <ShieldCheck className="text-indigo-600" size={24} />,
            title: "Certified Quality",
            desc: "40-point rigorous technical inspection by our expert engineers."
        },
        {
            icon: <RotateCcw className="text-blue-500" size={24} />,
            title: "Easy Returns",
            desc: "Not satisfied? Return within 7 days for a full, no-questions-asked refund."
        },
        {
            icon: <Headphones className="text-indigo-500" size={24} />,
            title: "24/7 Support",
            desc: "Round-the-clock technical assistance for all our premium customers."
        }
    ];

    const testimonials = [
        {
            name: "Rahul Sharma",
            role: "Software Developer",
            content: "Got a MacBook Pro at a fraction of the cost. Performance is identical to a brand new one. Highly recommended!",
            rating: 5
        },
        {
            name: "Priya Patel",
            role: "Graphic Designer",
            content: "The quality of the Dell XPS I received was stunning. Very minor signs of use, works perfectly for my design tasks.",
            rating: 5
        },
        {
            name: "Ankit Verma",
            role: "Student",
            content: "Vagwiin made it possible for me to get a high-end laptop for college within my budget. The 1-year warranty gives peace of mind.",
            rating: 5
        }
    ];

    return (
        <div className="min-h-screen bg-[#fafbfc] font-sans selection:bg-blue-100 selection:text-blue-900">
            <Navbar />

            <main>
                <Hero />

                {/* Shop Section */}
                <section id="shop" className="py-20 lg:py-32">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="flex flex-col lg:flex-row items-end justify-between gap-6 mb-16">
                            <div className="max-w-2xl">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-4 italic">
                                    Our Collection
                                </h2>
                                <h3 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-none mb-2">
                                    Featured Products
                                </h3>
                                <div className="w-20 h-1.5 bg-blue-600 rounded-full"></div>
                            </div>
                            <div className="hidden lg:block">
                                <p className="text-gray-400 font-bold max-w-xs text-right leading-tight">
                                    Handpicked selection of the most powerful machines in the market.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                            {/* Desktop Sidebar */}
                            <aside className="hidden lg:block w-72 shrink-0">
                                <div className="sticky top-32">
                                    <Sidebar onFilterChange={setSelectedBrand} />
                                </div>
                            </aside>

                            {/* Mobile Filters */}
                            <div className="lg:hidden mb-12">
                                <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Filter by Brand</p>
                                    <BrandFilters layout="horizontal" onFilterChange={setSelectedBrand} />
                                </div>
                            </div>

                            <div className="flex-1">
                                <ProductGrid brand={selectedBrand} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                            {benefits.map((benefit, i) => (
                                <div key={i} className="flex flex-col items-center lg:items-start text-center lg:text-left group">
                                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-50 transition-all duration-300">
                                        {benefit.icon}
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight">{benefit.title}</h3>
                                    <p className="text-gray-500 font-medium leading-relaxed italic">{benefit.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-24 bg-slate-900 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full"></div>

                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <div className="text-center mb-20">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-4 italic">Voices of Trust</h2>
                            <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight">What Our Clients Say</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {testimonials.map((t, i) => (
                                <div key={i} className="bg-slate-800/50 backdrop-blur-xl border border-white/5 p-10 rounded-[48px] hover:border-blue-500/30 transition-all duration-500 group">
                                    <div className="flex gap-1 mb-8">
                                        {[...Array(t.rating)].map((_, i) => (
                                            <Zap key={i} size={14} className="fill-blue-400 text-blue-400" />
                                        ))}
                                    </div>
                                    <p className="text-gray-300 text-lg font-medium leading-relaxed italic mb-8">
                                        "{t.content}"
                                    </p>
                                    <div className="flex items-center gap-4 border-t border-white/5 pt-8">
                                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-white text-xl">
                                            {t.name[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-white">{t.name}</h4>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{t.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Newsletter Section */}
                <section className="py-24 bg-white relative">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="max-w-5xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[64px] p-8 md:p-20 relative overflow-hidden shadow-[0_50px_100px_rgba(37,99,235,0.25)]">
                            {/* Decorative Blobs */}
                            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 blur-3xl rounded-full uppercase"></div>

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-10 border border-white/20">
                                    <MessageSquare className="text-white" size={32} />
                                </div>
                                <h2 className="text-3xl md:text-6xl font-black text-white tracking-normal leading-tight mb-6">
                                    Get the Latest <br className="hidden md:block" /> Deals in Your Inbox
                                </h2>
                                <p className="text-blue-100 text-lg font-medium mb-12 max-w-xl">
                                    Join 5,000+ tech enthusiasts getting exclusive early access to our weekly high-end laptop drops.
                                </p>

                                <form className="w-full max-w-lg flex flex-col sm:flex-row gap-4">
                                    <input
                                        type="email"
                                        placeholder="Enter your professional email"
                                        className="flex-1 px-8 py-5 bg-white rounded-3xl text-gray-900 font-bold focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-all placeholder:text-gray-400 text-sm"
                                    />
                                    <button className="px-10 py-5 bg-slate-900 text-white font-black text-sm uppercase tracking-widest rounded-3xl hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-3">
                                        Join List
                                        <Send size={18} />
                                    </button>
                                </form>
                                <p className="text-blue-200/60 text-[10px] font-black uppercase tracking-widest mt-8 italic">
                                    No Spam. Only Tech. Unsubscribe Anytime.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Home;
