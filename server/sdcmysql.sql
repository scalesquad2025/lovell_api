DROP DATABASE IF EXISTS grandvoyagers;
CREATE DATABASE sdc;

USE sdc;

CREATE TABLE products (
  id INT PRIMARY KEY,
  campus VARCHAR (255),
  name VARCHAR (255),
  slogan TEXT,
  description TEXT,
  category VARCHAR(255),
  default_price VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE features (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  feature VARCHAR(255),
  value VARCHAR(255),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE styles (
  product_id INT NOT NULL,
  style_id INT NOT NULL PRIMARY KEY,
  name VARCHAR(255),
  original_price VARCHAR(255),
  sale_price VARCHAR(255),
  default? BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE photos (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  style_id INT NOT NULL,
  thumbnail_url VARCHAR(255),
  url VARCHAR(255),
  FOREIGN KEY (style_id) REFERENCES styles(style_id)
);

CREATE TABLE skus (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  style_id INT NOT NULL,
  sku_id INT NOT NULL,
  quantity INT,
  size VARCHAR(255),
  FOREIGN KEY (style_id) REFERENCES styles(style_id)
);
