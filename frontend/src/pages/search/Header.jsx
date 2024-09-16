// Header.js
import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

const Header = ({ setDrawerOpen }) => (
  <Box
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      backgroundColor: "primary.main",
      backdropFilter: "blur(10px)",
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
      onClick={() => setDrawerOpen(true)}
    >
      <MenuIcon />
    </IconButton>
    <Typography
      variant="h6"
      sx={{ flexGrow: 1, textAlign: "center", color: "primary.contrastText" }}
    >
      People
    </Typography>
  </Box>
);

export default Header;
