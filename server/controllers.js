const express = require('express');
const models = require('./models.js');

module.exports = {

  getReviews: (req, res) => {
    const {product_id, page, count} = req.query;
    models.getReviews(req.query)
      .then((response) => {
        console.log('MY RESPONSE IS???', response);
        const getObj = {
          product: product_id,
          page,
          count,
          results: Object.keys(response).map((review) => response[review])
        }
        res.send(getObj);
      })
      .catch((err) => {console.log('Error getting reviews', err)})
  },

  getMeta: (req, res) => {
    models.getMeta(Number(req.query.product_id))
      .then((response) => {
        const data = response.rows[0].json_build_object;
        const characteristicsArr = Object.keys(data.characteristics);
        characteristicsArr.forEach((characteristic) => {
          if(!data.characteristics[characteristic].id) {
            delete data.characteristics[characteristic]
          }
        })
        res.send(data);
      })
      .catch((err) => { console.log('error getting meta'); console.log(err) })
  },

  postReview: (req, res) => {
    models.postReview(req.body)
      .then((response) => { res.sendStatus(201); })
      .catch((err) => { console.log('Error posting'); res.send(err); })
  },

  markHelpful: (req, res) => {
    models.markHelpful(req.params.review_id)
      .then((response) => { res.sendStatus(200); })
      .catch((err) => { console.log('error marking helpful'); res.send(err); })
  },

  reportReview: (req, res) => {
    models.reportReview(req.params.review_id)
      .then((response) => { res.sendStatus(200); })
      .catch((err) => { console.log('error reporting'); res.send(err); })
  }

}
