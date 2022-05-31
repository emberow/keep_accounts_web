
const database_name = "keep_accounts_database";
const mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
});
create_database(database_name,connection);
connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database: database_name
});
create_table(connection);
function create_database(db_name, con){
    sql = `CREATE DATABASE ${db_name} DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;`
    con.query(sql, function (err, result) {
        console.log("database created");
        });

}

function create_table(con){
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        
        var sql = "CREATE TABLE expense_income_record (id INT AUTO_INCREMENT PRIMARY KEY, account VARCHAR(20), item varchar(20), price int(10), date decimal(20,0),	state varchar(10))";
        con.query(sql, function (err, result) {
            console.log("Table created");
            });

        sql = "CREATE TABLE account (name VARCHAR(20), password	varchar(20))";
        con.query(sql, function (err, result) {
            console.log("Table created");
            });
      });
}
