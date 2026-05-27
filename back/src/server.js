const app = require("./app");
const env = require("./config/env");
require('node:dns').setServers(['1.1.1.1','8.8.8.8'])

const connectDatabase = require("./config/db");

const startServer = async () => {
  try {
    await connectDatabase(env.mongoUri);
    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
