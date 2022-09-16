require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());

app.get('/test', (req, res) => {
  console.log('Got a request')
  res.
})

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.SERVER_PORT}`);
});