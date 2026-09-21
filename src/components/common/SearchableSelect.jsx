import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';

/**
 * Reusable SearchableSelect Component
 * Works seamlessly across forms, filters, and modals.
 * Supports:
 * - string options: ['Option 1', 'Option 2']
 * - object options: [{ value: 'id1', label: 'Option 1', sublabel: 'Extra info' }]
 */
export default function SearchableSelect({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select option...',
  required = false,
  className = '',
  buttonClassName = '',
  disabled = false,
  name = '',
  allowClear = false,
  renderOption = null
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Normalize options to { value, label, sublabel }
  const normalizedOptions = options.map(opt => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { value: opt, label: String(opt), sublabel: '' };
    }
    return {
      value: opt.value !== undefined ? opt.value : opt.id || opt.name,
      label: opt.label || opt.name || String(opt.value),
      sublabel: opt.sublabel || opt.desc || opt.email || opt.dept || opt.department || '',
      icon: opt.icon || null,
      raw: opt
    };
  });

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  const filteredOptions = normalizedOptions.filter(opt => {
    const term = searchTerm.toLowerCase();
    return (
      opt.label.toLowerCase().includes(term) ||
      (opt.sublabel && opt.sublabel.toLowerCase().includes(term)) ||
      String(opt.value).toLowerCase().includes(term)
    );
  });

  const selectedOpt = normalizedOptions.find(o => String(o.value) === String(value));

  const handleSelect = (val) => {
    if (onChange) {
      if (typeof onChange === 'function') {
        onChange({ target: { name, value: val } });
      }
    }
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (onChange) {
      onChange({ target: { name, value: '' } });
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-[12px] font-bold text-slate-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(prev => !prev)}
        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 bg-white border rounded-lg text-left text-[13px] font-medium transition-all ${
          disabled 
            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
            : isOpen 
              ? 'border-[#489b0d] ring-2 ring-[#489b0d]/20 shadow-xs' 
              : 'border-slate-200 hover:border-slate-300 text-slate-800'
        } ${buttonClassName}`}
      >
        <span className={`truncate flex-1 ${selectedOpt ? 'text-slate-800 font-semibold' : 'text-slate-400'}`}>
          {selectedOpt ? (
            <span className="flex items-center gap-2">
              {selectedOpt.icon && <span>{selectedOpt.icon}</span>}
              <span>{selectedOpt.label}</span>
              {selectedOpt.sublabel && (
                <span className="text-[11px] text-slate-400 font-normal">({selectedOpt.sublabel})</span>
              )}
            </span>
          ) : (
            placeholder
          )}
        </span>

        <div className="flex items-center gap-1 shrink-0 text-slate-400">
          {allowClear && selectedOpt && !disabled && (
            <span 
              onClick={handleClear}
              className="p-0.5 hover:text-slate-600 rounded-full transition-colors cursor-pointer"
            >
              <X size={14} />
            </span>
          )}
          <ChevronDown size={15} className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#489b0d]' : ''}`} />
        </div>
      </button>

      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 z-50 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden flex flex-col max-h-64 animate-in fade-in duration-150">
          {/* Search Input Box */}
          <div className="p-2 border-b border-slate-100 bg-slate-50/50">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-md text-[12px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#489b0d]"
                onClick={e => e.stopPropagation()}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Options List */}
          <div className="overflow-y-auto max-h-48 divide-y divide-slate-50 custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-slate-400 text-[12px]">
                No options found for "{searchTerm}"
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <div
                    key={String(opt.value)}
                    onClick={() => handleSelect(opt.value)}
                    className={`px-3.5 py-2.5 flex items-center justify-between text-[12.5px] cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#489b0d]/10 text-[#489b0d] font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {renderOption ? (
                      renderOption(opt, isSelected)
                    ) : (
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="flex items-center gap-1.5">
                          {opt.icon && <span>{opt.icon}</span>}
                          <span className="truncate">{opt.label}</span>
                        </div>
                        {opt.sublabel && (
                          <p className="text-[10.5px] text-slate-400 font-normal truncate mt-0.5">
                            {opt.sublabel}
                          </p>
                        )}
                      </div>
                    )}
                    {isSelected && <Check size={14} className="text-[#489b0d] shrink-0" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
