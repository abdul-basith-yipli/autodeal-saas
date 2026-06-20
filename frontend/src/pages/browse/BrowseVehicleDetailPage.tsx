import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Typography, Paper, Chip, Button, Card, CardMedia, CardContent,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions, Alert,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Favorite, FavoriteBorder } from '@mui/icons-material'
import { vehiclesApi, wishlistApi, bookingsApi, type Vehicle, type Booking } from '../../services/core'
import { useAuth } from '../../contexts/AuthContext'

const fuelLabels: Record<string, string> = { petrol: 'Petrol', diesel: 'Diesel', electric: 'Electric', hybrid: 'Hybrid' }
const transLabels: Record<string, string> = { manual: 'Manual', automatic: 'Automatic' }
const condLabels: Record<string, string> = { new: 'New', like_new: 'Like New', excellent: 'Excellent', good: 'Good', fair: 'Fair' }
const statusColors: Record<string, string> = {
  available: 'success', sold: 'error', reserved: 'warning', in_transit: 'info',
}

export default function BrowseVehicleDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [wishlisted, setWishlisted] = useState(false)
  const [wishlistId, setWishlistId] = useState<number | null>(null)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookingMsg, setBookingMsg] = useState('')
  const [bookingDate, setBookingDate] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!id) return
    vehiclesApi.get(Number(id)).then(setVehicle)
  }, [id])

  useEffect(() => {
    if (!user || !id) return
    wishlistApi.check(Number(id)).then(r => {
      setWishlisted(r.is_wishlisted)
      if (r.wishlist_id) setWishlistId(r.wishlist_id)
    }).catch(() => {})
  }, [user, id])

  const toggleWishlist = async () => {
    if (!user) { navigate('/customer/login'); return }
    if (wishlisted && wishlistId) {
      await wishlistApi.remove(wishlistId)
      setWishlisted(false)
      setWishlistId(null)
    } else {
      const w = await wishlistApi.add(Number(id))
      setWishlisted(true)
      setWishlistId(w.id)
    }
  }

  const handleBooking = async () => {
    setError('')
    setSuccess('')
    try {
      const b = await bookingsApi.create({
        vehicle: Number(id),
        message: bookingMsg,
        preferred_date: bookingDate,
      } as Partial<Booking>)
      setSuccess(`Booking #${b.id} created! We'll contact you soon.`)
      setBookingOpen(false)
    } catch {
      setError('Failed to create booking. Please try again.')
    }
  }

  if (!vehicle) return <Typography>Loading...</Typography>

  return (
    <Box>
      <Button onClick={() => navigate('/browse')} sx={{ mb: 2 }}>← Back to listings</Button>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          {vehicle.images.length > 0 ? (
            <Card>
              <CardMedia
                component="img"
                image={vehicle.images.find(i => i.is_primary)?.image || vehicle.images[0].image}
                alt={vehicle.vin}
                sx={{ maxHeight: 400, objectFit: 'cover' }}
              />
            </Card>
          ) : (
            <Paper sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">No images available</Typography>
            </Paper>
          )}
          {vehicle.images.length > 1 && (
            <Box display="flex" gap={1} mt={1}>
              {vehicle.images.map(img => (
                <CardMedia key={img.id} component="img" image={img.image} alt=""
                  sx={{ width: 80, height: 60, borderRadius: 1, cursor: 'pointer' }} />
              ))}
            </Box>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h4">${parseFloat(vehicle.price).toLocaleString()}</Typography>
              <Button onClick={toggleWishlist} color={wishlisted ? 'error' : 'default'}>
                {wishlisted ? <Favorite /> : <FavoriteBorder />}
              </Button>
            </Box>

            <Typography variant="h6" mt={2}>{vehicle.year} · {vehicle.mileage.toLocaleString()} mi</Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {fuelLabels[vehicle.fuel_type] || vehicle.fuel_type} · {transLabels[vehicle.transmission] || vehicle.transmission}
            </Typography>

            <Box mt={2}>
              <Chip label={vehicle.status} color={(statusColors as any)[vehicle.status] || 'default'} sx={{ mr: 1 }} />
              <Chip label={condLabels[vehicle.condition] || vehicle.condition} variant="outlined" />
            </Box>

            <Typography variant="body2" mt={2}>VIN: {vehicle.vin}</Typography>
            <Typography variant="body2">Reg: {vehicle.reg_number || '—'}</Typography>
            <Typography variant="body2">Color: {vehicle.color || '—'}</Typography>

            {vehicle.description && (
              <Typography variant="body2" mt={2}>{vehicle.description}</Typography>
            )}

            <Button fullWidth variant="contained" size="large" sx={{ mt: 3 }}
              onClick={() => {
                if (!user) { navigate('/customer/login'); return }
                setBookingOpen(true)
              }}>
              Book Test Drive
            </Button>
          </Paper>
        </Grid>

        {vehicle.spec_values.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Specifications</Typography>
              {vehicle.spec_values.map(sv => (
                <Typography key={sv.id}>Spec #{sv.specification}: {JSON.stringify(sv.value)}</Typography>
              ))}
            </Paper>
          </Grid>
        )}

        {vehicle.inspections.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Inspections</Typography>
              {vehicle.inspections.map(ins => (
                <Box key={ins.id} mb={1}>
                  <Typography>Rating: {ins.rating}/5 — {ins.report}</Typography>
                </Box>
              ))}
            </Paper>
          </Grid>
        )}
      </Grid>

      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      <Dialog open={bookingOpen} onClose={() => setBookingOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Book a Test Drive</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Preferred Date" type="date" margin="normal"
            value={bookingDate} onChange={e => setBookingDate(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }} />
          <TextField fullWidth label="Message (optional)" multiline rows={3} margin="normal"
            value={bookingMsg} onChange={e => setBookingMsg(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleBooking} disabled={!bookingDate}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
