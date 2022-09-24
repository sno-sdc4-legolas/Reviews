require('dotenv').config();
const express = require('express');
const router = require('./routers.js');
const loader = require('./loader.js');
const app = express();

app.use(express.json());

app.use('/reviews', router);
app.use('/loaderio-924be848706d48bcde9f790501e4920e', loader);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Listening on port ${process.env.SERVER_PORT}`);
});
