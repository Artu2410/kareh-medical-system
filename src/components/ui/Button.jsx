import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled = false,
  loading = false,
  icon,
  ...props
}) {
  const baseStyles = 'rounded-2xl font-medium transition-all duration-300 inline-flex items-center justify-center gap-2 focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 relative overflow-hidden ripple';

  const variants = {
    primary: 'bg-gradient-to-r from-teal-600 to-teal-500 text-white hover:shadow-xl hover:shadow-teal-500/30 active:scale-95 shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none',
    secondary: 'bg-gradient-to-r from-slate-100 to-slate-50 text-slate-900 hover:shadow-lg hover:from-slate-200 hover:to-slate-100 shadow-sm border border-slate-200',
    ghost: 'text-slate-700 hover:bg-teal-50 hover:text-teal-600 hover:shadow-md',
    danger: 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:shadow-xl hover:shadow-red-500/30 shadow-md',
    success: 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:shadow-xl hover:shadow-emerald-500/30 shadow-md',
    glass: 'glass text-slate-900 hover:shadow-xl border border-white/30',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
}