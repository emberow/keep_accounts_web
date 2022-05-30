const express = require('express');
const engine = require('ejs-locals');

var operate_account_data = require('./database/account_db');
var operate_user_data = require('./database/user_data_db');

var app = express();

// 提供來源檔案的目錄，script/css的來源檔案路徑改到這裡
app.use(express.static("public"));
//設定css的來源資料夾
// app.set("css", express.static(__dirname + "public/css"));

// ejs
app.engine('ejs',engine);
app.use(express.static(__dirname + '/static'));
app.set('files','./files');
app.set('view engine','ejs');

// bodyParser 處理get post封包
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())

const session = require('express-session');
app.use(session({
  secret: 'mySecret',
  name: 'user', // optional
  saveUninitialized: false,
  resave: true, 
}));



//頁面顯示---------------------------------------------------------
//登入介面
app.get('/', function(req, res){
  if (req.session.user) {
    res.redirect('/index');
  }
  else{
    res.render('login');
  }
}); 

//建立新帳號介面
app.get('/create_account',function(req, res){
  res.render('create_account');
});

//記帳網頁
app.get('/index',function(req,res){
  account = req.session.user;
  if (req.session.user) {
    res.render('index');
  }
  else{
    res.redirect('/');
  }
  
});

app.get('/change_pwd', function(req, res){
  account = req.session.user;
  if (req.session.user) {
    res.render('change_pwd');
  }
  else{
    res.redirect('/');
  }
})

//處理ajax-------------------------------------------------------
//查詢搜尋資料庫中帳密一樣的人
app.post('/login_chk', function(req, res){
  var account = req.body.name;
  var password = req.body.password;
  const rules = /[^a-zA-X0-9_]{1}/;
  if(rules.test(account) || rules.test(password)){
    res.send({'message':"含有特殊字元"});
  }
  else{
    operate_account_data.login_chk(account, password).then(
      function(is_valid) {
        console.log(is_valid);
        if (is_valid == true){
          // 沒有找到帳戶資料回傳錯誤訊息給ajax
          req.session.user = account;
          console.log(account, password);
          res.send({'message':"登入成功"});
        }
        else{
          res.send({'message':"帳號或密碼錯誤"});
        }
      },
      function(error) {throw error}
    );
  }
});

app.post('/log_out', function(req, res){
  req.session.destroy(() => {
    res.send({'message':"登出成功"})
  })
});


//處理新增帳號
app.post('/account', function(req, res){
  var account = req.body.name;
  var password	 = req.body.pwd;
  var password_check = req.body.pwd_chk;
  const rules = /[^a-zA-X0-9_]{1}/;
  if(rules.test(account) || rules.test(password) || rules.test(password_check)){
    res.send({'message':"含有特殊字元"});
  }
  else{
    console.log(account,password,password_check)
    if (password != password_check){
      res.send({"message": "密碼與確認密碼不一致"});
    }
    else{
      operate_account_data.add_account(account, password).then(
        function(is_valid) {
          if (is_valid == true){
            // 沒有找到帳戶資料回傳錯誤訊息給ajax
            res.send({"message": "建立帳戶成功"});
          }
          else{
            res.send({"message": "帳戶已存在"});
          }
        },
        function(error) {throw error}
      );
    }
  }
});

//處理修改密碼
app.patch('/account', function(req, res){
  var account = req.session.user;
  var password	 = req.body.pwd;
  var new_password = req.body.new_pwd;
  var new_password_check = req.body.new_pwd_chk;
  const rules = /[^a-zA-X0-9_]{1}/;
  if(rules.test(account) || rules.test(password) || rules.test(new_password) || rules.test(new_password_check)){
    res.send({'message':"含有特殊字元"});
  }
  else{
    if (new_password != new_password_check){
      res.send({"message": "密碼與確認密碼不一致"});
    }
    else{
      operate_account_data.chnage_password(account, new_password).then(
        function(is_valid) {
          console.log(is_valid);
          if (is_valid == true){
            res.send({"message": "修改密碼成功"});
          }
          else{
            res.send({"message": "修改密碼失敗"});
          }
        },
        function(error) {throw error}
      );
    }
  }
});


// 使用者記帳資訊
app.get('/data', function(req,res){
  var account = req.session.user;
  const rules = /[^\u4E00-\u9FA5a-zA-X0-9_]{1}/;
  if(rules.test(account)){
    res.send({'message':"含有特殊字元"});
  }
  else{
    operate_user_data.get_user_data(account).then(
      function(user_data){
        console.log(user_data)
        res.send({"user_data": user_data});
      }
    );
  }
});

// 使用者新增紀錄
app.post('/data', function(req,res){
  var account = req.session.user;
  var item = req.body.item;
  var price = req.body.price;
  var date = req.body.date;
  var state = req.body.state;
  const rules = /[^\u4E00-\u9FA5a-zA-X0-9_]{1}/;
  if(rules.test(account) || rules.test(item) || rules.test(price) || rules.test(state)){
    res.send({'message':"含有特殊字元"});
  }
  else{
    date = new Date(date);
    date = Number(date);

    operate_user_data.add_record(account, item, price, date, state).then(
      function(id){
        res.send({"message":"新增成功","id": id});
      },
      function(err){
        console.log(err);
        res.send({"message":"新增失敗"})
      }
    )
  }
});

// 使用者修改紀錄
app.patch('/data', function(req,res){
  var id = req.body.id;
  var account = req.session.user;
  var item = req.body.item;
  var price = req.body.price;
  var date = req.body.date;
  var state = req.body.state;
  const rules = /[^\u4E00-\u9FA5a-zA-X0-9_]{1}/;
  if(rules.test(id) || rules.test(account) || rules.test(item) || rules.test(price) || rules.test(state)){
    res.send({'message':"含有特殊字元"});
  }
  else{
    console.log(id,account,item,price,date,state);
    operate_user_data.update_record(id, account, item, price, date, state).then(
      function(is_valid){
        res.send({"message":"更新成功"});
      },
      function(err){
        res.send({"message":"更新失敗"})
      }
    );
  }
});

// 使用者刪除紀錄
app.delete('/data', function(req,res){
  var id = req.body.id;
  var account = req.session.user;
  const rules = /[^\u4E00-\u9FA5a-zA-X0-9_]{1}/;
  if(rules.test(id) || rules.test(account)){
    res.send({'message':"含有特殊字元"});
  }
  else{
    operate_user_data.delete_record(id, account).then(
      function(is_valid){
        res.send({"message":"刪除成功"});
      },
      function(err){
        console.log(err);
        res.send({"message":"刪除失敗"});
      }
    );
  }
});



// check running enviroment
var port = process.env.PORT || 3000;

// create
app.listen(port);

// only print hint link for local enviroment
if (port === 3000) {
    console.log('RUN http://localhost:3000/');
}