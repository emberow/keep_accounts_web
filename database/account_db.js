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
      require("../entity/account")
  ]
});

exports.login_chk = async function(name, inputPassword){
  return databaseConfig.then(
    //使用typeORM去資料庫拿到該使用者的真正密碼
    function(connection){
    var postRepository = connection.getRepository("account");
    let password = postRepository.find(
      {select: ["name", "password"],
        where: { name: name}});
    return password;
  })
  .then(
    // 判斷密碼是否正確
    function(password){
      if(password.length != 0){
        password = password[0].password;
        if(inputPassword == password){
          return true;
        }
        else{
          return false;
        }
      }
      else{
        return false;
      }
    }
  )
}

exports.add_account = async function(name, password){
  return databaseConfig.then(
    //判斷是否可以建立該帳號
    function(connection){
    var postRepository = connection.getRepository("account");

    let isNameValid = postRepository.find(
      {select: ["name"],
        where: { name: name}})
        .then(function(data){
          return data.length == 0;
        })
        .then(
          function(isNameValid){
            if(isNameValid == true){
              postRepository.insert({name:name, password: password});
              return true;
            }
            else{
              return false;
            }
          }
        );
    return isNameValid;
  })
}

exports.chnage_password = async function(name, password){
  console.log(name, password)
  return databaseConfig.then(
    //判斷是否可以建立該帳號
    function(connection){
    var postRepository = connection.getRepository("account");
    postRepository.save({name: name, password: password});
    return true;
  })
}

