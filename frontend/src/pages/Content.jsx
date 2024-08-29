import React, { useState, useEffect } from 'react';
import { TextField, List, ListItem, ListItemText, Typography, Box, Paper, Drawer, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for making HTTP requests

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2),
  maxWidth: '100%',
  margin: 'auto',
}));

const Content = () => {
  const [query, setQuery] = useState("");
  const [originalData, setOriginalData] = useState([]); // Store fetched data here
  const [suggestions, setSuggestions] = useState([]); // Store current suggestions (can be filtered)
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/content');
        console.log("Fetched Data:", response.data); // Log fetched data

        // Store fetched data in the originalData state
        setOriginalData(response.data);
        setSuggestions(response.data); // Initialize suggestions with the original data
      } catch (error) {
        console.error("Error fetching data from the API:", error);
      }
    };

    fetchData();
  }, []); // Only fetch data once on initial mount

  const getSuggestions = (query) => {
    // Filter the fetched data based on the query
    return originalData.filter(item => 
      (item.topic_name || '').toLowerCase().includes(query.toLowerCase()) 
    );
  };

  const handleSearchChange = (e) => {
    const newQuery = e.target.value.toLowerCase();
    setQuery(newQuery);
    setSelectedItem(null);

    // Only update suggestions if there's a query
    if (newQuery) { // Check if newQuery is not empty
      const filteredSuggestions = getSuggestions(newQuery);
      setSuggestions(filteredSuggestions); 
    } else {
      // If query is empty, reset suggestions to the original data
      setSuggestions(originalData);
    }
  };

  const handleSuggestionClick = (item) => {
    setSelectedItem(item);
    setQuery(item.topic_name || ''); // Ensure item.topic_name is a string
    // Set suggestions to empty to hide the suggestion list
    setSuggestions([]); 
  };

  const truncateDescription = (description, maxLength) => {
    if (description && description.length <= maxLength) return description;
    return description ? description.substring(0, maxLength) + "..." : 'No description available';
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
            {suggestions.length > 0 ? (
              suggestions.map((item, index) => (
                <ListItem button key={index} onClick={() => handleSuggestionClick(item)}>
                  <ListItemText
                    primary={item.topic_name || 'Unknown'}
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {truncateDescription(item.description, 100)}
                      </Typography>
                    }
                  />
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No suggestions found
              </Typography>
            )}
          </List>
        )}
      </StyledPaper>

      {/* Selected Item Details Section */}
      {selectedItem && (
        <StyledPaper>
          <Typography variant="h6">{selectedItem.topic_name || 'Unknown'}</Typography>
          <Typography variant="body1"><strong>Topic ID:</strong> {selectedItem.topicid || 'Unknown'}</Typography>
          <Typography variant="body1"><strong>Description:</strong> {selectedItem.description || 'Unknown'}</Typography>

          {selectedItem.files && selectedItem.files.length > 0 && (
            <Box>
              <Typography variant="h6">Content Files:</Typography>
              <List>
                {selectedItem.files.map((file, fileIndex) => {
                  // Extract file information from the nested structure
                  const fileName = file['File/0/fileName'] || 'Unknown';
                  const contentUrl = file['File/0/contentUrl'] || 'Unknown';
                  const contentCreationDate = file['File/0/contentCreationDate'] || 'Unknown';
                  const contentSize = file['File/0/contentSize'] || 'Unknown';
                  const contentType = file['File/0/contentType'] || 'Unknown';

                  return (
                    <ListItem key={fileIndex}>
                      <ListItemText
                        primary={<Typography variant="body2"><strong>File Name:</strong> {fileName}</Typography>}
                        secondary={
                          <Box>
                            <Typography variant="body2"><strong>Content URL:</strong> <a href={contentUrl} target="_blank" rel="noopener noreferrer">{contentUrl}</a></Typography>
                            <Typography variant="body2"><strong>Creation Date:</strong> {contentCreationDate}</Typography>
                            <Typography variant="body2"><strong>Content Size:</strong> {contentSize} MB</Typography>
                            <Typography variant="body2"><strong>Content Type:</strong> {contentType}</Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          )}
        </StyledPaper>
      )}
    </Box>
  );
};

export default Content;