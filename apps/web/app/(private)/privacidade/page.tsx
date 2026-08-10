import { Typography, Container, Paper } from '@mui/material';

export default function PrivacidadePage() {
  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', textAlign: 'center' }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Privacidade
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configurações de privacidade (Rota Privada).
        </Typography>
      </Paper>
    </Container>
  );
}
