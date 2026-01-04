import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export function Skeleton({ className, variant = 'default', ...props }) {
  const variants = {
    default: 'h-4 w-full',
    text: 'h-4 w-3/4',
    title: 'h-8 w-1/2',
    circle: 'rounded-full w-12 h-12',
    card: 'h-48 w-full rounded-2xl',
    button: 'h-10 w-32 rounded-2xl',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={clsx(
        'skeleton rounded-lg',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className="flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-3xl p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" />
          <Skeleton variant="title" />
        </div>
        <Skeleton variant="circle" />
      </div>
      <Skeleton className="h-2" />
      <Skeleton variant="text" />
    </div>
  );
}

export function PatientCardSkeleton() {
  return (
    <div className="glass rounded-2xl p-4 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton variant="circle" className="w-16 h-16" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  );
}