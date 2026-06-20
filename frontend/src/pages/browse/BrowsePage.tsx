import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, CardMedia, Chip, TextField, MenuItem, InputAdornment,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Search, LocalGasStation, Settings } from '@mui/icons-material'
import { vehiclesApi, type Vehicle } from '../../services/core'
import { neo, theme } from '../../styles/neumorphism'

const fuelLabels: Record<string, string> = { petrol: 'Petrol', diesel: 'Diesel', electric: 'Electric', hybrid: 'Hybrid' }
const transLabels: Record<string, string> = { manual: 'Manual', automatic: 'Automatic' }
const condLabels: Record<string, string> = { new: 'New', like_new: 'Like New', excellent: 'Excellent', good: 'Good', fair: 'Fair' }

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
        v.description?.toLowerCase().includes(search.toLowerCase()) ||
        v.vin.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (fuelFilter) result = result.filter(v => v.fuel_type === fuelFilter)
    if (transFilter) result = result.filter(v => v.transmission === transFilter)
    setFiltered(result)
  }, [search, fuelFilter, transFilter, vehicles])

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, color: theme.text, mb: 1 }}>
          Find Your Dream Car
        </Typography>
        <Typography variant="body1" sx={{ color: theme.textSecondary, maxWidth: 500, mx: 'auto' }}>
          Browse our premium inventory of hand-picked vehicles
        </Typography>
      </Box>

      <Box sx={{ ...neo.concave, p: 2.5, mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField placeholder="Search by keyword..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search sx={{ color: theme.textSecondary }} /></InputAdornment> } }}
          sx={{ flex: 1, minWidth: 240, '& .MuiOutlinedInput-root': { ...neo.input } }} />
        <TextField select value={fuelFilter} onChange={(e) => setFuelFilter(e.target.value)}
          placeholder="Fuel Type" sx={{ minWidth: 140, '& .MuiOutlinedInput-root': { ...neo.select } }}>
          <MenuItem value="">Fuel Type</MenuItem>
          {Object.entries(fuelLabels).map(([k, v]) => <MenuItem key={k} value={k}>{v}</MenuItem>)}
        </TextField>
        <TextField select value={transFilter} onChange={(e) => setTransFilter(e.target.value)}
          placeholder="Transmission" sx={{ minWidth: 160, '& .MuiOutlinedInput-root': { ...neo.select } }}>
          <MenuItem value="">Transmission</MenuItem>
          {Object.entries(transLabels).map(([k, v]) => <MenuItem key={k} value={k}>{v}</MenuItem>)}
        </TextField>
      </Box>

      <Grid container spacing={3}>
        {filtered.map((v) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={v.id}>
            <Box sx={{
              ...neo.card, height: '100%', display: 'flex', flexDirection: 'column',
              cursor: 'pointer', overflow: 'hidden',
            }} onClick={() => navigate(`/browse/${v.id}`)}>
              <Box sx={{ position: 'relative', overflow: 'hidden', borderTopLeftRadius: theme.radius, borderTopRightRadius: theme.radius }}>
                <CardMedia component="img" height={190}
                  image={v.images?.find(i => i.is_primary)?.image || '/placeholder-car.jpg'}
                  alt={v.vin} sx={{ objectFit: 'cover', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }} />
                <Chip label={`$${parseFloat(v.price).toLocaleString()}`} size="small"
                  sx={{ position: 'absolute', top: 10, right: 10, bgcolor: theme.primary, color: 'white', fontWeight: 700, fontSize: 13 }} />
              </Box>
              <Box sx={{ p: 2, flexGrow: 1 }}>
                <Typography variant="body2" sx={{ color: theme.textLight, mb: 0.5 }}>
                  {v.year} · {v.mileage.toLocaleString()} mi
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap" mb={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocalGasStation sx={{ fontSize: 14, color: theme.textSecondary }} />
                    <Typography variant="caption" sx={{ color: theme.textSecondary }}>
                      {fuelLabels[v.fuel_type] || v.fuel_type}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Settings sx={{ fontSize: 14, color: theme.textSecondary }} />
                    <Typography variant="caption" sx={{ color: theme.textSecondary }}>
                      {transLabels[v.transmission] || v.transmission}
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" gap={1} alignItems="center">
                  <Chip label={v.status} size="small"
                    sx={{ ...neo.chip('#2ecc71'), color: '#2ecc71', fontSize: 11, height: 24 }} />
                  <Typography variant="caption" sx={{ color: theme.textLight }}>{condLabels[v.condition]}</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
        {filtered.length === 0 && (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ ...neo.convex, p: 6, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: theme.textSecondary }}>No vehicles found</Typography>
              <Typography variant="body2" sx={{ color: theme.textLight }}>Try adjusting your search or filters</Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}
