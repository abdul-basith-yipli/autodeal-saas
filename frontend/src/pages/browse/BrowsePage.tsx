import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, Card, CardMedia, CardContent, CardActions,
  Button, TextField, MenuItem, Chip, InputAdornment,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Search } from '@mui/icons-material'
import { vehiclesApi, type Vehicle } from '../../services/core'

const statusColors: Record<string, string> = {
  available: 'success', sold: 'error', reserved: 'warning', in_transit: 'info',
}

const fuelLabels: Record<string, string> = { petrol: 'Petrol', diesel: 'Diesel', electric: 'Electric', hybrid: 'Hybrid' }
const transLabels: Record<string, string> = { manual: 'Manual', automatic: 'Automatic' }

export default function BrowsePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filtered, setFiltered] = useState<Vehicle[]>([])
  const [search, setSearch] = useState('')
  const [fuelFilter, setFuelFilter] = useState('')
  const [transFilter, setTransFilter] = useState('')
  const navigate = useNavigate()

  const load = () => vehiclesApi.list().then(setVehicles)
  useEffect(() => { load() }, [])

  useEffect(() => {
    let result = vehicles.filter(v => v.status === 'available')
    if (search) {
      result = result.filter(v =>
        v.vin.toLowerCase().includes(search.toLowerCase()) ||
        v.description?.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (fuelFilter) result = result.filter(v => v.fuel_type === fuelFilter)
    if (transFilter) result = result.filter(v => v.transmission === transFilter)
    setFiltered(result)
  }, [search, fuelFilter, transFilter, vehicles])

  return (
    <Box>
      <Typography variant="h3" mb={1}>Find Your Dream Car</Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Browse our inventory of available vehicles
      </Typography>

      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField size="small" label="Search" value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> } }}
          sx={{ minWidth: 250 }} />
        <TextField size="small" select label="Fuel Type" value={fuelFilter}
          onChange={(e) => setFuelFilter(e.target.value)} sx={{ minWidth: 140 }}>
          <MenuItem value="">All</MenuItem>
          {Object.entries(fuelLabels).map(([k, v]) => <MenuItem key={k} value={k}>{v}</MenuItem>)}
        </TextField>
        <TextField size="small" select label="Transmission" value={transFilter}
          onChange={(e) => setTransFilter(e.target.value)} sx={{ minWidth: 140 }}>
          <MenuItem value="">All</MenuItem>
          {Object.entries(transLabels).map(([k, v]) => <MenuItem key={k} value={k}>{v}</MenuItem>)}
        </TextField>
      </Box>

      <Grid container spacing={3}>
        {filtered.map((v) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={v.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img" height={180}
                image={v.images?.find(i => i.is_primary)?.image || '/placeholder-car.jpg'}
                alt={v.vin}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">
                  ${parseFloat(v.price).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {v.year} · {v.mileage.toLocaleString()} mi
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {fuelLabels[v.fuel_type] || v.fuel_type} · {transLabels[v.transmission] || v.transmission}
                </Typography>
                <Chip label={v.status} color={(statusColors[v.status] as any) || 'default'} size="small" />
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/browse/${v.id}`)}>View Details</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        {filtered.length === 0 && (
          <Grid item xs={12}>
            <Typography align="center" color="text.secondary" py={4}>No vehicles found</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}
