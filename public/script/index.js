// 頁面加載結束才執行function
window.onload = get_data();
// 使用者記帳資訊
var user_data;

var date = new Date();
var time = [ date.getFullYear(), date.getMonth()+1];
if(time[1] >= 1 && time[1]<=9){
    document.getElementById("time").innerHTML = String(time[0]) + " / 0" + String(time[1]);
}
else{
    document.getElementById("time").innerHTML = String(time[0]) + " / " + String(time[1]);
}



function change_month(direction){
    var rear = user_data.length;
    var front = 0;
    if(direction == 'left'){
        time[1] -= 1;
    }
    else if(direction == 'right'){
        time[1] += 1;
    }
    else if(direction == 'middle'){
        date = new Date();
        time = [ date.getFullYear(), date.getMonth()+1];
        document.getElementById("time").innerHTML = String(time[0]) + " / " + String(time[1]);
    }
    
    if(time[1] == 0){
        time[1] = 12;
        time[0] -= 1;
    }
    else if(time[1] == 13){
        time[1] = 1;
        time[0] += 1;
    }

    if(time[1] >= 1 && time[1]<=9){
        document.getElementById("time").innerHTML = String(time[0]) + " / 0" + String(time[1]);
    }
    else{
        document.getElementById("time").innerHTML = String(time[0]) + " / " + String(time[1]);
    }

    print_accounting_data();
}

function log_out(req){
    $.ajax({
        url: '/log_out',
        data:"",  
        type : "post", 
        dataType:'json', 
        error:function(){   
            alert("連接server失敗");
        },
        success:function(data){   
            var log_out_form = document.createElement("form");
            log_out_form.action = '/';      
            log_out_form.target = "_self";
            log_out_form.method = "get";      
            document.body.appendChild(log_out_form);
            log_out_form.submit();     
        }
    });

    
}

function change_password(){
    var form = document.createElement("form");
    form.action = '/change_pwd';      
    form.target = "_self";
    form.method = "get";      
    document.body.appendChild(form);
    form.submit();     
}


// 依照日期將使用者資料排序
function user_data_sort(){
    if (user_data.length == 1){
        return;
    }
    user_data = user_data.sort(function(a,b){
        return a['date'] < b['date'] ? 1 : -1;
    })

    // 同一天日期裡用id排序
    for(var i = 0; i < user_data.length; i++){
        user_data[i]['event'] = user_data[i]['event'] = user_data[i]['event'].sort(function(a,b){
            return a['id'] < b['id'] ? 1 : -1;
        })
    }
}


//從伺服器拿取帳戶記帳資訊並存到 user_data裡面
function get_data(){
    
    // 日期預設值改為今天
    var date = new Date();
    var this_month = date.getMonth()+1;
    var this_date = date.getDate();
    if(this_month < 10){
        this_month = '0' + this_month;
    }
    if(this_date < 10){
        this_date = '0' + this_date;
    }
    var str_today = date.getFullYear() + "-" + this_month + "-" + this_date;
    $('#date').attr('value', str_today);

    var name = $('#account').val();
        $.ajax({
        url: "/data?name="+name,

        // data:"&name="+name,  
        type : "get", 
        dataType:'json', 
        error:function(){   
            document.getElementById("accounting_table").innerHTML = "連接server失敗";
        },
        success:function(data){   
            console.log(data);
            // user_data = {id: 56, account: 'andy', item: 'aaa', price: 123, date: 1643155200000, …}
            user_data = data['user_data'];

            // activity_time = [1643328000000, 1643241600000, 1643155200000]
            var activity_time = [];

            //將日期一樣的事件歸類在同一塊
            // temp_user_data = [{date: 1643155200000, event: [{id: 56, item: 'aaa', price: 123}, {id: 57, item: 'aaa', price: 123}, ...], total_price: money}, ...]
            temp_user_data = [];
            for(var i = 0; i < user_data.length; i++){
                if(activity_time.includes(user_data[i]['date'])){
                    daily_user_data['event'].push({'id': user_data[i]['id'], 'item': user_data[i]['item'], 'price': user_data[i]['price'], 'state': user_data[i]['state']});
                    
                }
                else{
                    activity_time.push(user_data[i]['date']);
                    var daily_user_data = new Object();
                    daily_user_data['date'] = user_data[i]['date'];
                    daily_user_data['event'] = [];
                    daily_user_data['event'].push({'id': user_data[i]['id'], 'item': user_data[i]['item'], 'price': user_data[i]['price'], 'state': user_data[i]['state']});
                    daily_user_data['total_price'] = 0;
                    temp_user_data.push(daily_user_data);
                }
                if(user_data[i]['state'] == 'income'){
                    daily_user_data['total_price'] += user_data[i]['price'];
                }
                else if(user_data[i]['state'] == 'expense'){
                    daily_user_data['total_price'] -= user_data[i]['price'];
                }
            }
            user_data = temp_user_data;
            print_accounting_data();
        }
    });
}

//印出帳戶記帳資訊
function print_accounting_data(){
    var accounting_table = "";
    var total_expense = 0;
    var total_income = 0;
    var date_lowerbound = new Date(time[0], time[1]-1, 1);
    var date_upperbound = new Date(time[0], time[1], 1);
    var is_no_info = true;
    // i一樣 日期一樣
    for(var i = 0; i < user_data.length; i++){

        // j代表同一天不同事件
        var date = user_data[i]['date'];
        // 只會顯示日期符合範圍的紀錄
        date = Number(date);
        if(date >= Number(date_lowerbound) && date < Number(date_upperbound)){
            is_no_info = false;
            date = new Date(date);
            accounting_table += "<br><table>";
            var month = date.getMonth()+1;
            accounting_table += "<tr><td class='form_title left'>" + date.getFullYear() + "/" + month + "/" + date.getDate() + "<td class='form_title right'>" + "$" + user_data[i]['total_price'];
            for(var j = 0; j < user_data[i]['event'].length; j++){
                var id = user_data[i]['event'][j]['id'];
                var item = user_data[i]['event'][j]['item'];
                var price = Number(user_data[i]['event'][j]['price']);
                var state = user_data[i]['event'][j]['state'];
                accounting_table += "<tr onclick=" + "show_update_form(" + id + ",'" + item + "'," + price + "," + Number(date) + ",'" + state + "')" +"><td class='left'>"+ item + "<td class='right'>";
                if(state == "income"){
                    accounting_table += "$ +" + price;
                    total_income += price
                }
                else if(state == "expense"){
                    accounting_table += "$ -" + price;
                    total_expense += price
                }
            }
        }
        
        
        accounting_table += "</table>"
    }
    if(is_no_info != true){
        document.getElementById("accounting_table").innerHTML = accounting_table;    
    }
    else{
        document.getElementById("accounting_table").innerHTML = "<table><tr><td>本月無資料</table>";    
    }
    document.getElementById("total_expense").innerHTML = "$" + total_expense;    
    document.getElementById("total_income").innerHTML = "$" + total_income;   
}

//刷新使用者記帳資訊
function reload(){
    print_accounting_data();
}

// client端新增record
function local_add_record(id, item, price, date, state){
    date = new Date(date);
    date = Number(date);
    price = Number(price);

    // 先前有事件的日期與新增事件一樣時
    for(var i = 0; i < user_data.length; i++){
        if(user_data[i]['date'] == date){
            user_data[i]['event'].push({"id": id, "item": item, "price": price, "date": date, "state": state});
            if(state == 'income'){
                user_data[i]['total_price'] += price;
            }
            else if(state == 'expense'){
                user_data[i]['total_price'] -= price;
            }
            break;
        }
        // 當此事件與其他事件的日期皆不同時，創造一個物件
        else if(i == user_data.length-1){
            var daily_user_data = new Object();
            daily_user_data['date'] = date;
            daily_user_data['event'] = [];
            daily_user_data['event'].push({'id': id, 'item': item, 'price': price, 'state': state});
            if(state == 'income'){
                daily_user_data['total_price'] = price;
            }
            else if(state == 'expense'){
                daily_user_data['total_price'] = -price;
            }
            user_data.push(daily_user_data);
            console.log(daily_user_data);
            break;
        }
    }

    if(user_data.length == 0){
        var daily_user_data = new Object();
            daily_user_data['date'] = date;
            daily_user_data['event'] = [];
            daily_user_data['event'].push({'id': id, 'item': item, 'price': price, 'state': state});
            if(state == 'income'){
                daily_user_data['total_price'] = price;
            }
            else if(state == 'expense'){
                daily_user_data['total_price'] = -price;
            }
            user_data.push(daily_user_data);
    }
    // 先使用日期排序
    user_data_sort();
}

// client端修改record
function local_update_record(id, item, price, date, state){
    local_delete_record(id);
    local_add_record(id, item, price, date, state);
    esc_button();
}

// client端刪除record
function local_delete_record(id){
    var to_remove;
    for(var i = 0; i < user_data.length; i++){
        for(var j = 0; j < user_data[i]['event'].length; j++){
            if(user_data[i]['event'][j]['id'] == id){
                var price = Number(user_data[i]['event'][j]['price']);
                var state = user_data[i]['event'][j]['state'];
                if (state == 'income'){
                    user_data[i]['total_price'] -= price;
                }
                else if(state == 'expense'){
                    user_data[i]['total_price'] += price;
                }
                
                to_remove = user_data[i]['event'][j];
                user_data[i]['event'] = user_data[i]['event'].filter(function(item){
                    return item != to_remove;
                })
                //當刪除當天唯一一個事件時，刪除這天日期裡的所有資訊
                if(user_data[i]['event'].length == 0){
                    user_data = user_data.filter(function(item){
                        return item != user_data[i];
                    })
                }
                break;
            }
        }
    }
}

// server新增record
function add_record(){
    // 同一個按鈕不能寫2個onclick
    var account = $('#account').val();
    var item = $('#item').val();
    var price = $('#price').val();
    var date = $('#date').val();
    var state = $("input:checked").val();
    
    if(item == "" || price == "" || date == "" || state == undefined){
        alert("欄位未填寫完整");
    }
    else{
        document.getElementById("txtHint").innerHTML = "";
        $.ajax({
            url: '/data',
            data:"&account="+ account + "&item=" + item + "&price=" + price + "&date=" + date + "&state=" + state,  
            type : "POST", 
            dataType:'json', 
            error:function(){   
            },
            success:function(data){
                if(data['message'] == "含有特殊字元"){
                    alert(data['message']);
                }
                else{
                    var id = data['id'];
                    esc_button();
                    local_add_record(id, item, price, date, state);
                    console.log(user_data);
                    alert(data['message']);
                    reload();
                }
            }
        });
    }
}

// server修改record
function update_record(){
    var id = $('#id').val();
    var account = $('#account').val();

    var update_item = $('#update_item').val();
    var update_price = $('#update_price').val();
    var update_date = $('#update_date').val();

    if(update_item == "" || update_price == "" || update_date == ""){
        document.getElementById("update_txtHint").innerHTML = "欄位未填寫完整";
    }
    else{
        update_date = new Date(update_date);
        update_date = Number(update_date)
    
        if($("#update_income").is(":checked")){
            var update_state = "income";
        }
        else if($("#update_expense").is(":checked")){
            var update_state = "expense";
        }
        $.ajax({
            url: '/data',
            data:"&id="+id+"&account="+account+"&item="+update_item+"&price="+update_price+"&date="+update_date+"&state="+update_state,  
            type : "patch", 
            dataType:'json', 
            error:function(){   
            },
            success:function(data){  
                if(data['message'] == "含有特殊字元"){
                    alert(data['message']);
                }
                else{ 
                    local_update_record(id, update_item, update_price, update_date, update_state);
                    console.log(user_data);
                    alert("修改成功");
                    reload();
                }
            }
        });
    }
}

// server刪除record
function delete_record(){
    var id = $('#id').val();
    var account = $('#account').val();
    $.ajax({
        url: '/data',
        data:"&id="+id+"&account="+account,  
        type : "delete", 
        dataType:'json', 
        error:function(){   
        },
        success:function(data){   
            if(data['message'] == "含有特殊字元"){
                alert(data['message']);
            }
            else{
                alert(data['message']);
                console.log(data['message']);
                local_delete_record(id);
                reload();
            }
            
        }
    });
}

// 當按下記帳table其中一條時 會到修改介面
function show_update_form(id, item, price, date, state){
    console.log(id, item, price, date, state);
    $('#update_txtHint').html("");
    $('.update_form').css({
        "display":"block"
    });
    $('.add_form').css({
        "display":"none"
    });
    var new_date = new Date(date);
    var this_month = new_date.getMonth()+1;
    var this_date = new_date.getDate();
    if(this_month < 10){
        this_month = '0' + this_month;
    }
    if(this_date < 10){
        this_date = '0' + this_date;
    }
    var str_date = new_date.getFullYear() + "-" + this_month + "-" + this_date;

    $('#update_item_title').html("項目("+ item +"):");
    $('#update_price_title').html("項目("+ price +"):");
    $('#update_date_title').html("項目("+ str_date +"):");

    $('#id').val(id);
    $('#update_item').val(item);
    $('#update_price').val(price);
    $('#update_date').val(str_date);
    if (state == "income"){
        $("#update_income").prop("checked", true);
    }
    else if(state == "expense"){
        $("#update_expense").prop("checked", true);
    }
    document.querySelector('.update_form').style.display = 'block';
    // 同一個按鈕不能寫2個onclick
    // document.querySelector('.add_form').style.display = 'none';
    // update_record(id, item, price, date, state);
}

function add_form_button(){
    $('.add_form').css({
        "display":"block"
    });
    $('.update_form').css({
        "display":'none'
    });
    $('#txtHint').html("");
    // 預設為支出
    $("#expense").prop("checked", true);
}

function esc_button(){
    $('.add_form').css({
        "display":'none'
    });
    $('.update_form').css({
        "display":'none'
    });
}

// function get_cookie(){
//     let decodedCookie = decodeURIComponent(document.cookie);
//     console.log(decodedCookie);
//     console.log("adwa")
// }


