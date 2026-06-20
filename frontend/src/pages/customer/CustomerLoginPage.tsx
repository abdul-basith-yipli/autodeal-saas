import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Box, Card, CardContent, TextField, Button, Typography, Alert } from '@mui/material'
import { useAuth } from '../../contexts/AuthContext'

export default function CustomerLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Card sx={{ maxWidth: 400, width: '100%', mx: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom align="center">Customer Sign In</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField fullWidth label="Email" type="email" margin="normal"
              value={email} onChange={e => setEmail(e.target.value)} required />
            <TextField fullWidth label="Password" type="password" margin="normal"
              value={password} onChange={e => setPassword(e.target.value)} required />
            <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>Sign In</Button>
          </Box>
          <Typography align="center" mt={2} variant="body2">
            Don't have an account? <Link to="/register">Register</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
