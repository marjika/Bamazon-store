var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3307,
    user: "root",
    password: "root",
    database: "bamazon_db"
  });

function start() {
    inquirer
      .prompt({
        name: "supervisorInput",
        type: "rawlist",
        message: "\nChoose from the following options.",
        choices: ["View Sales by Department", "Create New Department"]
      })
      .then(function(selection) {
        if (selection.supervisorInput === "View Sales by Department") {
            viewDepartmentSales();
        }
        else {
            createDepartment();
        }
      });
  }

function viewDepartmentSales() {
    connection.query('SELECT * FROM `departments`', function (error, results, fields) {
        if (error) throw error;
        console.log("\n| department_id | department_name | over_head_costs | product_sales | total_profit |");
        console.log("| ------------- | --------------- | --------------- | ------------- | ------------ |");
        for (var i=0; i<results.length; i++) {
        console.log("|  " + results[i].department_id + "\t\t|" + results[i].department_name + "\t  |" + results[i].over_head_costs);
        }
        start();
    });

}
 
function createDepartment() {
    console.log("Create New Department");
}

  start();