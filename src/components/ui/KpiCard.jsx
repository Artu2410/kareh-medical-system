import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

export function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendDirection = 'up',
  className,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(13, 148, 136, 0.15)' }}
      onClick={props.onClick}
      className={clsx({ 'cursor-pointer': props.onClick })}
    >
      <div
        className={clsx(
          'bg-gradient-to-br from-white to-slate-50 rounded-3xl border border-slate-100/50 shadow-sm p-6',
          'hover:border-teal-200/50 transition-all duration-300',
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">{title}</p>
            <h3 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">{value}</h3>
            {subtitle && <p className="text-sm text-slate-500 mt-2">{subtitle}</p>}
          </div>
          {Icon && (
            <motion.div className="bg-gradient-to-br from-teal-100 to-teal-50 rounded-2xl p-4 ml-4 shadow-lg shadow-teal-500/10 border border-teal-200/30" whileHover={{ scale: 1.1 }}>
              <Icon className="w-6 h-6 text-teal-600" />
            </motion.div>
          )}
        </div>
        {trend && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <p
              className={clsx(
                'text-sm font-medium',
                trendDirection === 'up' ? 'text-emerald-600' : 'text-red-600'
              )}
            >
              {trendDirection === 'up' ? '↑' : '↓'} {trend}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
