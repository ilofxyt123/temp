!function(){
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
}()
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
    this.preloadImage = function(ImageURL,callback,realLoading){
        var rd = realLoading||false;
        var i,j,haveLoaded = 0;
        var $num = $(".num");
        for(i = 0,j = ImageURL.length;i<j;i++){
            (function(img, src) {
                img.onload = function() {
                    haveLoaded+=1;
                    var num = Math.ceil(haveLoaded / ImageURL.length* 100);
                    if(rd){
                        $num.html("- "+num + "% -");
                    }
                    if (haveLoaded == ImageURL.length && callback) {
                        setTimeout(callback, 500);
                    }
                };
                img.onerror = function() {};
                img.onabort = function() {};

                img.src = src;
            }(new Image(), ImageURL[i]));
        }
    },//图片列表,图片加载完后回调函数，是否需要显示百分比
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
    this.ImageLoader = function ImageLoader(){
        this.total = 0;
        this.haveload = 0;
        this.percent = 0;
        this.complete = false;
        this.version = "?v1";
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

            if( _this.percent == 100 ){
                _this.complete = true;
                onComplete(result)
                return;
            }

            start()

        }

        function start(){
            var img = new Image();
            img.onload = onLoad;
            img.src = urls[_this.haveload].url
            if( urls[_this.haveload].name ){
                img["name"] = urls[_this.haveload].name
            }
            if( urls[_this.haveload].direction ){
                img["dir"] = urls[_this.haveload].direction
            }
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
        },
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
        },
        this.playMedia=function(id){
            var _self = this;
            var clock = setInterval(function(){
                if(_self.mutedEnd){
                    Utils.g(id).play()
                    clearInterval(clock);
                }
            },20)
        }
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
                {province:"江西省"},
                {province:"浙江省"},
                {province:"江苏省"}
            ],
            city:[
                {city:"杭州市"},
                {city:"嘉兴市"},
                {city:"温州市"}
            ],
            address:[
                {id:"1",name:"门店名称"},
                {id:"2",name:"门店名称"},
                {id:"3",name:"门店名称"}
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

        /*页面切换控制*/
        pwebgl:{
            visible:false,
        },
        p1:{
            visible:false,
        },
        p2:{
            visible:false,
        },
        pfill:{
            visible:false,
        },
        pend:{
            visible:false,
        },
        pquery:{
            visible:false,
        },
        paddress:{
            visible:false,
        },
        pvideo:{
            visible:false,
        },
        prule:{
            visible:false,
        },
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
var vm = new Vue( options );
var main = new function(){

    this.ios = Utils.browser("ios")
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

    this.isOnline = false;
    this.version = "";

    this.cdnUrl = "";
    this.assetsUrl = this.isOnline ? this.cdnUrl + "assets/" : "assets/";
    this.picUrl = this.assetsUrl + "images/";//图片路径
    this.videoUrl = this.assetsUrl + "video/"

    this.ImageList = [
        {
            url:this.picUrl+"bg.jpg" + this.version,
            group:"0"
        },
    ]
    this.ImageResult = {};

    this.RAF = undefined;


};
/***********************流程***********************/
main.init=function(){

};
main.start=function(){

    var loader = new Utils.ImageLoader();
    var _this = this;

    loader.load( _this.ImageList, onProgress, onLoad )

    function onProgress( percent ) {

        console.log( percent )

    }
    function onLoad( result ) {

        setTimeout(function(){

            _this.ImageResult = result
            _this.loadCallBack()

        },500)

    }

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
main.playbgm=function(){
    this.playMediaInWx(this.bgm.obj);
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

    document.body.ontouchmove = function( e ){

        e.preventDefault();

    }

    $( window ).resize( function() {

        resetDom()

    } )

    resetDom()
    function resetDom(){

        var win_w = window.innerWidth,
            win_h = window.innerHeight;

        //竖屏
        if( win_w < win_h ){

            $(".qiangzhihengping").css({
                width:win_h+"px",
                height:win_w+"px",
                transformOrigin:"left top",
                transform:"translate3d("+ win_w +"px,0,0) rotate(90deg)"
            })

            $(".qiangzhishuping").css({
                width:"100%",
                height:"100%",
                transformOrigin:"left top",
                transform:""
            })

            $(".qiangzhihengping2").css({
                width: win_h + "px",
                transformOrigin: "left top",
                transform: "translate3d(" + win_w + "px,0,0) rotate(90deg)"
            });

        }

        //横屏
        else {
            $(".qiangzhihengping").css({
                width:"100%",
                height:"100%",
                transformOrigin:"left top",
                transform:""
            })

            $(".qiangzhishuping").css({
                width:win_h+"px",
                height:win_w+"px",
                transformOrigin:"left top",
                transform:"translate3d(0,"+ win_h +"px,0) rotate(-90deg)"
            })

            $(".qiangzhihengping2").css({width: "100%", transformOrigin: "left top", transform: ""});
        }


    }

    // $(window).on("orientationchange",function(e){
    //     if(window.orientation == 0 || window.orientation == 180 ) {
    //         vm.hpwarn.visible = false;
    //     }
    //     else if(window.orientation == 90 || window.orientation == -90) {
    //         vm.hpwarn.visible = true;
    //     }
    // });

};
main.scrollInit = function(selector,start){
    this.touch.ScrollObj = $(selector);
    this.touch.container = $(selector).parent();
    this.touch.StartY = 0;
    this.touch.NewY = 0;
    this.touch.addY = 0;
    this.touch.scrollY = 0;
    this.touch.limitDown = this.touch.ScrollObj.height()<this.touch.container.height()?0:(this.touch.container.height()-this.touch.ScrollObj.height());
};
main.playMediaInWx = (function( ){

    var hasBind = false;

    return function( dom ){

        dom.currentTime = 0;

        if( typeof WeixinJSBridge != "undefined" ){

            WeixinJSBridge.invoke( "getNetworkType", {}, function () {

                dom.play()

            })

        } else {

            if( !hasBind ){

                hasBind = true;
                document.addEventListener("WeixinJSBridgeReady",function(){
                    dom.play()
                },false)

            }


            dom.play()

        }

    }

})()
/***********************功能***********************/


$( function() {

    main.init()
    main.addEvent()
    main.start()

} )








