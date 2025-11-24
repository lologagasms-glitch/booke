'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
  redirectToSearch?: boolean;
}

export default function SearchBar({
  placeholder = 'Rechercher un établissement...',
  className = '',
  onSearch,
  redirectToSearch = true,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    if (onSearch) {
      onSearch(query.trim());
    }
    
    if (redirectToSearch) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative max-w-2xl mx-auto ${className}`}>
      <div className="flex items-center shadow-lg rounded-full overflow-hidden transition-all duration-300 hover:shadow-xl bg-white/80 backdrop-blur-sm border border-gray-100">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full py-4 pl-8 pr-14 text-lg bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 transition-all duration-300"
        />
        <button
          type="submit"
          className="absolute right-2 h-[calc(100%-16px)] aspect-square rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105"
        >
          <MagnifyingGlassIcon className="w-6 h-6 text-white drop-shadow-sm" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}