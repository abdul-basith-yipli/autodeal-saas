import { useState, useEffect } from 'react'
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, IconButton,
} from '@mui/material'
import { Add, Edit, Delete } from '@mui/icons-material'
import { staffApi, type StaffProfile } from '../../services/core'

export default function StaffPage() {
  const [rows, setRows] = useState<StaffProfile[]>([])
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState<StaffProfile | null>(null)
  const [form, setForm] = useState({ employee_id: '', phone: '' })

  const load = () => staffApi.list().then(setRows)

  useEffect(() => { load() }, [])

  const handleSave = async () => {
    if (edit) {
      await staffApi.update(edit.id, form)
    } else {
      await staffApi.create(form)
    }
    setOpen(false)
    setEdit(null)
    setForm({ employee_id: '', phone: '' })
    load()
  }

  const handleEdit = (row: StaffProfile) => {
    setEdit(row)
    setForm({ employee_id: row.employee_id, phone: row.phone })
    setOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Delete this staff member?')) {
      await staffApi.delete(id)
      load()
    }
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Staff</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => { setEdit(null); setForm({ employee_id: '', phone: '' }); setOpen(true) }}>
          Add Staff
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee ID</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.employee_id}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.is_active ? 'Active' : 'Inactive'}</TableCell>
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
        <DialogTitle>{edit ? 'Edit Staff' : 'Add Staff'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Employee ID" margin="normal" value={form.employee_id}
            onChange={(e) => setForm({ ...form, employee_id: e.target.value })} />
          <TextField fullWidth label="Phone" margin="normal" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
