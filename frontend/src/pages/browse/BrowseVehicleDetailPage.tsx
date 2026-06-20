import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Typography, Chip, Button, CardMedia,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions, Alert,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Favorite, FavoriteBorder, ArrowBack, LocalGasStation, Settings, Speed } from '@mui/icons-material'
import { vehiclesApi, wishlistApi, bookingsApi, type Vehicle, type Booking } from '../../services/core'
import { useAuth } from '../../contexts/AuthContext'
import { neo, theme } from '../../styles/neumorphism'

const fuelLabels: Record<string, string> = { petrol: 'Petrol', diesel: 'Diesel', electric: 'Electric', hybrid: 'Hybrid' }
const transLabels: Record<string, string> = { manual: 'Manual', automatic: 'Automatic' }
const condLabels: Record<string, string> = { new: 'New', like_new: 'Like New', excellent: 'Excellent', good: 'Good', fair: 'Fair' }

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

  if (!vehicle) return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography sx={{ color: theme.textSecondary }}>Loading...</Typography>
    </Box>
  )

  return (
    <Box>
      <Button onClick={() => navigate('/browse')}
        sx={{ ...neo.concave, mb: 3, px: 3, py: 1, color: theme.text, gap: 1, textTransform: 'none' }}>
        <ArrowBack sx={{ fontSize: 18 }} /> Back to listings
      </Button>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ ...neo.card, overflow: 'hidden', p: 0 }}>
            {vehicle.images.length > 0 ? (
              <CardMedia component="img"
                image={vehicle.images.find(i => i.is_primary)?.image || vehicle.images[0].image}
                alt={vehicle.vin}
                sx={{ width: '100%', maxHeight: 420, objectFit: 'cover' }} />
            ) : (
              <Box sx={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: theme.bgDark }}>
                <Typography sx={{ color: theme.textLight }}>No images available</Typography>
              </Box>
            )}
          </Box>
          {vehicle.images.length > 1 && (
            <Box display="flex" gap={1} mt={1.5}>
              {vehicle.images.map(img => (
                <Box key={img.id} sx={{ ...neo.convex, borderRadius: 2, overflow: 'hidden' }}>
                  <CardMedia component="img" image={img.image} alt=""
                    sx={{ width: 72, height: 54, objectFit: 'cover', cursor: 'pointer' }} />
                </Box>
              ))}
            </Box>
          )}

          {/* Specifications */}
          {vehicle.spec_values.length > 0 && (
            <Box sx={{ ...neo.convex, p: 2.5, mt: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: theme.text, mb: 2 }}>Specifications</Typography>
              <Grid container spacing={1.5}>
                {vehicle.spec_values.map(sv => (
                  <Grid key={sv.id} size={{ xs: 6, sm: 4 }}>
                    <Box sx={{ ...neo.concave, p: 1.5, borderRadius: 2, textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ color: theme.textLight }}>Spec #{sv.specification}</Typography>
                      <Typography variant="body2" sx={{ color: theme.text, fontWeight: 600 }}>{JSON.stringify(sv.value)}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Inspections */}
          {vehicle.inspections.length > 0 && (
            <Box sx={{ ...neo.convex, p: 2.5, mt: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: theme.text, mb: 2 }}>Inspections</Typography>
              {vehicle.inspections.map(ins => (
                <Box key={ins.id} sx={{ ...neo.concave, p: 2, borderRadius: 2, mb: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${theme.primaryLight}, ${theme.primaryDark})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 16,
                  }}>{ins.rating}</Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: theme.text }}>{ins.report}</Typography>
                    <Typography variant="caption" sx={{ color: theme.textLight }}>Rating: {ins.rating}/5</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Grid>

        {/* Right column - Details */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box sx={{ ...neo.card, p: 3, position: 'sticky', top: 100 }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: theme.primary }}>
                  ${parseFloat(vehicle.price).toLocaleString()}
                </Typography>
                <Box display="flex" gap={1} mt={0.5}>
                  <Chip label={vehicle.status} size="small" sx={{ ...neo.chip('#2ecc71'), color: '#2ecc71', height: 26 }} />
                  <Chip label={condLabels[vehicle.condition] || vehicle.condition} size="small"
                    sx={{ ...neo.chip(theme.textSecondary), color: theme.textSecondary, height: 26 }} />
                </Box>
              </Box>
              <Button onClick={toggleWishlist}
                sx={{
                  ...neo.concave, minWidth: 44, height: 44, borderRadius: '50%',
                  color: wishlisted ? '#e74c3c' : theme.textSecondary,
                  bgcolor: wishlisted ? '#fdf0ed' : undefined,
                }}>
                {wishlisted ? <Favorite /> : <FavoriteBorder />}
              </Button>
            </Box>

            <Box sx={{ ...neo.concave, p: 2, borderRadius: 3, my: 2.5, display: 'flex', justifyContent: 'space-around' }}>
              <Box textAlign="center">
                <Speed sx={{ color: theme.primary, fontSize: 22 }} />
                <Typography variant="caption" sx={{ color: theme.textLight, display: 'block' }}>Year</Typography>
                <Typography variant="body2" sx={{ color: theme.text, fontWeight: 600 }}>{vehicle.year}</Typography>
              </Box>
              <Box textAlign="center">
                <LocalGasStation sx={{ color: theme.primary, fontSize: 22 }} />
                <Typography variant="caption" sx={{ color: theme.textLight, display: 'block' }}>Fuel</Typography>
                <Typography variant="body2" sx={{ color: theme.text, fontWeight: 600 }}>{fuelLabels[vehicle.fuel_type]}</Typography>
              </Box>
              <Box textAlign="center">
                <Settings sx={{ color: theme.primary, fontSize: 22 }} />
                <Typography variant="caption" sx={{ color: theme.textLight, display: 'block' }}>Trans</Typography>
                <Typography variant="body2" sx={{ color: theme.text, fontWeight: 600 }}>{transLabels[vehicle.transmission]}</Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 1 }}>
              {[
                { label: 'VIN', value: vehicle.vin },
                { label: 'Registration', value: vehicle.reg_number || '—' },
                { label: 'Color', value: vehicle.color || '—' },
                { label: 'Mileage', value: `${vehicle.mileage.toLocaleString()} mi` },
              ].map((item, i) => (
                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8, borderBottom: `1px solid ${theme.shadowDark}` }}>
                  <Typography variant="body2" sx={{ color: theme.textSecondary }}>{item.label}</Typography>
                  <Typography variant="body2" sx={{ color: theme.text, fontWeight: 600 }}>{item.value}</Typography>
                </Box>
              ))}
            </Box>

            {vehicle.description && (
              <Box sx={{ ...neo.concave, p: 2, borderRadius: 3, mt: 2 }}>
                <Typography variant="body2" sx={{ color: theme.text }}>{vehicle.description}</Typography>
              </Box>
            )}

            <Button fullWidth sx={{ ...neo.button, mt: 3, py: 1.5, fontSize: 16, gap: 1 }}
              onClick={() => {
                if (!user) { navigate('/customer/login'); return }
                setBookingOpen(true)
              }}>
              Book Test Drive
            </Button>
          </Box>
        </Grid>
      </Grid>

      {success && <Alert severity="success" sx={{ mt: 2, ...neo.convex, borderRadius: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mt: 2, ...neo.convex, borderRadius: 2 }}>{error}</Alert>}

      <Dialog open={bookingOpen} onClose={() => setBookingOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { ...neo.convex, borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, color: theme.text }}>Book a Test Drive</DialogTitle>
        <DialogContent>
          <TextField fullWidth placeholder="Preferred Date" type="date" margin="normal"
            value={bookingDate} onChange={e => setBookingDate(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { ...neo.input } }} />
          <TextField fullWidth placeholder="Message (optional)" multiline rows={3} margin="normal"
            value={bookingMsg} onChange={e => setBookingMsg(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { ...neo.input } }} />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setBookingOpen(false)}
            sx={{ ...neo.concave, color: theme.textSecondary, px: 3, textTransform: 'none' }}>
            Cancel
          </Button>
          <Button sx={{ ...neo.button, px: 3 }} onClick={handleBooking} disabled={!bookingDate}>
            Submit Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
