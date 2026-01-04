import React from 'react';
import { clsx } from 'clsx';

export function Card({ children, className }) {
  return (
    <div className={clsx('bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden', className)}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return (
    <div className={clsx('px-6 py-4 border-b border-slate-100 bg-slate-50/50', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }) {
  return (
    <h2 className={clsx('text-lg font-semibold text-slate-800', className)}>
      {children}
    </h2>
  );
}

export function CardContent({ children, className }) {
  return (
    <div className={clsx('p-6', className)}>
      {children}
    </div>
  );
}