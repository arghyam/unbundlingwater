
import PropTypes from "prop-types";
import { Grid, TextField, List, ListItem, ListItemText } from "@mui/material";

const SearchSection = ({
  nameQuery,
  locationQuery,
  topicQuery,
  handleSearch,
  showSuggestions,
  selectSuggestion,
  filterData,
}) => (
  <Grid container spacing={2}>
    <Grid item xs={12} md={4}>
      <TextField
        fullWidth
        label="Search by Name"
        variant="outlined"
        value={nameQuery}
        onChange={(e) => handleSearch(e.target.value, "name")}
      />
      {showSuggestions && nameQuery && (
        <SuggestionList
          suggestions={filterData}
          onSelect={(suggestion) => selectSuggestion(suggestion, "name")}
        />
      )}
    </Grid>
    <Grid item xs={12} md={4}>
      <TextField
        fullWidth
        label="Search by Location"
        variant="outlined"
        value={locationQuery}
        onChange={(e) => handleSearch(e.target.value, "location")}
      />
      {showSuggestions && locationQuery && (
        <SuggestionList
          suggestions={filterData}
          onSelect={(suggestion) => selectSuggestion(suggestion, "location")}
        />
      )}
    </Grid>
    <Grid item xs={12} md={4}>
      <TextField
        fullWidth
        label="Search by Topic"
        variant="outlined"
        value={topicQuery}
        onChange={(e) => handleSearch(e.target.value, "topic")}
      />
      {showSuggestions && topicQuery && (
        <SuggestionList
          suggestions={filterData}
          onSelect={(suggestion) => selectSuggestion(suggestion, "topic")}
        />
      )}
    </Grid>
  </Grid>
);

const SuggestionList = ({ suggestions, onSelect }) => (
  <List>
    {suggestions.map((suggestion, index) => (
      <ListItem button key={index} onClick={() => onSelect(suggestion)}>
        <ListItemText primary={suggestion} />
      </ListItem>
    ))}
  </List>
);

// Define prop types for validation
SearchSection.propTypes = {
  nameQuery: PropTypes.string.isRequired,
  locationQuery: PropTypes.string.isRequired,
  topicQuery: PropTypes.string.isRequired,
  handleSearch: PropTypes.func.isRequired,
  showSuggestions: PropTypes.bool.isRequired,
  selectSuggestion: PropTypes.func.isRequired,
  filterData: PropTypes.arrayOf(PropTypes.string).isRequired,
};

SuggestionList.propTypes = {
  suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default SearchSection;
