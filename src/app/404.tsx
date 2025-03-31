// src/app/not-found.tsx
import { Button, Typography, Container, Box } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
    return (
        <Container maxWidth="md" sx={{ textAlign: 'center', py: 8 }}>
            <Box sx={{ mb: 4 }}>
                <Image
                    src="/window.svg"
                    alt="Not Found"
                    width={300}
                    height={300}
                    style={{ margin: '0 auto' }}
                />
            </Box>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'error.main' }}>
                404 - Page Not Found
            </Typography>
            <Typography variant="h6" sx={{ mb: 4 }}>
                Oops! The page you&apos;re looking for doesn&apos;t exist.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                component={Link}
                href="/dashboard"
                sx={{ mt: 2 }}
            >
                Return to Dashboard
            </Button>
        </Container>
    );
}