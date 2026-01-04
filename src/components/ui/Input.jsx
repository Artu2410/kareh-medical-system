import { clsx } from 'clsx';
import { useState } from 'react';
import { motion } from 'framer-motion';

export function Input({
  type = 'text',
  placeholder,
  className,
  error,
  label,
  required,
  disabled = false,
  icon,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e) => {
    setIsFocused(false);
    setHasValue(!!e.target.value);
  };

  const showFloatingLabel = isFocused || hasValue;

  return (
    <div className="w-full relative">
      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10">
            {icon}
          </div>
        )}

        {/* Input */}
        <input
          type={type}
          placeholder={showFloatingLabel ? placeholder : ' '}
          disabled={disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => {
            setHasValue(!!e.target.value);
            props.onChange?.(e);
          }}
          className={clsx(
            'w-full px-4 py-3 rounded-2xl border transition-all duration-300 peer',
            'focus:ring-2 focus:ring-teal-500/50 focus:border-teal-400',
            'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed disabled:border-slate-100',
            'dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100',
            'dark:focus:bg-slate-800 dark:disabled:bg-slate-900',
            icon ? 'pl-12' : 'pl-4',
            error
              ? 'border-red-500 focus:ring-red-500/50 focus:border-red-400'
              : 'border-slate-200 dark:border-slate-700',
            'shadow-sm hover:border-slate-300 dark:hover:border-slate-600',
            'glass',
            className
          )}
          {...props}
        />

        {/* Floating Label */}
        {label && (
          <motion.label
            animate={{
              y: showFloatingLabel ? -32 : 0,
              scale: showFloatingLabel ? 0.85 : 1,
              x: showFloatingLabel ? 0 : icon ? 36 : 16,
            }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={clsx(
              'absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200',
              'font-medium origin-left',
              showFloatingLabel
                ? 'text-teal-600 dark:text-teal-400'
                : 'text-slate-500 dark:text-slate-400',
              error && !showFloatingLabel && 'text-red-500'
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </motion.label>
        )}

        {/* Focus Border Animation */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className={clsx(
            'absolute bottom-0 left-0 right-0 h-0.5 origin-center',
            error
              ? 'bg-gradient-to-r from-red-500 to-pink-500'
              : 'bg-gradient-to-r from-teal-500 to-purple-500'
          )}
        />
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 dark:text-red-400 mt-2 font-medium flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </motion.p>
      )}
    </div>
  );
}