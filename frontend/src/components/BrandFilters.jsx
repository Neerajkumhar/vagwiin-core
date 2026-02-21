import React, { useState } from 'react';
import { Smartphone, Laptop, Monitor, Apple, BadgePercent, GraduationCap } from 'lucide-react';

const BrandFilters = ({ layout = 'vertical', onFilterChange }) => {
    const [active, setActive] = useState('All');

    const handleSelect = (brandName) => {
        setActive(brandName);
        if (onFilterChange) onFilterChange(brandName);
    };

    const brands = [
        { name: 'All', icon: null },
        { name: 'Samsung', icon: Smartphone },
        { name: 'Dell', icon: Laptop },
        { name: 'Lenovo', icon: Monitor },
        { name: 'Apple', icon: Apple },
        { name: 'HP', icon: Laptop },
    ];

    if (layout === 'horizontal') {
        return (
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 py-1">
                {brands.map((brand) => (
                    <button
                        key={brand.name}
                        onClick={() => handleSelect(brand.name)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${active === brand.name
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100'
                            : 'bg-white text-gray-600 border-gray-100 hover:border-blue-200'
                            }`}
                    >
                        {brand.icon && <brand.icon size={14} />}
                        {brand.name}
                    </button>
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {brands.map((brand) => (
                <button
                    key={brand.name}
                    onClick={() => handleSelect(brand.name)}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all group ${active === brand.name
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-50 text-gray-600'
                        }`}
                >
                    <div className="flex items-center gap-3">
                        {brand.icon && <brand.icon size={20} className={active === brand.name ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'} />}
                        <span className="font-medium">{brand.name}</span>
                    </div>
                </button>
            ))}
        </div>
    );
};

export default BrandFilters;
