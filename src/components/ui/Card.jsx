import { clsx } from 'clsx'

export function Card({
  className,
  children,
  hover = false,
  ...props
}) {
  return (
    <div
      className={clsx(
        'bg-gradient-to-br from-white to-slate-50 rounded-3xl border border-slate-100/50 shadow-sm p-6 backdrop-blur-sm',
        hover && 'hover:shadow-xl hover:border-teal-200/50 hover:shadow-teal-500/10 transition-all duration-300 hover:scale-105',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={clsx('pb-4 border-b border-slate-100/50 bg-gradient-to-r from-white/50 to-slate-50/50', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h2 className={clsx('text-lg font-bold bg-gradient-to-r from-slate-900 to-teal-700 bg-clip-text text-transparent', className)} {...props}>
      {children}
    </h2>
  )
}

export function CardSubtitle({ className, children, ...props }) {
  return (
    <p className={clsx('text-sm text-slate-500 mt-1', className)} {...props}>
      {children}
    </p>
  )
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={clsx('pt-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div className={clsx('mt-6 pt-4 border-t border-slate-200 flex gap-2', className)} {...props}>
      {children}
    </div>
  )
}
