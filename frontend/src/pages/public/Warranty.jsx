import React, { useState, useRef } from 'react';
import {
    ShieldCheck,
    Search,
    Calendar,
    ArrowRight,
    HelpCircle,
    Clock,
    CheckCircle2,
    AlertCircle,
    Laptop,
    CreditCard,
    MessageSquare,
    FileText,
    ChevronRight,
    Loader2,
    Shield
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import warrantyService from '../../services/warrantyService';
import { formatDateFull } from '../../utils/dateUtils';
import WarrantyResult from '../../components/WarrantyResult';
import warrantyHero from '../../assets/images/warranty_hero.png';

const Warranty = () => {
    const [serialNumber, setSerialNumber] = useState('');
    const [warrantyData, setWarrantyData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const searchInputRef = useRef(null);

    const checkWarranty = async () => {
        if (!serialNumber.trim()) {
            searchInputRef.current?.focus();
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setWarrantyData(null);

            const data = await warrantyService.searchWarranty(serialNumber.trim());
            setWarrantyData(data);
        } catch (error) {
            console.error('Error checking warranty:', error);
            setError('Serial Number not found. Please check and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePlanClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        searchInputRef.current?.focus();
    };

    const plans = [
        {
            name: 'Onsite Support',
            icon: Clock,
            description: 'Essential onsite protection for your peace of mind.',
            features: [
                'Parts & Labor Coverage',
                'Basic Phone Support for Hardware',
                'Repairs performed at your location'
            ],
            color: 'blue'
        },
        {
            name: 'Premium Care Support',
            icon: ShieldCheck,
            description: 'Advanced technical support and priority services.',
            features: [
                'Prioritized Parts & Labor',
                'Engineer-level Technical Support',
                'Next Business Day Onsite Repairs',
                'Hardware & Software Assistance'
            ],
            highlight: true,
            color: 'blue'
        },
        {
            name: 'Premium Care Plus',
            icon: Laptop,
            description: 'The ultimate protection with accidental damage coverage.',
            features: [
                'All Premium Care Benefits',
                'Accidental Damage Protection',
                'Battery Warranty Extension',
                'Malware Removal & Optimization'
            ],
            color: 'blue'
        }
    ];

    return (
        <div className="min-h-screen bg-white text-gray-700 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
            <Navbar />

            {!warrantyData ? (
                <>
                    {/* Hero Section */}
                    <section className="relative bg-[#fcfdff] py-12 md:py-20 lg:py-32 overflow-hidden border-b border-gray-50">
                        <div className="container mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center justify-between gap-10 md:gap-16 relative z-10">
                            <div className="max-w-2xl text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest mb-6">
                                    <Shield size={14} /> Vagwiin Care Ecosystem
                                </div>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1] mb-6 md:mb-8 tracking-tight">
                                    Trusted <span className="text-blue-600 underline decoration-blue-100 underline-offset-4 md:underline-offset-8">Warranty</span> <br />
                                    & Active Support
                                </h1>
                                <p className="text-sm md:text-lg text-gray-500 mb-8 md:mb-12 max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed">
                                    Protect your investments with our comprehensive warranty plans.
                                    Check your device status or upgrade your protection in seconds.
                                </p>

                                {/* Search Bar */}
                                <div className="max-w-xl mx-auto lg:mx-0 w-full">
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-[20px] md:rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                                        <div className="relative flex flex-col sm:flex-row gap-3">
                                            <div className="relative flex-1">
                                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 animate-pulse" size={20} />
                                                <input
                                                    ref={searchInputRef}
                                                    type="text"
                                                    placeholder="Enter Serial (e.g. VGN-2024)"
                                                    className="w-full pl-16 pr-6 py-4 md:py-5 bg-white border border-gray-100 rounded-[18px] md:rounded-2xl text-base md:text-lg font-bold outline-none focus:ring-4 focus:ring-blue-100/50 transition-all text-gray-900 shadow-xl shadow-gray-100/50 placeholder:text-gray-300"
                                                    value={serialNumber}
                                                    onChange={(e) => setSerialNumber(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && checkWarranty()}
                                                />
                                            </div>
                                            <button
                                                onClick={checkWarranty}
                                                disabled={loading}
                                                className="px-8 py-4 md:py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[18px] md:rounded-2xl font-black uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center min-w-[140px] md:min-w-[160px] shadow-xl shadow-blue-200 active:scale-95 text-xs md:text-sm"
                                            >
                                                {loading ? <Loader2 className="animate-spin" size={24} /> : 'Search'}
                                            </button>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[11px] md:text-sm font-bold flex items-center gap-3 justify-center animate-in fade-in slide-in-from-top-2">
                                            <AlertCircle size={18} /> {error}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="relative block">
                                <div className="absolute -inset-10 md:-inset-20 bg-blue-100/30 rounded-full blur-2xl md:blur-3xl -z-10"></div>
                                <img
                                    src={warrantyHero}
                                    alt="Warranty Shield"
                                    className="w-full max-w-[280px] sm:max-w-sm md:max-w-lg lg:max-w-lg animate-float drop-shadow-2xl mx-auto"
                                />
                            </div>
                        </div>

                        {/* Decorative background blobs - reduced on mobile */}
                        <div className="hidden md:block absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -z-10 -mr-64 -mt-64"></div>
                        <div className="hidden md:block absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50/30 rounded-full blur-3xl -z-10 -ml-48 -mb-48"></div>
                    </section>

                    {/* Plans Section */}
                    <section className="py-16 md:py-24 bg-white">
                        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
                            <div className="text-center mb-12 md:mb-20">
                                <h2 className="text-[10px] md:text-xs font-black text-blue-600 uppercase tracking-[0.3em] mb-4">Protection Tiers</h2>
                                <h3 className="text-2xl md:text-4xl font-black text-gray-900 mb-6 tracking-tight">Expertly Designed Care Plans</h3>
                                <div className="w-16 md:w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                {plans.map((plan, i) => (
                                    <div
                                        key={i}
                                        className={`group relative bg-white p-8 md:p-10 rounded-[32px] md:rounded-[40px] border transition-all duration-500 hover:-translate-y-2 ${plan.highlight
                                            ? 'border-blue-200 shadow-2xl shadow-blue-100 ring-4 ring-blue-50'
                                            : 'border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100'
                                            } ${i === 2 && 'md:col-span-2 lg:col-span-1'}`}
                                    >
                                        {plan.highlight && (
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full whitespace-nowrap">
                                                Recommended Plan
                                            </div>
                                        )}
                                        <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 md:mb-8 transition-all duration-500 group-hover:scale-110 ${plan.highlight ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-blue-50 text-blue-600'
                                            }`}>
                                            <plan.icon size={24} md:size={30} />
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-2 tracking-tight">{plan.name}</h3>
                                        <p className="text-xs md:text-sm text-gray-400 font-bold mb-6 md:mb-8 leading-relaxed italic">{plan.description}</p>

                                        <hr className="border-gray-50 mb-6 md:mb-8" />

                                        <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10 min-h-[140px]">
                                            {plan.features.map((feature, j) => (
                                                <li key={j} className="flex items-start gap-3 text-xs md:text-[13px] font-bold text-gray-500 leading-snug">
                                                    <div className="p-1 bg-green-100 rounded-full mt-0.5 shrink-0">
                                                        <CheckCircle2 size={10} md:size={12} className="text-green-600" />
                                                    </div>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <button
                                            onClick={handlePlanClick}
                                            className={`w-full py-3.5 md:py-4 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all ${plan.highlight
                                                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100 overflow-hidden relative'
                                                : 'bg-gray-50 text-gray-700 hover:bg-blue-600 hover:text-white border border-gray-100'
                                                }`}
                                        >
                                            Check Eligibility
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Features Grid */}
                    <section className="py-16 md:py-24 bg-gray-50/50 border-t border-gray-100">
                        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-16">
                                <div className="text-center group">
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white shadow-lg md:shadow-xl shadow-gray-100 rounded-2xl md:rounded-[32px] flex items-center justify-center mx-auto mb-6 md:mb-8 group-hover:scale-110 transition-all border border-gray-50">
                                        <MessageSquare size={28} md:size={32} className="text-blue-600" />
                                    </div>
                                    <h4 className="font-black text-gray-900 uppercase text-[10px] md:text-xs tracking-[0.2em] mb-3 md:mb-4">Direct Communication</h4>
                                    <p className="text-xs md:text-sm text-gray-500 font-medium leading-relaxed mb-4 md:mb-6">Chat with our certified engineers for immediate technical diagnostics.</p>
                                    <a href="#" className="inline-flex items-center gap-2 text-blue-600 font-black text-[10px] md:text-xs uppercase tracking-widest hover:gap-4 transition-all border-b-2 border-transparent hover:border-blue-100 pb-1">
                                        Chat Now <ArrowRight size={14} />
                                    </a>
                                </div>
                                <div className="text-center group">
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white shadow-lg md:shadow-xl shadow-gray-100 rounded-2xl md:rounded-[32px] flex items-center justify-center mx-auto mb-6 md:mb-8 group-hover:scale-110 transition-all border border-gray-50">
                                        <FileText size={28} md:size={32} className="text-blue-600" />
                                    </div>
                                    <h4 className="font-black text-gray-900 uppercase text-[10px] md:text-xs tracking-[0.2em] mb-3 md:mb-4">Documentation</h4>
                                    <p className="text-xs md:text-sm text-gray-500 font-medium leading-relaxed mb-4 md:mb-6">Download official manuals, drivers, and technical specifications for your device.</p>
                                    <a href="#" className="inline-flex items-center gap-2 text-blue-600 font-black text-[10px] md:text-xs uppercase tracking-widest hover:gap-4 transition-all border-b-2 border-transparent hover:border-blue-100 pb-1">
                                        Browse Library <ArrowRight size={14} />
                                    </a>
                                </div>
                                <div className="text-center group sm:col-span-2 md:col-span-1">
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white shadow-lg md:shadow-xl shadow-gray-100 rounded-2xl md:rounded-[32px] flex items-center justify-center mx-auto mb-6 md:mb-8 group-hover:scale-110 transition-all border border-gray-50">
                                        <CreditCard size={28} md:size={32} className="text-blue-600" />
                                    </div>
                                    <h4 className="font-black text-gray-900 uppercase text-[10px] md:text-xs tracking-[0.2em] mb-3 md:mb-4">Request Service</h4>
                                    <p className="text-xs md:text-sm text-gray-500 font-medium leading-relaxed mb-4 md:mb-6">Schedule an onsite repair or track the progress of your ongoing service ticket.</p>
                                    <a href="#" className="inline-flex items-center gap-2 text-blue-600 font-black text-[10px] md:text-xs uppercase tracking-widest hover:gap-4 transition-all border-b-2 border-transparent hover:border-blue-100 pb-1">
                                        Book Repair <ArrowRight size={14} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            ) : (
                <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 md:py-12 max-w-5xl">
                    <WarrantyResult
                        data={warrantyData}
                        onBack={() => setWarrantyData(null)}
                    />
                </main>
            )}

            <footer className="bg-white border-t border-gray-100 py-8 md:py-12">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-gray-400 text-[11px] md:text-sm font-bold">
                        © 2026 <span className="text-gray-900">Vagwiin Care</span>. Protecting your digital future.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Warranty;
