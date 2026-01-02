import { clsx } from 'clsx'

export function Badge({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}) {
  const variants = {
    default: 'bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 border border-slate-200',
    primary: 'bg-gradient-to-r from-teal-100 to-teal-50 text-teal-800 border border-teal-200 shadow-sm shadow-teal-500/10',
    success: 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm shadow-emerald-500/10',
    warning: 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 border border-amber-200 shadow-sm shadow-amber-500/10',
    danger: 'bg-gradient-to-r from-red-100 to-red-50 text-red-800 border border-red-200 shadow-sm shadow-red-500/10',
  }

  const sizes = {
    sm: 'px-2 py-1 text-xs font-medium',
    md: 'px-2.5 py-1 text-sm font-medium',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-2xl whitespace-nowrap',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
