import { cookies } from "next/headers";
import { Typography, Container, Paper, Box, Button, Alert, AlertTitle } from '@mui/material';

export default async function MuralPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  const isAuthenticated = !!sessionToken;

  return (
    <Container maxWidth="md" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
        Mural / Calendário
      </Typography>
      
      <Paper elevation={2} sx={{ p: 4, width: '100%', mt: 4 }}>
        <Typography variant="h5" fontWeight="semibold" gutterBottom>
          Eventos Públicos
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Aqui você pode visualizar os eventos disponíveis para todos.
        </Typography>
        
        {isAuthenticated ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            <AlertTitle>Interação Liberada</AlertTitle>
            Você está autenticado! Agora você pode marcar datas no calendário e postar no mural.
            <Box mt={2}>
              <Button variant="contained" color="success">
                Adicionar Evento
              </Button>
            </Box>
          </Alert>
        ) : (
          <Alert severity="info" sx={{ mb: 2 }}>
            <AlertTitle>Acesso Limitado</AlertTitle>
            Você está vendo o mural no modo leitura. Faça login para interagir e marcar eventos no calendário.
            <Box mt={2}>
              <Button variant="contained" color="primary">
                Abrir Modal de Login
              </Button>
            </Box>
          </Alert>
        )}
      </Paper>
    </Container>
  );
}
