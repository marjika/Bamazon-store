var mysql = require("mysql");
var inquirer = require("inquirer");
const {table} = require('table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3307,
    user: "root",
    password: "root",
    database: "bamazon_db"
  });
   
  let data,
      output;

function start() {
    inquirer
      .prompt({
        name: "supervisorInput",
        type: "rawlist",
        message: "\nChoose from the following options.",
        choices: ["View Sales by Department", "Create New Department", "Quit"]
      })
      .then(function(selection) {
        if (selection.supervisorInput === "View Sales by Department") {
            viewDepartmentSales();
        }
        else if (selection.supervisorInput === "Create New Department") {
            createDepartment();
        }
        else {
            connection.end();
        }
      });
  }

function viewDepartmentSales() {
    var query = "SELECT department_id, departments.department_name, over_head_costs, SUM(products.product_sales) as Sum_sales ";
    query += "FROM departments LEFT JOIN products ON (departments.department_name = products.department_name) GROUP BY department_id";
    connection.query(query, function (error, results, fields) {
        if (error) throw error;
        data = [['department_id', 'department_name', 'over_head_costs', 'product_sales', 'total_profit']];

        for (var i=0; i<results.length; i++) {
            var tableRow = [results[i].department_id, results[i].department_name, results[i].over_head_costs, results[i].Sum_sales, (results[i].Sum_sales-results[i].over_head_costs).toFixed(2)];
            data.push(tableRow);
        }
        output = table(data);
        console.log(output);
        start();
    });
}
 
function createDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "\nPlease input the name of the new department."
        },
        {
            type: "input",
            name: "costs",
            message: "\nPlease enter the overhead costs of the new product in dollars."
        }
    ]).then(function(data) {
        if (!isNaN(data.costs)) {
            connection.query(
                "INSERT INTO departments SET ?",
                {
                department_name: data.name,
                over_head_costs: data.costs
                },
                function(err) {
                if (err) throw err;
                console.log("\nYour new department has been added.\n");
                start();
                }
            );
        }
        else {
            console.log("\n***************************************************");
            console.log("*Please enter a valid amount. (i.e. 4.45, not $4.45)*");
            console.log("***************************************************\n");
            createDepartment();
        }
    });
}

  start();