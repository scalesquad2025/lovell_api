import http from 'k6/http';
import { check, sleep } from 'k6';
// deploy

export const options = {
  stages: [
    { duration: '30s', target: 100 },
    { duration: '1m', target: 1000 },
    { duration: '1m', target: 0 }
  ]
};

export default function () {
  let res = http.get('http://localhost:3000/products');
  check(res, {
    'status is 200': (r) => r.status === 200
  });
  sleep(1);
};

