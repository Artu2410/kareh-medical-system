let auditLogs = []

export function logAudit({
  userId,
  action,
  resourceType,
  resourceId,
  changes,
  status = 'success',
  metadata = {},
}) {
  const log = {
    id: auditLogs.length + 1,
    userId,
    action,
    resourceType,
    resourceId,
    changes,
    status,
    metadata,
    timestamp: new Date().toISOString(),
  }
  auditLogs.push(log)
  return log
}

export function getAuditLogs(filters = {}) {
  let logs = [...auditLogs]

  if (filters.userId) {
    logs = logs.filter(log => log.userId === filters.userId)
  }

  if (filters.resourceType) {
    logs = logs.filter(log => log.resourceType === filters.resourceType)
  }

  if (filters.startDate) {
    logs = logs.filter(log => log.timestamp >= filters.startDate)
  }

  if (filters.endDate) {
    logs = logs.filter(log => log.timestamp <= filters.endDate)
  }

  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

export function getAuditLogsByResource(resourceType, resourceId) {
  return auditLogs.filter(
    log => log.resourceType === resourceType && log.resourceId === resourceId
  )
}

export function deleteAuditLog(id) {
  const index = auditLogs.findIndex(log => log.id === id)
  if (index !== -1) {
    auditLogs.splice(index, 1)
    return true
  }
  return false
}

export function clearAuditLogs(olderThanDays = 90) {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - olderThanDays)

  const initialLength = auditLogs.length
  auditLogs = auditLogs.filter(log => new Date(log.timestamp) > cutoffDate)

  return initialLength - auditLogs.length
}
