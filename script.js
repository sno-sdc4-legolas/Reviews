import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '15s',
};

export default function () {
  //Randomly generate an ID
  //1000011 is the total number of products
  const id = Math.ceil(Math.random() * 1000011);

  http.get(`http://localhost:8080/reviews/?page=1&count=5&sort=newest&product_id=${id}`);
  sleep(1);

  http.get(`http://localhost:8080/reviews/?page=1&count=5&sort=helpful&product_id=${id}`);
  sleep(1);

  http.get(`http://localhost:8080/reviews/?page=1&count=5&sort=relevant&product_id=${id}`);
  sleep(1);

  http.get(`http://localhost:8080/reviews/meta?product_id=${id}`);
  sleep(1);
}