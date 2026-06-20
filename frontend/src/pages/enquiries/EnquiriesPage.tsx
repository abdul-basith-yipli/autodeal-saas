import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, IconButton, TextField, MenuItem,
} from '@mui/material'
import { Add, Edit, Delete, Visibility } from '@mui/icons-material'
import { enquiriesApi, type Enquiry } from '../../services/core'

const statusColors: Record<string, string> = {
  new: 'info', contacted: 'warning', qualified: 'primary',
  negotiation: 'secondary', closed_won: 'success', closed_lost: 'error',
}

export default function EnquiriesPage() {
  const [rows, setRows] = useState<Enquiry[]>([])
  const [filtered, setFiltered] = useState<Enquiry[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const navigate = useNavigate()

  const load = () => enquiriesApi.list().then((data) => {
    setRows(data)
    setFiltered(data)
  })

  useEffect(() => { load() }, [])

  useEffect(() => {
    let result = rows
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((e) =>
        String(e.id).includes(q) || e.message.toLowerCase().includes(q)
      )
    }
    if (statusFilter) result = result.filter((e) => e.status === statusFilter)
    setFiltered(result)
  }, [search, statusFilter, rows])

  const handleDelete = async (id: number) => {
    if (confirm('Delete this enquiry?')) {
      await enquiriesApi.delete(id)
      load()
    }
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Enquiries</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/enquiries/new')}>
          Add Enquiry
        </Button>
      </Box>

      <Box display="flex" gap={2} mb={2}>
        <TextField size="small" label="Search ID/Message" value={search}
          onChange={(e) => setSearch(e.target.value)} sx={{ minWidth: 200 }} />
        <TextField size="small" select label="Status" value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 140 }}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="new">New</MenuItem>
          <MenuItem value="contacted">Contacted</MenuItem>
          <MenuItem value="qualified">Qualified</MenuItem>
          <MenuItem value="negotiation">Negotiation</MenuItem>
          <MenuItem value="closed_won">Closed Won</MenuItem>
          <MenuItem value="closed_lost">Closed Lost</MenuItem>
        </TextField>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((row) => (
              <TableRow key={row.id}>
                <TableCell>#{row.id}</TableCell>
                <TableCell>{row.customer}</TableCell>
                <TableCell>{row.message || '—'}</TableCell>
                <TableCell>
                  <Chip label={row.status.replace('_', ' ')} color={(statusColors[row.status] as any) || 'default'} size="small" />
                </TableCell>
                <TableCell>{new Date(row.created_at).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => navigate(`/enquiries/${row.id}`)}><Visibility /></IconButton>
                  <IconButton onClick={() => navigate(`/enquiries/${row.id}/edit`)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDelete(row.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
