import { Card, CardContent, Button } from '@/components/ui'
import { formatTime } from '@/lib/utils'
import { Clock, Users } from 'lucide-react'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'

export function TimeSlotsGrid({
  slots,
  selectedTime,
  onSelectTime,
  maxAppointmentsPerSlot = 5,
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {slots.map((slot) => {
        const isFull = slot.count >= maxAppointmentsPerSlot
        const isSelected = selectedTime === slot.time

        return (
          <motion.button
            key={slot.time}
            onClick={() => !isFull && onSelectTime(slot.time)}
            disabled={isFull}
            whileHover={!isFull ? { scale: 1.05 } : {}}
            whileTap={!isFull ? { scale: 0.95 } : {}}
            className={clsx(
              'p-3 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-1',
              isSelected
                ? 'border-teal-600 bg-teal-50'
                : isFull
                ? 'border-red-200 bg-red-50 cursor-not-allowed'
                : 'border-slate-200 hover:border-teal-300 bg-white'
            )}
          >
            <span className={clsx(
              'text-sm font-semibold',
              isSelected ? 'text-teal-600' : isFull ? 'text-red-600' : 'text-slate-900'
            )}>
              {formatTime(slot.time)}
            </span>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span className={clsx(
                'text-xs',
                isSelected ? 'text-teal-600' : isFull ? 'text-red-600' : 'text-slate-500'
              )}>
                {slot.count}/{maxAppointmentsPerSlot}
              </span>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
