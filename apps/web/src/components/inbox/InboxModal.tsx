'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Modal, Box, Typography, IconButton, List, ListItem, ListItemButton, 
  Avatar, Divider, TextField, Button, Paper, Tabs, Tab, Tooltip, InputAdornment, Chip, Popover
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { MOCK_INBOX, MessageThread, InboxMessage } from '../../mocks/inboxData';

interface InboxModalProps {
  open: boolean;
  onClose: () => void;
}

export default function InboxModal({ open, onClose }: InboxModalProps) {
  const [threads, setThreads] = useState<MessageThread[]>(MOCK_INBOX);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [tagAnchorEl, setTagAnchorEl] = useState<HTMLElement | null>(null);
  const [newTag, setNewTag] = useState('');

  const filteredThreads = useMemo(() => {
    return threads.filter(t => {
      // 1. Filtro de Aba
      if (tabValue === 0 && (t.isArchived || t.isBlocked)) return false;
      if (tabValue === 1 && (!t.isArchived || t.isBlocked)) return false;
      if (tabValue === 2 && !t.isBlocked) return false;

      // 2. Filtro de Busca
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSender = t.sender.toLowerCase().includes(q);
        const matchesEmail = t.senderEmail.toLowerCase().includes(q);
        const matchesSubject = t.subject.toLowerCase().includes(q);
        const matchesDate = new Date(t.date).toLocaleDateString('pt-BR').includes(q);
        const matchesTags = t.tags?.some(tag => tag.toLowerCase().includes(q));

        if (!matchesSender && !matchesEmail && !matchesSubject && !matchesDate && !matchesTags) {
          return false;
        }
      }
      return true;
    });
  }, [threads, tabValue, searchQuery]);

  // Auto-select first thread when opening or changing tabs if none is selected
  useEffect(() => {
    if (open && filteredThreads.length > 0) {
      if (!selectedThreadId || !filteredThreads.find(t => t.id === selectedThreadId)) {
        setSelectedThreadId(filteredThreads[0].id);
      }
    } else if (filteredThreads.length === 0) {
      setSelectedThreadId(null);
    }
  }, [open, filteredThreads, selectedThreadId]);

  const selectedThread = threads.find(t => t.id === selectedThreadId);

  const handleSelectThread = (id: string) => {
    setSelectedThreadId(id);
    setThreads(prev => 
      prev.map(t => t.id === id ? { ...t, read: true } : t)
    );
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedThread) return;

    const newMsg: InboxMessage = {
      id: Date.now().toString(),
      author: 'Você',
      content: replyText,
      createdAt: new Date().toISOString()
    };

    setThreads(prev => 
      prev.map(t => {
        if (t.id === selectedThread.id) {
          return { ...t, messages: [...t.messages, newMsg] };
        }
        return t;
      })
    );
    setReplyText('');
  };

  const handleToggleArchive = () => {
    if (!selectedThread) return;
    setThreads(prev => 
      prev.map(t => t.id === selectedThread.id ? { ...t, isArchived: !t.isArchived } : t)
    );
  };

  const handleToggleBlock = () => {
    if (!selectedThread) return;
    setThreads(prev => 
      prev.map(t => t.id === selectedThread.id ? { ...t, isBlocked: !t.isBlocked } : t)
    );
  };

  const handleAddTag = () => {
    if (!newTag.trim() || !selectedThread) return;
    const tag = newTag.trim().toLowerCase();
    
    setThreads(prev => 
      prev.map(t => {
        if (t.id === selectedThread.id) {
          const currentTags = t.tags || [];
          if (!currentTags.includes(tag)) {
            return { ...t, tags: [...currentTags, tag] };
          }
        }
        return t;
      })
    );
    setNewTag('');
    setTagAnchorEl(null);
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="inbox-modal-title">
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: { xs: '95%', md: 1100 }, height: { xs: '95%', md: '85vh' }, 
        bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24,
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography id="inbox-modal-title" variant="h5" fontWeight="bold">
            Mensagens Recebidas
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Body: 2 Columns */}
        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          
          {/* Left Column: Thread List */}
          <Box sx={{ width: { xs: '100%', sm: 400 }, borderRight: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column' }}>
            
            {/* Search and Tabs */}
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar por nome, email, assunto ou etiqueta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ mb: 2, bgcolor: 'background.paper' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
              />
              <Tabs 
                value={tabValue} 
                onChange={(_, newValue) => setTabValue(newValue)}
                variant="fullWidth"
                sx={{ minHeight: 36, '& .MuiTab-root': { minHeight: 36, py: 0.5, fontSize: '0.8rem' } }}
              >
                <Tab label="Entrada" />
                <Tab label="Arquivados" />
                <Tab label="Bloqueados" />
              </Tabs>
            </Box>

            {/* List */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
              <List disablePadding>
                {filteredThreads.length === 0 && (
                  <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                    <Typography variant="body2">Nenhuma mensagem encontrada.</Typography>
                  </Box>
                )}
                {filteredThreads.map((thread, index) => (
                  <React.Fragment key={thread.id}>
                    <ListItem disablePadding>
                      <ListItemButton 
                        selected={selectedThreadId === thread.id}
                        onClick={() => handleSelectThread(thread.id)}
                        sx={{ 
                          flexDirection: 'column', alignItems: 'flex-start', py: 2,
                          bgcolor: !thread.read && tabValue === 0 ? 'action.hover' : 'inherit'
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 0.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: !thread.read && tabValue === 0 ? 'bold' : 'normal' }}>
                            {thread.sender}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(thread.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: !thread.read && tabValue === 0 ? 'bold' : 'normal', mb: 0.5, width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {thread.subject}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', mb: 1 }}>
                          {thread.snippet}
                        </Typography>
                        {thread.tags && thread.tags.length > 0 && (
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {thread.tags.map(tag => (
                              <Chip key={tag} label={tag} size="small" sx={{ height: 18, fontSize: '0.65rem' }} />
                            ))}
                          </Box>
                        )}
                      </ListItemButton>
                    </ListItem>
                    {index < filteredThreads.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          </Box>

          {/* Right Column: Thread Details */}
          <Box sx={{ flexGrow: 1, display: { xs: selectedThreadId ? 'flex' : 'none', sm: 'flex' }, flexDirection: 'column', bgcolor: 'background.default' }}>
            {selectedThread ? (
              <>
                {/* Thread Header */}
                <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>{selectedThread.subject}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.9rem' }}>
                        {selectedThread.sender.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ lineHeight: 1 }}>{selectedThread.sender}</Typography>
                        <Typography variant="caption" color="text.secondary">{selectedThread.senderEmail}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5, mt: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                      {selectedThread.tags?.map(tag => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" color="primary" />
                      ))}
                      <Chip 
                        label="+ Tag" 
                        size="small" 
                        variant="outlined" 
                        onClick={(e) => setTagAnchorEl(e.currentTarget)} 
                        sx={{ borderStyle: 'dashed', cursor: 'pointer' }} 
                      />
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title={selectedThread.isArchived ? "Desarquivar" : "Arquivar"}>
                      <IconButton onClick={handleToggleArchive} color={selectedThread.isArchived ? "primary" : "default"}>
                        {selectedThread.isArchived ? <UnarchiveIcon /> : <ArchiveIcon />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={selectedThread.isBlocked ? "Desbloquear" : "Bloquear"}>
                      <IconButton onClick={handleToggleBlock} color={selectedThread.isBlocked ? "error" : "default"}>
                        {selectedThread.isBlocked ? <CheckCircleOutlineIcon /> : <BlockIcon />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Popover
                  open={Boolean(tagAnchorEl)}
                  anchorEl={tagAnchorEl}
                  onClose={() => { setTagAnchorEl(null); setNewTag(''); }}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                >
                  <Box sx={{ p: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField 
                      size="small" 
                      placeholder="Nova tag" 
                      value={newTag} 
                      onChange={e => setNewTag(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleAddTag(); }}
                      autoFocus
                    />
                    <Button variant="contained" size="small" onClick={handleAddTag}>Add</Button>
                  </Box>
                </Popover>

                {/* Messages History */}
                <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {selectedThread.messages.map((msg) => {
                    const isMe = msg.author === 'Você';
                    return (
                      <Box key={msg.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, px: 1 }}>
                          {isMe ? 'Você' : msg.author} • {new Date(msg.createdAt).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                        </Typography>
                        <Paper elevation={0} sx={{ 
                          p: 2, maxWidth: '80%', 
                          bgcolor: isMe ? 'primary.main' : 'background.paper', 
                          color: isMe ? 'primary.contrastText' : 'text.primary',
                          borderRadius: 2, border: isMe ? 'none' : '1px solid', borderColor: 'divider',
                          opacity: selectedThread.isBlocked ? 0.7 : 1
                        }}>
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{msg.content}</Typography>
                        </Paper>
                      </Box>
                    );
                  })}
                </Box>

                {/* Reply Box */}
                <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
                  {selectedThread.isBlocked ? (
                    <Box sx={{ p: 2, textAlign: 'center', color: 'error.main', bgcolor: 'error.light', borderRadius: 1, opacity: 0.2 }}>
                      <Typography variant="body2" fontWeight="bold">Contato bloqueado. Você não pode enviar mensagens.</Typography>
                    </Box>
                  ) : (
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="Digite sua resposta..."
                      variant="outlined"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <IconButton color="primary" onClick={handleSendReply} disabled={!replyText.trim()} sx={{ mt: 'auto' }}>
                            <SendIcon />
                          </IconButton>
                        )
                      }}
                    />
                  )}
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary' }}>
                <Typography>Selecione uma mensagem para ler.</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
