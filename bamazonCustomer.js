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

function listProducts() {
    connection.query('SELECT * FROM `products`', function (error, results, fields) {
        if (error) throw error;
        console.log("Item ID  Price($) \tProduct");
        console.log("----------------------------------------------")
        for (var i=0; i<results.length; i++) {
            console.log(results[i].item_id + "\t" + results[i].price + "\t\t" + results[i].product_name);
        }
        promptUser();
        maxResults = results.length;
    });
}

function promptUser() {
    inquirer.prompt([
        {
            type: "input",
            name: "id",
            message: "\nPlease select the ID number of the item you would like to order."
        },
        {
            type: "input",
            name: "amount",
            message: "\nPlease enter the quantity you need."
        }
    ]).then(function(data) {
        if (data.id <=maxResults && data.id>0 && !isNaN(data.amount)){
            completeOrder(data);
        }
        else if (isNaN(data.amount)){
            console.log("\n*******************************");
            console.log("*Please enter a valid quantity.*");
            console.log("*********************************\n");
            promptUser();
        }
        else {
            console.log("\n*************************");
            console.log("*Please enter a valid id*");
            console.log("*************************\n");
            promptUser();
        }
    });
}

function completeOrder(data) {
    connection.query('SELECT `stock_quantity`, `price`, `product_sales` FROM `products` WHERE `item_id`=?', [data.id], function (error, results, fields) {
        if (error) throw error;
        var inventory = results[0].stock_quantity;
        var price = results[0].price;
        var changedQuantity = (inventory-data.amount);
        var customerCost = data.amount * price;
        var newTotalSales = customerCost + results[0].product_sales;
        if (inventory >= data.amount) {          
            connection.query('UPDATE products SET stock_quantity = ?, product_sales = ? WHERE item_id = ?', [changedQuantity, newTotalSales, data.id], function (error, results, fields) {
                if (error) throw error;
              });
            console.log("\nYour total price is $" + customerCost + ".\n");
            anotherPrompt();
        }
        else {
            console.log("\nInsufficient quantity in stock for your purchase.\n");
            anotherPrompt();
        }
    });
}

function anotherPrompt() {
    inquirer.prompt([
        {
            type: "confirm",
            name: "again",
            message: "\nWould you like to order another item?"
        }
    ]).then(function(data) {
        if (data.again) {
            listProducts();
        }
        else {
            console.log("\nThank you for using Bamazon.\n")
            connection.end();
        }
    })
}

listProducts();