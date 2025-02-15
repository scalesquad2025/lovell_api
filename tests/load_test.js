import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 10 },
    { duration: '30s', target: 0 }
  ],
  thresholds: {
    http_req_failed: ['rate<0.02'],
    http_req_duration: ['p(95)<2000'],
  },
  cloud: {
    distribution: {
      'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 },
    },
  },
};

export default function () {
  let res = http.get('http://localhost:3000/products/40344/styles');
  check(res, {
    'status is 200': (r) => r.status === 200
  });
  sleep(1);
};

