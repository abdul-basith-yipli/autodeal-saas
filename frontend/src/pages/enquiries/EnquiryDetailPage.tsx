import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import {
  Box, Typography, Paper, Chip, Button, TextField, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Collapse,
} from '@mui/material'
import { Add } from '@mui/icons-material'
import Grid from '@mui/material/Grid2'
import {
  enquiriesApi, customersApi, followupsApi,
  vehiclesApi,
  type Enquiry, type Customer,
} from '../../services/core'

const statusColors: Record<string, string> = {
  new: 'info', contacted: 'warning', qualified: 'primary',
  negotiation: 'secondary', closed_won: 'success', closed_lost: 'error',
}
const typeLabels: Record<string, string> = {
  call: 'Call', email: 'Email', visit: 'Visit', test_drive: 'Test Drive',
}
const fuStatusLabels: Record<string, string> = {
  pending: 'Pending', completed: 'Completed', cancelled: 'Cancelled',
}

export default function EnquiryDetailPage() {
  const { id } = useParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null)
  const [showFuForm, setShowFuForm] = useState(false)
  const isEdit = pathname.endsWith('/edit')
  const isNew = id === 'new'

  const reload = () => { if (id) enquiriesApi.get(Number(id)).then(setEnquiry) }

  useEffect(() => {
    if (id && !isNew && !isEdit) reload()
    if (id && isEdit) reload()
  }, [id])

  const handleSave = () => navigate('/enquiries')

  if (isNew || isEdit) return (
    <EnquiryFormPage editEnquiry={isEdit ? enquiry || undefined : undefined} onSave={handleSave} />
  )

  if (!enquiry) return <Typography>Loading...</Typography>

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Enquiry #{enquiry.id}</Typography>
        <Box>
          <Button onClick={() => navigate(`/enquiries/${id}/edit`)} sx={{ mr: 1 }}>Edit</Button>
          <Button onClick={() => navigate('/enquiries')}>Back</Button>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Details</Typography>
            <Typography>Customer ID: {enquiry.customer}</Typography>
            <Typography>Message: {enquiry.message || '—'}</Typography>
            <Typography>Source: {enquiry.source || '—'}</Typography>
            <Typography>Budget: {enquiry.expected_budget ? `$${parseFloat(enquiry.expected_budget).toLocaleString()}` : '—'}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Status</Typography>
            <Chip label={enquiry.status.replace('_', ' ')} color={(statusColors[enquiry.status] as any) || 'default'} />
            <Typography sx={{ mt: 1 }}>Showroom: {enquiry.showroom}</Typography>
            <Typography>Vehicle: {enquiry.vehicle || '—'}</Typography>
            <Typography>Assigned: {enquiry.assigned_to || '—'}</Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h6">Follow-ups</Typography>
              <Button size="small" startIcon={<Add />} onClick={() => setShowFuForm(!showFuForm)}>
                {showFuForm ? 'Cancel' : 'Add Follow-up'}
              </Button>
            </Box>

            <Collapse in={showFuForm}>
              <FollowUpForm enquiryId={enquiry.id} onSaved={() => { setShowFuForm(false); reload() }} />
            </Collapse>

            {enquiry.followups.length === 0 ? (
              <Typography color="text.secondary" sx={{ mt: 1 }}>No follow-ups yet.</Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Scheduled</TableCell>
                      <TableCell>Note</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {enquiry.followups.map((fu) => (
                      <TableRow key={fu.id}>
                        <TableCell>{typeLabels[fu.followup_type] || fu.followup_type}</TableCell>
                        <TableCell><Chip label={fuStatusLabels[fu.status] || fu.status} size="small"
                          color={fu.status === 'completed' ? 'success' : fu.status === 'cancelled' ? 'error' : 'warning'} /></TableCell>
                        <TableCell>{new Date(fu.scheduled_at).toLocaleString()}</TableCell>
                        <TableCell>{fu.note || '—'}</TableCell>
                        <TableCell align="right">
                          {fu.status === 'pending' && (
                            <Button size="small" onClick={async () => {
                              await followupsApi.complete(enquiry.id, fu.id)
                              reload()
                            }}>Complete</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Communication Log</Typography>
            {enquiry.communication_logs.length === 0 ? (
              <Typography color="text.secondary">No communication logs yet.</Typography>
            ) : (
              enquiry.communication_logs.map((log) => (
                <Box key={log.id} sx={{ mb: 1, pb: 1, borderBottom: '1px solid #eee' }}>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(log.created_at).toLocaleString()} — Staff #{log.staff}
                  </Typography>
                  <Typography>{log.note}</Typography>
                </Box>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

function FollowUpForm({ enquiryId, onSaved }: { enquiryId: number; onSaved: () => void }) {
  const [form, setForm] = useState({
    followup_type: 'call', scheduled_at: '', note: '', assigned_to: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await followupsApi.create(enquiryId, {
      ...form,
      enquiry: enquiryId,
      assigned_to: form.assigned_to ? Number(form.assigned_to) : null,
      scheduled_at: new Date(form.scheduled_at).toISOString(),
    })
    onSaved()
    setForm({ followup_type: 'call', scheduled_at: '', note: '', assigned_to: '' })
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 4 }}>
          <TextField fullWidth size="small" select label="Type" required value={form.followup_type}
            onChange={(e) => setForm({ ...form, followup_type: e.target.value })}>
            {Object.entries(typeLabels).map(([k, v]) => <MenuItem key={k} value={k}>{v}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <TextField fullWidth size="small" label="Scheduled At" type="datetime-local" required
            value={form.scheduled_at}
            onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
            InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid size={{ xs: 4 }}>
          <TextField fullWidth size="small" label="Assigned To (User ID)" value={form.assigned_to}
            onChange={(e) => setForm({ ...form, assigned_to: e.target.value })} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField fullWidth size="small" label="Note" multiline rows={2} value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Button type="submit" variant="contained" size="small">Create Follow-up</Button>
        </Grid>
      </Grid>
    </Box>
  )
}

function EnquiryFormPage({ editEnquiry, onSave }: { editEnquiry?: Enquiry; onSave: () => void }) {
  const navigate = useNavigate()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [vehicles, setVehicles] = useState<any[]>([])
  const [form, setForm] = useState({
    customer: '', vehicle: '', showroom: '', assigned_to: '',
    source: '', message: '', status: 'new', expected_budget: '',
  })

  useEffect(() => {
    customersApi.list().then(setCustomers)
    vehiclesApi.list().then(setVehicles)
    if (editEnquiry) {
      setForm({
        customer: String(editEnquiry.customer),
        vehicle: String(editEnquiry.vehicle || ''),
        showroom: String(editEnquiry.showroom),
        assigned_to: String(editEnquiry.assigned_to || ''),
        source: editEnquiry.source,
        message: editEnquiry.message,
        status: editEnquiry.status,
        expected_budget: editEnquiry.expected_budget || '',
      })
    }
  }, [editEnquiry])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload: any = {
      ...form,
      customer: Number(form.customer),
      vehicle: form.vehicle ? Number(form.vehicle) : null,
      showroom: form.showroom ? Number(form.showroom) : null,
      assigned_to: form.assigned_to ? Number(form.assigned_to) : null,
      expected_budget: form.expected_budget || null,
    }
    if (editEnquiry) {
      await enquiriesApi.update(editEnquiry.id, payload)
    } else {
      await enquiriesApi.create(payload)
    }
    onSave()
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600 }}>
      <Typography variant="h4" mb={2}>{editEnquiry ? 'Edit Enquiry' : 'Add Enquiry'}</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6 }}>
          <TextField fullWidth select label="Customer" required value={form.customer}
            onChange={(e) => setForm({ ...form, customer: e.target.value })}>
            {customers.map((c) => <MenuItem key={c.id} value={c.id}>{c.name} ({c.phone})</MenuItem>)}
          </TextField>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField fullWidth select label="Vehicle" value={form.vehicle}
            onChange={(e) => setForm({ ...form, vehicle: e.target.value })}>
            <MenuItem value="">—</MenuItem>
            {vehicles.map((v) => <MenuItem key={v.id} value={v.id}>{v.vin} ({v.year})</MenuItem>)}
          </TextField>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField fullWidth select label="Status" required value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <MenuItem value="new">New</MenuItem>
            <MenuItem value="contacted">Contacted</MenuItem>
            <MenuItem value="qualified">Qualified</MenuItem>
            <MenuItem value="negotiation">Negotiation</MenuItem>
            <MenuItem value="closed_won">Closed Won</MenuItem>
            <MenuItem value="closed_lost">Closed Lost</MenuItem>
          </TextField>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField fullWidth label="Source" value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField fullWidth label="Expected Budget" value={form.expected_budget}
            onChange={(e) => setForm({ ...form, expected_budget: e.target.value })} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField fullWidth label="Assigned To (User ID)" value={form.assigned_to}
            onChange={(e) => setForm({ ...form, assigned_to: e.target.value })} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField fullWidth label="Message" multiline rows={3} value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Button type="submit" variant="contained" sx={{ mr: 1 }}>Save</Button>
          <Button onClick={() => navigate('/enquiries')}>Cancel</Button>
        </Grid>
      </Grid>
    </Box>
  )
}
