const express = require('express');
const router = express.Router();
const controller = require('./controllers.js');


router.get('', (req, res) => {console.log('HELLO'); res.send('loaderio-924be848706d48bcde9f790501e4920e'); });

module.exports = router;
