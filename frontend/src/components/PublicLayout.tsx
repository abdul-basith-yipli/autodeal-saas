import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { neo, theme } from '../styles/neumorphism'
import type { ReactNode } from 'react'

export default function PublicLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <Box sx={{ ...neo.page }}>
      <Box sx={{
        ...neo.convex,
        mx: 'auto',
        maxWidth: 1280,
        mt: 2,
        mb: 0,
        borderRadius: 3,
        display: 'flex',
        alignItems: 'center',
        px: 3,
        py: 1.5,
      }}>
        <Box
          onClick={() => navigate('/browse')}
          sx={{ cursor: 'pointer', flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <Box sx={{
            boxShadow: neo.convex.boxShadow, width: 36, height: 36,
            borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `linear-gradient(145deg, ${theme.primaryLight}, ${theme.primaryDark})`,
          }}>
            <Typography sx={{ color: 'white', fontWeight: 800, fontSize: 18 }}>A</Typography>
          </Box>
          <Typography variant="h6" sx={{
            fontWeight: 800,
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>AutoDeal</Typography>
        </Box>
        {user ? (
          <Box display="flex" alignItems="center" gap={1}>
            <Box sx={{ ...neo.input, px: 2, py: 0.5, borderRadius: 2 }}>
              <Typography variant="body2" sx={{ color: theme.text }}>{user.full_name}</Typography>
            </Box>
            <Button sx={neo.button} onClick={() => navigate('/customer/dashboard')}>Dashboard</Button>
          </Box>
        ) : (
          <Box display="flex" gap={1}>
            <Button sx={{
              ...neo.convex, color: theme.primary, px: 3, py: 1, borderRadius: 2,
              fontWeight: 600, fontSize: 14, textTransform: 'none',
              '&:hover': { boxShadow: `6px 6px 12px ${theme.shadowDark}, -6px -6px 12px ${theme.shadowLight}` },
            }} onClick={() => navigate('/customer/login')}>Sign In</Button>
            <Button sx={neo.button} onClick={() => navigate('/register')}>Register</Button>
          </Box>
        )}
      </Box>
      <Box sx={{ p: 3, maxWidth: 1280, mx: 'auto' }}>
        {children}
      </Box>
    </Box>
  )
}
