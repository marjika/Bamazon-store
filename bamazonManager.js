var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3307,
    user: "root",
    password: "root",
    database: "bamazon_db"
  });

var maxResults = 0;

function start() {
    connection.query('SELECT * FROM `products`', function (error, results, fields) {
        maxResults = results.length;
    });
    inquirer
      .prompt({
        name: "managerInput",
        type: "rawlist",
        message: "\nChoose from the following options.",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"]
      })
      .then(function(selection) {
        if (selection.managerInput === "View Products for Sale") {
            displayProducts();
        }
        else if (selection.managerInput === "View Low Inventory") {
            lowInventory();
        }
        else if (selection.managerInput === "Add to Inventory") {
            addInventory();
        }
        else if (selection.managerInput === "Add New Product") {
            newProduct();
        }
        else {
            connection.end();
        }
      });
  }

  function displayProducts() {
    connection.query('SELECT * FROM `products`', function (error, results, fields) {
        if (error) throw error;
        console.log("\nItem ID  Price($)\tUnits \tProduct");
        console.log("--------------------------------------------------------")
        for (var i=0; i<results.length; i++) {
            console.log(results[i].item_id + "\t " + results[i].price.toFixed(2) + "\t\t" + results[i].stock_quantity + "\t" + results[i].product_name);
        }
        start();
    });
  }

  function lowInventory() {
    connection.query('SELECT * FROM `products`', function (error, results, fields) {
        if (error) throw error;
        var noLowItems = true;
        console.log("\nItem ID\tUnits \tProduct");
        console.log("------------------------------------")
        for (var i=0; i<results.length; i++) {
            if (results[i].stock_quantity<5) {
                noLowItems = false;
                console.log(results[i].item_id + "\t" + results[i].stock_quantity + "\t" + results[i].product_name);
            }
        }
        if (noLowItems) {
            console.log("\nNo items with inventory under 5 units.\n")
        }
        start();
    });
  }

  function addInventory() {
    inquirer.prompt([
        {
            type: "input",
            name: "id",
            message: "\nPlease select the ID number of the item to restock."
        },
        {
            type: "input",
            name: "amount",
            message: "\nPlease enter the quantity to be added to stock."
        }
    ]).then(function(data) {
        if (data.id <=maxResults && data.id>0 && !isNaN(data.amount)){
            connection.query('SELECT `stock_quantity`, `product_name` FROM `products` WHERE `item_id`=?', [data.id], function (error, results, fields) {
                if (error) throw error;
                var inventory = results[0].stock_quantity;
                var changedQuantity = (inventory+parseInt(data.amount));
                connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', [changedQuantity, data.id], function (error, results, fields) {
                    if (error) throw error;
                });
                console.log("\nThere are " + changedQuantity + " units in inventory for "+ results[0].product_name + ".\n");
                start();
            });
        }
        else if (isNaN(data.amount)){
            console.log("\n*******************************");
            console.log("*Please enter a valid quantity.*");
            console.log("*********************************\n");
            addInventory();
        }
        else {
            console.log("\n*************************");
            console.log("*Please enter a valid id*");
            console.log("*************************\n");
            addInventory();
        }
    });
  }

  function newProduct() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "\nPlease input the name of the new product."
        },
        {
            type: "input",
            name: "department",
            message: "\nPlease enter the name of the department of the new product."
        },
        {
            type: "input",
            name: "price",
            message:"\nWhat is the price of the new product in dollars?"
        },
        {
            type: "input",
            name: "quantity",
            message: "\nHow many units of the new product are in stock?"
        }
    ]).then(function(data) {
        connection.query(
            "INSERT INTO products SET ?",
            {
              product_name: data.name,
              department_name: data.department,
              price: data.price,
              stock_quantity: data.quantity
            },
            function(err) {
              if (err) throw err;
              console.log("Your new product has been added.");
              start();
            }
          );
    });
  }

  start();