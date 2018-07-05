CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  item_id int NOT NUll auto_increment,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(30)  NOT NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INTEGER(10),
  PRIMARY KEY (item_id)
);

-- Creates new rows containing data in all named columns --
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('oboe reed', 'music', 34.89, 10),
        ('broom', 'household', 17.50, 5),
        ('watch', 'jewelry', 85.99, 5),
        ('Nintendo Switch', 'electronics', 289.99, 25),
        ('Disney tee', 'clothing', 18.79, 12),
        ('pony beads', 'craft', 4.99, 30),
        ('fan', 'household', 27.19, 10),
        ('silver frame', 'home decor', 14.77, 30),
        ('iphone charger', 'electronice', 7.88, 10),
        ('Jedi costume', 'clothing', 28.50, 4);



