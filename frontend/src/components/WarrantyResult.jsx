import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CheckCircle2,
    Clock,
    ChevronRight,
    Search,
    CreditCard,
    ShieldCheck,
    User,
    Phone,
    Loader2
} from 'lucide-react';
import { formatDateFull } from '../utils/dateUtils';
import warrantyService from '../services/warrantyService';
import complaintService from '../services/complaintService';
import { useSettings } from '../context/SettingsContext';

const WarrantyResult = ({ data, onBack, isAdmin = false }) => {
    const { currencySymbol } = useSettings();
    const navigate = useNavigate();
    const [showUpgradeForm, setShowUpgradeForm] = useState(false);
    const [showDiagnosisForm, setShowDiagnosisForm] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [successType, setSuccessType] = useState(''); // 'upgrade' or 'diagnosis'
    const [diagnosisDetails, setDiagnosisDetails] = useState({
        issueDescription: '',
        diagnosisDate: ''
    });
    const [upgradeData, setUpgradeData] = useState({
        fullName: '',
        phone: ''
    });

    if (!data) return null;

    const calculateRemainingTime = (endDate) => {
        const end = new Date(endDate);
        const now = new Date();
        const diffTime = end - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) return 'Expired';

        const months = Math.floor(diffDays / 30);
        if (months > 0) return `${months} Months`;
        return `${diffDays} Days`;
    };

    const upgradePlans = [
        {
            id: 'premium',
            name: 'Premium Care Onsite Support',
            price: 1999,
            duration: '1 Year Extension',
            features: ['Prioritized Parts & Labor', 'Next Business Day Support']
        },
        {
            id: 'plus',
            name: 'Premium Care Plus Support',
            price: 3499,
            duration: '1 Year Extension',
            features: ['Accidental Damage Protection', 'Battery Warranty', 'Data Migration']
        }
    ];

    const handleUpgrade = async (e) => {
        e.preventDefault();
        try {
            setIsProcessing(true);
            // Simulate payment delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            await warrantyService.upgradeWarranty({
                serialNumber: data.serialNumber,
                planName: selectedPlan.name,
                durationYears: 1
            });

            setSuccessType('upgrade');
            setIsSuccess(true);
        } catch (error) {
            alert('Upgrade failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsProcessing(false);
        }
    };

    const handleBookDiagnosis = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user) {
            navigate('/login');
            return;
        }

        try {
            setIsProcessing(true);
            await complaintService.bookDiagnosis({
                serialNumber: data.serialNumber,
                issueDescription: diagnosisDetails.issueDescription,
                diagnosisDate: diagnosisDetails.diagnosisDate
            });

            setSuccessType('diagnosis');
            setIsSuccess(true);
        } catch (error) {
            alert('Booking failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsProcessing(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="bg-white p-6 md:p-12 rounded-[32px] md:rounded-[40px] border border-gray-100 shadow-sm text-center animate-in zoom-in duration-300 mx-auto max-w-2xl">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={32} md:size={40} />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
                    {successType === 'upgrade' ? 'Upgrade Successful!' : 'Diagnosis Booked!'}
                </h2>
                <p className="text-xs md:text-lg text-gray-500 font-medium mb-8 max-w-md mx-auto">
                    {successType === 'upgrade'
                        ? `Your warranty has been upgraded to ${selectedPlan?.name} and extended.`
                        : "Your diagnosis request has been submitted successfully. Our technician will contact you soon."}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full sm:w-auto px-10 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-blue-600 transition-all font-sans"
                    >
                        {successType === 'upgrade' ? 'View Updated Status' : 'Back to Home'}
                    </button>
                </div>
            </div>
        );
    }

    if (showUpgradeForm) {
        return (
            <div className="bg-white p-5 md:p-10 rounded-[32px] md:rounded-[40px] border border-gray-100 shadow-sm animate-in fade-in duration-500 text-left">
                <button
                    onClick={() => setShowUpgradeForm(false)}
                    className="flex items-center gap-2 text-gray-400 font-bold hover:text-gray-900 mb-6 md:mb-8 transition-colors bg-transparent border-none cursor-pointer text-[10px] md:text-sm"
                >
                    <ChevronRight size={16} md:size={20} className="rotate-180" /> Back to Status
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 text-left">
                    {/* Left: Plan Selection */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-2">Choose Upgrade Plan</h2>
                            <p className="text-[10px] md:text-xs text-gray-400 font-bold">Select the best protection for your device</p>
                        </div>
                        <div className="space-y-4">
                            {upgradePlans.map((plan) => (
                                <div
                                    key={plan.id}
                                    onClick={() => setSelectedPlan(plan)}
                                    className={`p-5 md:p-6 rounded-[24px] md:rounded-[32px] border-2 transition-all cursor-pointer ${selectedPlan?.id === plan.id
                                        ? 'border-blue-600 bg-blue-50/30 shadow-md'
                                        : 'border-gray-100 hover:border-blue-200'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="min-w-0 pr-2">
                                            <h3 className="font-black text-gray-900 text-sm md:text-base leading-tight">{plan.name}</h3>
                                            <span className="text-[9px] md:text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1 inline-block">{plan.duration}</span>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-lg md:text-xl font-black text-gray-900 font-mono">{currencySymbol}{plan.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <ul className="space-y-2">
                                        {plan.features.map((f, i) => (
                                            <li key={i} className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-gray-500">
                                                <ShieldCheck size={14} className="text-blue-500 shrink-0" /> <span className="truncate">{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: User Details & Payment */}
                    <div className="bg-gray-50/50 p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-gray-100 text-left h-fit">
                        <h3 className="text-sm md:text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                            <CreditCard size={18} md:size={20} className="text-blue-600" /> Complete Purchase
                        </h3>
                        <form onSubmit={handleUpgrade} className="space-y-5 md:space-y-6">
                            <div className="space-y-2">
                                <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative text-left">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        required
                                        type="text"
                                        placeholder="Enter your name"
                                        className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-white border border-gray-100 rounded-xl md:rounded-2xl text-[11px] md:text-sm font-bold shadow-sm outline-none focus:ring-4 focus:ring-blue-100/50"
                                        value={upgradeData.fullName}
                                        onChange={(e) => setUpgradeData({ ...upgradeData, fullName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Number</label>
                                <div className="relative text-left">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        required
                                        type="tel"
                                        placeholder="+91 00000 00000"
                                        className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-white border border-gray-100 rounded-xl md:rounded-2xl text-[11px] md:text-sm font-bold shadow-sm outline-none focus:ring-4 focus:ring-blue-100/50"
                                        value={upgradeData.phone}
                                        onChange={(e) => setUpgradeData({ ...upgradeData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-xs md:text-sm font-bold text-gray-500">Order Total</span>
                                    <span className="text-lg md:text-2xl font-black text-gray-900 font-mono">{currencySymbol}{selectedPlan ? selectedPlan.price.toLocaleString() : '0'}</span>
                                </div>
                                <button
                                    disabled={!selectedPlan || isProcessing}
                                    className="w-full py-4 md:py-5 bg-gray-900 text-white rounded-xl md:rounded-[24px] font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-blue-600 transition-all shadow-xl shadow-gray-200 disabled:opacity-50 active:scale-95 flex items-center justify-center gap-3"
                                >
                                    {isProcessing ? <Loader2 className="animate-spin" size={20} /> : (
                                        <>
                                            <CreditCard size={18} /> Pay & Upgrade Now
                                        </>
                                    )}
                                </button>
                                <p className="text-[9px] md:text-[10px] text-center text-gray-400 font-medium mt-4 leading-relaxed">
                                    Secured payment processing. <br className="sm:hidden" /> No hidden charges.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    if (showDiagnosisForm) {
        return (
            <div className="bg-white p-5 md:p-10 rounded-[32px] md:rounded-[40px] border border-gray-100 shadow-sm animate-in fade-in duration-500 text-left">
                <button
                    onClick={() => setShowDiagnosisForm(false)}
                    className="flex items-center gap-2 text-gray-400 font-bold hover:text-gray-900 mb-6 md:mb-8 transition-colors bg-transparent border-none cursor-pointer text-[10px] md:text-sm"
                >
                    <ChevronRight size={16} md:size={20} className="rotate-180" /> Back to Status
                </button>

                <div className="max-w-2xl mx-auto text-left">
                    <h2 className="text-xl md:text-3xl font-black text-gray-900 mb-2">Book Diagnosis</h2>
                    <p className="text-[10px] md:text-sm text-gray-500 font-medium mb-8 md:mb-10">Describe the issue you're facing and choose a preferred date for diagnosis.</p>

                    <form onSubmit={handleBookDiagnosis} className="space-y-6 md:space-y-8">
                        <div className="space-y-2 md:space-y-3">
                            <label className="text-[9px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Serial Number</label>
                            <input
                                type="text"
                                disabled
                                value={data.serialNumber}
                                className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl text-[11px] md:text-sm font-bold text-gray-400 outline-none font-mono"
                            />
                        </div>

                        <div className="space-y-2 md:space-y-3">
                            <label className="text-[9px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Describe Issue</label>
                            <textarea
                                required
                                rows="4"
                                placeholder="E.g. Laptop screen flickering, battery draining fast..."
                                className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-white border border-gray-100 rounded-xl md:rounded-2xl text-[11px] md:text-sm font-bold shadow-sm outline-none focus:ring-4 focus:ring-blue-100/50 transition-all placeholder:text-gray-300"
                                value={diagnosisDetails.issueDescription}
                                onChange={(e) => setDiagnosisDetails({ ...diagnosisDetails, issueDescription: e.target.value })}
                            ></textarea>
                        </div>

                        <div className="space-y-2 md:space-y-3">
                            <label className="text-[9px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Preferred Date</label>
                            <input
                                required
                                type="date"
                                className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-white border border-gray-100 rounded-xl md:rounded-2xl text-[11px] md:text-sm font-bold shadow-sm outline-none focus:ring-4 focus:ring-blue-100/50 transition-all font-sans"
                                value={diagnosisDetails.diagnosisDate}
                                onChange={(e) => setDiagnosisDetails({ ...diagnosisDetails, diagnosisDate: e.target.value })}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div className="pt-4 md:pt-6">
                            <button
                                disabled={isProcessing}
                                type="submit"
                                className="w-full py-4 md:py-5 bg-blue-600 text-white rounded-xl md:rounded-3xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {isProcessing ? <Loader2 className="animate-spin" size={20} /> : 'Book Now'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 md:space-y-10 animate-in fade-in duration-500 text-gray-700">
            {onBack && (
                <div className="flex items-center justify-between mb-2">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-blue-600 font-bold hover:underline bg-transparent border-none p-0 cursor-pointer text-[11px] md:text-sm"
                    >
                        <ChevronRight size={18} md:size={20} className="rotate-180" /> Back to {isAdmin ? 'List' : 'Search'}
                    </button>
                </div>
            )}

            <div className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-8 md:gap-12 relative overflow-hidden text-left">
                {/* In Warranty Badge - Responsive Positioning */}
                <div className="absolute top-6 right-6 lg:top-8 lg:right-8 z-20">
                    <span className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-1.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-wider border whitespace-nowrap ${data.status === 'Active'
                        ? 'bg-green-50 text-green-600 border-green-100'
                        : 'bg-red-50 text-red-600 border-red-100'
                        }`}>
                        {data.status === 'Active' ? 'In Warranty' : 'Expired'}
                        {data.status === 'Active' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                    </span>
                </div>

                <div className="flex-1 space-y-8 md:space-y-12 relative z-10 w-full">
                    <div className="flex flex-row items-center gap-4 md:gap-6 pb-6 border-b border-gray-50 mr-24 sm:mr-0">
                        <div className="w-14 h-14 md:w-24 md:h-24 bg-gray-50 rounded-xl md:rounded-2xl p-2 md:p-3 border border-gray-100 shrink-0">
                            <img
                                src={
                                    (data.product?.images && data.product.images.length > 0 && data.product.images[0])
                                        ? data.product.images[0]
                                        : (data.product?.image || 'https://placehold.co/600x400?text=Product')
                                }
                                alt="laptop-preview"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    e.target.src = 'https://placehold.co/600x400?text=Product';
                                }}
                            />
                        </div>
                        <div className="min-w-0 pr-4">
                            <h2 className="text-sm md:text-xl font-black text-gray-900 uppercase tracking-tight mb-0.5 md:mb-1 truncate">Warranty Status</h2>
                            <p className="text-[10px] md:text-sm font-bold text-blue-600 truncate">{data.product?.name || 'Vagwiin Certified Laptop'}</p>
                        </div>
                    </div>

                    <div className="space-y-0 text-xs md:text-sm border rounded-2xl md:border-none p-4 md:p-0 border-gray-50 bg-gray-50/20 md:bg-transparent">
                        <div className="flex flex-col sm:flex-row sm:items-center py-3 md:py-4 border-b border-gray-50 gap-1 sm:gap-0">
                            <span className="w-full sm:w-48 text-gray-400 font-bold uppercase text-[9px] md:text-[10px] tracking-widest">Serial Number</span>
                            <span className="text-gray-900 font-black font-mono break-all sm:break-normal">{data.serialNumber}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center py-3 md:py-4 border-b border-gray-50 gap-1 sm:gap-0">
                            <span className="w-full sm:w-48 text-gray-400 font-bold uppercase text-[9px] md:text-[10px] tracking-widest">Warranty Plan</span>
                            <span className="text-gray-900 font-black">{data.planName || 'Onsite Support'}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center py-3 md:py-4 border-b border-gray-50 gap-1 sm:gap-0">
                            <span className="w-full sm:w-48 text-gray-400 font-bold uppercase text-[9px] md:text-[10px] tracking-widest">Contracted period</span>
                            <span className="text-gray-900 font-black font-mono text-[10px] md:text-sm">
                                {formatDateFull(data.startDate)} <span className="text-gray-300 mx-1">-</span> {formatDateFull(data.endDate)}
                            </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center py-3 md:py-4 gap-1 sm:gap-0">
                            <span className="w-full sm:w-48 text-gray-400 font-bold uppercase text-[9px] md:text-[10px] tracking-widest">Time remaining</span>
                            <span className="text-gray-900 font-black flex items-center gap-2">
                                <Clock size={14} className="text-blue-500 md:hidden" />
                                {calculateRemainingTime(data.endDate)}
                            </span>
                        </div>
                    </div>

                    {!isAdmin && (
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 lg:pt-4">
                            <button
                                onClick={() => setShowUpgradeForm(true)}
                                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl md:rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-100 active:scale-95 whitespace-nowrap"
                            >
                                Upgrade now
                            </button>
                            {data.status === 'Active' && (
                                <button
                                    onClick={() => setShowDiagnosisForm(true)}
                                    className="px-8 py-3.5 bg-gray-900 hover:bg-black text-white rounded-xl md:rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest transition-all shadow-lg shadow-gray-100 active:scale-95 whitespace-nowrap"
                                >
                                    Book Diagnosis
                                </button>
                            )}
                            <button className="px-6 py-2.5 bg-transparent text-blue-600 font-bold hover:underline transition-all text-[10px] md:text-sm text-center">
                                Register Device(s)
                            </button>
                        </div>
                    )}

                    <div className="pt-8 md:pt-10">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[10px] md:text-sm font-black text-gray-900 uppercase tracking-wider">Warranty History</h3>
                            <span className="text-[10px] text-gray-400 font-bold italic hidden sm:block">Full track record of coverage</span>
                        </div>

                        {/* Progressive Disclosure: Table for Desktop, Cards for Mobile */}
                        <div className="hidden sm:block bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 w-full overflow-x-auto">
                            <table className="w-full text-left min-w-[500px]">
                                <thead>
                                    <tr className="bg-gray-100/50">
                                        <th className="px-6 py-4 text-[9px] md:text-[10px] font-black uppercase text-gray-400">Plan</th>
                                        <th className="px-6 py-4 text-[9px] md:text-[10px] font-black uppercase text-gray-400 text-right">Period</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 font-mono">
                                    <tr className="bg-white">
                                        <td className="px-6 py-4 text-[11px] md:text-xs font-bold text-gray-700">{data.planName || 'Onsite Support'}</td>
                                        <td className="px-6 py-4 text-[11px] md:text-xs font-bold text-gray-500 text-right">
                                            {formatDateFull(data.startDate)} - {formatDateFull(data.endDate)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards for History */}
                        <div className="sm:hidden space-y-3">
                            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-3">
                                <div className="flex justify-between items-start">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Plan</span>
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[8px] font-black uppercase">Current</span>
                                </div>
                                <p className="text-xs font-black text-gray-900">{data.planName || 'Onsite Support'}</p>
                                <div className="pt-2 border-t border-gray-200/50 flex flex-col gap-1">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Period</span>
                                    <p className="text-[10px] font-bold text-gray-600 font-mono">
                                        {formatDateFull(data.startDate)} - {formatDateFull(data.endDate)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gauge Section - Responsive Layout */}
                <div className="w-full lg:w-72 xl:w-80 flex flex-col items-center justify-center py-10 lg:py-10 border-t lg:border-t-0 lg:border-l border-gray-100 px-6 md:px-10 shrink-0 bg-blue-50/10 lg:bg-transparent rounded-3xl lg:rounded-none">
                    <div className="relative w-36 h-18 md:w-48 md:h-24 mb-6">
                        <svg viewBox="0 0 100 50" className="w-full h-full">
                            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#F1F5F9" strokeWidth="8" strokeLinecap="round" />
                            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="url(#gauge-gradient-result)" strokeWidth="8" strokeLinecap="round" strokeDasharray="125" strokeDashoffset={data.status === 'Active' ? "25" : "125"} />
                            <defs>
                                <linearGradient id="gauge-gradient-result" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#ef4444" />
                                    <stop offset="50%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#22c55e" />
                                </linearGradient>
                            </defs>
                            <line x1="50" y1="50" x2={data.status === 'Active' ? "75" : "25"} y2={data.status === 'Active' ? "25" : "25"} stroke="#1E293B" strokeWidth="2" strokeLinecap="round" className="transition-all duration-1000" />
                            <circle cx="50" cy="50" r="3" fill="#1E293B" />
                        </svg>
                    </div>
                    <div className="text-center">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm border border-blue-100">
                            <Clock size={20} />
                        </div>
                        <h4 className="text-[10px] md:text-xs font-black text-gray-900 uppercase mb-1">{data.planName || 'Onsite Support'}</h4>
                        <div className="flex flex-col items-center gap-1">
                            <span className={`px-4 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase shadow-sm border ${data.status === 'Active'
                                ? 'bg-blue-50 text-blue-600 border-blue-100'
                                : 'bg-red-50 text-red-600 border-red-100'
                                }`}>
                                {data.status === 'Active' ? 'Health: Optimal' : 'Health: Expired'}
                            </span>
                            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter mt-1">Status Checked Live</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WarrantyResult;
