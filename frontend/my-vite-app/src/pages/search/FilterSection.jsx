
import PropTypes from "prop-types";
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

// Add PropTypes for props validation
FilterSection.propTypes = {
  filterOption: PropTypes.string.isRequired,
  setFilterOption: PropTypes.func.isRequired,
};

export default FilterSection;
