'use client';
import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Tabs, Tab, Grid, Paper, Alert } from '@mui/material';
import { MOCK_EVENTS, MOCK_MENTORSHIPS, BoardItem } from '../../src/mocks/boardData';
import TrelloCard from '../../src/components/boards/TrelloCard';
import { useRouter } from 'next/navigation';

export default function PainelPage() {
  const [tabValue, setTabValue] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
        router.push('/'); // Redirect if not logged in
      }
    };
    checkAuth();
    window.addEventListener("auth-changed", checkAuth);
    return () => window.removeEventListener("auth-changed", checkAuth);
  }, [router]);

  if (!isAuthenticated || !currentUser) {
    return null; // or a loading spinner
  }

  // Combine all items
  const allItems = [...MOCK_EVENTS, ...MOCK_MENTORSHIPS];

  // Minhas Produções: itens que o usuário criou
  const producoes = allItems.filter(item => item.author === currentUser.name);

  // Participando: itens onde o usuário comentou, mas não é o autor
  const participacoes = allItems.filter(item => 
    item.author !== currentUser.name && item.comments.some(c => c.author === currentUser.name)
  );

  const displayItems = tabValue === 0 ? producoes : participacoes;

  return (
    <Box sx={{ minHeight: 'calc(100vh - 70px)', py: 4, bgcolor: 'background.default' }}>
      <Container maxWidth="xl">
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Meu Painel
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Gerencie os eventos e mentorias que você está organizando ou participando.
        </Typography>

        <Paper sx={{ mb: 4, bgcolor: 'background.paper' }} elevation={0} variant="outlined">
          <Tabs 
            value={tabValue} 
            onChange={(_, newValue) => setTabValue(newValue)}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label={`Minhas Produções (${producoes.length})`} />
            <Tab label={`Participando (${participacoes.length})`} />
          </Tabs>
        </Paper>

        {displayItems.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            Você ainda não tem nenhum item nesta categoria. Vá até o Mural para explorar!
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {displayItems.map(item => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                {/* Reusing TrelloCard, we wrap it in a fixed Box or just let it fill the grid item */}
                <Box sx={{ height: '100%', '& > *': { height: '100%' } }}>
                  <TrelloCard 
                    item={item} 
                    isAuthenticated={true} 
                    onRequireLogin={() => {}} 
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
