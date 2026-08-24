import { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  debounceMs?: number;
  loading?: boolean;
  autoFocus?: boolean;
}

export function SearchInput({
  placeholder = 'Search leads, students, courses...',
  className,
  value: controlledValue,
  onChange,
  onSearch,
  debounceMs = 300,
  loading = false,
  autoFocus = false,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const value = controlledValue ?? internalValue;

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch?.(value);
    }, debounceMs);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, debounceMs, onSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const handleClear = () => {
    setInternalValue('');
    onChange?.('');
    onSearch?.('');
    inputRef.current?.focus();
  };

  return (
    <div
      className={cn(
        'relative flex items-center transition-all duration-200',
        className
      )}
    >
      <div className="pointer-events-none absolute left-3 flex items-center">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-[#FBBF24]" />
        ) : (
          <Search className="h-4 w-4 text-[#FBBF24]" />
        )}
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={cn(
          'w-full rounded-xl border border-[#D4AF37]/30 bg-[#161E2E] py-2.5 pl-10 pr-9 text-xs font-bold text-white placeholder:text-slate-400',
          'transition-all duration-200 shadow-sm',
          'focus:border-[#FBBF24] focus:bg-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20',
          isFocused && 'border-[#FBBF24] bg-[#1E293B]'
        )}
      />
      <AnimatePresence>
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleClear}
            className="absolute right-2.5 flex h-5 w-5 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
