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

const About = () => {
    return (
        <div className="min-h-screen bg-[#f8fbff] flex flex-col font-sans mb-20">
            <Navbar />

            {/* Hero Section */}
            <section className="bg-white py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl -mr-64 -mt-64"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full mb-8">
                            <ShieldCheck size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Our Mission</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 tracking-tighter leading-tight">
                            Redefining the <span className="text-blue-600 italic">Refurbished</span> Experience.
                        </h1>
                        <p className="text-xl text-gray-400 font-medium leading-relaxed">
                            Vagwiin was founded with a single goal: to make high-end technology accessible to everyone while reducing electronic waste. We believe that a refurbished laptop shouldn't just be "used"—it should be reborn.
                        </p>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="container mx-auto px-6 py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all">
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8">
                            <Award size={28} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-4">Quality First</h3>
                        <p className="text-sm text-gray-400 font-medium leading-relaxed">45+ point quality inspection by certified technicians on every single device.</p>
                    </div>
                    <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all">
                        <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-8">
                            <Users size={28} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-4">Customer Obsessed</h3>
                        <p className="text-sm text-gray-400 font-medium leading-relaxed">24/7 support and a community of over 50,000 happy users across India.</p>
                    </div>
                    <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all">
                        <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-8">
                            <Heart size={28} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-4">Eco-Friendly</h3>
                        <p className="text-sm text-gray-400 font-medium leading-relaxed">Preventing thousands of tons of e-waste from entering landfills every year.</p>
                    </div>
                    <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all">
                        <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-8">
                            <TrendingUp size={28} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-4">Innovation</h3>
                        <p className="text-sm text-gray-400 font-medium leading-relaxed">Constantly improving our refurbishing process to deliver like-new performance.</p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-slate-900 py-24 rounded-[64px] mx-6">
                <div className="container mx-auto px-6 text-center">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                        <div>
                            <div className="text-5xl font-black text-blue-400 mb-2">15k+</div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Laptops Delivered</div>
                        </div>
                        <div>
                            <div className="text-5xl font-black text-white mb-2">98%</div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Happy Customers</div>
                        </div>
                        <div>
                            <div className="text-5xl font-black text-white mb-2">45+</div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Quality Checks</div>
                        </div>
                        <div>
                            <div className="text-5xl font-black text-blue-400 mb-2">24h</div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Avg Response Time</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="container mx-auto px-6 py-32">
                <div className="flex flex-col lg:flex-row items-center gap-20">
                    <div className="flex-1 space-y-10">
                        <h2 className="text-4xl font-black text-gray-900 leading-tight">The Vagwiin Certification<br />Standard of Excellence.</h2>
                        <div className="space-y-6">
                            {[
                                { title: 'Battery Performance Inspection', desc: 'Every battery is tested and replaced if capacity is below 80%.' },
                                { title: 'Cosmetic Refurbishing', desc: 'Devices are meticulously cleaned and polished to remove signs of previous use.' },
                                { title: 'Technical Stress Testing', desc: 'Hardware is pushed to its limits to ensure structural stability.' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-6 p-6 bg-white rounded-3xl border border-gray-50">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-900 mb-1">{item.title}</h4>
                                        <p className="text-sm text-gray-400 font-medium">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        <div className="w-full aspect-square bg-blue-600 rounded-[80px] overflow-hidden relative group">
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-700"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Globe2 className="text-white/20 w-80 h-80" />
                            </div>
                            <div className="absolute bottom-10 left-10 text-white z-10">
                                <h3 className="text-5xl font-black tracking-tighter">Global Quality.</h3>
                                <p className="text-lg font-bold text-white/70">Local Expertise since 2018.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
