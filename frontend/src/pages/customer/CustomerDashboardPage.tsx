import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, Card, CardContent, CardActions, CardMedia,
  Button, Chip, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Tabs, Tab, IconButton,
} from '@mui/material'
import { Delete } from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { wishlistApi, bookingsApi, paymentsApi, type Wishlist, type Booking, type Payment } from '../../services/core'

const statusColors: Record<string, string> = {
  pending: 'warning', confirmed: 'info', completed: 'success', cancelled: 'error',
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

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4">Welcome, {user?.full_name}</Typography>
          <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
        </Box>
        <Box>
          <Button onClick={() => navigate('/browse')} sx={{ mr: 1 }}>Browse Vehicles</Button>
          <Button onClick={logout}>Logout</Button>
        </Box>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label={`Wishlist (${wishlist.length})`} />
        <Tab label={`Bookings (${bookings.length})`} />
        <Tab label={`Payments (${payments.length})`} />
      </Tabs>

      {tab === 0 && (
        <Box display="flex" flexWrap="wrap" gap={2}>
          {wishlist.length === 0 && (
            <Typography color="text.secondary" py={4}>Your wishlist is empty</Typography>
          )}
          {wishlist.map(w => (
            <Card key={w.id} sx={{ width: 280 }}>
              <CardMedia component="img" height={140}
                image={w.vehicle_detail?.images?.find(i => i.is_primary)?.image || '/placeholder-car.jpg'}
                alt="" />
              <CardContent>
                <Typography variant="h6">${parseFloat(w.vehicle_detail?.price || '0').toLocaleString()}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {w.vehicle_detail?.year} · {w.vehicle_detail?.mileage?.toLocaleString()} mi
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/browse/${w.vehicle}`)}>View</Button>
                <IconButton size="small" onClick={() => removeWishlist(w.id)}><Delete /></IconButton>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}

      {tab === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Vehicle</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Preferred Date</TableCell>
                <TableCell>Message</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map(b => (
                <TableRow key={b.id}>
                  <TableCell>#{b.vehicle}</TableCell>
                  <TableCell>
                    <Chip label={b.status} color={(statusColors[b.status] as any) || 'default'} size="small" />
                  </TableCell>
                  <TableCell>{b.preferred_date}</TableCell>
                  <TableCell>{b.message || '—'}</TableCell>
                  <TableCell align="right">
                    {b.status === 'pending' && (
                      <Button size="small" onClick={() => cancelBooking(b.id)}>Cancel</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tab === 2 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Paid At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map(p => (
                <TableRow key={p.id}>
                  <TableCell>{p.transaction_id || '—'}</TableCell>
                  <TableCell>${parseFloat(p.amount).toLocaleString()}</TableCell>
                  <TableCell>{p.payment_method}</TableCell>
                  <TableCell>
                    <Chip label={p.status} color={(statusColors[p.status] as any) || 'default'} size="small" />
                  </TableCell>
                  <TableCell>{p.paid_at ? new Date(p.paid_at).toLocaleDateString() : '—'}</TableCell>
                </TableRow>
              ))}
              {payments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">No payments yet</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}
