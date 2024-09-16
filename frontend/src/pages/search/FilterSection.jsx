// FilterSection.js
import React from "react";
import { Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const FilterSection = ({ filterOption, setFilterOption }) => (
  <Grid item xs={12} mt={3} md={3}>
    <FormControl fullWidth variant="outlined">
      <InputLabel>Filter by</InputLabel>
      <Select
        value={filterOption}
        onChange={(e) => setFilterOption(e.target.value)}
        label="Filter by"
      >
        <MenuItem value="all">All</MenuItem>
        <MenuItem value="TRAINER TRAINEE">Trainers</MenuItem>
        <MenuItem value="TRAINEE">Trainees</MenuItem>
      </Select>
    </FormControl>
  </Grid>
);

export default FilterSection;
