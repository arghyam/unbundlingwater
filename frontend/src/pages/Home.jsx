import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  ThemeProvider,
  createTheme,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { CheckCircle, Water, School, Group } from '@mui/icons-material'; // Example icons
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { Drawer } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Customize your primary color
    },
    secondary: {
      main: '#dc004e', // Customize your secondary color
    },
  },
  typography: {
    h3: {
      fontWeight: 700, // Bold font weight
      fontSize: '2.5rem',
      color: '#0d47a1', // Deep blue color for contrast
    },
    body1: {
      fontSize: '1.1rem', // Increased font size for better readability
      lineHeight: 1.7, // Space between lines
    },
  },
});

const Header = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(4),
  textAlign: 'center',
}));

const Content = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1.5, 3), // Consistent padding for all buttons
  fontSize: '1rem',
  minWidth: '200px', // Ensures all buttons have the same minimum width
  textTransform: 'none', // Prevents text from being all uppercase
  textAlign: 'center',
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  marginBottom: theme.spacing(4),
  borderRadius: '8px', // Rounded corners for the image
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', // Subtle shadow effect
}));



function Homes() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const imageUrl = 'https://www.indiaisus.com/document/cause/23867a335a.jpg';

  const toggleDrawer = (open) => {
    setIsDrawerOpen(open);
  };


  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#1976d2', // Adjust color to your preference
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        padding: '8px 16px',
      }}>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => toggleDrawer(true)}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, ml: 7, color: '#fff' }}>Unbundling Water</Typography>
      </Box>

      {/* Drawer Section */}
      <Drawer anchor="left" open={isDrawerOpen} onClose={() => toggleDrawer(false)}>
        <Box sx={{ width: 250, mt: 6 }}>
          <List>
            <ListItem button onClick={() => { navigate("/"); toggleDrawer(false); }}>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button onClick={() => { navigate("/map"); toggleDrawer(false); }}>
              <ListItemText primary="Map" />
            </ListItem>
            <ListItem button onClick={() => { navigate("/peoplecontainer"); toggleDrawer(false); }}>
              <ListItemText primary="People Assets" />
            </ListItem>
            <ListItem button onClick={() => { navigate("/content"); toggleDrawer(false); }}>
              <ListItemText primary="Content Assets" />
            </ListItem>
            <ListItem button
            // onClick={() => { navigate("/map"); toggleDrawer(false); }}
            >
              <ListItemText primary="Contact Us" />
            </ListItem>

            <ListItem button
            // onClick={() => { navigate("/map"); toggleDrawer(false); }}
            >
              <ListItemText primary="About Us" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <div style={{ marginTop: '64px' }}>
        <Container maxWidth="md">
          <ImageContainer>
            <img
              src={imageUrl}
              alt="Water Assets"
              style={{ width: '100%', height: 'auto' }}
            />
          </ImageContainer>
          <Header>
            <Typography variant="h3" gutterBottom>
              Unbundling Water Assets
            </Typography>
          </Header>
          <Content>
            <Typography variant="body1" gutterBottom>
              In rural India, thousands of individuals work tirelessly to ensure
              access to water remains reliable, safe, and fair. The Unbundling Water
              Assets initiative brings attention to these key contributors.
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold', mt: 3, textAlign: 'center', fontSize: '1.5rem' }}>
              Key highlights
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Discover over 25,000 digitally verified water workers trained in groundwater management, natural resource planning, and more."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Water color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Access expert-led training resources covering 500+ topics in states like Meghalaya, Gujarat, Bihar, and Karnataka."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <School color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Engage with workers skilled in community engagement, water quality testing, and plumbing."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Group color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Empower rural communities by connecting with local water resource professionals."
                />
              </ListItem>
            </List>
          </Content>

          <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold', mt: 3, mb: 3, textAlign: 'center', fontSize: '1.5rem' }}>
            Explore Resources
            </Typography>
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
            <Grid item>
              <Link to="/map" style={{ textDecoration: 'none' }}>
                <ButtonStyled variant="contained" color="primary">
                  Map
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
