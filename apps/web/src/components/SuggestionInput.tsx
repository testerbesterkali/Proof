import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SuggestionInputProps {
    value: string;
    onChange: (value: string) => void;
    suggestions: string[];
    placeholder?: string;
    icon?: React.ReactNode;
    className?: string;
    maxSuggestions?: number;
    /** If true, the input clears after a suggestion is selected (useful for "add to list" patterns) */
    clearOnSelect?: boolean;
}

export function SuggestionInput({
    value,
    onChange,
    suggestions,
    placeholder,
    icon,
    className = '',
    maxSuggestions = 6,
    clearOnSelect = false,
}: SuggestionInputProps) {
    const [open, setOpen] = useState(false);
    const [localValue, setLocalValue] = useState(value);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Sync external value → local (only when not clearOnSelect mode)
    useEffect(() => {
        if (!clearOnSelect) {
            setLocalValue(value);
        }
    }, [value, clearOnSelect]);

    // Filter suggestions based on what user typed
    const filtered = (() => {
        const q = localValue.trim().toLowerCase();
        if (!q) return []; // Don't show anything when empty
        return suggestions
            .filter(s => s.toLowerCase().includes(q) && s.toLowerCase() !== q)
            .slice(0, maxSuggestions);
    })();

    // Close on click outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        setLocalValue(v);
        setOpen(true);
        setHighlightedIndex(-1);
        if (!clearOnSelect) {
            onChange(v);
        }
    };

    const selectSuggestion = (suggestion: string) => {
        if (clearOnSelect) {
            onChange(suggestion); // pass selected value to parent
            setLocalValue('');   // clear the input
        } else {
            setLocalValue(suggestion);
            onChange(suggestion);
        }
        setOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!open || filtered.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex(prev => (prev + 1) % filtered.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex(prev => (prev - 1 + filtered.length) % filtered.length);
        } else if (e.key === 'Enter' && highlightedIndex >= 0) {
            e.preventDefault();
            selectSuggestion(filtered[highlightedIndex]);
        } else if (e.key === 'Escape') {
            setOpen(false);
        }
    };

    const highlightMatch = (text: string, query: string) => {
        if (!query.trim()) return text;
        const idx = text.toLowerCase().indexOf(query.toLowerCase());
        if (idx === -1) return text;
        return (
            <>
                {text.slice(0, idx)}
                <span className="font-bold text-[#1C1C1E]">{text.slice(idx, idx + query.length)}</span>
                {text.slice(idx + query.length)}
            </>
        );
    };

    const showDropdown = open && filtered.length > 0;

    return (
        <div ref={containerRef} className="relative">
            <div className="relative">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1C1C1E]/25 pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder}
                    value={localValue}
                    onChange={handleChange}
                    onFocus={() => {
                        if (localValue.trim()) setOpen(true);
                    }}
                    onKeyDown={handleKeyDown}
                    className={`w-full bg-[#F8F9FB] border border-black/5 rounded-xl py-4 ${icon ? 'pl-12' : 'pl-5'} pr-5 text-[#1C1C1E] placeholder-[#1C1C1E]/25 focus:outline-none focus:border-[#1C1C1E]/15 transition-colors ${className}`}
                />
            </div>

            <AnimatePresence>
                {showDropdown && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.12 }}
                        className="absolute z-50 left-0 right-0 mt-1.5 bg-white rounded-xl border border-black/8 shadow-xl overflow-hidden"
                        style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)' }}
                    >
                        {filtered.map((suggestion, i) => (
                            <button
                                key={suggestion}
                                onMouseDown={(e) => {
                                    e.preventDefault(); // prevent blur
                                    selectSuggestion(suggestion);
                                }}
                                onMouseEnter={() => setHighlightedIndex(i)}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${i === highlightedIndex
                                        ? 'bg-[#F2F3F5] text-[#1C1C1E]'
                                        : 'text-[#1C1C1E]/60 hover:bg-[#F8F9FB]'
                                    } ${i > 0 ? 'border-t border-black/[0.03]' : ''}`}
                            >
                                {highlightMatch(suggestion, localValue)}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
