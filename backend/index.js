const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// PostgreSQL connection pool setup
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "UserDetails",
  password: "postgres",
  port: 5432,
});

// Helper function to mask phone number and email ID
const maskPhonenumber = (phonenumber) => {
  if (!phonenumber || phonenumber.length < 2) return "NA";
  return phonenumber.slice(0, 2) + "*".repeat(phonenumber.length - 2);
};

const maskEmailId = (emailid) => {
  if (!emailid || !emailid.includes("@")) return "NA";
  const [localPart, domain] = emailid.split("@");
  const domainExtension = domain.split(".").pop();
  return `${localPart.slice(0, 2)}***.${domainExtension}`;
};

const removeEmptyFields = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => value !== "")
  );
};

// API route to get users with their trainee and trainer training data
app.get("/api/users", async (req, res) => {
  try {
    // Fetch user basic details from BasicDetails table
    const basicDetailsQuery = `
      SELECT bd.userid, bd.name, bd.country, bd.state, bd.district, bd.city, bd.phonenumber, bd.emailid, bd.userrole, bd.latitude, bd.longitude
      FROM BasicDetails bd;
    `;
    const basicDetailsResult = await pool.query(basicDetailsQuery);
    const users = basicDetailsResult.rows;

    // Iterate over each user and fetch their training data
    for (const user of users) {
      // Mask phone number and email
      user.phonenumber = maskPhonenumber(user.phonenumber);
      user.emailid = maskEmailId(user.emailid);

      // Fetch trainee training data for the current user
      const traineeQuery = `
        SELECT 
          tt.topicName1, tt.IssuedDateTopic1, tt.topicName2, tt.issuedDateTopic2, tt.topicName3, tt.IssuedDateTopic3, tt.topicName4, tt.issuedDateTopic4, tt.topicName5, tt.issuedDateTopic5, tt.topicName6, tt.issuedDateTopic6, tt.topicName7, tt.issuedDateTopic7, tt.topicName8, tt.issuedDateTopic8, tt.TopicName9, tt.issuedDateTopic9, tt.TopicName10, tt.issuedDateTopic10, tt.TopicName11, tt.IssuedDate11, tt.TopicName12, tt.IssuedDate12, tt.topicName13, tt.issuedDate13, tt.topicName14, tt.issuedDate14, tt.topicName15, tt.issuedDate15, tt.topicName16, tt.issuedDate16, tt.topicName17, tt.issuedDate17, tt.topicName18, tt.issuedDate18, tt.topicName19, tt.issuedDate19, tt.topicName20, tt.issuedDate20, tt.topicName21, tt.issuedDate21, tt.topicName22, tt.issuedDate22, tt.topicName23, tt.issuedDate23, tt.topicName24, tt.issuedDate24, tt.topicName25, tt.issuedDate25, tt.topicName26, tt.issuedDate26, tt.topicName27, tt.issuedDate27, tt.topicName28, tt.issuedDate28, tt.topicName29, tt.issuedDate29, tt.topicName30, tt.issuedDate30, tt.topicName31, tt.issuedDate31, tt.topicName32, tt.issuedDate32, tt.topicName33, tt.issuedDate33, tt.topicName34, tt.issuedDate34, tt.topicName35, tt.issuedDate35, tt.topicName36, tt.issuedDate36, tt.topicName37, tt.issuedDate37, tt.topicName38, tt.issuedDate38, tt.topicName39, tt.issuedDate39, tt.topicName40, tt.issuedDate40, tt.topicName41, tt.issuedDate41, tt.topicName42, tt.issuedDate42, tt.topicName43, tt.issuedDate43, tt.topicName44, tt.issuedDate44, tt.topicName45, tt.issuedDate45, tt.topicName46, tt.issuedDate46
        FROM trainee_trainings tt
        WHERE tt.userid = $1;
      `;
      const traineeResult = await pool.query(traineeQuery, [user.userid]);

      user.traineeTrainings = traineeResult.rows.map((training) =>
        removeEmptyFields(training)
      );

      // Fetch trainer training data for the current user
      const trainerQuery = `
        SELECT ttr.trainer0topicName, ttr.trainer0issueDate, ttr.trainer1topicName, ttr.trainer1issueDate, ttr.trainer2topicName, ttr.trainer2issueDate, ttr.trainer3topicName, ttr.trainer3issuedDate, ttr.trainer4topicName, ttr.trainer4issueDate, ttr.trainer5topicName, ttr.trainer5issueDate, ttr.trainer6topicName, ttr.trainer6issuedDate, ttr.trainer7topicName, ttr.trainer7issuedDate, ttr.trainer8topicName, ttr.trainer8issuedDate, ttr.trainer9topicName, ttr.trainer9issuedDate, ttr.trainer10topicName, ttr.trainer10issuedDate, ttr.trainer11topicName, ttr.trainer11issuedDate, ttr.trainer12topicName, ttr.trainer12issuedDate, 
          ttr.trainer13topicName, ttr.trainer13issuedDate, ttr.trainer14topicName, ttr.trainer14issuedDate, ttr.trainer15topicName, ttr.trainer15issuedDate, ttr.trainer16topicName, ttr.trainer16issuedDate, ttr.trainer17topicName, ttr.trainer17issuedDate, ttr.trainer18topicName, ttr.trainer18issuedDate, ttr.trainer19topicName, ttr.trainer19issuedDate, ttr.trainer20topicName, ttr.trainer20issuedDate, ttr.trainer21topicName, ttr.trainer21issuedDate, ttr.trainer22topicName, ttr.trainer22issuedDate, ttr.trainer23topicName, ttr.trainer23issuedDate, ttr.trainer24topicName, ttr.trainer24issuedDate, ttr.trainer25topicName, ttr.trainer25issuedDate, ttr.trainer26topicName, ttr.trainer26issuedDate, ttr.trainer27topicName, ttr.trainer27issuedDate, ttr.trainer28topicName, ttr.trainer28issuedDate, ttr.trainer29topicName, ttr.trainer29issuedDate, ttr.trainer30topicName, ttr.trainer30issuedDate, ttr.trainer31topicName, ttr.trainer31issuedDate, ttr.trainer32topicName, ttr.trainer32issuedDate, ttr.trainer33topicName, ttr.trainer33issuedDate, ttr.trainer34topicName, ttr.trainer34issuedDate, ttr.trainer35topicName, ttr.trainer35issuedDate, ttr.trainer36topicName, ttr.trainer36issuedDate, ttr.trainer37topicName, ttr.trainer37issuedDate, ttr.trainer38topicName, ttr.trainer38issuedDate, ttr.trainer39topicName, ttr.trainer39issuedDate, ttr.trainer40topicName, ttr.trainer40issuedDate, ttr.trainer41topicName, ttr.trainer41issuedDate, ttr.trainer42topicName, ttr.trainer42issuedDate, ttr.trainer43topicName, ttr.trainer43issuedDate, ttr.trainer44topicName, ttr.trainer44issuedDate, ttr.trainer45topicName, ttr.trainer45issuedDate, ttr.trainer46topicName, ttr.trainer46issuedDate, ttr.trainer47topicName, ttr.trainer47issuedDate, ttr.trainer48topicName, ttr.trainer48issuedDate, ttr.trainer49topicName, ttr.trainer49issuedDate, ttr.trainer50topicName, ttr.trainer50issuedDate, ttr.trainer51topicName, ttr.trainer51issuedDate, ttr.trainer52topicName, ttr.trainer52issuedDate, ttr.trainer53topicName, ttr.trainer53issuedDate, ttr.trainer54topicName, ttr.trainer54issuedDate, ttr.trainer55topicName, ttr.trainer55issuedDate, ttr.trainer56topicName, ttr.trainer56issuedDate, ttr.trainer57topicName, ttr.trainer57issuedDate, ttr.trainer58topicName, ttr.trainer58issuedDate, ttr.trainer59topicName, ttr.trainer59issuedDate, ttr.trainer60topicName, ttr.trainer60issuedDate
        FROM trainer_trainings ttr
        WHERE ttr.userid = $1;
      `;
      const trainerResult = await pool.query(trainerQuery, [user.userid]);

      user.trainerTrainings = trainerResult.rows.map((training) =>
        removeEmptyFields(training)
      );

      // Remove empty traineeTrainings and trainerTrainings arrays
      if (user.traineeTrainings.length === 0) {
        delete user.traineeTrainings;
      }
      if (user.trainerTrainings.length === 0) {
        delete user.trainerTrainings;
      }
    }

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "An error occurred while fetching users." });
  }
});

app.get('/api/content', async (req, res) => {
  const selectQuery = `
    SELECT * FROM Basic_Content;
  `;

  try {
    const basicContentResult = await pool.query(selectQuery);
    const basicContent = basicContentResult.rows;

    for (const content of basicContent) {
      const contentFilesQuery = `
        SELECT * FROM Content_Files WHERE topicid = $1;
      `;
      const contentFilesResult = await pool.query(contentFilesQuery, [content.topicid]);
      const contentFiles = contentFilesResult.rows;

      // Filter out empty fields
      const filteredContentFiles = contentFiles.map(file => {
        return Object.fromEntries(
          Object.entries(file).filter(([_, value]) => value !== "")
        );
      });

      content.files = filteredContentFiles;
    }

    res.json(basicContent);
  } catch (err) {
    console.error('Error fetching content:', err);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});


app.get('/ping', async (req, res) => {res.send('pong')});















// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
