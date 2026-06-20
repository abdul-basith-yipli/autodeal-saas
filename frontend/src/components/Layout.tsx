import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  AppBar, Toolbar, Typography, Button,
} from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import type { ReactNode } from 'react'

const drawerWidth = 240

const navItems = [
  { label: 'Dashboard', path: '/', icon: '📊' },
  { label: 'Showrooms', path: '/showrooms', icon: '🏢' },
  { label: 'Departments', path: '/departments', icon: '🏛️' },
  { label: 'Staff', path: '/staff', icon: '👥' },
  { label: 'Vehicles', path: '/vehicles', icon: '🚗' },
  { label: 'Enquiries', path: '/enquiries', icon: '📋' },
  { label: 'Sales', path: '/sales', icon: '💰' },
]

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            AutoDeal
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>{user?.full_name}</Typography>
          <Button color="inherit" onClick={logout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" sx={{
        width: drawerWidth,
        '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
      }}>
        <Toolbar />
        <List>
          {navItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  )
}
