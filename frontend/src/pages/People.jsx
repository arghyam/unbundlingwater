import "./people.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  Typography,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Drawer,
} from "@mui/material";
import { ExpandMore, ExpandLess, Menu as MenuIcon } from "@mui/icons-material";
import MapView from "../MapView";

const People = () => {
  const [nameQuery, setNameQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [topicQuery, setTopicQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showList, setShowList] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [filterOption, setFilterOption] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userData, setUserData] = useState([]);

  const navigate = useNavigate();

  // Ref for the MapView component
  const mapViewRef = useRef(null);

  useEffect(() => {
    fetchUsersData();
  }, []);

  useEffect(() => {
    if (userData) {
      const result = search(userData);
      setFilteredData(result);

      // Update the MapView component with the filtered data
      if (mapViewRef.current) {
        mapViewRef.current.setUserData(filteredData);
      }
    }
  }, [userData, nameQuery, locationQuery, topicQuery, filterOption]);

  const fetchUsersData = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/users");
      const data = await response.json();
      setUserData(data);
      generateSuggestions(nameQuery, "name");
      generateSuggestions(locationQuery, "location");
      generateSuggestions(topicQuery, "topic");
    } catch (error) {
      console.error("Error fetching users data:", error);
    }
  };

  const search = (data) => {
    const filtered = data.filter((item) => {
      const name = item.name?.toLowerCase() || "";
      const city = item.city?.toLowerCase() || "";
      const district = item.district?.toLowerCase() || "";
      const state = item.state?.toLowerCase() || "";

      const matchesNameQuery = !nameQuery || name.includes(nameQuery);
      const matchesLocationQuery =
        !locationQuery ||
        `${city}, ${district}, ${state}`.includes(locationQuery);
      const matchesTopicQuery =
        !topicQuery ||
        item.traineeTrainings.some((trainee) =>
          trainee.topicName?.toLowerCase().includes(topicQuery)
        ) ||
        item.trainerTrainings.some((trainer) =>
          trainer.topicName?.toLowerCase().includes(topicQuery)
        );

      return matchesNameQuery && matchesLocationQuery && matchesTopicQuery;
    });

    if (filterOption === "trainers") {
      return filtered.filter((item) => item.trainerTrainings?.length > 0);
    } else if (filterOption === "trainees") {
      return filtered.filter((item) => item.traineeTrainings?.length > 0);
    }

    return filtered;
  };

  const handleSearch = (e, type) => {
    const value = e.target.value.toLowerCase();
    setShowSuggestions(true);
    setShowList(false);

    switch (type) {
      case "name":
        setNameQuery(value);
        break;
      case "location":
        setLocationQuery(value);
        break;
      case "topic":
        setTopicQuery(value);
        break;
      default:
        break;
    }
    generateSuggestions(value, type);
  };

  const generateSuggestions = (query, type) => {
    const allSuggestions = userData
      .flatMap((item) => {
        const city = item.city?.toLowerCase() || "";
        const district = item.district?.toLowerCase() || "";
        const state = item.state?.toLowerCase() || "";

        if (type === "location") {
          return [
            `${city}, ${district}, ${state}`,
            `${district}, ${state}`,
            state,
          ];
        } else if (type === "name") {
          return item.name ? [item.name.toLowerCase()] : [];
        } else if (type === "topic") {
          return [
            ...(item.traineeTrainings || []).map((trainee) =>
              trainee.topicName?.toLowerCase()
            ),
            ...(item.trainerTrainings || []).map((trainer) =>
              trainer.topicName?.toLowerCase()
            ),
          ].filter(Boolean);
        }
        return [];
      })
      .filter(Boolean);

    const uniqueSuggestions = [...new Set(allSuggestions)]
      .filter((suggestion) => suggestion && suggestion.includes(query))
      .filter(
        (suggestion, index, self) =>
          index === self.findIndex((s) => s === suggestion)
      );

    if (type === "location") {
      const suggestionMap = {};
      uniqueSuggestions.forEach((suggestion) => {
        const [city, district, state] = suggestion
          .split(",")
          .map((s) => s.trim());
        const key = `${district}, ${state}`.toLowerCase();
        if (!suggestionMap[key] || (city && city !== district)) {
          suggestionMap[key] = suggestion;
        }
      });
      setSuggestions(Object.values(suggestionMap));
    } else {
      setSuggestions(uniqueSuggestions);
    }
  };

  const selectSuggestion = (suggestion, type) => {
    setShowSuggestions(false);
    setShowList(true);

    let selectedData = userData.filter((item) => {
      if (type === "name") {
        return item.name?.toLowerCase() === suggestion;
      } else if (type === "location") {
        const city = item.city?.toLowerCase() || "";
        const district = item.district?.toLowerCase() || "";
        const state = item.state?.toLowerCase() || "";
        return (
          `${city}, ${district}, ${state}` === suggestion ||
          `${district}, ${state}` === suggestion ||
          state === suggestion
        );
      } else if (type === "topic") {
        return (
          item.traineeTrainings?.some((trainee) =>
            trainee.topicName?.toLowerCase().includes(suggestion)
          ) ||
          item.trainerTrainings?.some((trainer) =>
            trainer.topicName?.toLowerCase().includes(suggestion)
          )
        );
      }
      return false;
    });

    if (type === "name") {
      setNameQuery(suggestion);
    } else if (type === "location") {
      setLocationQuery(suggestion);
    } else if (type === "topic") {
      setTopicQuery(suggestion);
    }

    setFilteredData(selectedData);
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          backgroundColor: "#fff",
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
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
          People
        </Typography>
      </Box>

      {/* Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250, mt: 6 }}>
          <List>
            <ListItem button onClick={() => navigate("/")}>
              <ListItemText primary="Home" />
            </ListItem>

            <ListItem
              button
              onClick={() => {
                setShowMap(!showMap);
                setDrawerOpen(false);
              }}
            >
              <ListItemText primary={showMap ? "List View" : "Map View"} />
            </ListItem>

            <ListItem
              button
              onClick={() => {
                navigate("/content");
                setDrawerOpen(false);
              }}
            >
              <ListItemText primary="Content Page" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ marginTop: "64px" }}>
        {showMap ? (
          <MapView
            ref={mapViewRef} // Pass the ref to the MapView component
            userData={filteredData} // Provide the filtered data to MapView
          />
        ) : (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} md={9}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Search by Name"
                      variant="outlined"
                      value={nameQuery}
                      onChange={(e) => handleSearch(e, "name")}
                    />
                    {showSuggestions && nameQuery && (
                      <List>
                        {suggestions.map((suggestion, index) => (
                          <ListItem
                            button
                            key={index}
                            onClick={() => selectSuggestion(suggestion, "name")}
                          >
                            <ListItemText primary={suggestion} />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Search by Location"
                      variant="outlined"
                      value={locationQuery}
                      onChange={(e) => handleSearch(e, "location")}
                    />
                    {showSuggestions && locationQuery && (
                      <List>
                        {suggestions.map((suggestion, index) => (
                          <ListItem
                            button
                            key={index}
                            onClick={() =>
                              selectSuggestion(suggestion, "location")
                            }
                          >
                            <ListItemText primary={suggestion} />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Search by Topic"
                      variant="outlined"
                      value={topicQuery}
                      onChange={(e) => handleSearch(e, "topic")}
                    />
                    {showSuggestions && topicQuery && (
                      <List>
                        {suggestions.map((suggestion, index) => (
                          <ListItem
                            button
                            key={index}
                            onClick={() =>
                              selectSuggestion(suggestion, "topic")
                            }
                          >
                            <ListItemText primary={suggestion} />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Filter by</InputLabel>
                  <Select
                    value={filterOption}
                    onChange={(e) => setFilterOption(e.target.value)}
                    label="Filter by"
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="trainers">Trainers</MenuItem>
                    <MenuItem value="trainees">Trainees</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {showList && (
              <List>
                {filteredData.map((item, index) => {
                  const mobileNumber = item.phoneNumber || "N/A";
                  const email = item.emailId || "N/A";
                  const city = item.city || "N/A";
                  const district = item.district || "N/A";
                  const state = item.state || "N/A";
                  const location = `${city}, ${district}, ${state}`;

                  const traineeTrainings = (item.traineeTrainings || []).map(
                    (trainee, idx) => (
                      <Box key={`trainee-${idx}`} sx={{ mb: 2 }}>
                        <Typography variant="body2">
                          {trainee.topicName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Issued:{" "}
                          {new Date(trainee.issueDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    )
                  );

                  const trainerTrainings = (item.trainerTrainings || []).map(
                    (trainer, idx) => (
                      <Box key={`trainer-${idx}`} sx={{ mb: 2 }}>
                        <Typography variant="body2">
                          {trainer.topicName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Issued:{" "}
                          {new Date(trainer.issueDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    )
                  );

                  return (
                    <ListItem
                      key={index}
                      button
                      onClick={() => toggleExpand(index)}
                      className={`user-card ${
                        expandedIndex === index ? "expanded" : ""
                      }`}
                    >
                      <ListItemText primary={item.name} secondary={location} />
                      {expandedIndex === index ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                      {expandedIndex === index && (
                        <Box className="dropdown-content">
                          <Typography variant="body2">
                            Location: {location}
                          </Typography>
                          <Typography variant="body2">
                            Mobile Number: {mobileNumber}
                          </Typography>
                          <Typography variant="body2">
                            Email: {email}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Trainings Done:</strong>
                          </Typography>
                          {traineeTrainings.length > 0
                            ? traineeTrainings
                            : "None"}
                          {trainerTrainings.length > 0 && (
                            <>
                              <Typography variant="body2">
                                <strong>Trainer Data:</strong>
                              </Typography>
                              {trainerTrainings}
                            </>
                          )}
                        </Box>
                      )}
                    </ListItem>
                  );
                })}
              </List>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default People;
