import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Box, Typography, TextField, Button, Alert, InputAdornment, IconButton } from '@mui/material'
import { Visibility, VisibilityOff, Email, Person, Lock } from '@mui/icons-material'
import { neo, theme } from '../../styles/neumorphism'
import { authService } from '../../services/auth'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showCpw, setShowCpw] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) { setError('Passwords do not match'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    try {
      await authService.register({ email, full_name: fullName, password, role: 'customer' })
      await authService.login({ email, password })
      navigate('/customer/dashboard')
    } catch (err: any) {
      setError(err?.response?.data?.email?.[0] || err?.response?.data?.full_name?.[0] || err?.response?.data?.password?.[0] || 'Registration failed')
    }
  }

  return (
    <Box sx={{ ...neo.page, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Box sx={{ ...neo.card, p: 4, maxWidth: 420, width: '100%', mx: 2 }}>
        <Box textAlign="center" mb={3}>
          <Box sx={{
            boxShadow: neo.convex.boxShadow, width: 56, height: 56, borderRadius: 3,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            mx: 'auto', mb: 1.5,
            background: `linear-gradient(145deg, ${theme.primaryLight}, ${theme.primaryDark})`,
          }}>
            <Typography sx={{ color: 'white', fontWeight: 800, fontSize: 24 }}>A</Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: theme.text }}>Create Account</Typography>
          <Typography variant="body2" sx={{ color: theme.textSecondary, mt: 0.5 }}>
            Join AutoDeal to browse and book vehicles
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2, ...neo.concave, borderRadius: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField fullWidth placeholder="Full Name" value={fullName}
            onChange={e => setFullName(e.target.value)} required
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><Person sx={{ color: theme.textLight, fontSize: 20 }} /></InputAdornment> } }}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { ...neo.input } }} />
          <TextField fullWidth type="email" placeholder="Email Address" value={email}
            onChange={e => setEmail(e.target.value)} required
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><Email sx={{ color: theme.textLight, fontSize: 20 }} /></InputAdornment> } }}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { ...neo.input } }} />
          <TextField fullWidth type={showPw ? 'text' : 'password'} placeholder="Password" value={password}
            onChange={e => setPassword(e.target.value)} required
            slotProps={{ input: {
              startAdornment: <InputAdornment position="start"><Lock sx={{ color: theme.textLight, fontSize: 20 }} /></InputAdornment>,
              endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={() => setShowPw(!showPw)} sx={{ color: theme.textLight }}>{showPw ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}</IconButton></InputAdornment>,
            } }}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { ...neo.input } }} />
          <TextField fullWidth type={showCpw ? 'text' : 'password'} placeholder="Confirm Password" value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)} required
            slotProps={{ input: {
              startAdornment: <InputAdornment position="start"><Lock sx={{ color: theme.textLight, fontSize: 20 }} /></InputAdornment>,
              endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={() => setShowCpw(!showCpw)} sx={{ color: theme.textLight }}>{showCpw ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}</IconButton></InputAdornment>,
            } }}
            sx={{ mb: 3, '& .MuiOutlinedInput-root': { ...neo.input } }} />
          <Button fullWidth type="submit" sx={{ ...neo.button, py: 1.5, fontSize: 16, mb: 2 }}>
            Create Account
          </Button>
        </Box>

        <Typography align="center" variant="body2" sx={{ color: theme.textSecondary }}>
          Already have an account?{' '}
          <Link to="/customer/login" style={{ color: theme.primary, fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
        </Typography>
      </Box>
    </Box>
  )
}
