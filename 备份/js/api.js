var _getData = {
    getProvince:function(callback){
        $.post(
            "index.php",
            {action : "get_province" },
            function (data) {
                data = eval("("+data+")");
                if(callback){
                    callback(data)
                }
            }
        );
    },
    getCity:function(callback){
        //更新vm.server_data.city这个数组
        $.post(
            "index.php",
            {action : "get_city" , province : vm.server_data.province},
            function (data) {
                data = eval("("+data+")");
                callback && callback(data)
            }
        );
    },
    getShop:function(callback){
        //更新vm.server_data.address这个数组
        $.post(
            "index.php",
            {action : "get_shop" , city : vm.server_data.city},
            function (data) {
                data = eval("("+data+")");
                callback && callback();
            }
        );
    },
};

var _uploadData = {
    addInfo:function(callback){
        $.post(
            "index.php",
            {action : "add_info" , truename : vm.server_data.name , mobile : vm.server_data.tel , shop_id : vm.server_data.shop_id},
            function (data) {
                data = eval("("+data+")");
                callback && callback();
            }
        );
    },
};