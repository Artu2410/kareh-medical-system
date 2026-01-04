import { clsx } from 'clsx';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendDirection = 'up',
  className,
  delay = 0,
  ...props
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
        delay: delay,
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.2 },
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) / 5);
        y.set((e.clientY - rect.top - rect.height / 2) / 5);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      onClick={props.onClick}
      className={clsx({ 'cursor-pointer': props.onClick })}
    >
      <div
        className={clsx(
          'glass rounded-3xl p-6 hover-lift relative overflow-hidden',
          className
        )}
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500" />

        <div className="relative">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                {title}
              </p>
              
              <motion.h3
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: delay + 0.2, type: 'spring', stiffness: 200 }}
                className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent"
              >
                {value}
              </motion.h3>

              {subtitle && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  {subtitle}
                </p>
              )}
            </div>

            {Icon && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: delay + 0.1,
                  type: 'spring',
                  stiffness: 200,
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-900 dark:to-teal-800 rounded-2xl p-4 ml-4 shadow-lg shadow-teal-500/10 border border-teal-200/30 dark:border-teal-700/30"
              >
                <Icon className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </motion.div>
            )}
          </div>

          {trend && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.3 }}
              className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center gap-2">
                {trendDirection === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                )}
                <p
                  className={clsx(
                    'text-sm font-medium',
                    trendDirection === 'up'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-600 dark:text-red-400'
                  )}
                >
                  {trend}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Animated Particles */}
        <motion.div
          className="absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br from-teal-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </motion.div>
  );
}