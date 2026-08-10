"use client";

import React from 'react';
import { Box, Typography, Container, useTheme } from '@mui/material';

export default function HeroSection() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        pt: { xs: 4, md: 6 },
        pb: { xs: 2, md: 4 },
        color: 'text.primary',
        textAlign: 'center',
        flexShrink: 0
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h3"
          component="h1"
          fontWeight="bold"
          gutterBottom
          sx={{
            fontFamily: 'var(--font-family-hero)',
            lineHeight: 1.3,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
          }}
        >
          Inicie sua jornada como{' '}
          <Box component="span" sx={{ color: 'primary.main' }}>
            DEV
          </Box>{' '}
          com{' '}
          <Box component="span" sx={{ color: 'greenAccent.main' }}>
            Equilíbrio
          </Box>{' '}
          e Apoio em comunidade!
        </Typography>

        <Typography
          variant="h6"
          component="p"
          sx={{
            mt: 2,
            fontWeight: 400,
            color: 'grey.400',
            maxWidth: '600px',
            mx: 'auto',
          }}
        >
          Base sólida em Hard Skills, Soft Skills para crescer e uma comunidade
          harmônica sem julgamentos e que apoia.
        </Typography>
      </Container>
    </Box>
  );
}
