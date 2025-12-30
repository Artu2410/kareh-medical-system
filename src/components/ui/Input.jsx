import { clsx } from 'clsx'

export function Input({
  type = 'text',
  placeholder,
  className,
  error,
  label,
  required,
  disabled = false,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className={clsx('block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide')}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={clsx(
          'w-full px-4 py-2.5 rounded-2xl border border-slate-200/70 bg-white text-slate-900 placeholder-slate-400',
          'focus:ring-2 focus:ring-teal-500/50 focus:border-teal-400 focus:bg-white/80 transition-all duration-200',
          'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed disabled:border-slate-100',
          'shadow-sm hover:border-slate-300',
          error && 'border-red-500 focus:ring-red-500/50 focus:border-red-400',
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-600 mt-1 font-medium">{error}</p>}
    </div>
  )
}
