var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host:"localhost",
    port: 3306,
    user: "root",
    password: "Dwiegercarat6",
    database: "bamazon"
})

connection.connect(function(err){
    if (err) throw err;
    console.log("Connected as id: "+ connection.threadId);
    dataInfo();
})

var dataInfo = function(){
    console.log("\n" + " WELCOME TO BAMAZON.COM!!!" + "\n");
    connection.query("SELECT * FROM products", function(err,res){
        console.log(" " + "ID" +" || " + " PRODUCT " + " || " + " DEPARTMENT " + "|| " + "PRICE" + " || " + "QUANTITY" );
        for (var i=0; i < res.length; i++){
            console.log("\n" + " " + res[i].item_id + " || " + res[i].product_name + " || " + res[i].department_name + " || " +
        res[i].price + " || " + res[i].stock_quantity) + " \n ";
        }
        askUser(res);
    })
}

var askUser = function(res){
    inquirer.prompt([{
        type: 'input',
        name: "id",
        message: "\n" + " Please select the ID number of the product you wish to purchase or enter [Q] to quit: ",
            validate: function(value) {
                var pass = value.match(/^\d+$/);
                if (pass) {
                    return true;
                } else if (value == "q") {
                    process.exit();
                } else {
                    return "Entry invalid, please enter a numeral";
                }  
            }
    }]).then(function(answer){
        for (var i=0; i<res.length;i++){
            if (res[i].item_id == answer.id) {
                console.log("You have chosen: " + res[i].product_name);
                var j = i;
                inquirer.prompt([{
                    type: 'input',
                    name: 'quantity',
                    message: '\n' + ' How many units would you like to purchase?',
                    validate: function(value) {
                        var pass = value.match(/^\d+$/);
                        if (pass) {
                            return true; 
                        }
                        return " Entry invalid, please enter a numeral";
                    }
        
                }]).then(function(answer){
                        if (answer.quantity <= res[j].stock_quantity){
                            var newAmount = res[j].stock_quantity - answer.quantity;
                            var newId = res[j].item_id
                            var purchaseAmount = res[j].price * answer.quantity;
                            connection.query("UPDATE products SET ? WHERE ?",
                            [
                                {
                                stock_quantity : newAmount
                                },
                                { item_id: newId
                                }
                            ],
                             function(err,res){
                                console.log("\n" + " The total amount of your purchase is " + purchaseAmount + " dollars" + "\n");
                                console.log(" Purchase Successful.  Enjoy!");
                                dataInfo();
                            })    
                        } else {
                        console.log(" Not enough in stock, please choose another quantity.");
                        askUser(res);
                        }  
                 })
            } 
        }
    })
}





    
       