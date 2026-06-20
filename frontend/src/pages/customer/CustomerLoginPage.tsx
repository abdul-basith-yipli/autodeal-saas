import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Box, Typography, TextField, Button, Alert, InputAdornment, IconButton } from '@mui/material'
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material'
import { neo, theme } from '../../styles/neumorphism'
import { useAuth } from '../../contexts/AuthContext'

export default function CustomerLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/customer/dashboard')
    } catch {
      setError('Invalid email or password')
    }
  }

  return (
    <Box sx={{ ...neo.page, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Box sx={{ ...neo.card, p: 4, maxWidth: 400, width: '100%', mx: 2 }}>
        <Box textAlign="center" mb={3}>
          <Box sx={{
            boxShadow: neo.convex.boxShadow, width: 56, height: 56, borderRadius: 3,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            mx: 'auto', mb: 1.5,
            background: `linear-gradient(145deg, ${theme.primaryLight}, ${theme.primaryDark})`,
          }}>
            <Typography sx={{ color: 'white', fontWeight: 800, fontSize: 24 }}>A</Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: theme.text }}>Welcome Back</Typography>
          <Typography variant="body2" sx={{ color: theme.textSecondary, mt: 0.5 }}>
            Sign in to your AutoDeal account
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2, ...neo.concave, borderRadius: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
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
            sx={{ mb: 3, '& .MuiOutlinedInput-root': { ...neo.input } }} />
          <Button fullWidth type="submit" sx={{ ...neo.button, py: 1.5, fontSize: 16, mb: 2 }}>
            Sign In
          </Button>
        </Box>

        <Typography align="center" variant="body2" sx={{ color: theme.textSecondary }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: theme.primary, fontWeight: 600, textDecoration: 'none' }}>Register</Link>
        </Typography>
      </Box>
    </Box>
  )
}
