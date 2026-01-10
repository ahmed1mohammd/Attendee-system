
import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <input 
        type="text" 
        placeholder={placeholder}
        className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 pr-12 rounded-2xl md:rounded-3xl outline-none font-bold text-sm shadow-sm focus:border-brand transition-all text-black dark:text-white"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <i className="fa-solid fa-magnifying-glass absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"></i>
    </div>
  );
};

export default SearchBar;
