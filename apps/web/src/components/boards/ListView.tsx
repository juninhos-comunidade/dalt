'use client';
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import TrelloCard from './TrelloCard';
import { BoardItem } from '../../mocks/boardData';

interface ListViewProps {
  items: BoardItem[];
  isAuthenticated: boolean;
  onRequireLogin: () => void;
}

export default function ListView({ items, isAuthenticated, onRequireLogin }: ListViewProps) {
  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1 }}>
        {items.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>Nenhum item encontrado.</Typography>
        ) : (
          items.map(item => (
            <TrelloCard key={item.id} item={item} isAuthenticated={isAuthenticated} onRequireLogin={onRequireLogin} />
          ))
        )}
      </Box>
    </Box>
  );
}
