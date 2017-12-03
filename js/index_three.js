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
    },
    methods:{
        /*活动规则*/
        top_btn_rule:function(){
            this.prule.visible = true;
            if(!main.scroll){
                main.scroll = new Scroll({
                    container:".scroll-area",
                    scrollObj:".scroller"
                })
            }
        },
        prule_btn_xx:function(){
            this.prule.visible = false;
        },
        after_leave_rule:function(){
            main.scroll.set( 0 );
        },
        after_enter_rule:function(){
            main.scroll.update();
        },

        /*webgl*/
        onPwebglEnter:function(){
            main.initLX({
                container:$(".P_webgl"),
                delay:3000
            });
            main.initLX({
                container:$("#bg .bg2"),
                delay:1500
            })
            if(vm.key_index==3&&vm.server_data.prizeType==0&&!vm.server_data.is_end){
                $(".tip-all").show();
                $(".big-icon").show();
                $(".number").hide();
                $(".animation-box").fi();
            }
        },
        pwegbl_btn_chaxun:function(){
            this.pquery.visible = true;
        },
        pwebgl_btn_getPrize:function(){
            //关注
            if(!this.server_data.have_guanzhu){
                this.pguanzhu.visible = true;
                this.pwebgl.visible = false;
                main.stopRender();
                return;
            }
            //vip
            if(!this.server_data.isVip){
                var type = vm.palert.choice.reg;
                var content = vm.palert.txt[type];
                vm.openAlert( type, content );
                return;
            }

            if(this.server_data.is_end){
                this.palert.type = this.palert.choice.normal;
                this.palert.content = "本次活动已结束<br>期待EP雅莹更多活动<br>记得关注“EP雅莹官方微信”<br>敬请期待我们的下次活动";
                this.palert.visible = true;
                $(".animation-box").fo();
                return;
            }

            var _vm = this;
            var callback = function( data ){
                if( data.status ){
                    _vm.server_data.prizeType = data.lottery_result;
                    _vm.pprize.visible = true;
                    _vm.pwebgl.visible = false;
                    setTimeout(function(){
                        $(".animation-box").hide();
                    },1000)
                    main.stopRender();
                }else{
                    console.log( "抽奖后台出问题了"+data )
                }
            };
            _getData.getPrize( callback );
        },
        pwebgl_btn_icon4:function(){
            var content = "活动结束，该奖品已过期<br>下次请尽早哦！"
            this.openAlert("normal",content);
        },

        /*中奖结果页*/
        afterEnterPprize:function(){
            this.isResult = true;
            init_weixin_share();
        },
        afterLeavePprize:function(){
            this.isResult = false;
            init_weixin_share()
        },
        pprize_btn_paddress:function(){
            this.paddress.visible = true;
        },/*中奖结果页*/
        pprize_btn_share:function(){
            this.pshare.visible = true;
        },
        pprize_btn_pfill:function(){
            this.pfill.visible = true;
            this.pprize.visible = false;
        },
        pprize_btn_close:function(){
            main.startRender();
            this.pprize.visible = false;
            this.pwebgl.visible = true;
        },
        /*中奖查询页*/
        pquery_btn_paddress:function(){
            this.paddress.visible = true;
        },
        pquery_btn_share:function(){
            this.pshare.visible = true;
        },
        pquery_btn_xx:function(){
            this.pquery.visible = false;
        },

        /*提交信息页*/
        pfill_btn_submit:function(){
            var number = this.server_data.tel;
            var name = this.server_data.name;
            var patt = /^1(3|4|5|7|8)\d{9}$/;

            if(name == ""){
                this.palert.type = this.palert.choice.normal;
                this.palert.content = "请输入姓名";
                this.palert.visible = true;
                return;
            };
            if(!(patt.test(number))){
                this.palert.type = this.palert.choice.normal;
                this.palert.content = "请输入正确的手机号";
                this.palert.visible = true;
                return;
            };
            if(this.server_data.select_province == ""){
                this.palert.type = this.palert.choice.normal;
                this.palert.content = "请选择省份";
                this.palert.visible = true;
                return;
            }
            if(this.server_data.select_city == ""){
                this.palert.type = this.palert.choice.normal;
                this.palert.content = "请选择城市";
                this.palert.visible = true;
                return;
            }
            if(this.server_data.select_address == ""){
                this.palert.type = this.palert.choice.normal;
                this.palert.content = "请选择门店";
                this.palert.visible = true;
                return;
            }

            var callback = function( result ){
                if(result.status){
                    location.href = "index.php";
                }else{
                    console.log(result)
                }
            }
            _uploadData.addInfo( callback );

        },
        onPfillProvinceChangeHandle:function(e){
            var _vm = this;
            _getData.getCity(function(data){
                _vm.server_data.city = data.data
            })
        },
        onPfillCityChangeHandle:function(e){
            var _vm = this;
            _getData.getShop(function(data){
                _vm.server_data.address = data.data
            })
        },
        onPfillAddressChangeHandle:function(e){
            this.server_data.shop_id = e.target.selectedOptions[0].getAttribute("shopid");
        },

        /*查询可使用门店页*/
        onPaddress_btn_xx:function(){
            this.paddress.visible = false;
        },
        onPaddressProvinceChangeHandle:function(e){
            var _vm = this;
            _getData.getCity(function(data){
                _vm.server_data.city = data.data
            })
        },
        onPaddressCityChangeHandle:function(e){
            var _vm = this;
            _getData.getShop(function(data){
                _vm.server_data.address = data.data
            })
        },
        onPaddressAddressChangeHandle:function(e){

        },


        /*后退*/
        back:function(){
            var len = this.router.length;
            if(len>0){
                var page = this.router[len-1];
                this[page].visible = true;
                this.router.splice(len-1,1)
            }
        },

        /*alert页面*/
        palert_btn_gofill:function(){
            this.pfill.visible = true;
            this.closeAlert();
        },
        palert_btn_goregist:function(){
            var back_url = "http://epshow.i-creative.cn/summer/index.php?is_reg=1";
            location.href = "http://o2o.elegant-prosper.com/EPWXSiteNew/VIP/CreateVIP?sid=cfe404ea-fe5b-4a85-87f0-b2701929462c&redirect_uri="+encodeURIComponent(back_url);
        },
        onPshareEnter:function(){
            // main.initLX({
            //     container:$(".P_share"),
            //     delay:1000
            // })
        },
        openAlert:function(type,content,fontSize){
            var fontSize = fontSize?fontSize:"";
            this.palert.type = type;
            this.palert.content = content;
            this.palert.visible = true;
            this.palert.fontSize = fontSize;
        },
        closeAlert:function(){
            this.palert.visible = false;
            this.palert.type = "";
            this.palert.content = "";
            this.palert.fontSize = "";
        },
    },
    computed:{

    },
    delimiters: ['$[', ']']
}
var vm = new Vue(options);
vm.ploading.visible = true;

var three = new function(){
    this.container;
    this.scene;
    this.camera;
    this.renderer;
    this.width;
    this.height;

    this.raycaster;//射线实例
};
three.init = function(){
    this.container = $("#WebGL");
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45,this.width/this.height,0.1,10000);
    this.camera.position.y = 50;
    this.camera.position.z = 1600;

    this.ocamera = new THREE.OrthographicCamera(-this.width/2,this.width/2,this.height/2,-this.height/2,1,1000);
    this.ocamera.position.y = 50;
    this.ocamera.position.z = 15;
    this.scene2 = new THREE.Scene();


    this.renderer = new THREE.WebGLRenderer({antialias:true,alpha:true,precision:"highp"});
    this.renderer.setPixelRatio(window.devicePixelRatio);//移动端为了性能，关闭此功能
    this.renderer.setSize(this.width,this.height);
    // this.renderer.setClearColor(0x000000,1);
    this.renderer.autoClear = false;
    this.container.append(this.renderer.domElement);

    this.raycaster = new THREE.Raycaster();

    this.ddsloader = new THREE.DDSLoader();
    THREE.Loader.Handlers.add(/\.dds$/i,this.ddsloader);


};

three.loadOBJ = function(config){
    config = config ? config : {};
    config.modelName = config.modelName ? config.modelName : (function(){console.error("加载obj文件，modelName不能为空");return;}())
    config.objFile = config.objFile ? config.objFile :(function(){console.error("加载obj文件，fileName不能为空");return;}())
    config.material = config.material ? config.material : undefined;
    config.needTouch = typeof config.needTouch =="boolean" ? config.needTouch : true;//是否可以点击，如果可以，加入到touch搜索列表
    config.callback = config.callback ? config.callback : undefined;
    var objloader = new THREE.OBJLoader();

    if(config.material){
        objloader.setMaterials(config.material);
        console.log(config.material)
    }

    objloader.load(config.objFile,function(group){//加载路径,成功回调，参数可以是整个模型对象Group也可以是单个object(mesh)
        config.callback && config.callback(group)

        group.name = config.modelName;//给物体一个名字
        group.position.x = webgl.OBJData[config.modelName].position.x;
        group.position.y = webgl.OBJData[config.modelName].position.y;
        group.position.z = webgl.OBJData[config.modelName].position.z;

        group.rotation.x = webgl.OBJData[config.modelName].rotation.x;
        group.rotation.y = webgl.OBJData[config.modelName].rotation.y;
        group.rotation.z = webgl.OBJData[config.modelName].rotation.z;

        group.scale.x = webgl.OBJData[config.modelName].scale.x;
        group.scale.y = webgl.OBJData[config.modelName].scale.y;
        group.scale.z = webgl.OBJData[config.modelName].scale.z;


        webgl.OBJData[config.modelName].obj = group;//存入到全局OBJ数据中


        if(webgl.OBJData[config.modelName].needTouch){//根据需要加入touch搜索列表
            webgl.touchObjects.push(object);
        }

        main.loader.haveLoad++;
        var completePercent = Math.round(main.loader.haveLoad/main.loader.total*100);
        $(".num").html(100-completePercent)
        if(main.loader.haveLoad == main.loader.total ){
            main.loadCallBack();
        }
    },function(progress){
        // console.log(progress)
    },function(error){
        console.log("加载obj出错")
    })
};
three.loadMTL = function(config){
    config = config ? config : {};
    config.modelName = config.modelName ? config.modelName : (function(){console.error("加载mtl文件，modelName不能为空");return;}());
    config.mtlFile = config.mtlFile ? config.mtlFile :(function(){console.error("加载mtl文件，文件名不能为空");return;}());

    var mtlloader = new THREE.MTLLoader();
    if(config.baseUrl){
        mtlloader.setPath(config.baseUrl);
    }

    mtlloader.load(config.mtlFile,function(materials){//加载mtl文件
        materials.preload();
        if(config.objFile){
            three.loadOBJ({
                modelName:config.modelName,
                objFile:config.objFile,
                material:materials,
            })
        }

    },function(res){
        // console.log(res)
    },function(res){
        console.log("加载mtl出错")
    })
};
three.loadCollada = function(config){
    config = config ? config : {};
    config.url = config.url;

    config.successCallback = typeof config.successCallback =="function" ? config.successCallback : function(collada){console.log(collada)};
    config.progressCallback = config.progressCallback ? config.progressCallback : function(progress){console.log(progress)};
    config.failCallback = config.failCallback ? config.failCallback : function(fail){console.log(fail)};
    var loader = new THREE.ColladaLoader();
    loader.load(config.url,config.successCallback,config.progressCallback,config.failCallback)
};
three.loadTexture = function(config){
    config = config ? config : {};
    config.url = config.url ? config.url : "";
    config.name = config.name ? config.name : "";
    config.wrapS = typeof config.wrapS == "boolean" ? config.wrapS :false;
    config.wrapT = typeof config.wrapT == "boolean" ? config.wrapT :false;
    config.SuccessCallback = typeof config.SuccessCallback == "function" ? config.SuccessCallback :function(){};

    var textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin("");
    var texture = textureLoader.load(config.url,function(texture){config.SuccessCallback(texture)},undefined,function(){});
    if(config.wrapS){
        texture.wrapS = THREE.RepeatWrapping;
    }
    if(config.wrapT){
        texture.wrapT = THREE.RepeatWrapping;
    }
    texture.name = config.name;
    return texture;

};
three.loadAudio = function(config){
    var audioLoader = new THREE.AudioLoader()
}

three.getSpotLight = function(config){
    config = config ? config : {};
    config.color = config.color ? config.color : 0xffffff;//灯光颜色
    config.intensity = config.intensity ? config.intensity : 1;//灯光强度
    config.distance = config.distance ? config.distance : 100;//灯光的照射长度
    config.angle = config.angle ? config.angle : Math.PI/3;//灯光角度，默认60度对应的弧度
    config.exponent = config.exponent ? config.exponent : 10;//灯光衰减速度，默认是10

    var light = new THREE.SpotLight(config.color,config.intensity,config.distance,config.angle,config.exponent);
    light.position.x = 100;
    light.position.y = 100;
    light.position.z = 0;
    return light;
};//聚光灯
three.getPointLightHelper = function(spotLight){
    if(spotLight instanceof THREE.Light){
        return new THREE.SpotLightHelper(spotLight);
    }
};//增加聚光灯辅助工具,便与调试,return一个helper实例
three.getDirectionalLight = function(config){
    config = config ? config : {};
    config.color = config.color ? config.color : 0xffffff;//颜色
    config.intensity = config.intensity ? config.intensity : 1;//光线强度

    var light = new THREE.DirectionalLight(config.color,config.intensity);

    if(config.position){
        light.position.set(config.position.x,config.position.y,config.position.z);
    }
    return light;
};//平行方向光,return光线实例
three.getAmbientLight = function(config){
    config = config ? config : {};
    config.color = config.color ? config.color : 0xffffff;//颜色
    config.intensity = config.intensity ? config.intensity : 1;
    var light = new THREE.AmbientLight( config.color, config.intensity );

    return light;
};//环境光,return光线实例

three.getSkyByCubeGeo = function(config){
    var path = "assets/texture/"
    config = config ? config : {};
    config.size = config.size ? config.size : 1024;
    config.format = config.format ? config.format : ".jpg";
    config.urls = config.urls ? config.urls : [
        path+"right"+config.format,
        path+"left"+config.format,
        path+"up"+config.format,
        path+"down"+config.format,
        path+"front"+config.format,
        path+"back"+config.format,
    ];

    var materials = [];
    for(var i = 0;i<config.urls.length;i++){
        materials.push(new THREE.MeshLambertMaterial({
            map:this.loadTexture({url:config.urls[i]}),
            side:THREE.BackSide
        }))
    }

    var mesh = new THREE.Mesh(new THREE.CubeGeometry(config.size,config.size,config.size),new THREE.MeshFaceMaterial(materials));//天空盒Mesh已经生成
    return mesh;
};//六面立方体CubeGeometry+多面材质组合MeshFaceMaterial,return mesh
three.getSkyBySphere = function(config){
    config = config ? config : {};
    config.R = config.R ? config.R : 50;//球体半径,说明:在2:1的长图素材中，r取值为short/PI
    config.Ws = config.Ws ? config.Ws :8;//分段数
    config.Hs = config.Hs ? config.Hs :6;//分段数
    config.phiStart = config.phiStart ? config.phiStart : 0;//0-2PI,x轴起点
    config.phiLength = config.phiLength ? config.phiLength : 2*Math.PI;//0-2PI,2PI代表画整个球
    config.thetaStart = config.thetaStart ? config.thetaStart : 0;//0-PI,y轴起点
    config.thetaLength = config.thetaLength ? config.thetaLength : Math.PI;//0-PI,0.5PI代表上半个球
    config.texture = config.texture ? config.texture : new THREE.Texture();

    var geometry = new THREE.SphereGeometry(config.R,config.Ws,config.Hs,config.phiStart,config.phiLength,config.thetaStart,config.thetaLength);
    var material = new THREE.MeshBasicMaterial({
        map:config.texture,
        side:THREE.DoubleSide
    })
    var mesh = new THREE.Mesh(geometry,material);
    return mesh;
};

three.getCubeGeometry = function(config){
    //默认创建一个长宽高100的立方体，分段数为1
    config = config ? config : {};
    config.sizeX = config.sizeX ? config.sizeX : 100;//X方向大小
    config.sizeY = config.sizeY ? config.sizeY :100;//Y方向大小
    config.sizeZ = config.sizeZ ? config.sizeZ :100;//Z方向大小
    config.Xs = config.Xs ? config.Xs : 1;
    config.Ys = config.Ys ? config.Ys : 1;
    config.Zs = config.Zs ? config.Zs : 1;

    var geometry = new THREE.CubeGeometry(config.sizeX,config.sizeY,config.sizeZ,config.Xs,config.Ys,config.Zs);
    return geometry;
};//return geometry
three.getPlaneGeo = function(config){
    config = config ? config : {};
    config.width = config.width ? config.width : 50;//平面默认宽50
    config.height = config.height ? config.height : 50;//平面默认高50
    config.Ws = config.Ws ? config.Ws : 1;//平面默认X方向段数为1
    config.Hs = config.Hs ? config.Hs : 1;//平面默认Y方向段数为1

    var planeGeo = new THREE.PlaneGeometry(config.width,config.height,config.Ws,config.Hs);
    return planeGeo;
};//return geometry
three.getSphereGeometry = function(config){
    config = config ? config : {};
    config.R = config.R ? config.R : 50;//球体半径,说明:在2:1的长图素材中，r取值为short/PI
    config.Ws = config.Ws ? config.Ws :8;//分段数
    config.Hs = config.Hs ? config.Hs :6;//分段数
    config.phiStart = config.phiStart ? config.phiStart : 0;//0-2PI,x轴起点
    config.phiLength = config.phiLength ? config.phiLength : 2*Math.PI;//0-2PI,2PI代表画整个球
    config.thetaStart = config.thetaStart ? config.thetaStart : 0;//0-PI,y轴起点
    config.thetaLength = config.thetaLength ? config.thetaLength : Math.PI;//0-PI,0.5PI代表上半个球

    var geometry = new THREE.SphereGeometry(config.R,config.Ws,config.Hs,config.phiStart,config.phiLength,config.thetaStart,config.thetaLength);
    return geometry;
};//return geometry
three.getPointMaterial = function(config){
    config = config ? config : {};
    config.size = config.size ? config.size : 4;
    config.map = config.map ? config.map : undefined;
    config.blending = config.blending ? config.blending : THREE.AdditiveBlending;

};

three.getOrbitControls = function(config){
    config = config ? config : {};
    return new THREE.OrbitControls(this.camera,this.renderer.domElement);
};
three.addPerspectiveCameraHelper = function(camera){
    camera = camera ? camera : this.camera;
    var helper = new THREE.CameraHelper(camera);
    this.scene.add(helper);
    return helper;
};

three.getFps = function(){
    var s = new Stats();
    return s;
};//return Stats实例
three.getObjectByName = function(config){
    config = config ? config : {};
    config.name = config.name ? config.name : (function(){console.error("getObjectByName时缺少name");}())
    config.scene = config.scene ? config.scene : this.scene;

    return config.scene.getObjectByName(config.name)
};//return scene.children
three.raycasterResult = function(config){//返回点到的第一个
    config = config ? config :{};
    config.coords = config.coords ? config.coords : new THREE.Vector2();
    config.searchFrom = config.searchFrom ? config.searchFrom : this.scene;
    config.recursive = config.recursive ? config.recursive : false;//是否需要递归查找到子对象
    config.needGroup = config.needGroup ? config.needGroup : false;//是否需要返回整个模型group

    config.coords.x = (config.coords.x/this.width)*2-1;
    config.coords.y = 2 * -(config.coords.y / this.height) + 1;

    this.raycaster.setFromCamera(config.coords,this.camera);
    var result;
    result = this.raycaster.intersectObjects(config.searchFrom,config.recursive);
    if(result.length>0){//有点到东西
        if(config.needGroup){//需要返回整个模型Group
            if(result[0].object.parent && result[0].object.parent instanceof THREE.Group){
                result = result[0].object.parent;
            }
        }
        else{
            result = result[0];
        }
    }
    else{
        result = undefined;
    }
    return result;
};
three.getTime = function(){
    return new Date().getTime();
};//return 时间戳1213432534213123
three.getTouchCoords = function(event){
    return {x:event.offsetX,y:event.offsetY};
};//传入touch回调参数,return{x:0,y:0}

three.render = function(){
    this.renderer.clear()
    this.renderer.render(this.scene,this.camera);
    this.renderer.clearDepth();
    this.renderer.render(this.scene2,this.ocamera);
};
three.onresize = function(){
    this.width = this.container.width();
    this.height = this.container.height();

    this.camera.aspect = this.width/this.height;
    this.camera.updateProjectionMatrix();

    this.ocamera.left = -this.width/2;
    this.ocamera.right = this.width/2;
    this.ocamera.top = this.height/2;
    this.ocamera.bottom = -this.height/2;
    this.ocamera.updateProjectionMatrix();

    this.renderer.setSize(this.width,this.height);
};

/***********************webgl***********************/
var webgl = new function(){
    /*debug模式
     * 增加fps工具:webgl.fps = three.addFps()
     *
     *
     * */
    this.debug = true;

    this.fps = undefined;//左上角fps
    this.orbit = undefined;//键盘+鼠标控制器
    this.gravity = undefined;//重力控制器

    //加载计数器
    this.loader = {
        haveLoad:0,
        total:0,
        complete:false,
    };

    // this.assetsUrl = "http://epshow.img.i-creative.cn/planet/assets/";
    this.assetsUrl = "assets/";

    this.picUrl = this.assetsUrl+"images/";//图片路径
    this.texturePath = this.assetsUrl+"images/"; //纹理路径
    this.modelsUrl = this.assetsUrl+"models/";//模型基础路径

    //可被touch到的物体,this.touchObjects.indexOf(testObj) !=-1
    this.touchObjects = [];

    //一般为带纹理的整个模型,配置信息
    this.OBJData = {
        scene:{
            name:"scene",
            baseUrl:this.assetsUrl,
            mtlFile:this.assetsUrl+"models/scene/scene.mtl",
            objFile:this.assetsUrl+"models/scene/scene.obj",
            // texture:"assets/models/scene/scene.png",

            position:{x:0,y:0,z:0},
            rotation:{x:0,y:0,z:0},
            scale:{x:0.07,y:0.07,z:0.07},

            needTouch:false,
            liusu_center:undefined,
            liusu_up:undefined,
        }
    };

    //待加载的纹理--配置信息
    this.TextureData={

    };

    const SQ3 = Math.sqrt(3);
    const SQ2 = Math.sqrt(2);

    //背景天空
    this.skyBox = undefined;

    //纹理序列
    this.earthChangeTexture = [];
    //切换到第几张纹理
    this.textureIndex = 0;

    this.ogroup = new THREE.Group();

    //时钟
    this.clock = new THREE.Clock();
};
webgl.init = function(){
    this.loader.total = Object.keys(this.OBJData).length;
};
webgl.load = function(){
    for(var prop in this.OBJData){
        var config = this.OBJData[prop];
        // three.loadMTL({
        //     modelName:config.name,
        //     mtlFile:config.mtlFile,
        //     objFile:config.objFile,
        //     baseUrl:config.baseUrl,
        // })
        three.loadOBJ({
            modelName:config.name,
            objFile:config.objFile,
            callback:function(group){
                webgl.stone1 = group.children[0];
                webgl.stone2 = group.children[1];
                webgl.liusu_up = group.children[2];
                webgl.liusu_center = group.children[3];
                webgl.planet = group.children[4];

                // object.children[0].material = material;
            }
        })
    }

};
webgl.loadCallback = function(){
    // if(this.debug){
    //     this.addFps();
    // }
    for(var i=1;i<=38;i++){
        var texture = three.loadTexture({
            url:main.modelsUrl+"scene/ls/"+i+".png"
        });

        // var texture = new THREE.Texture(main.ls[i-1]);
        this.earthChangeTexture.push(texture)
    }
    this.addAmbientLight();//加环境光
    this.addDirectionLight();//加方向光
    this.addEarth();//加地球
    // this.addStars();//加星星
    // this.updateStar();//设置星星闪烁
    // this.addSky();//加天空
    this.addCross();
    this.addOrbit();//加控制器
    this.orbit.enabled = false;
    this.orbit.enableZoom = false;
    this.orbit.rotateSpeed = 0.5;
    // this.addGravity();
    // if(this.debug){
    //     this.addAxisHelper();//增加坐标轴辅助线
    // }
};
webgl.addAmbientLight = function(){
    var ambientLight = three.getAmbientLight({
        color:0x000000,
        intensity:1,
    });//可被移除的对象
    three.scene.add(ambientLight);
};//加环境光
webgl.addDirectionLight = function(){
    var directionLight = three.getDirectionalLight({
        color:0x111111,
        intensity:0.1,
        position:{x:0,y:300,z:0}
    });

    three.scene.add(directionLight);


    if(this.debug){
        var helper = new THREE.DirectionalLightHelper(directionLight)
        // three.scene.add(helper)
    }

};//加平行光
webgl.addOrbit = function(){
    this.orbit = new THREE.OrbitControls( three.camera , $("#gl-touch")[0]);
    this.orbit.enableZoom = true;
    this.orbit.target = webgl.earthGroup.position;
};//加控制器
webgl.addGravity = function(){
    this.gravity = new THREE.DeviceOrientationControls(this.sky)
};
webgl.addEarth = function(){
    var group = new THREE.Group();
    group.scale.set(0,0,0);
    group.position.set(0,50,-200)
    group.rotation.y = 2*Math.PI
    var material = new THREE.MeshPhongMaterial({
        map:three.loadTexture({
            url:this.assetsUrl+"models/scene/planet.png",
        }),
        normalMap:three.loadTexture({
            url:this.assetsUrl+"models/scene/normal_planet.png",
        }),
        shininess:20,
        emissive:0x111111,
        emissiveIntensity:0,
    });
    this.planet.material = material;

    group.add(this.planet)

    // var material1 = new THREE.MeshPhongMaterial({
    //                     map:three.loadTexture({
    //                         url:"assets/models/scene/stone1.png",
    //                     }),
    //                     normalMap:three.loadTexture({
    //                         url:"assets/models/scene/normal_stone1.png",
    //                     }),
    //                     shininess:30,

    //                 });
    // this.stone1.material = material1;
    // group.add( this.stone1 );

    // var material2 = new THREE.MeshPhongMaterial({
    //                 map:three.loadTexture({
    //                     url:"assets/models/scene/stone2.png",
    //                 }),
    //                 normalMap:three.loadTexture({
    //                     url:"assets/models/scene/normal_stone2.png",
    //                 }),
    //                 shininess:0,
    //             });
    // this.stone2.material = material2;
    // group.add( this.stone2 );

    var material3 = new THREE.MeshLambertMaterial({
        color:"white",
        map:three.loadTexture({
            url:this.assetsUrl+"models/scene/ls/1.png",
        }),
        side:THREE.DoubleSide,
        depthWrite:false,
        transparent:true,
        opacity:0.8
    });
    this.liusu_up.material = material3;
    this.liusu_up.scale.set(1.01,1.01,1.01)
    this.liusu_up.rotation.set(2,2,2)

    group.add( this.liusu_up )

    var material4 = new THREE.MeshLambertMaterial({
        color:"white",
        map:three.loadTexture({
            url:this.assetsUrl+"models/scene/ls/1.png",
        }),
        side:THREE.DoubleSide,
        depthWrite:false,
        transparent:true,
        opacity:0.8
    });
    this.liusu_center.material = material4;
    this.liusu_center.scale.set(1.01,1.01,1.01)
    this.liusu_center.rotation.set(1.01,1.01,1.01)
    group.add(this.liusu_center);


    // group.add(cloudMesh);
    this.earthGroup = group;
    three.scene.add(group);

    for(point in this.PointData){
        var points = this.PointData;
        var point = points[point];

        point.texture= three.loadTexture({
            url:point.texture
        })

        var RedPoint2 = new THREE.Sprite(new THREE.SpriteMaterial({map:point.texture,depthWrite:false}))

        RedPoint2.position.set( point.position.x, point.position.y, point.position.z )
        RedPoint2.scale.set(point.width*1.3,point.width*1.3,1)
        group.add(RedPoint2);
        RedPoint2.name = point.name;
        point.obj = RedPoint2;
    }
};//加地球
webgl.addStars = function(){
    var texture = three.loadTexture({
        url:this.picUrl+"star2.png"
    })
    var mat = new THREE.SpriteMaterial({
        map:texture,
        transparent:true,
        depthWrite:false,
    });

    this.stars = new THREE.Group();
    for(var i=0;i<200;i++){
        var axis = parseInt(Math.random()*3)
        switch(axis){
            case 0:
                var x = THREE.Math.randFloat( 800,1000 )
                var y = THREE.Math.randFloat( 0,1000 )
                var z = THREE.Math.randFloat( 0,1000 )
                break;
            case 1:
                var x = THREE.Math.randFloat( 0,1000 )
                var y = THREE.Math.randFloat( 800,1000 )
                var z = THREE.Math.randFloat( 0,1000 )
                break;
            case 2:
                var x = THREE.Math.randFloat( 0,1000 )
                var y = THREE.Math.randFloat( 0,1000 )
                var z = THREE.Math.randFloat( 800,1000 )
                break;
        }


        var flag = (Math.random()-0.5)>0?1:-1
        x*=flag;
        flag = (Math.random()-0.5)>0?1:-1
        y*=flag;
        flag = (Math.random()-0.5)>0?1:-1
        z*=flag;



        var sprite = new THREE.Sprite(mat);
        var rand = THREE.Math.randFloat(30,50)
        sprite.scale.set(rand,rand,1);
        sprite.position.set(x,y,z);
        this.stars.add(sprite);
    }
    three.scene.add(this.stars);
};//加星星
webgl.addSky = function(){
    var skyMesh = three.getSkyByCubeGeo({
        size:2048,
    });
    this.sky = skyMesh;

    three.scene.add(skyMesh);

    // var texture = three.loadTexture({
    //     url:main.picUrl+"sky.jpg"
    // })
    // var sky = three.getSkyBySphere({
    //     R:4096,
    //     Ws:8,
    //     Hs:8,
    //     texture:texture
    // })
    // this.sky = sky
    // three.scene.add( sky );

};//加天空
webgl.addCross = function(){
    var texture = three.loadTexture({
        url:main.picUrl + "p1-miaozhun.png",
    });
    var material = new THREE.SpriteMaterial({
        map:texture
    });
    var sprite = new THREE.Sprite( material );
    sprite.position.set(0,50,0);
    sprite.scale.set(40,40,1);
    three.scene2.add(sprite);
};//加准心
webgl.updateStar = function(){
    var number = this.stars.children.length;
    for(var i=0;i<number;i++){
        var rand = parseInt(10*Math.random());
        TweenMax.fromTo(this.stars.children[i].material,1,{opacity:1},{opacity:0,repeat:-1,yoyo:true})
    }
};

webgl.addFps = function(){
    this.fps = three.getFps();
    document.getElementById("FPS").appendChild(this.fps.domElement);
};
webgl.addAxisHelper = function(){
    var helper = new THREE.AxisHelper(1000);
    three.scene.add(helper);
};
webgl.updateTexture = function(){
    this.liusu_center.material.map = this.earthChangeTexture[this.textureIndex];
    this.liusu_up.material.map = this.earthChangeTexture[this.textureIndex];
    this.liusu_center.material.needsUpdate = true;
    this.liusu_up.material.needsUpdate = true;

    this.liusu_center.rotation.x+=0.001;
    this.liusu_center.rotation.y+=0.001;
    this.liusu_center.rotation.z+=0.001;

    this.liusu_up.rotation.x+=0.001;
    this.liusu_up.rotation.y+=0.001;
    this.liusu_up.rotation.z+=0.001;


    if(this.textureIndex<this.earthChangeTexture.length-1){
        this.textureIndex++;
    }else{
        this.textureIndex = 0;
    }


};



webgl.render = function(){
    this.clock.startTime = Date.now();
    if(this.clock.startTime - this.clock.oldTime >50) {
        this.updateTexture();
        this.clock.oldTime = this.clock.startTime;
    }
};

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
            url:this.picUrl+"bg.jpg",
            group:"1"
        }, {
            url:this.picUrl+"p6-kuang.png",
            group:"1"
        },
        {
            url:this.picUrl+"p11-btn.png",
            group:"1"
        },
        {
            url:this.picUrl+"p11-kuang.png",
            group:"1"
        },
        {
            url:this.picUrl+"pfill-title.png",
            group:"1"
        },
        {
            url:this.picUrl+"pfill-txt-3.png",
            group:"1"
        },
        {
            url:this.picUrl+"phone.png",
            group:"1"
        },
        {
            url:this.picUrl+"weile.png",
            group:"1"
        },
    ];

    this.RAF = undefined;
};
/***********************流程***********************/
main.init=function(){
    three.init();
    webgl.init();
};
main.start=function(){
    var loader = new Utils.ImageLoader();

    loader.load(this.ImageList,function( percent ){
        console.log( percent )
    },function( result ){
        console.log( result )
    });

};
main.loadCallBack = function(){

};
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











