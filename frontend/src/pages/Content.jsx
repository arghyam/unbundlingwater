import React, { useState, useEffect } from "react";
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Paper,
  Drawer,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { fetchTopicsByName, searchTopicsByName } from "../api";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2),
  maxWidth: "100%",
  margin: "auto",
}));

const Content = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (query) {
      searchTopicsByName(query).then((data) => {
        if (data && data.length > 0) {
          setSuggestions(data.map((i) => i.name));
        }
      });
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSearchChange = (e) => {
    fetchTopicsByName(e.target.value).then((data) => {
      setSuggestions(data);
    });
    setQuery(e.target.value.toLowerCase());
    setSelectedItem(null);
  };

  const handleSuggestionClick = (item) => {
    fetchTopicsByName(item).then((data) => {
      setSelectedItem(data[0]);
    });
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
    <Box sx={{ p: 2, maxWidth: "100%", mx: "auto" }}>
      {/* Header Section */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          backgroundColor: "#1976d2", // Adjust color to your preference
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          padding: "8px 16px",
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={() => toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, ml: 2, color: "#fff" }}>
          Content Page
        </Typography>
      </Box>

      {/* Drawer Section */}
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => toggleDrawer(false)}
      >
        <Box sx={{ width: 250, mt: 6 }}>
          <List>
            <ListItem
              button
              onClick={() => {
                navigate("/");
                toggleDrawer(false);
              }}
            >
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                navigate("/peoplecontainer");
                toggleDrawer(false);
              }}
            >
              <ListItemText primary="People Assets" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                navigate("/map");
                toggleDrawer(false);
              }}
            >
              <ListItemText primary="Map" />
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

      {suggestions && suggestions.length > 0 && (
        <StyledPaper>
          <List>
            {suggestions?.map((item, index) => (
              <ListItem
                button
                key={index}
                onClick={() => handleSuggestionClick(item)}
              >
                <ListItemText primary={item || "Unknown"} />
              </ListItem>
            ))}
          </List>
        </StyledPaper>
      )}

      {/* Selected Item Details Section */}
      {query && selectedItem && (
        <StyledPaper sx={{ mt: 2 }}>
          <Typography variant="h6">{selectedItem.name}</Typography>
          <Typography variant="body1">
            <strong>Topic ID:</strong> {selectedItem.id || "Unknown"}
          </Typography>
          <Typography variant="body1">
            <strong>Description:</strong>{" "}
            {truncateDescription(selectedItem.description, 100) || "Unknown"}
          </Typography>

          {selectedItem.topicFiles.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Content Files:</Typography>
              <List>
                {selectedItem?.topicFiles?.map((file, fileIndex) => (
                  <ListItem key={fileIndex}>
                    <ListItemText
                      primary={
                        <Typography variant="body2">
                          <strong>File Name:</strong> {file.fileName}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            <strong>Content URL:</strong>{" "}
                            <a
                              href={file.contentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {file.contentUrl}
                            </a>
                          </Typography>
                          <Typography variant="body2">
                            <strong>Creation Date:</strong>{" "}
                            {new Date(file.createdAt).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Content Size:</strong> {file.size} MB
                          </Typography>
                          <Typography variant="body2">
                            <strong>Content Type:</strong> {file.type}
                          </Typography>
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
