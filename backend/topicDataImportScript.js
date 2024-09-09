const fs = require('fs');
const csv = require('csv-parser');
const { Topic, TopicFile, Location } = require('./models');
const sequelize = require('./database');

async function importCsv(filePath) {
  try {
    await sequelize.sync(); // Ensure all tables are created

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', async (row) => {
        try {
          // Create or update Topic
          const [topic, created] = await Topic.findOrCreate({
            where: { id: row.TopicId },
            defaults: {
              name: row['Topic Name'],
              description: row.description,
            },
          });

          // Loop through the files and create TopicFile entries
          for (let i = 0; i <= 22; i++) {
            const fileName = row[`File/${i}/fileName`];
            const contentUrl = row[`File/${i}/contentUrl`];
            const contentCreationDate = row[`File/${i}/contentCreationDate`];
            const contentSize = row[`File/${i}/contentSize`];
            const contentId = row[`File/${i}/contentId`];
            const contentType = row[`File/${i}/contentType`];
            const langCode = row[`File/${i}/langCode`];

            if (fileName && contentUrl) {
              await TopicFile.create({
                topicId: row.TopicId,
                fileName,
                contentUrl,
                createdAt: contentCreationDate ? new Date(contentCreationDate) : null,
                size: contentSize ? parseFloat(contentSize) : null,
                contentId: contentId ? parseInt(contentId, 10) : null,
                type: contentType,
                langCode: langCode,
              });
            }
          }

          console.log(`Processed topic: ${topic.name}`);
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

async function insertUniqueLocations(filePath) {
  try {
    await sequelize.sync(); 

    const uniqueLocations = new Set();
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        const district = row.district?.trim();
        const state = row.state?.trim();
        if (district && state) {
          uniqueLocations.add(`${district}, ${state}`);
        }
      })
      .on('end', async () => {
        for (const name of uniqueLocations) {
          const [district, state] = name.split(', ');
          await Location.findOrCreate({
            where: { district, state },
            defaults: { name }
          });
        }
        console.log('Unique locations inserted successfully');
      });
  } catch (error) {
    console.error(`Error inserting unique locations: ${error.message}`);
  }
}

// Usage
// const filePath = '/home/lucky/Downloads/content_training_arghyam.csv';
// importCsv(filePath);



// filePath = '/home/lucky/Downloads/full_details.csv';

// Usage
insertUniqueLocations('/home/lucky/Downloads/full_details.csv');