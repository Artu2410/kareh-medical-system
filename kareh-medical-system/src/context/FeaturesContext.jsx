import { createContext, useState } from 'react'

export const FeaturesContext = createContext(null)

export function FeaturesProvider({ children }) {
  const [features, setFeatures] = useState({
    dashboard: true,
    appointments: true,
    patients: true,
    calendar: true,
    reports: true,
    audit: true,
  })

  const isFeatureEnabled = (featureName) => {
    return features[featureName] === true
  }

  return (
    <FeaturesContext.Provider value={{ features, isFeatureEnabled }}>
      {children}
    </FeaturesContext.Provider>
  )
}
