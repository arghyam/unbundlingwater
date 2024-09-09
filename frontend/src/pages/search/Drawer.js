// Drawer.js
import React from "react";
import { Drawer as MuiDrawer, Box, List, ListItem, ListItemText } from "@mui/material";

const Drawer = ({ drawerOpen, setDrawerOpen, navigate, showMap, setShowMap }) => (
  <MuiDrawer
    anchor="left"
    open={drawerOpen}
    onClose={() => setDrawerOpen(false)}
  >
    <Box sx={{ width: 250, mt: 6 }}>
      <List>
        <ListItem button onClick={() => navigate("/")}>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button onClick={() => { 
          setShowMap(!showMap);
          setDrawerOpen(false); 
        }}>
          <ListItemText primary={showMap ? "List View" : "Map View"} />
        </ListItem>
        <ListItem button onClick={() => {
          navigate("/content");
          setDrawerOpen(false);
        }}>
          <ListItemText primary="Content Page" />
        </ListItem>
      </List>
    </Box>
  </MuiDrawer>
);

export default Drawer;