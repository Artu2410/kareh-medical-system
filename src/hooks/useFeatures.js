import { useContext } from 'react'
import { FeaturesContext } from '../context/FeaturesContext'

export function useFeatures() {
  const context = useContext(FeaturesContext)
  if (!context) {
    throw new Error('useFeatures debe ser usado dentro de FeaturesProvider')
  }
  return context
}
