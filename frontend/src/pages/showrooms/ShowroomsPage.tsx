import { useState, useEffect } from 'react'
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, IconButton,
} from '@mui/material'
import { Add, Edit, Delete } from '@mui/icons-material'
import { showroomsApi, type Showroom } from '../../services/core'

export default function ShowroomsPage() {
  const [rows, setRows] = useState<Showroom[]>([])
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState<Showroom | null>(null)
  const [form, setForm] = useState({ name: '', code: '', phone: '', email: '' })

  const load = () => showroomsApi.list().then(setRows)

  useEffect(() => { load() }, [])

  const handleSave = async () => {
    if (edit) {
      await showroomsApi.update(edit.id, form)
    } else {
      await showroomsApi.create(form)
    }
    setOpen(false)
    setEdit(null)
    setForm({ name: '', code: '', phone: '', email: '' })
    load()
  }

  const handleEdit = (row: Showroom) => {
    setEdit(row)
    setForm({ name: row.name, code: row.code, phone: row.phone, email: row.email })
    setOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Delete this showroom?')) {
      await showroomsApi.delete(id)
      load()
    }
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Showrooms</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => { setEdit(null); setForm({ name: '', code: '', phone: '', email: '' }); setOpen(true) }}>
          Add Showroom
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.code}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(row)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDelete(row.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{edit ? 'Edit Showroom' : 'Add Showroom'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" margin="normal" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField fullWidth label="Code" margin="normal" value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })} />
          <TextField fullWidth label="Phone" margin="normal" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <TextField fullWidth label="Email" margin="normal" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
