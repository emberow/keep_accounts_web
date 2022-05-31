var typeorm = require("typeorm");

typeorm.createConnection({
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
    return typeorm.getConnection()
    .createQueryBuilder()
    .select("expense_income_record")
    .from("expense_income_record", "expense_income_record")
    .where("expense_income_record.account = :account", { account: account })
    .getMany().then(
        function(data){
            return data;
        }
    );
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
    .where("expense_income_record.id = :id", {id: id})
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
    .where("expense_income_record.id = :id ANd expense_income_record.account = :account", {id: id, account: account})
    .execute();
}