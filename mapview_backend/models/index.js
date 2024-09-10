const User = require('./user');
const UserTopics = require('./userTopics');

// Define associations
User.hasMany(UserTopics, { foreignKey: 'userid' });
UserTopics.belongsTo(User, { foreignKey: 'userid' });

module.exports = { User, UserTopics };
