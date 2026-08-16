'use client';
import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Modal, Button } from '@mui/material';
import Board from '../../src/components/boards/Board';
import ItemFormModal from '../../src/components/boards/ItemFormModal';
import { MOCK_EVENTS, MOCK_MENTORSHIPS, BoardItem, BoardItemType } from '../../src/mocks/boardData';
import { useRouter } from 'next/navigation';

export default function MuraisPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [events, setEvents] = useState<BoardItem[]>(MOCK_EVENTS);
  const [mentorships, setMentorships] = useState<BoardItem[]>(MOCK_MENTORSHIPS);
  const [formOpen, setFormOpen] = useState(false);
  const [formType, setFormType] = useState<BoardItemType>('event');
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setIsAuthenticated(true);
        try { setCurrentUser(JSON.parse(storedUser)); } catch {}
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    };
    checkAuth();
    window.addEventListener("auth-changed", checkAuth);
    return () => window.removeEventListener("auth-changed", checkAuth);
  }, []);

  const handleRequireLogin = () => {
    setAuthModalOpen(true);
  };

  const handleOpenForm = (type: BoardItemType) => {
    if (!isAuthenticated) {
      handleRequireLogin();
      return;
    }
    setFormType(type);
    setFormOpen(true);
  };

  const handleSaveItem = (data: Partial<BoardItem>) => {
    const newItem: BoardItem = {
      id: Date.now().toString(),
      type: data.type as BoardItemType,
      title: data.title || '',
      description: data.description || '',
      date: data.date,
      subject: data.subject,
      author: currentUser?.name || 'Mock User',
      comments: []
    };

    if (newItem.type === 'event') {
      setEvents(prev => [...prev, newItem]);
    } else {
      setMentorships(prev => [...prev, newItem]);
    }
    setFormOpen(false);
  };

  return (
    <Box sx={{ height: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column', py: 2, overflow: 'hidden' }}>
      <Container maxWidth={false} sx={{ maxWidth: 1600, flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
          Murais
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4, flexGrow: 1, overflow: 'hidden' }}>
          <Board
            title="Eventos"
            type="event"
            items={events}
            isAuthenticated={isAuthenticated}
            onRequireLogin={handleRequireLogin}
            onAdd={() => handleOpenForm('event')}
          />
          <Board
            title="Procura / Oferta de Mentoria"
            type="mentorship"
            items={mentorships}
            isAuthenticated={isAuthenticated}
            onRequireLogin={handleRequireLogin}
            onAdd={() => handleOpenForm('mentorship')}
          />
        </Box>
      </Container>

      {/* Login Required Modal */}
      <Modal open={authModalOpen} onClose={() => setAuthModalOpen(false)}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 600 }, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, p: 4,
          textAlign: 'center'
        }}>
          <Typography variant="h6" gutterBottom>
            Acesso Restrito
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Você precisa estar logado para visualizar detalhes ou interagir com os cards.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
            <Button variant="outlined" onClick={() => setAuthModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={() => {
              setAuthModalOpen(false);
              if (window.innerWidth < 900) {
                router.push('/login');
              } else {
                window.dispatchEvent(new Event('open-login'));
              }
            }}>
              Fazer Login
            </Button>
          </Box>
        </Box>
      </Modal>

      <ItemFormModal 
        open={formOpen} 
        onClose={() => setFormOpen(false)} 
        onSave={handleSaveItem} 
        type={formType} 
      />
    </Box>
  );
}
