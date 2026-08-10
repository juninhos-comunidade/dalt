"use client";

import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReplyIcon from '@mui/icons-material/Reply';
import { motion } from 'framer-motion';

const mentors = [
  { name: 'Marcos', desc: 'Marcos me\nEnsinou GIT', color: '#4CAF50' },
  { name: 'Ana', desc: 'Ana me ajudou\ncom DSA', color: '#FF9800' },
  { name: 'Clara', desc: 'Clara me ajudou a\ncomunicar melhor', color: '#9E9E9E' },
];

export default function PayItForwardSection() {
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
      {/* <Container maxWidth="xl" sx={{ px: { xs: 2, md: 8 } }}>
        <Typography
          variant="h4"
          component="h2"
          fontWeight="bold"
          gutterBottom
          sx={{ mb: 2 }}
        >
          <Box component="span" sx={{ color: 'primary.main' }}>
            2.
          </Box>{' '}
          Mural Pay It Forward
        </Typography>
      </Container> */}

      <Paper
        elevation={0}
        sx={{
          backgroundColor: 'transparent',
          pt: { xs: 4, md: 5 },
          pb: { xs: 4, md: 5 },
          px: { xs: 3, md: '10%' },
          borderRadius: 0,
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 4,
          width: '100%',
          flex: { md: 1 }
        }}
      >
          {/* Texto Explicativo (Notion) */}
          <Box sx={{ textAlign: 'center', mb: 2, maxWidth: 1000 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ typography: { xs: 'h5', md: 'h3' } }}>
              O Sistema de Apadrinhamento
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, fontSize: { xs: '1rem', md: '1.25rem' } }}>
              A ponte entre novatos e desenvolvedores experientes. Uma dinâmica 100% orientada à comunidade e altruísmo. Conectamos seus objetivos com a vivência de um padrinho que já está nessa trilha há algum tempo.
            </Typography>
          </Box>

          {/* Flow of Avatars */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              justifyContent: 'center',
              gap: { xs: 3, sm: 1 },
              width: '100%',
            }}
          >
            {mentors.map((mentor, index) => (
              <React.Fragment key={mentor.name}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1 }}>
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      backgroundColor: mentor.color,
                      border: '4px solid #D9725B', // Laranja accent
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    {/* Using initial as placeholder for image */}
                    <Typography variant="h3" fontWeight="bold">
                      {mentor.name[0]}
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.4, fontWeight: 'medium' }}>
                    {mentor.desc}
                  </Typography>
                </Box>
                {index < mentors.length - 1 && (
                  <ArrowForwardIcon sx={{ color: 'primary.main', fontSize: 50, transform: { xs: 'rotate(90deg)', sm: 'none' } }} />
                )}
              </React.Fragment>
            ))}
          </Box>

          {/* Action Button/Box */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 2 }}>
            <Box
              sx={{
                backgroundColor: 'primary.main', // #D9725B
                borderRadius: 2,
                p: 2,
                px: 3,
                border: '2px solid #8B4A3B', // Darker shade for border
                position: 'relative'
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" textAlign="center" sx={{ lineHeight: 1.2 }}>
                Recomende<br />quem impactou<br />sua jornada
              </Typography>
            </Box>
            <ReplyIcon sx={{ color: 'primary.main', fontSize: 60, transform: 'scaleX(-1) rotate(45deg)', ml: -2, mt: -4 }} />
          </Box>
        </Paper>
    </Box>
  );
}
