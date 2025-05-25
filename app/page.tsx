'use client';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 6, mt: 6, textAlign: 'center', borderRadius: 3 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Bienvenue sur le portail KYC de MAHABO
        </Typography>

        <Typography variant="h6" component="p" color="text.secondary" sx={{ mb: 4 }}>
          Assurez-vous que vos informations sont sécurisées, vérifiées et conformes.
        </Typography>

        <Link href="/kyc" passHref>
          <Button variant="contained" color="primary" size="large">
            Commencer la validation
          </Button>
        </Link>
      </Paper>
    </Container>
  );
}
