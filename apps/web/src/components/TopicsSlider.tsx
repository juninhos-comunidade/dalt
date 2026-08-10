"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Box, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SafeSpaceSection from './SafeSpaceSection';
import PayItForwardSection from './PayItForwardSection';
import BridgeSection from './BridgeSection';

const topics = [
  <SafeSpaceSection key="1" />,
  <PayItForwardSection key="2" />,
  <BridgeSection key="3" />
];

export default function TopicsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const nextTopic = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % topics.length);
  }, []);

  const prevTopic = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + topics.length) % topics.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      nextTopic();
    }, 10000); // Aumentado para 10 segundos
    return () => clearInterval(interval);
  }, [nextTopic]);

  return (
    <Box sx={{ flex: 1, position: 'relative', width: '100%', height: '100%', overflow: 'hidden', backgroundColor: 'transparent' }}>
      {/* Botão Voltar */}
      <IconButton 
        onClick={prevTopic}
        sx={{ 
          position: 'absolute', 
          left: { xs: 8, md: 32 }, 
          top: '50%', 
          transform: 'translateY(-50%)', 
          zIndex: 10,
          color: 'white',
          backgroundColor: 'rgba(255,255,255,0.05)',
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' }
        }}
      >
        <ArrowBackIosNewIcon />
      </IconButton>

      {/* Botão Avançar */}
      <IconButton 
        onClick={nextTopic}
        sx={{ 
          position: 'absolute', 
          right: { xs: 8, md: 32 }, 
          top: '50%', 
          transform: 'translateY(-50%)', 
          zIndex: 10,
          color: 'white',
          backgroundColor: 'rgba(255,255,255,0.05)',
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' }
        }}
      >
        <ArrowForwardIosIcon />
      </IconButton>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: direction > 0 ? 150 : -150 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -150 : 150 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        >
          {topics[currentIndex]}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}
