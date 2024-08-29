import React, { useState, useEffect } from 'react';
import { TextField, List, ListItem, ListItemText, Typography, Box, Paper, Drawer, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { data } from '../content';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2),
  maxWidth: '100%',
  margin: 'auto',
}));

const Content = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (query) {
      setSuggestions(getSuggestions(data, query));
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const getSuggestions = (data, query) => {
    return data.filter(item =>
      item.name.toLowerCase().includes(query)
    );
  };

  const handleSearchChange = (e) => {
    setQuery(e.target.value.toLowerCase());
    setSelectedItem(null);
  };

  const handleSuggestionClick = (item) => {
    setSelectedItem(item);
    setQuery(item.name);
    setSuggestions([]);
  };

  const truncateDescription = (description, maxLength) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + "...";
  };

  const toggleDrawer = (open) => {
    setIsDrawerOpen(open);
  };

  return (
    <Box sx={{ p: 2, maxWidth: '100%', mx: 'auto' }}>
      {/* Header Section */}
      <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          backgroundColor: '#fff',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          padding: '8px 16px',
        }}>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => toggleDrawer(true)}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>Content Page</Typography>
      </Box>

      {/* Drawer Section */}
      <Drawer anchor="left" open={isDrawerOpen} onClose={() => toggleDrawer(false)}>
        <Box sx={{ width: 250, mt: 6 }}>
          <List>
            <ListItem button onClick={() => { navigate("/"); toggleDrawer(false); }}>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button onClick={() => { navigate("/people"); toggleDrawer(false); }}>
              <ListItemText primary="People Assets" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Search Bar Section */}
      <TextField
        fullWidth
        label="Search..."
        variant="outlined"
        onChange={handleSearchChange}
        value={query}
        sx={{ mt: 6 }}
      />

      {/* Suggestions Section */}
      <StyledPaper>
        {query && (
          <List>
            {suggestions.map((item, index) => (
              <ListItem button key={index} onClick={() => handleSuggestionClick(item)}>
                <ListItemText
                  primary={item.name || 'Unknown'}
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {truncateDescription(item.description || 'No description available', 100)}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </StyledPaper>

      {/* Selected Item Details Section */}
      {selectedItem && (
        <StyledPaper>
          <Typography variant="h6">{selectedItem.name}</Typography>
          <Typography variant="body1"><strong>Topic ID:</strong> {selectedItem.topicId || 'Unknown'}</Typography>
          <Typography variant="body1"><strong>Description:</strong> {selectedItem.description || 'Unknown'}</Typography>
          <Typography variant="body1"><strong>Program ID:</strong> {selectedItem.programId || 'Unknown'}</Typography>

          {selectedItem.contentFiles.length > 0 && (
            <Box>
              <Typography variant="h6">Content Files:</Typography>
              <List>
                {selectedItem.contentFiles.map((file, fileIndex) => (
                  <ListItem key={fileIndex}>
                    <ListItemText
                      primary={<Typography variant="body2"><strong>File Name:</strong> {file.fileName}</Typography>}
                      secondary={
                        <Box>
                          <Typography variant="body2"><strong>Content URL:</strong> <a href={file.contentUrl} target="_blank" rel="noopener noreferrer">{file.contentUrl}</a></Typography>
                          <Typography variant="body2"><strong>Creation Date:</strong> {new Date(file.contentCreationDate).toLocaleDateString()}</Typography>
                          <Typography variant="body2"><strong>Content Size:</strong> {file.contentSize} MB</Typography>
                          <Typography variant="body2"><strong>Content Type:</strong> {file.contentType}</Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </StyledPaper>
      )}
    </Box>
  );
};

export default Content;
