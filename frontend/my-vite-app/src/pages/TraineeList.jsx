import React from "react";
import { userData } from "../complete_userdetails";
import { Box, List, ListItem, ListItemText, Collapse, Typography } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { useState } from "react";

const gettraineesData = (users) => {
  return users
    .filter(user => user.data?.userDetailData?.traineeData && user.data.userDetailData.traineeData.length > 0)
    .map(user => ({
      userId: user.data.userDetailData.userId,
      name: user.data.userDetailData.name,
      emailId: user.data.userDetailData.emailId,
      country: user.data.userDetailData.country,
      state: user.data.userDetailData.state,
      city: user.data.userDetailData.city,
      phoneNumber: user.data.userDetailData.phoneNumber,
      district: user.data.userDetailData.district,
      traineeData: user.data.userDetailData.traineeData
    }));
};

const TraineeList = () => {
  const traineesData = gettraineesData(userData);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>Trainee List</Typography>
      <List>
        {traineesData.map((trainee, index) => (
          <React.Fragment key={trainee.userId}>
            <ListItem button onClick={() => toggleExpand(index)}>
              <ListItemText
                primary={trainee.name}
                secondary={`${trainee.city}, ${trainee.district}, ${trainee.state}`}
              />
              {expandedIndex === index ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={expandedIndex === index} timeout="auto" unmountOnExit>
              <Box sx={{ pl: 4 }}>
                <Typography variant="body2">Email: {trainee.emailId}</Typography>
                <Typography variant="body2">Phone: {trainee.phoneNumber}</Typography>
                <Typography variant="body2">Country: {trainee.country}</Typography>
                <Typography variant="body2">District: {trainee.district}</Typography>
                <Typography variant="body2">State: {trainee.state}</Typography>
                <Typography variant="body2">City: {trainee.city}</Typography>
                <Typography variant="body2" gutterBottom>trainee Data:</Typography>
                <List>
                  {trainee.traineeData.map((data, dataIndex) => (
                    <ListItem key={dataIndex}>
                      <ListItemText
                        primary={`Topic Name: ${data.topicName}`}
                        secondary={`Issued Date: ${data.issuedDate}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default TraineeList;
