import React, { useState } from "react";
import { List, ListItem, ListItemText, Box, Typography } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

const UserList = ({ userData }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <>
      <List>
        {userData.map((item, index) => (
          <UserListItem
            key={index}
            item={item}
            index={index}
            expandedIndex={expandedIndex}
            toggleExpand={toggleExpand}
          />
        ))}
      </List>
    </>
  );
};

const UserListItem = ({ item, index, expandedIndex, toggleExpand }) => {
  const userDetailData = item || {};
  const location = `${userDetailData.city || "N/A"}, ${userDetailData.district || "N/A"}, ${userDetailData.state || "N/A"}`;

  return (
    <ListItem
      button
      onClick={() => toggleExpand(index)}
      className={`user-card ${expandedIndex === index ? "expanded" : ""}`}
    >
      <ListItemText
        primary={userDetailData.name}
        secondary={location}
      />
      {expandedIndex === index ? <ExpandLess /> : <ExpandMore />}
      {expandedIndex === index && (
        <UserDetails userDetailData={userDetailData} />
      )}
    </ListItem>
  );
};

const UserDetails = ({ userDetailData }) => (
  <Box className="dropdown-content">
    <Typography variant="body2">Location: {`${userDetailData.city || "N/A"}, ${userDetailData.district || "N/A"}, ${userDetailData.state || "N/A"}`}</Typography>
    <Typography variant="body2">Mobile Number: {userDetailData.phoneNumber || "N/A"}</Typography>
    <Typography variant="body2">Email: {userDetailData.emailId || "N/A"}</Typography>
    <Typography variant="body2"><strong>Trainings Done:</strong></Typography>
    <TrainingList trainings={userDetailData.userTopics} />
    {userDetailData.userTrainers && userDetailData.userTrainers.length > 0 && (
      <>
        <Typography variant="body2"><strong>Trainer Data:</strong></Typography>
        <TrainingList trainings={userDetailData.userTrainers} />
      </>
    )}
  </Box>
);

const TrainingList = ({ trainings }) => (
  <>
    {trainings && trainings.length > 0 ? (
      trainings.map((training, idx) => (
        <Box key={`training-${idx}`} sx={{ mb: 2 }}>
          <Typography variant="body2">{training.name}</Typography>
          <Typography variant="body2" color="textSecondary">
            Issued: {new Date(training.issuedAt || training.issueDate).toLocaleDateString()}
          </Typography>
        </Box>
      ))
    ) : (
      <Typography variant="body2">None</Typography>
    )}
  </>
);

export default UserList;