"use client";

import React from 'react';
import { Box, Container } from '@mui/material';
import AuthForm from '../../../src/components/AuthForm';

export default function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 80px)', // Subtracting approximate navbar height
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center' }}>
        <AuthForm isMobile={true} />
      </Container>
    </Box>
  );
}
