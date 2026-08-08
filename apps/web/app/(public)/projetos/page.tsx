import { Box, Typography, Container, Paper } from '@mui/material';

export default function ProjetosPage() {
  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', textAlign: 'center' }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Nossos Projetos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Lista de projetos públicos disponíveis na plataforma (MUI).
        </Typography>
      </Paper>
    </Container>
  );
}
