const express = require('express');
const app = express();
const port = port.env.PORT || 3000;
const sequelize = require('./database');
const { User, UserTopic, UserTrainer, Topic, TopicFile } = require('./models');

const userRoutes = require('./routes/users');
const userTopicRoutes = require('./routes/userTopics');
const userTrainerRoutes = require('./routes/userTrainers');
const topicRoutes = require('./routes/topics');
const topicFileRoutes = require('./routes/topicFiles');
const locationRoutes = require('./routes/location');


app.use(express.json());

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/user-topics', userTopicRoutes);
app.use('/api/v1/user-trainers', userTrainerRoutes);
app.use('/api/v1/topics', topicRoutes);
app.use('/api/v1/topic-files', topicFileRoutes);
app.use('/api/v1/location', locationRoutes);

sequelize.sync({ force: false }).then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});