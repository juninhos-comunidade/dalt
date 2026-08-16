'use client';
import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, IconButton, TextField, Button, Chip, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import { BoardItem, Comment } from '../../mocks/boardData';

interface CardDetailsModalProps {
  open: boolean;
  onClose: () => void;
  item: BoardItem | null;
}

export default function CardDetailsModal({ open, onClose, item }: CardDetailsModalProps) {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (item) {
      setComments(item.comments || []);
    }
  }, [item]);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try { setCurrentUser(JSON.parse(userStr)); } catch(e) {}
    }
  }, []);

  if (!item) return null;

  const isOwner = currentUser?.name === item.author;
  const formattedDate = item.date ? new Date(item.date).toLocaleDateString('pt-BR') : '';

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now().toString(),
      author: currentUser?.name || 'Você (Mock)',
      content: newComment,
      createdAt: new Date().toISOString()
    };
    setComments([...comments, comment]);
    setNewComment('');
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-title">
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: { xs: '90%', md: 1000 }, maxWidth: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4,
        maxHeight: '90vh', overflow: 'auto', display: 'flex', flexDirection: 'column'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="overline" color="text.secondary" gutterBottom>
              {item.type === 'event' ? 'EVENTO' : 'MENTORIA'}
            </Typography>
            <Typography id="modal-title" variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
              {item.title}
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {/* Coluna Esquerda: Descrição e Comentários */}
          <Box sx={{ flex: '1 1 60%', minWidth: 300 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Descrição</Typography>
            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, minHeight: 100, mb: 4 }}>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {item.description || "Nenhuma descrição fornecida."}
              </Typography>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Discussão</Typography>
            
            <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Adicionar um comentário..."
                multiline
                rows={2}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                variant="outlined"
                fullWidth
              />
              <Button variant="contained" onClick={handleAddComment} disabled={!newComment.trim()} sx={{ alignSelf: 'flex-start' }}>
                Comentar
              </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {comments.length === 0 ? (
                <Typography variant="body2" color="text.secondary">Nenhum comentário ainda.</Typography>
              ) : (
                comments.map((c) => {
                  const isMyComment = currentUser?.name === c.author || (c.author === 'Você (Mock)' && !currentUser);
                  return (
                    <Box key={c.id} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PersonIcon fontSize="small" /> {c.author}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(c.createdAt).toLocaleString('pt-BR')}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>{c.content}</Typography>
                      {isMyComment && (
                        <Button size="small" variant="text" sx={{ p: 0, minWidth: 'auto', textTransform: 'none' }}>Editar</Button>
                      )}
                    </Box>
                  );
                })
              )}
            </Box>
          </Box>

          {/* Coluna Direita: Detalhes e Ações */}
          <Box sx={{ flex: '1 1 30%', minWidth: 250, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Detalhes</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon fontSize="small" color="action" />
                  <Typography variant="body2"><strong>Autor:</strong> {item.author}</Typography>
                </Box>
                {formattedDate && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EventIcon fontSize="small" color="action" />
                    <Typography variant="body2"><strong>Data:</strong> {formattedDate}</Typography>
                  </Box>
                )}
                {item.subject && (
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <Typography variant="body2" sx={{ mt: 0.5 }}><strong>Assunto:</strong></Typography>
                    <Chip label={item.subject} size="small" color="primary" variant="outlined" />
                  </Box>
                )}
              </Box>
            </Box>

            {isOwner && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" gutterBottom>Ações do Dono</Typography>
                <Button variant="outlined" fullWidth size="small" sx={{ mb: 1 }}>
                  Editar {item.type === 'event' ? 'Evento' : 'Mentoria'}
                </Button>
                <Button variant="outlined" color="error" fullWidth size="small">
                  Excluir
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
