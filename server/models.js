const pool = require('../database/index.js');

module.exports = {

  getReviews: (query) => {
    const {page = 1, count = 5, sort = 'newest', product_id} = query;
    const offset = page > 1 ? (page - 1) * count : 1;
    let sortBy = '';
    if (sort === 'newest') { sortBy = 'date DESC'; }
    if (sort === 'helpful') { sortBy = 'helpfulness DESC'; }
    if (sort === 'relevant') { sortBy = 'date DESC, helpfulness DESC'; }

    return pool.query(`
      SELECT * FROM reviews_photos
      RIGHT OUTER JOIN reviews
      ON reviews_photos.review_id = reviews.id
      WHERE reviews.product_id = ${product_id}
      AND reviews.reported = FALSE
      ORDER BY ${sortBy}
      LIMIT ${count}
      OFFSET ${offset};
    `).then((response) => {
        // const results = [];
        const reStructure = {};
        response.rows.forEach((row) => {
          if (!reStructure[row.id]) {
            reStructure[row.id] = {
              review_id: row.id,
              rating: row.rating,
              summary: row.summary,
              recommend: row.recommended,
              response: row.response,
              body: row.body,
              date: new Date(Number(row.date)).toISOString(),
              reviewer_name: row.reviewer_name,
              helpfulness: row.helpfulness,
              photos: row.review_id ? [{id: row.review_id, url: row.url}] : []
            }
            // results.push(row.id);
          } else {
            reStructure[row.id].photos.push({id: row.review_id, url: row.url});
          }
        })
        return reStructure;
      })
      .catch((err) => {console.log(err)})
  },

  getMeta: (product_id) => {
    const ratingQuery = '(SELECT COUNT(rating) FROM reviews WHERE rating =';
    const recommendTrue = '(SELECT COUNT(recommended) FROM reviews WHERE recommended = TRUE AND product_id =';
    const recommendFalse = '(SELECT COUNT(recommended) FROM reviews WHERE recommended = FALSE AND product_id =';
    const test = '(SELECT AVG(VALUE) FROM characteristics_reviews where id = '
    const test2 = '(SELECT id from characteristics where product_id ='

    const charQuery = '(SELECT id from characteristics where product_id =';
    return pool.query(`
      SELECT json_build_object (
        'product_id', ${product_id},
        'ratings', (SELECT json_build_object (
          '1', ${ratingQuery} 1 AND product_id = ${product_id}),
          '2', ${ratingQuery} 2 AND product_id = ${product_id}),
          '3', ${ratingQuery} 3 AND product_id = ${product_id}),
          '4', ${ratingQuery} 4 AND product_id = ${product_id}),
          '5', ${ratingQuery} 5 AND product_id = ${product_id})
        )),
        'recommended', (SELECT json_build_object (
          'true', ${recommendTrue} ${product_id}),
          'false', ${recommendFalse} ${product_id})
        )),
        'characteristics', (SELECT json_build_object (
          'Fit', (SELECT json_build_object('id', ${charQuery} ${product_id} AND name = 'Fit'), 'value', ${test} ${test2} ${product_id} AND name = 'Fit')))),
          'Length', (SELECT json_build_object('id', ${charQuery} ${product_id} AND name = 'Length'), 'value', ${test} ${test2} ${product_id} AND name = 'Length')))),
          'Comfort', (SELECT json_build_object('id', ${charQuery} ${product_id} AND name = 'Comfort'), 'value', ${test} ${test2} ${product_id} AND name = 'Comfort')))),
          'Quality', (SELECT json_build_object('id', ${charQuery} ${product_id} AND name = 'Quality'), 'value', ${test} ${test2} ${product_id} AND name = 'Quality')))),
          'Width', (SELECT json_build_object('id', ${charQuery} ${product_id} AND name = 'Width'), 'value', ${test} ${test2} ${product_id} AND name = 'Width')))),
          'Size', (SELECT json_build_object('id', ${charQuery} ${product_id} AND name = 'Size'), 'value', ${test} ${test2} ${product_id} AND name = 'Size'))))
        ))
      )
    `)
  },

  postReview: ({
    product_id, rating, summary, body, recommend, name, email, photos, characteristics
  }) => {
    const date = new Date().getTime();
    const params = [
      product_id, rating, date, summary, body, recommend, name, email
    ]

    return pool.query(`
      INSERT INTO reviews (product_id, rating, date, summary, body, recommended, reviewer_name, reviewer_email)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id AS review_id;
    `, params)
        .then((response) => {
          if (photos.length > 0) {
            photos.map((photo) => {
              pool.query(`
                INSERT INTO reviews_photos (url, review_id)
                VALUES ('${photo.url}', ${response.rows[0].review_id});
              `).catch((err) => {console.log(err)})
            })
          }

          const keys = Object.keys(characteristics);
          keys.map((key) => {
            pool.query(`
              INSERT INTO characteristics_reviews (characteristic_id, review_id, value)
              VALUES (${key}, ${response.rows[0].review_id}, ${characteristics[key]});
            `).catch((err) => {console.log('Error inserting into characteristics', err)})
          })
        })
        .catch((err) => {console.log(err)})
  },

  markHelpful: (review_id) => {
    return pool.query(`
      UPDATE reviews SET helpfulness = helpfulness + 1
      WHERE id = ${review_id};
    `)
  },

  reportReview: (review_id) => {
    return pool.query(`
      UPDATE reviews SET reported = TRUE
      WHERE id = ${review_id};
    `)
  }
}
