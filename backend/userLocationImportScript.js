const fs = require('fs');
const csv = require('csv-parser');
const { User, UserTopic, UserTrainer } = require('./models');
const sequelize = require('./database');
const { DataTypes } = require('sequelize');

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
                    const user = await User.findOne({
                        where: { userId: handleNull(row.userid) }
                    });

                    if (user) {
                        await user.update({
                            latitude: handleNull(row.latitude),
                            longitude: handleNull(row.longitude)
                        });
                        console.log(`Updated location for user: ${handleNull(user.name)}`);
                    } else {
                        console.log(`User not found: ${handleNull(row.userid)}`);
                    }
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


async function addGeoColumnsToUserTable() {
    try {
        const tableInfo = await sequelize.getQueryInterface().describeTable('Users');

        if (!tableInfo.latitude) {
            await sequelize.getQueryInterface().addColumn('Users', 'latitude', {
                type: DataTypes.DECIMAL(10, 8),
                allowNull: true
            });
            console.log('Latitude column added successfully to Users table');
        } else {
            console.log('Latitude column already exists in Users table');
        }

        if (!tableInfo.longitude) {
            await sequelize.getQueryInterface().addColumn('Users', 'longitude', {
                type: DataTypes.DECIMAL(11, 8),
                allowNull: true
            });
            console.log('Longitude column added successfully to Users table');
        } else {
            console.log('Longitude column already exists in Users table');
        }
    } catch (error) {
        console.error('Error adding geo columns:', error);
    }
}

addGeoColumnsToUserTable();

const filePath = '/home/lucky/Dropbox/argyam/users_loc.csv';
importCsv(filePath);
