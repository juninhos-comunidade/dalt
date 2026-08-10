"use client";

import React from 'react';
import { Box, Typography, Container, Paper, useTheme, Avatar } from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import StorageIcon from '@mui/icons-material/Storage';
import { motion } from 'framer-motion';

export default function BridgeSection() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: 'transparent',
        height: { xs: 'auto', md: '100%' },
        py: { xs: 6, md: 0 },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 8 } }}>
        {/* <Typography
          variant="h4"
          component="h2"
          fontWeight="bold"
          gutterBottom
          sx={{ mb: 4 }}
        >
          <Box component="span" sx={{ color: 'greenAccent.main' }}>
            3.
          </Box>{' '}
          A ponte entre comunidade e mercado
        </Typography> */}

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 4,
            mt: 4,
          }}
        >
          {/* Right side content com explicação (Agora na esquerda) */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Box>
              <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ typography: { xs: 'h4', md: 'h3' } }}>
                A Base Essencial (Hard & Soft Skills)
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, fontSize: { xs: '1rem', md: '1.25rem' }, mb: 3 }}>
                Focamos no que realmente é usado no dia a dia. Equilibramos uma trilha sólida de Hard Skills (Lógica, Linux, versionamento) com uma forte trilha de Soft Skills e vivência corporativa. Nosso objetivo é preparar você para se comunicar e resolver problemas como um profissional de verdade.
              </Typography>
              
              <Typography variant="body1" sx={{ color: 'grey.300', fontFamily: 'var(--font-jetbrains)', backgroundColor: 'rgba(0,0,0,0.2)', p: 3, borderRadius: 2, fontSize: { xs: '0.9rem', md: '1.1rem' } }}>
                <Box component="span" sx={{ color: '#C678DD' }}>import</Box> {'{ '}
                <Box component="span" sx={{ color: '#E5C07B' }}>Resiliencia, Mentor</Box>
                {' }'}
                <br />
                <Box component="span" sx={{ color: '#C678DD' }}>from</Box>{' '}
                <Box component="span" sx={{ color: '#98C379' }}>&apos;harmonico&apos;</Box>
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 80, height: 80, backgroundColor: 'primary.main', border: '3px solid #FFF' }}>
                  <PsychologyIcon sx={{ fontSize: 40, color: 'white' }} />
                </Avatar>
                <Typography variant="h6" fontWeight="medium">Soft Skills</Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 80, height: 80, backgroundColor: 'purpleAccent.main', border: '3px solid #FFF' }}>
                  <StorageIcon sx={{ fontSize: 40, color: 'white' }} />
                </Avatar>
                <Typography variant="h6" fontWeight="medium">Hard Skills</Typography>
              </Box>
            </Box>
          </Box>

          {/* Mock IDE Window (Agora na direita) */}
          <Paper
            elevation={3}
            sx={{
              flex: 1,
              backgroundColor: '#1E1E1E', // Dark IDE background
              borderRadius: 2,
              overflow: 'hidden',
              width: '100%',
              maxWidth: 400,
            }}
          >
            {/* IDE Header */}
            <Box
              sx={{
                backgroundColor: '#2D2D2D',
                px: 2,
                py: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#FF5F56' }} />
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#FFBD2E' }} />
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#27C93F' }} />
            </Box>
            
            {/* IDE Content - Abstract blocks */}
            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
               <Box sx={{ display: 'flex', gap: 1 }}>
                 <Box sx={{ height: 16, width: '40%', backgroundColor: 'primary.main', borderRadius: 4 }} />
                 <Box sx={{ height: 16, width: '20%', backgroundColor: 'purpleAccent.main', borderRadius: 4 }} />
               </Box>
               <Box sx={{ display: 'flex', gap: 1 }}>
                 <Box sx={{ height: 16, width: '60%', backgroundColor: 'greenAccent.main', borderRadius: 4 }} />
                 <Box sx={{ height: 16, width: '30%', backgroundColor: 'primary.main', borderRadius: 4 }} />
               </Box>
               <Box sx={{ height: 16, width: '50%', backgroundColor: 'purpleAccent.main', borderRadius: 4 }} />
               <Box sx={{ display: 'flex', gap: 1 }}>
                 <Box sx={{ height: 16, width: '25%', backgroundColor: 'primary.main', borderRadius: 4 }} />
                 <Box sx={{ height: 16, width: '45%', backgroundColor: 'purpleAccent.main', borderRadius: 4 }} />
               </Box>
               <Box sx={{ height: 16, width: '80%', backgroundColor: 'greenAccent.main', borderRadius: 4 }} />
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}
