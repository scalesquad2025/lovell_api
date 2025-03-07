import http from 'k6/http';
import { check, sleep } from 'k6';
// deploy

export const options = {
  stages: [
    { duration: '30s', target: 100 },
    { duration: '1m', target: 100 },
    { duration: '1m', target: 0 }
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
  let res = http.get('https://289e-73-241-73-129.ngrok-free.app/products/40354/styles'); // dynamic
  check(res, {
    'status is 200': (r) => r.status === 200
  });
  sleep(1);
};



