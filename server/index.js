require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());

app.get('/test', (req, res) => {
  console.log('Got a request')
})

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Listening on port ${process.env.SERVER_PORT}`);
});