import { clsx } from 'clsx'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

export function Select({
  label,
  options,
  value,
  onChange,
  placeholder = 'Seleccionar...',
  error,
  required,
  disabled = false,
  className,
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className={clsx(
            'w-full px-4 py-2 rounded-2xl border border-slate-200 bg-white text-slate-900',
            'focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200',
            'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed',
            'text-left flex items-center justify-between',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
        >
          <span className={value ? 'text-slate-900' : 'text-slate-400'}>
            {options.find(opt => opt.value === value)?.label || placeholder}
          </span>
          <ChevronDown className={clsx('w-5 h-5 text-slate-400 transition-transform', isOpen && 'rotate-180')} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-md z-50">
            {options.map(option => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={clsx(
                  'w-full text-left px-4 py-2 transition-colors',
                  option.value === value
                    ? 'bg-teal-50 text-teal-700 font-medium'
                    : 'text-slate-700 hover:bg-slate-50'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
}
