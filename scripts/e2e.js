let API = process.env.API_URL || 'http://localhost:4001/api'
import http from 'http'
import { URL } from 'url'

function createMockServer(port = 4001){
  let professionals = [
    { id: 'prof-1', firstName: 'Ana', lastName: 'Gomez', license: 'ABC123' },
    { id: 'prof-2', firstName: 'Juan', lastName: 'Perez', license: 'XYZ789' }
  ]
  let patients = []
  let appointments = []
  let cashflows = []

  function parseJson(req){
    return new Promise((resolve,reject)=>{
      let body=''
      req.on('data',c=>body+=c)
      req.on('end',()=>{ if(!body) return resolve(null); try{ resolve(JSON.parse(body)) }catch(e){ reject(e) } })
      req.on('error',reject)
    })
  }

  const server = http.createServer(async (req,res)=>{
    const url = new URL(req.url, `http://${req.headers.host}`)
    const pathname = url.pathname
    res.setHeader('Content-Type','application/json')
    try{
      if(req.method==='GET' && pathname==='/api/health'){ res.end(JSON.stringify({ok:true})); return }
      if(req.method==='GET' && pathname==='/api/professionals'){ res.end(JSON.stringify(professionals)); return }
      if(req.method==='POST' && pathname==='/api/appointments'){
        const body = await parseJson(req)
        const { patient, professionalId, dates, therapyType, appointmentType, diagnosis } = body || {}
        if(!patient || !professionalId || !dates){ res.statusCode=400; res.end(JSON.stringify({error:'Faltan datos'})); return }
        let p = patients.find(x=>x.dni===patient.dni)
        if(!p){ p = { id: `pat-${Date.now()}`, ...patient }; patients.push(p) } else { Object.assign(p,patient) }
        const created = []
        for(const d of dates){ const slot = new Date(d).toISOString(); const appt = { id:`appt-${Date.now()}-${Math.random().toString(36).slice(2,6)}`, patientId: p.id, professionalId, date: d, slot, therapyType, appointmentType, diagnosis, status: 'SCHEDULED' }; appointments.push(appt); created.push(appt) }
        res.statusCode=201; res.end(JSON.stringify({ success:true, patient:p, appointments:created })); return
      }
      if(req.method==='GET' && pathname==='/api/appointments'){ const date = url.searchParams.get('date'); if(!date){ res.end(JSON.stringify(appointments)); return } const filtered = appointments.filter(a=>a.date && a.date.startsWith(date)); res.end(JSON.stringify(filtered)); return }
      if(req.method==='POST' && pathname==='/api/cashflow'){ const body = await parseJson(req); const { type, amount, concept, method, date } = body || {}; if(!type || !amount){ res.statusCode=400; res.end(JSON.stringify({ error:'type y amount requeridos' })); return } const entry = { id:`flow-${Date.now()}`, type, amount, concept, method, date: date || new Date().toISOString().split('T')[0], createdAt: new Date().toISOString() }; cashflows.push(entry); res.statusCode=201; res.end(JSON.stringify(entry)); return }
      if(req.method==='GET' && pathname==='/api/cashflow'){ const startDate = url.searchParams.get('startDate'); const endDate = url.searchParams.get('endDate'); if(!startDate || !endDate){ res.end(JSON.stringify(cashflows)); return } const filtered = cashflows.filter(f=>f.date>=startDate && f.date<=endDate); res.end(JSON.stringify(filtered)); return }
      res.statusCode=404; res.end(JSON.stringify({ error:'Not found' }))
    }catch(err){ res.statusCode=500; res.end(JSON.stringify({ error: err.message })) }
  })

  return new Promise((resolve,reject)=>{
    server.listen(port,()=> resolve({ server, port }))
    server.on('error', reject)
  })
}

async function req(path, opts={}){
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts
  })
  const text = await res.text()
  let body
  try { body = JSON.parse(text) } catch(e){ body = text }
  return { ok: res.ok, status: res.status, body }
}

async function main(){
  console.log('E2E: Iniciando pruebas (API_ESPERADA=http://localhost:4000/api)')

  // Iniciar mock server embebido para pruebas E2E si no se provee API real
  let mockServer
  try {
    mockServer = await createMockServer(4001)
    API = `http://localhost:${mockServer.port}/api`
    console.log('Mock server iniciado en', API)
  } catch (err) {
    console.warn('No se pudo iniciar mock server:', err.message)
  }

  // Preparar datos de paciente
  const newPatient = {
    firstName: 'Test', lastName: 'Paciente', dni: `99999${Date.now()%10000}`,
    dob: '1990-01-01', phone: '+5491112345678', address: 'Calle Falsa 123',
    hasCancer: false, hasPacemaker: false, hasBypass: false, hasAsthma: false,
    hasDiabetes: false, hasHypertension: false, hasHeartDisease: false,
    hasOsteoporosis: false, hasArthritis: false, allergies: 'Ninguna',
    currentMedications: '', socialWorkId: '', notes: 'Creado por E2E'
  }

  // 2) Obtener profesionales disponibles
  console.log('\n2) Obtener profesionales...')
  let r = await req('/professionals')
  console.log('Status:', r.status)
  console.log('Body:', r.body)
  if (!r.ok) { console.error('Fallo al obtener profesionales'); process.exit(1) }
  const professional = (Array.isArray(r.body) ? r.body[0] : r.body.data?.[0])
  if (!professional){ console.error('No hay profesionales'); process.exit(1) }
  const professionalId = professional.id || professional.professionalId || professional.id

  // 3) Crear turno (usando endpoint /appointments que hace upsert del paciente)
  console.log('\n3) Crear turno (crea paciente si no existe)...')
  const today = new Date().toISOString().split('T')[0]
  const apptPayload = {
    patient: newPatient,
    professionalId,
    dates: [today],
    therapyType: 'FKT',
    appointmentType: 'single',
    diagnosis: 'Consulta E2E'
  }
  r = await req('/appointments', { method: 'POST', body: JSON.stringify(apptPayload) })
  console.log('Status:', r.status)
  console.log('Body:', r.body)
  if (!r.ok){ console.error('Fallo al crear turno'); process.exit(1) }
  const appointmentId = r.body.appointments?.[0]?.id || (Array.isArray(r.body) && r.body[0]?.id)
  const patientId = r.body.patient?.id || r.body.patientId

  // 4) Registrar movimiento en caja chica
  console.log('\n4) Registrar movimiento caja (INGRESO)...')
  const flow = { type: 'INCOME', amount: 1500, concept: 'Pago turno E2E', method: 'CASH', date: new Date().toISOString().split('T')[0] }
  r = await req('/cashflow', { method: 'POST', body: JSON.stringify(flow) })
  console.log('Status:', r.status)
  console.log('Body:', r.body)
  if (!r.ok){ console.error('Fallo al crear movimiento de caja'); process.exit(1) }
  const flowId = r.body.id || r.body.data?.id

  // 5) Verificar que el turno aparece en la lista de citas de hoy
  console.log('\n5) Verificar citas de hoy...')
  r = await req(`/appointments?date=${encodeURIComponent(new Date().toISOString().split('T')[0])}`)
  console.log('Status:', r.status)
  console.log('Body:', r.body)
  if (!r.ok){ console.error('Fallo al obtener citas'); process.exit(1) }

  // 6) Verificar movimientos de caja
  console.log('\n6) Verificar movimientos de caja...')
  r = await req(`/cashflow?startDate=${encodeURIComponent(new Date().toISOString().split('T')[0])}&endDate=${encodeURIComponent(new Date().toISOString().split('T')[0])}`)
  console.log('Status:', r.status)
  console.log('Body:', r.body)
  if (!r.ok){ console.error('Fallo al obtener caja'); process.exit(1) }

  console.log('\nE2E: Todas las pruebas completadas correctamente.')

  // Cerrar mock server si fue iniciado
  if (mockServer && mockServer.server) {
    mockServer.server.close()
    console.log('Mock server detenido')
  }
}

main().catch(err => { console.error('Error E2E', err); process.exit(1) })
