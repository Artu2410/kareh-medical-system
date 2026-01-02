import http from 'http'
import { URL } from 'url'

let professionals = [
  { id: 'prof-1', firstName: 'Ana', lastName: 'Gomez', license: 'ABC123' },
  { id: 'prof-2', firstName: 'Juan', lastName: 'Perez', license: 'XYZ789' }
]
let patients = []
let appointments = []
let cashflows = []

function parseJson(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => body += chunk)
    req.on('end', () => {
      if (!body) return resolve(null)
      try { resolve(JSON.parse(body)) } catch (e) { reject(e) }
    })
    req.on('error', reject)
  })
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const pathname = url.pathname
  res.setHeader('Content-Type', 'application/json')

  try {
    if (req.method === 'GET' && pathname === '/api/health') {
      res.end(JSON.stringify({ ok: true }))
      return
    }

    if (req.method === 'GET' && pathname === '/api/professionals') {
      res.end(JSON.stringify(professionals))
      return
    }

    if (req.method === 'POST' && pathname === '/api/appointments') {
      const body = await parseJson(req)
      const { patient, professionalId, dates, therapyType, appointmentType, diagnosis } = body || {}
      if (!patient || !professionalId || !dates) {
        res.statusCode = 400
        res.end(JSON.stringify({ error: 'Faltan datos' }))
        return
      }
      let p = patients.find(x => x.dni === patient.dni)
      if (!p) { p = { id: `pat-${Date.now()}`, ...patient }; patients.push(p) } else { Object.assign(p, patient) }
      const created = []
      for (const d of dates) {
        const slot = new Date(d).toISOString()
        const appt = { id: `appt-${Date.now()}-${Math.random().toString(36).slice(2,6)}`, patientId: p.id, professionalId, date: d, slot, therapyType, appointmentType, diagnosis, status: 'SCHEDULED' }
        appointments.push(appt)
        created.push(appt)
      }
      res.statusCode = 201
      res.end(JSON.stringify({ success: true, patient: p, appointments: created }))
      return
    }

    if (req.method === 'GET' && pathname === '/api/appointments') {
      const date = url.searchParams.get('date')
      if (!date) { res.end(JSON.stringify(appointments)); return }
      const filtered = appointments.filter(a => a.date && a.date.startsWith(date))
      res.end(JSON.stringify(filtered))
      return
    }

    if (req.method === 'POST' && pathname === '/api/cashflow') {
      const body = await parseJson(req)
      const { type, amount, concept, method, date } = body || {}
      if (!type || !amount) { res.statusCode = 400; res.end(JSON.stringify({ error: 'type y amount requeridos' })); return }
      const entry = { id: `flow-${Date.now()}`, type, amount, concept, method, date: date || new Date().toISOString().split('T')[0], createdAt: new Date().toISOString() }
      cashflows.push(entry)
      res.statusCode = 201
      res.end(JSON.stringify(entry))
      return
    }

    if (req.method === 'GET' && pathname === '/api/cashflow') {
      const startDate = url.searchParams.get('startDate')
      const endDate = url.searchParams.get('endDate')
      if (!startDate || !endDate) { res.end(JSON.stringify(cashflows)); return }
      const filtered = cashflows.filter(f => f.date >= startDate && f.date <= endDate)
      res.end(JSON.stringify(filtered))
      return
    }

    // Not found
    res.statusCode = 404
    res.end(JSON.stringify({ error: 'Not found' }))
  } catch (err) {
    res.statusCode = 500
    res.end(JSON.stringify({ error: err.message }))
  }
})

const PORT = process.env.MOCK_PORT || 4001
server.listen(PORT, () => console.log(`Mock API running on port ${PORT}`))
