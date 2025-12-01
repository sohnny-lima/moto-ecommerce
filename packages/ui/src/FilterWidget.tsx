import React, { useState } from 'react';
import { Button } from './Button';

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

export interface FilterSection {
  title: string;
  type: 'checkbox' | 'radio' | 'range' | 'color';
  options?: FilterOption[];
  min?: number;
  max?: number;
  value?: any;
}

export interface FilterWidgetProps {
  sections: FilterSection[];
  onFilterChange?: (filters: Record<string, any>) => void;
  onReset?: () => void;
  className?: string;
}

export const FilterWidget: React.FC<FilterWidgetProps> = ({
  sections,
  onFilterChange,
  onReset,
  className = '',
}) => {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections.map((s) => s.title))
  );

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  const handleCheckboxChange = (section: string, optionId: string) => {
    setFilters((prev) => {
      const sectionFilters = prev[section] || [];
      const next = sectionFilters.includes(optionId)
        ? sectionFilters.filter((id: string) => id !== optionId)
        : [...sectionFilters, optionId];
      
      const updated = { ...prev, [section]: next };
      onFilterChange?.(updated);
      return updated;
    });
  };

  const handleRadioChange = (section: string, optionId: string) => {
    setFilters((prev) => {
      const updated = { ...prev, [section]: optionId };
      onFilterChange?.(updated);
      return updated;
    });
  };

  const handleRangeChange = (section: string, value: number) => {
    setFilters((prev) => {
      const updated = { ...prev, [section]: value };
      onFilterChange?.(updated);
      return updated;
    });
  };

  const handleReset = () => {
    setFilters({});
    onReset?.();
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Filtros</h3>
        <button
          onClick={handleReset}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Limpiar
        </button>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="border-b border-gray-200 pb-6 last:border-0">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.title)}
              className="flex items-center justify-between w-full text-left"
            >
              <h4 className="font-semibold text-gray-900">{section.title}</h4>
              <svg
                className={`w-5 h-5 transition-transform ${
                  expandedSections.has(section.title) ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Section Content */}
            {expandedSections.has(section.title) && (
              <div className="mt-4 space-y-3">
                {/* Checkbox */}
                {section.type === 'checkbox' && section.options?.map((option) => (
                  <label key={option.id} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filters[section.title]?.includes(option.id) || false}
                      onChange={() => handleCheckboxChange(section.title, option.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {option.label}
                      {option.count !== undefined && (
                        <span className="text-gray-400 ml-1">({option.count})</span>
                      )}
                    </span>
                  </label>
                ))}

                {/* Radio */}
                {section.type === 'radio' && section.options?.map((option) => (
                  <label key={option.id} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name={section.title}
                      checked={filters[section.title] === option.id}
                      onChange={() => handleRadioChange(section.title, option.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {option.label}
                    </span>
                  </label>
                ))}

                {/* Range */}
                {section.type === 'range' && (
                  <div className="space-y-2">
                    <input
                      type="range"
                      min={section.min || 0}
                      max={section.max || 100}
                      value={filters[section.title] || section.min || 0}
                      onChange={(e) => handleRangeChange(section.title, Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>S/ {section.min?.toLocaleString()}</span>
                      <span className="font-semibold text-blue-600">
                        S/ {(filters[section.title] || section.min || 0).toLocaleString()}
                      </span>
                      <span>S/ {section.max?.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {/* Color */}
                {section.type === 'color' && section.options?.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleCheckboxChange(section.title, option.id)}
                    className={`
                      px-3 py-1.5 text-sm rounded-full border-2 transition-all
                      ${filters[section.title]?.includes(option.id)
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Apply Button */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <Button
          variant="primary"
          fullWidth
          onClick={() => onFilterChange?.(filters)}
        >
          Aplicar filtros
        </Button>
      </div>
    </div>
  );
};

export default FilterWidget;

