DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products (
  item_id int NOT NUll auto_increment,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(30)  NOT NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INTEGER(10),
  product_sales DECIMAL(10,2) NULL,
  PRIMARY KEY (item_id)
);

-- Creates new rows containing data in all named columns --
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)
VALUES ('oboe reed', 'music', 34.89, 10, 0),
        ('broom', 'household', 17.50, 5, 0),
        ('watch', 'jewelry', 85.99, 5, 0),
        ('Nintendo Switch', 'electronics', 289.99, 25, 0),
        ('Disney tee', 'clothing', 18.79, 12, 0),
        ('pony beads', 'craft', 4.99, 30, 0),
        ('fan', 'household', 27.19, 10, 0),
        ('silver frame', 'home decor', 14.77, 30, 0),
        ('iphone charger', 'electronics', 7.88, 10, 0),
        ('Jedi costume', 'clothing', 28.50, 4, 0);

CREATE TABLE departments (
  department_id int NOT NULL auto_increment,
  department_name VARCHAR(50) NOT NULL,
  over_head_costs DECIMAL(10,2) NULL,
  PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs)
VALUES ('music', 50.50),
        ('household', 30.84),
        ('jewelry', 100.00),
        ('electonics', 81.25),
        ('clothing', 38.87),
        ('craft', 15.15),
        ('home decor', 46.75);


