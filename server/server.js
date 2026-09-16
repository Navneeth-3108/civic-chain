const mongoose = require('mongoose');
const app = require('./app');
const env = require('./config/env');

async function start() {
  await mongoose.connect(env.mongoUri);
  app.listen(env.port, () => console.log(`CivicChain API listening on http://localhost:${env.port}`));
}

start().catch((error) => {
  console.error('Server startup failed:', error.message);
  process.exitCode = 1;
});