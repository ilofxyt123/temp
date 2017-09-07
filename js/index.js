var onJQAnimationEndHandle = function( option ){
    switch( option.type ){
        case "fadeIn":
            this.removeClass("opacity "+option.ani);
            break;
        case "fadeOut":
            this.hide().removeClass(option.ani);
            break;
    }
    if(option.callback){
        option.callback.call(this);
    };
    this.off("webkitAnimationEnd").css({
        animationDuration:""
    });
};
$.fn.extend({
    fi:function(option){
        var _this = this;
        var options = {
            ani:"ani-fadeIn",
            duration:"500",
            callback:undefined,
            type:"fadeIn"
        };
        if(option){
            jQuery.extend(options,option);
        }
        this.on("webkitAnimationEnd", function( e ){
            e.stopPropagation();
            onJQAnimationEndHandle.call(_this,options)
        }).css({
            animationDuration:options.duration+"ms",
        }).addClass("opacity " + options.ani).show();
        return this;
    },
    fo:function(option){
        var _this = this;
        var options = {
            ani:"ani-fadeOut",
            duration:"500",
            callback:undefined,
            type:"fadeOut"
        };
        if(option){
            jQuery.extend(options,option);
        }
        this.on("webkitAnimationEnd",function( e ){
            e.stopPropagation();
            onJQAnimationEndHandle.call(_this,options)
        }).css({
            animationDuration:options.duration+"ms",
        }).addClass(options.ani);
        return this;
    }
});
if ( Object.assign === undefined ) {

    // Missing in IE
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign

    ( function () {

        Object.assign = function ( target ) {

            'use strict';

            if ( target === undefined || target === null ) {

                throw new TypeError( 'Cannot convert undefined or null to object' );

            }

            var output = Object( target );

            for ( var index = 1; index < arguments.length; index ++ ) {

                var source = arguments[ index ];

                if ( source !== undefined && source !== null ) {

                    for ( var nextKey in source ) {

                        if ( Object.prototype.hasOwnProperty.call( source, nextKey ) ) {

                            output[ nextKey ] = source[ nextKey ];

                        }

                    }

                }

            }

            return output;

        };

    } )();

}
var Utils = new function(){
    this.ImageLoader = function ImageLoader(){
        this.total = 0;
        this.haveload = 0;
        this.percent = 0;
        this.complete = false;
        this.version = "?v1";
    };
    this.lazyLoad = function(){
        var a = $(".lazy");
        var len = a.length;
        var imgObj;
        var Load = function(){
            for(var i=0;i<len;i++){
                imgObj = a.eq(i);
                imgObj.attr("src",imgObj.attr("data-src"));
            }
        };
        Load();
    };//将页面中带有.lazy类的图片进行加载
    this.browser = function(t){
        var u = navigator.userAgent;
        var u2 = navigator.userAgent.toLowerCase();
        var p = navigator.platform;
        var browserInfo = {
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
            iosv: u.substr(u.indexOf('iPhone OS') + 9, 3),
            weixin: u2.match(/MicroMessenger/i) == "micromessenger",
            taobao: u.indexOf('AliApp(TB') > -1,
            win: p.indexOf("Win") == 0,
            mac: p.indexOf("Mac") == 0,
            xll: (p == "X11") || (p.indexOf("Linux") == 0),
            ipad: (navigator.userAgent.match(/iPad/i) != null) ? true : false
        };
        return browserInfo[t];
    };//获取浏览器信息
    this.g=function(id){
        return document.getElementById(id);
    };
    this.limitNum=function(obj){//限制11位手机号
        var value = $(obj).val();
        var length = value.length;
        //假设长度限制为10
        if(length>11){
            //截取前10个字符
            value = value.substring(0,11);
            $(obj).val(value);
        }
    };
};
Object.assign( Utils.ImageLoader.prototype,{

    load: function( urls, onEveryLoad, onComplete){
        var result = {
            0:[]
        };

        this.total = urls.length;

        var _this = this;

        start();

        function onLoad( e ){

            if( Object.prototype.hasOwnProperty.call( urls[_this.haveload], "group" ) ){
                var group = urls[_this.haveload].group;
                if(result[group] instanceof Array == false){
                    result[group] = [];
                }
                result[group].push(this)
            }else{
                result[0].push( this );
            }

            _this.haveload++;
            _this.percent = Math.floor(_this.haveload/_this.total*100);
            onEveryLoad(_this.percent);
            this.onload = null;

            if(_this.percent == 100){
                _this.complete = true;
                onComplete(result)
                return;
            }
            var img = new Image();
            img.onload = onLoad;
            img.src = urls[_this.haveload].url+_this.version;


        }

        function start(){
            var img = new Image();
            img.onload = onLoad;
            img.src = urls[_this.haveload].url+_this.version;
        }

    }

});
var Media = new function(){
    this.mutedEnd = false;
    this.WxMediaInit=function(){

        var _self = this;
        if(!Utils.browser("weixin")){
            this.mutedEnd = true;
            return;
        }
        if(!Utils.browser("iPhone")){
            _self.mutedEnd = true;
            return;
        }
        document.addEventListener("WeixinJSBridgeReady",function(){
            var $media = $(".iosPreload");
            $.each($media,function(index,value){
                _self.MutedPlay(value["id"]);
                if(index+1==$media.length){
                    _self.mutedEnd = true;
                }
            });
        },false)
    };
    this.MutedPlay=function(string){
        var str = string.split(",");//id数组
        var f = function(id){
            var media = Utils.g(id);
            media.volume = 0;
            media.play();
            // setTimeout(function(){
            media.pause();
            media.volume = 1;
            media.currentTime = 0;
            // },100)
        };
        if(!(str.length-1)){
            f(str[0]);
            return 0;
        }
        str.forEach(function(value,index){
            f(value);
        })
    };
    this.playMedia=function(id){
        var _self = this;
        var clock = setInterval(function(){
            if(_self.mutedEnd){
                Utils.g(id).play()
                clearInterval(clock);
            }
        },20)
    };
};
Media.WxMediaInit();

var options = {
    el:"#iCreative",
    data:{
        server_data:{
            is_end : !!parseInt($("#is_end").val()),//活动是否结束
            have_guanzhu : !!parseInt($("#have_guanzhu").val()),//是否关注了公众号
            isVip : !!parseInt($("#is_vip").val()),//是否注册过
            goRegist : !!parseInt($("#goRegist").val()),//出去注册了一下
            haveFill : !!parseInt($("#haveFill").val()),//是否填写过中奖信息
            prizeType:parseInt($("#prizeType").val()),//奖品类型
            province:[
                // {province:"江西省"},
                // {province:"浙江省"},
                // {province:"江苏省"}
            ],
            city:[
                // {city:"杭州市"},
                // {city:"嘉兴市"},
                // {city:"温州市"}
            ],
            address:[
                // {id:"1",name:"门店名称"},
                // {id:"2",name:"门店名称"},
                // {id:"3",name:"门店名称"}
            ],
            name:'',
            tel:'',

            select_province:'',//视图上选中省份String,该字段即时更新
            select_city:'',
            select_address:'',
            shop_id:0,
            myInfo:{
                province:"",
                city:"",
                shop:"",
            },
        },
        ios:Utils.browser("ios"),
        /*页面切换控制*/
        ploading:{
            visible:false,
        },
        pwebgl:{
            visible:false,
        },
        p1:{
            visible:false,
        },
        p2:{
            visible:false,
        },
        pprize:{
            visible:false,
        },
        pfill:{
            visible:false,
        },
        paddress:{
            visible:false,
        },
        pvideo:{
            visible:false,
        },
        pend:{
            visible:false,
        },
        pshare:{
            visible:false,
        },
        pquery:{
            visible:false,
        },
        pguanzhu:{
            visible:false,
        },
        prule:{
            visible:false,
        },

        palert:{
            visible:false,
            type:"",
            choice:{
                fill:"fill",
                normal:"normal",
                reg:"reg",
            },
            fontSize:"",
            content:"",//主文字
            title:"",//标题
            txt: {
                fill:"你还未填写领奖信息，<br>赶快去填写吧",
                reg:"为了确保星球领奖者的真实性,<br>系统需要进行实名认证,<br>请填写个人真实信息领取奖品!"
            }
        },
        isResult:false,
        hpwarn:{
            visible:false,
        },
        pwait:{
            visible:false,
        },
        /*页面切换控制*/
        pages:{
            p1:'p1',
            p2:'p2',
        },//可选的后退页
        router:[],//管理后退栈

    },
    methods:{
                                            /*提交信息页*/
        pfill_btn_submit:function(){
            var number = this.server_data.tel;
            var name = this.server_data.name;
            var patt = /^1(3|4|5|7|8)\d{9}$/;

            if(name == ""){
                this.pmask.type = this.pmask.choice.normal;
                this.pmask.content = "请输入姓名";
                this.pmask.visible = true;
                return;
            };
            if(!(patt.test(number))){
                this.pmask.type = this.pmask.choice.normal;
                this.pmask.content = "请输入正确的手机号";
                this.pmask.visible = true;
                return;
            };
            if(this.server_data.select_province == ""){
                this.pmask.type = this.pmask.choice.normal;
                this.pmask.content = "请选择省份";
                this.pmask.visible = true;
                return;
            }
            if(this.server_data.select_city == ""){
                this.pmask.type = this.pmask.choice.normal;
                this.pmask.content = "请选择城市";
                this.pmask.visible = true;
                return;
            }
            if(this.server_data.select_address == ""){
                this.pmask.type = this.pmask.choice.normal;
                this.pmask.content = "请选择门店";
                this.pmask.visible = true;
                return;
            }

            _uploadData.fillInfo();

        },
        onPfillProvinceChangeHandle:function(e){
            console.log(this.server_data.select_province)
            // _getData.getCity(this.server_data.select_province)
        },
        onPfillCityChangeHandle:function(e){
            console.log(this.server_data.select_city)
            // _getData.getAddress(this.server_data.select_city)
        },
        onPfillAddressChangeHandle:function(e){
            this.server_data.shop_id = e.target.selectedOptions[0].getAttribute("shopid");
            console.log(this.server_data.select_address)
        },

                                           /*查询可使用门店页*/
        onPaddress_btn_xx:function(){
            this.paddress.visible = false;
        },

                                           /*后退*/
        back:function(){
            var len = this.router.length;
            if(len>0){
                var page = this.router[len-1];
                this[page].visible = true;
                this.router.splice(len-1,1)
            }
        }
    },
    delimiters: ['$[', ']']
}
var vm = new Vue(options);
var main = new function(){

    this.touch ={
        ScrollObj:undefined,
        isScroll:false,
        limitUp:0,
        limitDown:undefined,
        overlimit:false,
        lastX:0,
        lastY:0,
        newX:0,
        newY:0,
        delta_X:0,
        delta_Y:0,
        scrollY:0,
        touchAllow:true,
        fingerNumber:0,
        distance:0,
        angle:0,
        delta_angle:0,
        time:0,
        offsetTime:0,
    };

    this.bgm ={
        obj:document.getElementById("bgm"),
        id:"bgm",
        isPlay:false,
        button:$(".music-btn")
    };
    this.V = {//视频
        id:"video",
        currentTime:0,
        isPlay:false,
        obj:document.getElementById("video")
    };

    this.assetsUrl = "assets/";
    this.picUrl = this.assetsUrl + "images/";//图片路径
    this.ImageList = [
        {
            url:this.picUrl+"weile.png",
            group:"clouds"
        }, {
            url:this.picUrl+"phone.png",
            group:"scene"
        }
    ];

    this.RAF = undefined;
};
/***********************流程***********************/
main.init=function(){

};
main.start=function(){
    var loader = new ImageLoader();

    loader.load(this.ImageList,function(progress){
        console.log(progress)
    },function(result){
        console.log(result)
    });

};
main.loadCallBack = function(){};
main.prule = function(){
    $(".P_rule").fi();
    main.scrollInit(".rule-txt",0)
};
main.prulelaeve = function(){
    $(".P_rule").fo(function(){
        $(".rule-txt")[0].style.webkitTransform="translate3d(0,0,0)";
    });
};
/***********************流程***********************/

/***********************功能***********************/
main.scrollInit=function(selector){
    this.touch.ScrollObj = $(selector);
    this.touch.container = $(selector).parent();
    this.touch.StartY = 0;
    this.touch.NewY = 0;
    this.touch.addY = 0;
    this.touch.scrollY = 0;
    this.touch.limitDown = this.touch.ScrollObj.height() < this.touch.container.height() ? 0 :(this.touch.container.height()-this.touch.ScrollObj.height());
};
main.limitNum = function(obj){//限制11位手机号
    var value = obj.value;
    var length = value.length;
    //假设长度限制为10
    if(length>11){
        //截取前10个字符
        value = value.substring(0,11);
        obj.value = value;
    }
};//限制手机号长度
main.playbgm=function(){
    Media.playMedia(this.bgm.id);
    this.bgm.button.addClass("ani-bgmRotate");
    this.bgm.isPlay = true;
};
main.pausebgm=function(){
    this.bgm.obj.pause();
    this.bgm.button.removeClass("ani-bgmRotate");
    this.bgm.isPlay = false;
};
main.startRender = function(){
    var loop = function(){
        main.RAF = window.requestAnimationFrame(loop)
    };
    loop();
};
main.stopRender = function(){
    window.cancelAnimationFrame(main.RAF);
};
main.addEvent=function(){
    $(window).on("orientationchange",function(e){
        if(window.orientation == 0 || window.orientation == 180 ) {
            vm.hpwarn.visible = false;
        }
        else if(window.orientation == 90 || window.orientation == -90) {
            vm.hpwarn.visible = true;
        }
    });
};
/***********************功能***********************/

main.addEvent();
main.init();











