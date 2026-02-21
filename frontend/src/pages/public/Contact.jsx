import React from 'react';
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    MessageSquare,
    Send,
    Globe2,
    ChevronRight,
    Instagram,
    Facebook,
    Twitter
} from 'lucide-react';
import Navbar from '../../components/Navbar';

const Contact = () => {
    return (
        <div className="min-h-screen bg-[#f8fbff] flex flex-col font-sans mb-20">
            <Navbar />

            <main className="container mx-auto px-6 py-16 max-w-7xl">
                {/* Header Section */}
                <div className="text-center mb-20 max-w-2xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-tight">Get in Touch.</h1>
                    <p className="text-gray-400 font-medium text-lg leading-relaxed">
                        Have questions about our refurbishing process or need help with an order? Our team is here to help you 24/7.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left: Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm transition-all hover:shadow-xl group">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-10 transition-transform group-hover:scale-110">
                                <Phone size={28} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">Speak with Us</h3>
                            <p className="text-sm font-bold text-gray-400 mb-6">Mon-Fri from 9am to 6pm.</p>
                            <a href="tel:+919876543210" className="text-lg font-black text-blue-600 hover:underline">+91 98765 43210</a>
                        </div>

                        <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm transition-all hover:shadow-xl group">
                            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-10 transition-transform group-hover:scale-110">
                                <Mail size={28} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">Email Support</h3>
                            <p className="text-sm font-bold text-gray-400 mb-6">We'll respond within 24 hours.</p>
                            <a href="mailto:support@vagwiin.com" className="text-lg font-black text-green-600 hover:underline">support@vagwiin.com</a>
                        </div>

                        <div className="bg-slate-900 p-10 rounded-[48px] text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl -mr-16 -mt-16"></div>
                            <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-10">
                                <MapPin size={28} />
                            </div>
                            <h3 className="text-xl font-black mb-2">Our Office</h3>
                            <p className="text-sm font-bold text-gray-400">Visit us at our headquarters.</p>
                            <p className="mt-4 text-sm font-medium leading-relaxed">123 Tech Hub, Cyber City, Phase III, Gurgaon, Haryana 122002</p>
                        </div>
                    </div>

                    {/* Right: Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-12 md:p-16 rounded-[64px] border border-gray-100 shadow-xl relative overflow-hidden">
                            {/* Form Header */}
                            <div className="flex items-center gap-6 mb-12">
                                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center">
                                    <MessageSquare size={32} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900">Send us a Message</h2>
                                    <p className="text-gray-400 font-medium text-sm">Fill out the form and we'll be in touch soon.</p>
                                </div>
                            </div>

                            <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <input type="text" placeholder="John Doe" className="w-full px-8 py-5 bg-gray-50 border-none rounded-3xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all font-sans" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <input type="email" placeholder="john@example.com" className="w-full px-8 py-5 bg-gray-50 border-none rounded-3xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all font-sans" />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                                    <select className="w-full px-8 py-5 bg-gray-50 border-none rounded-3xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all font-sans appearance-none">
                                        <option>General Inquiry</option>
                                        <option>Order Support</option>
                                        <option>Warranty Claim</option>
                                        <option>Bulk Order (B2B)</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Message</label>
                                    <textarea placeholder="Tell us more about your request..." className="w-full px-8 py-6 bg-gray-50 border-none rounded-[40px] text-sm font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all h-40 resize-none font-sans"></textarea>
                                </div>
                                <div className="md:col-span-2 pt-6">
                                    <button type="button" className="w-full py-6 bg-blue-600 text-white rounded-[32px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-3 group">
                                        Send Message <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Social Links Footer */}
                        <div className="mt-12 flex flex-wrap items-center justify-center gap-10">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.4em]">Follow Us Online</p>
                            <div className="flex items-center gap-6">
                                <a href="#" className="p-4 bg-white rounded-2xl border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm">
                                    <Instagram size={20} />
                                </a>
                                <a href="#" className="p-4 bg-white rounded-2xl border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm">
                                    <Facebook size={20} />
                                </a>
                                <a href="#" className="p-4 bg-white rounded-2xl border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm">
                                    <Twitter size={20} />
                                </a>
                                <a href="#" className="p-4 bg-white rounded-2xl border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm">
                                    <Globe2 size={20} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Contact;
