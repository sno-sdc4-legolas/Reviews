require('dotenv').config();
const express = require('express');
const router = require('./routers.js');
const app = express();

app.use(express.json());

app.use('/reviews', router);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Listening on port ${process.env.SERVER_PORT}`);
});