import { useState, useCallback } from 'react'
import { getStats } from '../services/stats.service'

export function useStats() {
  const [stats, setStats] = useState(getStats())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchStats = useCallback(() => {
    setLoading(true)
    try {
      const data = getStats()
      setStats(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    stats,
    loading,
    error,
    fetchStats,
  }
}
