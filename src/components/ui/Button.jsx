import { clsx } from 'clsx'

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled = false,
  ...props
}) {
  const baseStyles = 'rounded-2xl font-medium transition-all duration-200 inline-flex items-center justify-center gap-2 focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'

  const variants = {
    primary: 'bg-gradient-to-r from-teal-600 to-teal-500 text-white hover:shadow-lg hover:shadow-teal-500/30 active:scale-95 shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none',
    secondary: 'bg-gradient-to-r from-slate-100 to-slate-50 text-slate-900 hover:shadow-lg hover:from-slate-200 hover:to-slate-100 shadow-sm border border-slate-200',
    ghost: 'text-slate-700 hover:bg-teal-50 hover:text-teal-600 hover:shadow-md',
    danger: 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:shadow-lg hover:shadow-red-500/30 shadow-md',
    success: 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:shadow-lg hover:shadow-emerald-500/30 shadow-md',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
