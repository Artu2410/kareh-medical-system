import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui'
import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
import { clsx } from 'clsx'

export function AppointmentWizardSteps({
  steps,
  currentStep,
  onStepChange,
  completedSteps,
}) {
  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(index)
            const isCurrent = currentStep === index
            const isUpcoming = index > currentStep

            return (
              <div key={step.id} className="flex items-center flex-1">
                {/* Step Button */}
                <motion.button
                  onClick={() => onStepChange(index)}
                  disabled={isUpcoming}
                  className={clsx(
                    'relative w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all',
                    isCurrent
                      ? 'bg-teal-600 text-white ring-4 ring-teal-100'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isUpcoming
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )}
                  whileHover={!isUpcoming ? { scale: 1.1 } : {}}
                  whileTap={!isUpcoming ? { scale: 0.95 } : {}}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </motion.button>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div
                    className={clsx(
                      'flex-1 h-1 mx-2 rounded-full transition-colors',
                      isCompleted ? 'bg-emerald-600' : 'bg-slate-200'
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Step labels */}
        <div className="mt-6 grid grid-cols-4 gap-2">
          {steps.map((step) => (
            <div key={step.id} className="text-center">
              <p className="text-xs font-medium text-slate-700">{step.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function AppointmentWizardContent({
  currentStep,
  children,
}) {
  return (
    <motion.div
      key={currentStep}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

export function AppointmentWizardActions({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onComplete,
  isLoading = false,
}) {
  return (
    <div className="flex gap-3 justify-between mt-8">
      <Button
        variant="secondary"
        onClick={onPrevious}
        disabled={currentStep === 0}
      >
        ← Atrás
      </Button>

      <div className="flex gap-3">
        {currentStep === totalSteps - 1 ? (
          <Button
            onClick={onComplete}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? 'Completando...' : 'Confirmar Cita'}
          </Button>
        ) : (
          <Button
            onClick={onNext}
            className="flex items-center gap-2"
          >
            Siguiente <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
