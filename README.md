# High Performance E-Commerce API


This project is a high-performance e-commerce API designed to handle data fetches from multiple endpoints, showcasing how database design, server architecture, and load balancing techniques can impact scalability and response times


<ins>Optimizations:</ins>

 -  MongoDB Schema:
  Transitioned from a normalized structure requiring multiple nested lookups to a denormalized structure and indexed key fields to reduce query time

 -  ETL pipeline:
  Used async loops while batch processing read streams to create predictable data transformations

 -  Horizontal scaling:
  Deployed containerized servers across multiple EC2 instances to distribute request load

 -  Nginx load balancer:
  Configured Nginx parameters by tuning worker connections, load balancing strategies, disabling logging, and gradually increasing virtual users


<ins>Final Results:</ins>

- After MongoDB refactor: **+3s -> milliseconds**
- Single EC2: **1000 RPS, 191ms, 0.3% error rate**
- Nginx + 2 EC2s: **1150 RPS, 9ms, 0% error rate**


<ins>Tech Stack:</ins>
AWS EC2, Node.js, Express.js, MongoDB, Docker, Nginx


<ins>Testing:</ins>
jest, supertest, K6/K6 cloud, Loaderio


<ins>Installation:</ins>

- Fork and clone the repo
- Add variables to example.env and rename to .env
- npm install
OR
- docker build -t [container_name] .
- docker run -d -p 3000:3000 --env-fil .env [container_name]
