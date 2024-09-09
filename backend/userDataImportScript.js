const fs = require('fs');
const csv = require('csv-parser');
const { User, UserTopic, UserTrainer } = require('./models');
const sequelize = require('./database');

function handleNull(value, defaultValue = null) {
  return value !== null && value !== undefined ? value : defaultValue;
}

async function importCsv(filePath) {
  try {
    await sequelize.sync(); 
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', async (row) => {
        try {
          const [user, created] = await User.findOrCreate({
            where: { userId: handleNull(row.userid) },
            defaults: {
              name: handleNull(row.name),
              country: handleNull(row.country),
              state: handleNull(row.state),
              district: handleNull(row.district),
              city: handleNull(row.city),
              phoneNumber: handleNull(row.phonenumber),
              emailId: handleNull(row.emailid),
              userRole: handleNull(row.userrole)
            }
          });

          if (!created) {
            await user.update({
              name: handleNull(row.name),
              country: handleNull(row.country),
              state: handleNull(row.state),
              district: handleNull(row.district),
              city: handleNull(row.city),
              phoneNumber: handleNull(row.phonenumber),
              emailId: handleNull(row.emailid),
              userRole: handleNull(row.userrole)
            });
          }
          for (let i = 1; i <= 46; i++) {
            const topicName = handleNull(row[`topicname${i}`]);
            const issuedDate = handleNull(row[`issueddatetopic${i}`] ?? row[`issueddate${i}`]);    
            console.log(`topicname${i}`, `issueddatetopic${i}`, topicName, issuedDate)
        
            if (topicName && issuedDate) {
              await UserTopic.findOrCreate({
                where: {
                  userId: handleNull(row.userid),
                  name: topicName,
                  issuedAt: new Date(issuedDate)
                }
              });
            }
          }
          for (let i = 0; i <= 61; i++) {
            const trainerTopicName = handleNull(row[`trainer${i}topicname`]);
            const trainerIssueDate = handleNull(row[`trainer${i}issuedate`] ?? row[`trainer${i}issueddate`]);
            console.log(`trainer${i}topicname`, `trainer${i}issuedate`, trainerTopicName, trainerIssueDate)
            if (trainerTopicName && trainerIssueDate) {
              await UserTrainer.findOrCreate({
                where: {
                  userId: handleNull(row.userid),
                  name: trainerTopicName,
                  issueDate: new Date(trainerIssueDate)
                }
              });
            }
          }
          console.log(`Processed user: ${handleNull(user.name)}`);
        } catch (error) {
          console.error(`Error processing row: ${error.message}`);
        }
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
      });
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

// Usage
const filePath = '/home/lucky/Downloads/full_details2.csv';
importCsv(filePath);
