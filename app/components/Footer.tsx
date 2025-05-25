'use client';
import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box component="footer" sx={{ textAlign: 'center', py: 2, mt: 4 }}>
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} MAHABO – Tous droits réservés.
      </Typography>
    </Box>
  );
}
