'use client';
import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { BoardItemType, BoardItem } from '../../mocks/boardData';

interface ItemFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<BoardItem>) => void;
  type: BoardItemType;
}

export default function ItemFormModal({ open, onClose, onSave, type }: ItemFormModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [subject, setSubject] = useState('');

  useEffect(() => {
    if (open) {
      setTitle('');
      setDescription('');
      setDate('');
      setSubject('');
    }
  }, [open]);

  const handleSave = () => {
    if (!title.trim() || !description.trim() || !date) return;
    
    // Converte a string date (YYYY-MM-DDTHH:mm) para ISO com Timezone 'Z' mockado
    const isoDate = new Date(date).toISOString();

    onSave({
      type,
      title,
      description,
      date: isoDate,
      ...(type === 'mentorship' ? { subject } : {})
    });
  };

  const isFormValid = title.trim() && description.trim() && date && (type === 'event' || subject.trim());

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="form-modal-title">
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: 500 }, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4,
        display: 'flex', flexDirection: 'column', gap: 2
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography id="form-modal-title" variant="h5" component="h2" fontWeight="bold">
            Novo {type === 'event' ? 'Evento' : 'Mentoria'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <TextField
          label="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          required
        />
        
        <TextField
          label="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
          fullWidth
          required
        />

        <TextField
          label="Data e Hora"
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
        />

        {type === 'mentorship' && (
          <TextField
            label="Assunto (ex: Backend, Design)"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            fullWidth
            required
          />
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
          <Button variant="outlined" onClick={onClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} disabled={!isFormValid}>
            Salvar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
