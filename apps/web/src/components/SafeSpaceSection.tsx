"use client";

import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
// import { motion } from 'framer-motion';

export default function SafeSpaceSection() {
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
          <Box component="span" sx={{ color: 'greenAccent.main' }}>
            1.
          </Box>{' '}
          Seu Espaço Seguro
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
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          flex: { md: 1 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start'
        }}
      >
          {/* Rota Sinuosa (Wavy Path) baseada no mockup */}
          <Box
            component="svg"
            viewBox="0 0 100 400"
            preserveAspectRatio="none"
            sx={{
              position: 'absolute',
              right: { xs: '-10%', md: '10%' },
              top: 0,
              bottom: 0,
              width: { xs: '70%', md: '40%' },
              height: '100%',
              zIndex: 0
            }}
          >
            {/* Linha que representa o caminho/rota */}
            <path 
              d="M 80,0 C 80,100 20,150 20,250 C 20,350 70,400 70,400" 
              fill="none" 
              stroke="#90A68A" // greenAccent.main
              strokeWidth="2" 
              strokeDasharray="4 4"
            />
          </Box>

          {/* Bandeira usando Ícone do MUI para não distorcer */}
          <FlagIcon 
            sx={{ 
              position: 'absolute', 
              right: { xs: '55%', md: '28%' }, 
              bottom: '0%', 
              color: 'primary.main', 
              fontSize: 48,
              zIndex: 1
            }} 
          />

          <Box sx={{ position: 'relative', zIndex: 1, maxWidth: { xs: '90%', md: '45%' } }}>
            <Typography
              variant="h3"
              fontWeight="bold"
              gutterBottom
              sx={{ typography: { xs: 'h4', md: 'h2' }, color: 'greenAccent.main' }}
            >
              Apoio Psicológico<br/>e de Carreira
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 'normal', mb: 3, color: 'rgba(255,255,255,0.9)', fontSize: { xs: '1.2rem', md: '1.5rem' } }}
            >
              Foco no desenvolvimento humano, priorizando Soft Skills, vivência de mercado e saúde mental.
            </Typography>
            <Typography
              variant="body1"
              sx={{ lineHeight: 1.6, color: 'rgba(255,255,255,0.9)', fontSize: { xs: '1rem', md: '1.25rem' } }}
            >
              A jornada de um júnior é cheia de incertezas, mas você não precisa encará-las sozinho. Somos uma comunidade focada em acolhimento e suporte prático. Aqui você se conecta com profissionais de RH e psicólogos dispostos a ajudar com treinamentos, revisão de currículo e dicas para destacar seu perfil no LinkedIn. E claro, o contato próximo com outros desenvolvedores garante o networking que faz toda a diferença para o seu crescimento.
            </Typography>
          </Box>
        </Paper>
    </Box>
  );
}
