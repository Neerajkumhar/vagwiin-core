import React, { useState } from 'react';

const CategoryFilters = () => {
    const [active, setActive] = useState('Laptops');
    const categories = ['Laptops', 'Business', 'Media', 'Analytics'];

    return (
        <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-xl w-fit">
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => setActive(cat)}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${active === cat
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};

export default CategoryFilters;
