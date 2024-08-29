import React from "react";
import { userData } from "../complete_userdetails";
import { Box, List, ListItem, ListItemText, Collapse, Typography, Grid } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { useState } from "react";

const getTrainersData = (users) => {
  return users
    .filter(user => user.data?.userDetailData?.trainerData && user.data.userDetailData.trainerData.length > 0)
    .map(user => ({
      userId: user.data.userDetailData.userId,
      name: user.data.userDetailData.name,
      emailId: user.data.userDetailData.emailId,
      country: user.data.userDetailData.country,
      state: user.data.userDetailData.state,
      city: user.data.userDetailData.city,
      phoneNumber: user.data.userDetailData.phoneNumber,
      district: user.data.userDetailData.district,
      trainerData: user.data.userDetailData.trainerData
    }));
};

const TrainersList = () => {
  const trainersData = getTrainersData(userData);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>Trainers List</Typography>
      <List>
        {trainersData.map((trainer, index) => (
          <React.Fragment key={trainer.userId}>
            <ListItem button onClick={() => toggleExpand(index)}>
              <ListItemText
                primary={trainer.name}
                secondary={`${trainer.city}, ${trainer.district}, ${trainer.state}`}
              />
              {expandedIndex === index ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={expandedIndex === index} timeout="auto" unmountOnExit>
              <Box sx={{ pl: 4 }}>
                <Typography variant="body2">Email: {trainer.emailId}</Typography>
                <Typography variant="body2">Phone: {trainer.phoneNumber}</Typography>
                <Typography variant="body2">Country: {trainer.country}</Typography>
                <Typography variant="body2">District: {trainer.district}</Typography>
                <Typography variant="body2">State: {trainer.state}</Typography>
                <Typography variant="body2">City: {trainer.city}</Typography>
                <Typography variant="body2" gutterBottom>Trainer Data:</Typography>
                <List>
                  {trainer.trainerData.map((data, dataIndex) => (
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

export default TrainersList;
