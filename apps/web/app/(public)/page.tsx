import { Box, Typography, Button, Container } from '@mui/material';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Container maxWidth="md" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4 }}>
      <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
        Bem-vindo ao Harmônico
      </Typography>
      <Typography variant="h6" color="text.secondary" textAlign="center" mb={4}>
        Plataforma de mentoria e desenvolvimento humano.
      </Typography>
      <Box display="flex" gap={2}>
        <Button variant="contained" color="primary" component={Link} href="/sobre">
          Sobre o Projeto
        </Button>
        <Button variant="outlined" color="primary" component={Link} href="/projetos">
          Ver Projetos
        </Button>
      </Box>
    </Container>
  );
}
