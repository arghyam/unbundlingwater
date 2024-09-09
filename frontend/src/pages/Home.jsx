import React from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  ThemeProvider,
  createTheme,
  Typography,
} from '@mui/material';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { Home } from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Customize your primary color
    },
    secondary: {
      main: '#dc004e', // Customize your secondary color
    },
  },
});

const useStyles = styled('div')(({ theme }) => ({
  padding: theme.spacing(4),
}));

const Header = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(4),
  textAlign: 'center',
}));

const Content = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  marginBottom: theme.spacing(4),
}));

function Homes() {
  // URL of the image 
  const imageUrl = 'https://example.com/your-image.jpg';

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Container maxWidth="md">
          <ImageContainer>
            <img src={imageUrl} alt="Water Assets" style={{ width: '100%', height: 'auto' }} />
          </ImageContainer>
          <Header>
            <Typography variant="h3" gutterBottom>
              Unbundling Water Assets
            </Typography>
          </Header>
          <Content>
            <Typography variant="body1" gutterBottom>
              In Rural India, thousands, if not lakhs, of
              individuals work tirelessly to ensure access to
              water remains reliable, safe, and fair. The
              Unbundling Water Assets initiative aims to
              make these valuable contributors
              discoverable to the entire ecosystem.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Discover over 25,000 digitally verified water
              workers who are trained in groundwater
              management, natural resource planning,
              water quality testing, community
              engagement, plumbing, and more.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Access training resources from expert
              organizations covering 500+ topics in states
              such as Meghalaya, Gujarat, Bihar, Karnataka,
              and more.
            </Typography>
          </Content>
          <Grid container justifyContent="center" spacing={2}>
            <Grid item>
              <Link to="/peoplecontainer" style={{ textDecoration: 'none' }}>
                <ButtonStyled variant="contained" color="primary">
                  People Assets
                </ButtonStyled>
              </Link>
            </Grid>
            <Grid item>
              <Link to="/content" style={{ textDecoration: 'none' }}>
                <ButtonStyled variant="contained" color="primary">
                  Content Assets
                </ButtonStyled>
              </Link>
            </Grid>
          </Grid>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default Homes;
