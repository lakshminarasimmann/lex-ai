'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = 'Search clauses...',
  debounceMs = 300,
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    return () => clearTimeout(timerRef.current);
  }, [query, debounceMs, onSearch]);

  const clear = useCallback(() => {
    setQuery('');
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className={cn(
        'relative flex items-center rounded-xl border transition-all duration-200',
        isFocused
          ? 'border-[rgba(212,175,55,0.3)] bg-[#171C25] shadow-[0_0_20px_rgba(212,175,55,0.06)]'
          : 'border-[rgba(255,255,255,0.08)] bg-[#11151C] hover:border-[rgba(255,255,255,0.12)]',
        className
      )}
    >
      <Search className="absolute left-3 w-4 h-4 text-[#667085]" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full bg-transparent pl-9 pr-8 py-2.5 text-sm text-[#F8FAFC] placeholder:text-[#667085] focus:outline-none"
        aria-label={placeholder}
      />
      {query && (
        <button
          onClick={clear}
          className="absolute right-2.5 p-0.5 rounded text-[#667085] hover:text-[#A8B3C7] transition-colors"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
