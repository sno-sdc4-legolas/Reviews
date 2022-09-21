const express = require('express');
const router = express.Router();
const controller = require('./controllers.js');

router.get('', controller.getReviews);
router.get('/meta', controller.getMeta);
router.post('', controller.postReview);
router.put('/:review_id/helpful', controller.markHelpful);
router.put('/:review_id/report', controller.reportReview);

module.exports = router;