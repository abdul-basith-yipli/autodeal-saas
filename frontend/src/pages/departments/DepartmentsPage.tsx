import { useState, useEffect } from 'react'
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, IconButton,
} from '@mui/material'
import { Add, Edit, Delete } from '@mui/icons-material'
import { departmentsApi, type Department } from '../../services/core'

export default function DepartmentsPage() {
  const [rows, setRows] = useState<Department[]>([])
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState<Department | null>(null)
  const [form, setForm] = useState({ name: '', code: '', description: '' })

  const load = () => departmentsApi.list().then(setRows)

  useEffect(() => { load() }, [])

  const handleSave = async () => {
    if (edit) {
      await departmentsApi.update(edit.id, form)
    } else {
      await departmentsApi.create(form)
    }
    setOpen(false)
    setEdit(null)
    setForm({ name: '', code: '', description: '' })
    load()
  }

  const handleEdit = (row: Department) => {
    setEdit(row)
    setForm({ name: row.name, code: row.code, description: row.description })
    setOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Delete this department?')) {
      await departmentsApi.delete(id)
      load()
    }
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Departments</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => { setEdit(null); setForm({ name: '', code: '', description: '' }); setOpen(true) }}>
          Add Department
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.code}</TableCell>
                <TableCell>{row.description}</TableCell>
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
        <DialogTitle>{edit ? 'Edit Department' : 'Add Department'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" margin="normal" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField fullWidth label="Code" margin="normal" value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })} />
          <TextField fullWidth label="Description" margin="normal" multiline rows={3} value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
