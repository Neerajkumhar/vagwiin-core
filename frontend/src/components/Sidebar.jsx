import React from 'react';
import { Search } from 'lucide-react';
import BrandFilters from './BrandFilters';

const Sidebar = ({ onFilterChange }) => {
    return (
        <aside className="w-64 flex flex-col gap-6">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search laptop..."
                    className="w-full bg-blue-50/50 border border-blue-100 rounded-xl px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest px-3 mb-2">Brands</h3>
                <BrandFilters layout="vertical" onFilterChange={onFilterChange} />
            </div>

            <div className="mt-4 p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl text-white">
                <h4 className="font-bold mb-1">Student Deal!</h4>
                <p className="text-xs text-blue-100 mb-3">Get extra 15% off on selected refurbished MacBooks.</p>
                <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-semibold backdrop-blur-sm border border-white/10 transition-colors">
                    Claim Offer
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
