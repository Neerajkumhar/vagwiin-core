import React from 'react';
import { Search, ChevronRight, Smartphone, Laptop, Apple, Monitor, BadgePercent, GraduationCap } from 'lucide-react';

const Sidebar = () => {
    const categories = [
        { name: 'Samsung', icon: Smartphone, count: 8 },
        { name: 'Dell', icon: Laptop },
        { name: 'Lenovo', icon: Monitor },
        { name: 'Apple', icon: Apple },
        { name: 'Price', icon: BadgePercent },
        { name: 'Grade', icon: GraduationCap },
    ];

    return (
        <aside className="w-64 flex flex-col gap-6">
            <div className="relative">
                <input
                    type="text"
                    placeholder="All"
                    className="w-full bg-blue-50/50 border border-blue-100 rounded-xl px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
            </div>

            <div className="flex flex-col gap-2">
                {categories.map((item) => (
                    <button
                        key={item.name}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <item.icon size={20} className="text-gray-400 group-hover:text-blue-500" />
                            <span className="text-gray-600 font-medium group-hover:text-gray-900">{item.name}</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500" />
                    </button>
                ))}
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
