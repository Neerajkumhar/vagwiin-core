import React from 'react';
import {
    ShieldCheck,
    Users,
    Award,
    Heart,
    CheckCircle2,
    TrendingUp,
    Globe2,
    Package
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const About = () => {
    return (
        <div className="min-h-screen bg-[#f8fbff] flex flex-col font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="bg-white py-16 md:py-24 lg:py-32 relative overflow-hidden">
                <div className="hidden md:block absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl -mr-64 -mt-64"></div>
                <div className="container mx-auto px-4 sm:px-6 relative z-10">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full mb-6 md:mb-8 text-[10px] font-black uppercase tracking-widest">
                            <ShieldCheck size={14} />
                            <span>Our Mission</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 md:mb-8 tracking-tighter leading-[1.1]">
                            Redefining the <span className="text-blue-600 italic">Refurbished</span> Experience.
                        </h1>
                        <p className="text-base md:text-lg lg:text-xl text-gray-400 font-medium leading-relaxed max-w-3xl">
                            Vagwiin was founded with a single goal: to make high-end technology accessible to everyone while reducing electronic waste. We believe that a refurbished laptop shouldn't just be "used"—it should be reborn.
                        </p>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="container mx-auto px-4 sm:px-6 py-16 md:py-24">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                    {[
                        { icon: Award, color: 'blue', title: 'Quality First', desc: '45+ point quality inspection by certified technicians on every single device.' },
                        { icon: Users, color: 'green', title: 'Customer Obsessed', desc: '24/7 support and a community of over 50,000 happy users across India.' },
                        { icon: Heart, color: 'purple', title: 'Eco-Friendly', desc: 'Preventing thousands of tons of e-waste from entering landfills every year.' },
                        { icon: TrendingUp, color: 'orange', title: 'Innovation', desc: 'Constantly improving our refurbishing process to deliver like-new performance.' }
                    ].map((value, idx) => (
                        <div key={idx} className="bg-white p-8 md:p-10 rounded-[32px] md:rounded-[48px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group">
                            <div className={`w-12 h-12 md:w-14 md:h-14 bg-${value.color}-50 text-${value.color}-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 transition-transform`}>
                                <value.icon size={24} md:size={28} />
                            </div>
                            <h3 className="text-lg md:text-xl font-black text-gray-900 mb-3 md:mb-4">{value.title}</h3>
                            <p className="text-xs md:text-sm text-gray-400 font-medium leading-relaxed">{value.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-slate-900 py-16 md:py-24 rounded-[32px] md:rounded-[64px] mx-4 md:mx-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
                        {[
                            { val: '15k+', label: 'Laptops Delivered', highlight: true },
                            { val: '98%', label: 'Happy Customers' },
                            { val: '45+', label: 'Quality Checks' },
                            { val: '24h', label: 'Avg Response Time', highlight: true }
                        ].map((stat, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className={`text-3xl sm:text-4xl md:text-5xl font-black ${stat.highlight ? 'text-blue-400' : 'text-white'}`}>{stat.val}</div>
                                <div className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-gray-500">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="container mx-auto px-4 sm:px-6 py-20 md:py-32">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="flex-1 space-y-8 md:space-y-12 w-full">
                        <div className="text-center lg:text-left">
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
                                The Vagwiin Certification<br className="hidden md:block" /> Standard of Excellence.
                            </h2>
                            <div className="w-16 h-1 bg-blue-600 mx-auto lg:mx-0 rounded-full"></div>
                        </div>
                        <div className="space-y-4 md:space-y-6">
                            {[
                                { title: 'Battery Performance Inspection', desc: 'Every battery is tested and replaced if capacity is below 80%.' },
                                { title: 'Cosmetic Refurbishing', desc: 'Devices are meticulously cleaned and polished to remove signs of previous use.' },
                                { title: 'Technical Stress Testing', desc: 'Hardware is pushed to its limits to ensure structural stability.' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4 md:gap-6 p-5 md:p-6 bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm hover:border-blue-100 transition-colors">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                                        <CheckCircle2 size={20} md:size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-900 mb-1 text-sm md:text-base">{item.title}</h4>
                                        <p className="text-xs md:text-sm text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 relative w-full max-w-xl lg:max-w-none">
                        <div className="w-full aspect-square bg-blue-600 rounded-[40px] md:rounded-[80px] overflow-hidden relative group shadow-2xl shadow-blue-200">
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-700"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Globe2 className="text-white/10 w-48 h-48 md:w-80 md:h-80 animate-pulse" />
                            </div>
                            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white z-10">
                                <h3 className="text-3xl md:text-5xl font-black tracking-tighter mb-1">Global Quality.</h3>
                                <p className="text-sm md:text-lg font-bold text-white/70">Local Expertise since 2018.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default About;
