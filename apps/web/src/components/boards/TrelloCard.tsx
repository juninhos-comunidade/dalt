'use client';
import React, { useState } from 'react';
import { Card, CardContent, Typography, CardActionArea, Box, Chip } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import CardDetailsModal from './CardDetailsModal';
import { BoardItem } from '../../mocks/boardData';

interface TrelloCardProps {
  item: BoardItem;
  isAuthenticated: boolean; // Simulates checking JWT
  onRequireLogin: () => void;
}

export default function TrelloCard({ item, isAuthenticated, onRequireLogin }: TrelloCardProps) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (!isAuthenticated) {
      onRequireLogin();
      return;
    }
    setOpen(true);
  };

  const formattedDate = item.date ? new Date(item.date).toLocaleDateString('pt-BR') : '';

  return (
    <>
      <Card sx={{ mb: 2, borderRadius: 2, boxShadow: 1, '&:hover': { boxShadow: 3 } }}>
        <CardActionArea onClick={handleClick}>
          <CardContent>
            <Typography variant="h6" component="div" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
              {item.title}
            </Typography>
            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {item.type === 'mentorship' && item.subject && (
                <Chip label={item.subject} size="small" color="primary" variant="outlined" />
              )}
              {formattedDate && (
                <Chip icon={<EventIcon />} label={formattedDate} size="small" />
              )}
            </Box>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PersonIcon fontSize="small" /> {item.author}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CommentIcon fontSize="small" /> {item.comments?.length || 0}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>

      <CardDetailsModal open={open} onClose={() => setOpen(false)} item={item} />
    </>
  );
}
