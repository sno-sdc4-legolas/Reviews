DROP DATABASE IF EXISTS test;
CREATE DATABASE test;

DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS reviews_photos CASCADE;
DROP TABLE IF EXISTS characteristics CASCADE;
DROP TABLE IF EXISTS characteristics_reviews CASCADE;

\c test;

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id INT,
  rating INT,
  date BIGINT NOT NULL,
  summary text,
  body text,
  recommended boolean,
  reported boolean,
  reviewer_name text,
  reviewer_email text,
  response text,
  helpfulness INT
);

CREATE TABLE reviews_photos (
  id SERIAL PRIMARY KEY,
  review_id INT references reviews(id),
  url text
);

CREATE TABLE characteristics (
 id SERIAL PRIMARY KEY,
 product_id INT,
 name text
);

CREATE TABLE characteristics_reviews (
  id SERIAL PRIMARY KEY,
  characteristic_id INT references characteristics(id),
  review_id INT references reviews(id),
  value INT
);

\COPY reviews (id, product_id, rating, date, summary, body, recommended, reported, reviewer_name, reviewer_email, response, helpfulness) FROM 'database/csv/reviews.csv' WITH DELIMITER ',' CSV HEADER;

\COPY reviews_photos (id, review_id, url) FROM 'database/csv/reviews_photos.csv' WITH DELIMITER ',' CSV HEADER;

\COPY characteristics (id, product_id, name) FROM 'database/csv/characteristics.csv' WITH DELIMITER ',' CSV HEADER;

\COPY characteristics_reviews (id, characteristic_id, review_id, value) FROM 'database/csv/characteristic_reviews.csv' WITH DELIMITER ',' CSV HEADER;

-- Run psql postgres -f database/seed.sql