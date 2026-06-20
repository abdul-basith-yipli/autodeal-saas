import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, CardMedia, Button, Chip, IconButton,
} from '@mui/material'
import { Delete, Favorite, ExitToApp, DirectionsCar } from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { wishlistApi, bookingsApi, paymentsApi, type Wishlist, type Booking, type Payment } from '../../services/core'
import { neo, theme } from '../../styles/neumorphism'

const statusStyles: Record<string, { bg: string; color: string }> = {
  pending: { bg: '#fff8e1', color: '#f9a825' },
  confirmed: { bg: '#e3f2fd', color: '#1565c0' },
  completed: { bg: '#e8f5e9', color: '#2e7d32' },
  cancelled: { bg: '#fbe9e7', color: '#c62828' },
}

export default function CustomerDashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)
  const [wishlist, setWishlist] = useState<Wishlist[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [payments, setPayments] = useState<Payment[]>([])

  useEffect(() => {
    wishlistApi.list().then(setWishlist).catch(() => {})
    bookingsApi.list().then(setBookings).catch(() => {})
    paymentsApi.list().then(setPayments).catch(() => {})
  }, [])

  const removeWishlist = async (id: number) => {
    await wishlistApi.remove(id)
    setWishlist(prev => prev.filter(w => w.id !== id))
  }

  const cancelBooking = async (id: number) => {
    await bookingsApi.cancel(id)
    bookingsApi.list().then(setBookings).catch(() => {})
  }

  const tabs = [
    { label: 'Wishlist', count: wishlist.length, icon: <Favorite sx={{ fontSize: 18 }} /> },
    { label: 'Bookings', count: bookings.length, icon: <DirectionsCar sx={{ fontSize: 18 }} /> },
    { label: 'Payments', count: payments.length, icon: null },
  ]

  return (
    <Box>
      {/* Header */}
      <Box sx={{ ...neo.convex, p: 2.5, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: theme.text }}>
            Welcome, {user?.full_name?.split(' ')[0] || 'there'} 👋
          </Typography>
          <Typography variant="body2" sx={{ color: theme.textSecondary }}>{user?.email}</Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button sx={{ ...neo.concave, color: theme.textSecondary, px: 2, textTransform: 'none', gap: 0.5 }}
            onClick={() => navigate('/browse')}>
            <DirectionsCar sx={{ fontSize: 16 }} /> Browse
          </Button>
          <Button sx={{ ...neo.concave, color: '#c62828', px: 2, textTransform: 'none', gap: 0.5 }} onClick={logout}>
            <ExitToApp sx={{ fontSize: 16 }} /> Logout
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ ...neo.input, p: 0.5, borderRadius: 3, mb: 3, display: 'flex', gap: 0.5 }}>
        {tabs.map((t, i) => (
          <Box key={i} onClick={() => setTab(i)}
            sx={{
              flex: 1, py: 1.2, px: 2, borderRadius: 2.5, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
              ...(tab === i ? neo.button : {}),
              ...(tab !== i ? { color: theme.textSecondary } : {}),
              fontSize: 14, fontWeight: 600, textTransform: 'none', transition: 'all 0.2s',
            }}>
            {t.icon} {t.label}
            <Chip label={t.count} size="small"
              sx={{ bgcolor: tab === i ? 'rgba(255,255,255,0.3)' : theme.bgDark, color: tab === i ? 'white' : theme.text, fontWeight: 700, fontSize: 11, height: 20 }} />
          </Box>
        ))}
      </Box>

      {/* Tab content */}
      {tab === 0 && (
        <Box display="flex" flexWrap="wrap" gap={2.5}>
          {wishlist.length === 0 && (
            <Box sx={{ ...neo.convex, p: 5, textAlign: 'center', width: '100%' }}>
              <Favorite sx={{ fontSize: 48, color: theme.textLight, mb: 1 }} />
              <Typography sx={{ color: theme.textSecondary }}>Your wishlist is empty</Typography>
              <Button sx={neo.button} onClick={() => navigate('/browse')} style={{ marginTop: 12 }}>Browse Vehicles</Button>
            </Box>
          )}
          {wishlist.map(w => (
            <Box key={w.id} sx={{ ...neo.card, width: 280, overflow: 'hidden' }}>
              <CardMedia component="img" height={148}
                image={w.vehicle_detail?.images?.find(i => i.is_primary)?.image || '/placeholder-car.jpg'}
                alt="" sx={{ objectFit: 'cover' }} />
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: theme.primary }}>
                  ${parseFloat(w.vehicle_detail?.price || '0').toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.textSecondary }}>
                  {w.vehicle_detail?.year} · {w.vehicle_detail?.mileage?.toLocaleString()} mi
                </Typography>
              </Box>
              <Box sx={{ px: 2, pb: 2, display: 'flex', gap: 1 }}>
                <Button sx={{ ...neo.concave, flex: 1, color: theme.text, textTransform: 'none', fontSize: 13 }}
                  onClick={() => navigate(`/browse/${w.vehicle}`)}>View</Button>
                <IconButton size="small" onClick={() => removeWishlist(w.id)}
                  sx={{ ...neo.concave, borderRadius: 2, color: '#e74c3c', width: 36, height: 36 }}>
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {tab === 1 && (
        <Box display="flex" flexDirection="column" gap={2}>
          {bookings.length === 0 && (
            <Box sx={{ ...neo.convex, p: 5, textAlign: 'center' }}>
              <DirectionsCar sx={{ fontSize: 48, color: theme.textLight, mb: 1 }} />
              <Typography sx={{ color: theme.textSecondary }}>No bookings yet</Typography>
            </Box>
          )}
          {bookings.map(b => {
            const s = statusStyles[b.status] || { bg: theme.bgDark, color: theme.text }
            return (
              <Box key={b.id} sx={{ ...neo.card, p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: theme.text }}>
                    Vehicle #{b.vehicle}
                  </Typography>
                  <Typography variant="caption" sx={{ color: theme.textLight }}>
                    {b.preferred_date} {b.message ? `· ${b.message}` : ''}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Chip label={b.status} size="small"
                    sx={{ bgcolor: s.bg, color: s.color, fontWeight: 600, fontSize: 12, borderRadius: 2 }} />
                  {b.status === 'pending' && (
                    <Button onClick={() => cancelBooking(b.id)}
                      sx={{ ...neo.concave, color: '#c62828', textTransform: 'none', fontSize: 12, px: 2, py: 0.5 }}>
                      Cancel
                    </Button>
                  )}
                </Box>
              </Box>
            )
          })}
        </Box>
      )}

      {tab === 2 && (
        <Box display="flex" flexDirection="column" gap={2}>
          {payments.length === 0 ? (
            <Box sx={{ ...neo.convex, p: 5, textAlign: 'center' }}>
              <Typography sx={{ color: theme.textSecondary }}>No payments yet</Typography>
            </Box>
          ) : (
            payments.map(p => {
              const s = statusStyles[p.status] || { bg: theme.bgDark, color: theme.text }
              return (
                <Box key={p.id} sx={{ ...neo.card, p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: theme.text }}>
                      ${parseFloat(p.amount).toLocaleString()} via {p.payment_method}
                    </Typography>
                    <Typography variant="caption" sx={{ color: theme.textLight }}>
                      {p.transaction_id ? `ID: ${p.transaction_id}` : ''} {p.paid_at ? `· ${new Date(p.paid_at).toLocaleDateString()}` : ''}
                    </Typography>
                  </Box>
                  <Chip label={p.status} size="small"
                    sx={{ bgcolor: s.bg, color: s.color, fontWeight: 600, fontSize: 12, borderRadius: 2 }} />
                </Box>
              )
            })
          )}
        </Box>
      )}
    </Box>
  )
}
