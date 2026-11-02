import React from 'react';
import { Search, Filter, Car } from 'lucide-react';

const categories = [
  'All',
  'Exhaust',
  'Engine & Turbo',
  'Suspension',
  'Brake Kit',
  'Aero & Exterior',
  'ECU & Tuning'
];

const hondaModels = [
  'All Models',
  'Honda Civic FE',
  'Honda Civic FK8',
  'Honda Civic FL5',
  'Honda City Turbo',
  'Honda Accord',
  'Honda Jazz GK',
  'Universal Honda'
];

export const FilterBar = ({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedCar,
  onSelectCar
}) => {
  return (
    <div className="bg-[#161922] border border-[#2E3547] rounded-xl p-4 mb-8 space-y-4 shadow-lg">
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อสินค้า, อะไหล่, รหัส..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#0F1115] border border-[#2E3547] rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 transition"
          />
        </div>

        {/* Car Model Selector */}
        <div className="w-full md:w-auto flex items-center space-x-2">
          <Car className="w-4 h-4 text-red-500 shrink-0" />
          <select
            value={selectedCar}
            onChange={(e) => onSelectCar(e.target.value)}
            className="w-full md:w-60 bg-[#0F1115] border border-[#2E3547] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-red-500 transition"
          >
            {hondaModels.map((model) => (
              <option key={model} value={model === 'All Models' ? '' : model}>
                {model}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
        <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              activeCategory === cat
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-[#1F2430] text-slate-300 hover:bg-[#2E3547]'
            }`}
          >
            {cat === 'All' ? 'ทั้งหมด (All)' : cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
