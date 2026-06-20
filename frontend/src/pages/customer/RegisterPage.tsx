import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Box, Card, CardContent, TextField, Button, Typography, Alert } from '@mui/material'
import { authService } from '../../services/auth'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    try {
      await authService.register({ email, full_name: fullName, password, role: 'customer' })
      await authService.login({ email, password })
      navigate('/customer/dashboard')
    } catch (err: any) {
      setError(err?.response?.data?.email?.[0] || err?.response?.data?.full_name?.[0] || err?.response?.data?.password?.[0] || 'Registration failed')
    }
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Card sx={{ maxWidth: 400, width: '100%', mx: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom align="center">Create an Account</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField fullWidth label="Full Name" margin="normal"
              value={fullName} onChange={e => setFullName(e.target.value)} required />
            <TextField fullWidth label="Email" type="email" margin="normal"
              value={email} onChange={e => setEmail(e.target.value)} required />
            <TextField fullWidth label="Password" type="password" margin="normal"
              value={password} onChange={e => setPassword(e.target.value)} required />
            <TextField fullWidth label="Confirm Password" type="password" margin="normal"
              value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>Register</Button>
          </Box>
          <Typography align="center" mt={2} variant="body2">
            Already have an account? <Link to="/customer/login">Sign In</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
