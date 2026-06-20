import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, IconButton, TextField, MenuItem,
} from '@mui/material'
import { Add, Edit, Delete, Visibility } from '@mui/icons-material'
import { vehiclesApi, type Vehicle, type VehicleBrand, type VehicleCategory } from '../../services/core'

const statusColors: Record<string, string> = {
  available: 'success', sold: 'error', reserved: 'warning', in_transit: 'info',
}

export default function VehiclesPage() {
  const [rows, setRows] = useState<Vehicle[]>([])
  const [filtered, setFiltered] = useState<Vehicle[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const navigate = useNavigate()

  const load = () => vehiclesApi.list().then((data) => {
    setRows(data)
    setFiltered(data)
  })

  useEffect(() => { load() }, [])

  useEffect(() => {
    let result = rows
    if (search) {
      result = result.filter((v) =>
        v.vin.toLowerCase().includes(search.toLowerCase()) ||
        v.reg_number.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (statusFilter) result = result.filter((v) => v.status === statusFilter)
    setFiltered(result)
  }, [search, statusFilter, rows])

  const handleDelete = async (id: number) => {
    if (confirm('Delete this vehicle?')) {
      await vehiclesApi.delete(id)
      load()
    }
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Vehicles</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/vehicles/new')}>
          Add Vehicle
        </Button>
      </Box>

      <Box display="flex" gap={2} mb={2}>
        <TextField size="small" label="Search VIN/Reg" value={search}
          onChange={(e) => setSearch(e.target.value)} sx={{ minWidth: 200 }} />
        <TextField size="small" select label="Status" value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 140 }}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="available">Available</MenuItem>
          <MenuItem value="sold">Sold</MenuItem>
          <MenuItem value="reserved">Reserved</MenuItem>
          <MenuItem value="in_transit">In Transit</MenuItem>
        </TextField>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>VIN</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Mileage</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.vin}</TableCell>
                <TableCell>{row.year}</TableCell>
                <TableCell>{row.mileage.toLocaleString()} mi</TableCell>
                <TableCell>${parseFloat(row.price).toLocaleString()}</TableCell>
                <TableCell>
                  <Chip label={row.status} color={(statusColors[row.status] as any) || 'default'} size="small" />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => navigate(`/vehicles/${row.id}`)}><Visibility /></IconButton>
                  <IconButton onClick={() => navigate(`/vehicles/${row.id}/edit`)}><Edit /></IconButton>
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
