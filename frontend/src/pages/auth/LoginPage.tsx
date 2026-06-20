import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Card, CardContent, TextField, Button, Typography, Alert,
} from '@mui/material'
import { useAuth } from '../../contexts/AuthContext'

export default function LoginPage() {
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
      navigate('/')
    } catch {
      setError('Invalid email or password')
    }
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Card sx={{ maxWidth: 400, width: '100%', mx: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom align="center">
            AutoDeal SaaS
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Email" type="email" margin="normal"
              value={email} onChange={(e) => setEmail(e.target.value)} required
            />
            <TextField
              fullWidth label="Password" type="password" margin="normal"
              value={password} onChange={(e) => setPassword(e.target.value)} required
            />
            <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
              Sign In
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
