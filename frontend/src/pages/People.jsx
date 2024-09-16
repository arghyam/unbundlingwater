import "./people.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userData } from "../complete_userdetails";
// import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MapView from "../MapView";
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

  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      const result = search(userData);
      setFilteredData(result);
    }
  }, [nameQuery, locationQuery, topicQuery, filterOption]);

  const search = (data) => {
    const filtered = data.filter((item) => {
      const userDetailData = item.data?.userDetailData || {};
      const traineeData = userDetailData.traineeData || [];
      const trainerData = userDetailData.trainerData || [];

      const name = userDetailData.name?.toLowerCase() || "";
      const city = userDetailData.city?.toLowerCase() || "";
      const district = userDetailData.district?.toLowerCase() || "";
      const state = userDetailData.state?.toLowerCase() || "";

      const matchesNameQuery = !nameQuery || name.includes(nameQuery);
      const matchesLocationQuery =
        !locationQuery ||
        `${city}, ${district}, ${state}`.includes(locationQuery);
      const matchesTopicQuery =
        !topicQuery ||
        traineeData.some((trainee) =>
          trainee.topicName?.toLowerCase().includes(topicQuery)
        ) ||
        trainerData.some((trainer) =>
          trainer.topicName?.toLowerCase().includes(topicQuery)
        );

      return matchesNameQuery && matchesLocationQuery && matchesTopicQuery;
    });

    if (filterOption === "trainers") {
      return filtered.filter(
        (item) => item.data?.userDetailData?.trainerData?.length > 0
      );
    } else if (filterOption === "trainees") {
      return filtered.filter(
        (item) => item.data?.userDetailData?.traineeData?.length > 0
      );
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
        const userDetailData = item.data?.userDetailData || {};
        const city = userDetailData.city?.toLowerCase() || "";
        const district = userDetailData.district?.toLowerCase() || "";
        const state = userDetailData.state?.toLowerCase() || "";

        if (type === "location") {
          return [
            `${city}, ${district}, ${state}`,
            `${district}, ${state}`,
            state,
          ];
        } else if (type === "name") {
          return userDetailData.name ? [userDetailData.name.toLowerCase()] : [];
        } else if (type === "topic") {
          return [
            ...(userDetailData.traineeData || []).map((trainee) =>
              trainee.topicName?.toLowerCase()
            ),
            ...(userDetailData.trainerData || []).map((trainer) =>
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
      const userDetailData = item.data?.userDetailData || {};
      if (type === "name") {
        return userDetailData.name?.toLowerCase() === suggestion;
      } else if (type === "location") {
        const city = userDetailData.city?.toLowerCase() || "";
        const district = userDetailData.district?.toLowerCase() || "";
        const state = userDetailData.state?.toLowerCase() || "";
        return (
          `${city}, ${district}, ${state}` === suggestion ||
          `${district}, ${state}` === suggestion ||
          state === suggestion
        );
      } else if (type === "topic") {
        return (
          userDetailData.traineeData?.some((trainee) =>
            trainee.topicName?.toLowerCase().includes(suggestion)
          ) ||
          userDetailData.trainerData?.some((trainer) =>
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
          <MapView userData={filteredData} />
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
                  const userDetailData = item.data?.userDetailData || {};
                  const mobileNumber = userDetailData.phoneNumber || "N/A";
                  const email = userDetailData.emailId || "N/A";
                  const city = userDetailData.city || "N/A";
                  const district = userDetailData.district || "N/A";
                  const state = userDetailData.state || "N/A";
                  const location = `${city}, ${district}, ${state}`;

                  const traineeData = (userDetailData.traineeData || []).map(
                    (trainee, idx) => (
                      <Box key={`trainee-${idx}`} sx={{ mb: 2 }}>
                        <Typography variant="body2">
                          {trainee.topicName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Issued:{" "}
                          {new Date(trainee.issuedDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    )
                  );

                  const trainerData = (userDetailData.trainerData || []).map(
                    (trainer, idx) => (
                      <Box key={`trainer-${idx}`} sx={{ mb: 2 }}>
                        <Typography variant="body2">
                          {trainer.topicName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Issued:{" "}
                          {new Date(trainer.issuedDate).toLocaleDateString()}
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
                      <ListItemText
                        primary={userDetailData.name}
                        secondary={location}
                      />
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
                          {traineeData.length > 0 ? traineeData : "None"}
                          {trainerData.length > 0 && (
                            <>
                              <Typography variant="body2">
                                <strong>Trainer Data:</strong>
                              </Typography>
                              {trainerData}
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
