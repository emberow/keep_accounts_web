const { user } = require("pg/lib/defaults");
var typeorm = require("typeorm");
var databaseConfig = typeorm.createConnection({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "32865417",
  database: "keepAccounts",
  synchronize: true,
  entities: [
      require("../entity/expense_income_record")
  ]
});


exports.get_user_data = async function(account){
    return databaseConfig.then(
        function(connection){
            var postRepository = connection.getRepository("expense_income_record");
            let data = postRepository.find({
                select: ["id", "account", "item", "price", "date", "state"],
                where: {account: account}
            }).then(
                function(data){
                    data.forEach(element => element["price"] = Number(element["price"]));
                    return data;
                }
            )
            return data;
        }
    )
  }
  
exports.add_record = async function(account, item, price, date, state){
    return typeorm.getConnection()
    .createQueryBuilder()
    .insert()
    .into("expense_income_record")
    .values({account: account, item: item, price: price, date: date, state: state})
    .returning("id")
    .execute().then(
        function(id){
            return id["raw"][0]["id"];
        }
    );
}
  
exports.update_record = async function(id,account,item,price,date,state){
    return typeorm.getConnection()
    .createQueryBuilder()
    .update("expense_income_record")
    .set({account: account, item: item, price: price, date: date, state: state})
    .where(`id = ${id}`)
    .execute().then(
        function(id){
            return id["raw"][0]["id"];
        }
    );
}
  
exports.delete_record = async function(id, account){
    return typeorm.getConnection()
    .createQueryBuilder()
    .delete()
    .from("expense_income_record")
    .where(`id = ${id} AND account = '${account}'`)
    .execute();
}