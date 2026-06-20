import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import type { ReactNode } from 'react'

export default function PublicLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/browse')}>
            AutoDeal
          </Typography>
          {user ? (
            <>
              <Button color="inherit" onClick={() => navigate('/customer/dashboard')}>Dashboard</Button>
              <Typography variant="body2" sx={{ mr: 2 }}>{user.full_name}</Typography>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/customer/login')}>Sign In</Button>
              <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
        {children}
      </Box>
    </Box>
  )
}
