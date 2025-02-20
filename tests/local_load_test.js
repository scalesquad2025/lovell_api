import http from 'k6/http';
import { check, sleep } from 'k6';
// deploy

export const options = {
  stages: [
    { duration: '30s', target: 1000 },
    { duration: '1m', target: 4000 },
    { duration: '1m', target: 0 }
  ]
};

export default function () {
  let res = http.get('http://18.212.51.221:3000/products/4034/styles');
  check(res, {
    'status is 200': (r) => r.status === 200
  });
  sleep(1);
};

