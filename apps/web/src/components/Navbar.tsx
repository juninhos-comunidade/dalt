"use client";

import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
  Avatar,
  Popover,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import AuthForm from './AuthForm';

// Mocking auth state
const isLoggedIn = false;

const publicPages = [
  { name: 'Home', path: '/' },
  { name: 'Sobre', path: '/sobre' },
  { name: 'Comunidade', path: '/comunidade' },
  { name: 'Mentoria', path: '/mentoria' },
  { name: 'Blog', path: '/blog' },
];

const privatePages = [
  { name: 'Home', path: '/' },
  { name: 'Mural', path: '/mural' },
  { name: 'Minhas Mentorias', path: '/minhas-mentorias' },
];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loginAnchorEl, setLoginAnchorEl] = useState<HTMLButtonElement | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const pathname = usePathname();

  const pages = isLoggedIn ? privatePages : publicPages;

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const mobileMenu = (
    <Box
      sx={{ width: 250, backgroundColor: 'background.default', height: '100%' }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
        <Image src="/logo.svg" alt="Harmônico Logo" width={64} height={64} />
      </Box>
      <List>
        {pages.map((page) => {
          const isActive = pathname === page.path;
          return (
            <ListItem key={page.name} disablePadding>
              <ListItemButton 
                component={Link} 
                href={page.path}
                sx={{
                  color: isActive ? 'primary.main' : 'inherit',
                  textDecoration: isActive ? 'underline' : 'none',
                  textUnderlineOffset: '4px',
                  backgroundColor: isActive ? 'transparent' : 'inherit',
                  '&:hover': {
                    backgroundColor: isActive ? 'transparent' : 'rgba(255, 255, 255, 0.08)'
                  }
                }}
              >
                <ListItemText primary={page.name} primaryTypographyProps={{ fontWeight: isActive ? 'bold' : 'normal' }} />
              </ListItemButton>
            </ListItem>
          );
        })}
        {!isLoggedIn && (
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/login">
              <ListItemText primary="Login" sx={{ color: 'primary.main' }} />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'background.paper', backgroundImage: 'none', boxShadow: 'none', borderBottom: '1px solid #323E50' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo Mobile & Desktop */}
          <Box sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }} component={Link} href="/">
             <Image src="/logo.svg" alt="Harmônico Logo" width={56} height={56} />
          </Box>

          {/* Desktop Menu */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {pages.map((page) => {
                const isActive = pathname === page.path;
                return (
                  <Button
                    key={page.name}
                    component={Link}
                    href={page.path}
                    sx={{
                      color: isActive ? 'primary.main' : 'white',
                      display: 'block',
                      textTransform: 'none',
                      fontSize: 18,
                      textDecoration: isActive ? 'underline' : 'none',
                      textUnderlineOffset: '6px',
                      textDecorationThickness: '2px',
                      borderRadius: 2,
                      px: 2,
                      '&:hover': {
                        backgroundColor: isActive ? 'transparent' : 'rgba(255, 255, 255, 0.08)',
                        textDecoration: isActive ? 'underline' : 'none',
                      }
                    }}
                  >
                    {page.name}
                  </Button>
                );
              })}
            </Box>
          )}

          {/* User Actions */}
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
            {!isMobile && (
              isLoggedIn ? (
                <Avatar sx={{ bgcolor: 'secondary.main', color: 'white' }}>U</Avatar>
              ) : (
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={(e) => setLoginAnchorEl(e.currentTarget)} 
                  size="large" 
                  sx={{ 
                    borderRadius: 6, 
                    px: 4, 
                    py: 1, 
                    fontSize: 18, 
                    textTransform: 'none',
                    opacity: Boolean(loginAnchorEl) ? 0 : 1,
                    transition: 'opacity 0.2s ease-in-out',
                  }}
                >
                  Login
                </Button>
              )
            )}
            
            {/* Mobile Menu Icon */}
            {isMobile && (
              <>
                {isLoggedIn && <Avatar sx={{ bgcolor: 'secondary.main', color: 'white', width: 32, height: 32 }}>U</Avatar>}
                <IconButton
                  size="large"
                  aria-label="menu"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={toggleDrawer(true)}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {mobileMenu}
      </Drawer>

      {/* Desktop Login Modal */}
      <Popover
        open={Boolean(loginAnchorEl)}
        anchorEl={loginAnchorEl}
        onClose={() => setLoginAnchorEl(null)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            backgroundImage: 'none',
            boxShadow: 'none',
            overflow: 'visible',
          }
        }}
      >
        <AuthForm onClose={() => setLoginAnchorEl(null)} isMobile={false} />
      </Popover>
    </AppBar>
  );
}
