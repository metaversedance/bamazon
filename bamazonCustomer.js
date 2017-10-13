var mysql = require("mysql");
var inquirer = require("inquirer");


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
});
connection.query("SELECT * FROM products", 
 function(err, res){
      if(err) console.log("err",err);
      res.forEach(function(item){
        console.log("________________________")
        console.log("item_id: " + item.item_id);
        console.log("product_name: " + item.product_name);
        console.log("price: " + item.price);
        console.log("department_name: " + item.department_name);
        console.log("stock_quantity: " + item.stock_quantity)



      });
      inquireAnswers();
  })

function inquireAnswers(){
  // Created a series of questions
  inquirer.prompt([

    {
      type: "input",
      name: "item_id",
      message: "What is the ID of the item you would like to buy?"
    },
    {
      type: "input",
      name: "item_quantity",
      message:"What is the quantity you would like to buy?"
    }

  ]).then(function(customer) {
      var query = "SELECT * FROM products WHERE ?";
      var WHERE = { item_id: parseInt(customer.item_id)};
      
      connection.query(query,WHERE,function(err,res){
        if(res[0].stock_quantity < customer.item_quantity) {
          return console.log("not enough in stock, try again");
        }

        connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: res.stock_quantity--
            },
            {
              item_id: res.item_id
            }
          ],
          function() {
            console.log("your total cost is " + res[0].price * parseInt(customer.item_quantity))
          }
        );

      })
  });

}


// connection.query("SELECT * FROM inventory WHERE ?", 
//     {
//       id: itemID
//     }, function(err, res){
//       if(err) console.log("err",err);
//       console.log(res);
//   })