var Utils = new function(){
    this.preloadImage = function(ImageURL,callback,realLoading){
        var rd = realLoading||false;
        var i,j,haveLoaded = 0;
        var $num = $(".num");
        for(i = 0,j = ImageURL.length;i<j;i++){
            (function(img, src) {
                img.onload = function() {
                    main.loader.haveLoad +=1;
                    var num = Math.ceil(main.loader.haveLoad / main.loader.total * 100);
                    console.log(num)
                    if(rd){
                        $num.html("- "+num + "% -");
                    }
                    if (main.loader.haveLoad == main.loader.total && !main.loader.complete) {
                        main.loader.complete = true;
                        callback && callback()
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
};
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
        debug:true,
        server_data:{},

        /*页面切换控制*/
        ploading:{
            visible:true,
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


    },
    methods:{

    },
    delimiters: ['$[', ']']
}
var vm = new Vue(options);


/***********************three***********************/
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
    this.camera = new THREE.PerspectiveCamera(45,this.width/this.height,1,10000);
    this.camera.position.z = 500;

    this.renderer = new THREE.WebGLRenderer({antialias:true});
    // this.renderer.setPixelRatio(window.devicePixelRatio);//移动端为了性能，关闭此功能
    this.renderer.setSize(this.width,this.height);
    this.renderer.setClearColor(0x000000,1);
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
    var objloader = new THREE.OBJLoader();

    if(config.material){
        objloader.setMaterials(config.material);
        console.log(config.material)
    }

    objloader.load(config.objFile,function(object){//加载路径,成功回调，参数可以是整个模型对象Group也可以是单个object(mesh)
        object.name = config.modelName;//给物体一个名字
        object.position.x = webgl.OBJData[config.modelName].position.x;
        object.position.y = webgl.OBJData[config.modelName].position.y;
        object.position.z = webgl.OBJData[config.modelName].position.z;

        object.rotation.x = webgl.OBJData[config.modelName].rotation.x;
        object.rotation.y = webgl.OBJData[config.modelName].rotation.y;
        object.rotation.z = webgl.OBJData[config.modelName].rotation.z;

        object.scale.x = webgl.OBJData[config.modelName].scale.x;
        object.scale.y = webgl.OBJData[config.modelName].scale.y;
        object.scale.z = webgl.OBJData[config.modelName].scale.z;


        // console.log(object)

        webgl.OBJData[config.modelName].obj = object;//存入到全局OBJ数据中
        three.scene.add(object);

        if(webgl.OBJData[config.modelName].needTouch){//根据需要加入touch搜索列表
            webgl.touchObjects.push(object);
        }

        webgl.loader.haveLoad++;
        main.loader.haveLoad++;
        var completePercent = Math.round(main.loader.haveLoad/main.loader.total*100);
        if(main.loader.haveLoad == main.loader.total && !main.loader.complete){
            main.loader.complete = true;
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
    var light = new THREE.AmbientLight(config.color);

    return light;
};//环境光,return光线实例

three.getSkyByCubeGeo = function(config){
    config = config ? config : {};
    config.size = config.size ? config.size : 1024;
    config.format = config.format ? config.format : ".jpg";
    config.urls = config.urls ? config.urls : [
        this.path.texture+"right"+config.format,
        this.path.texture+"left"+config.format,
        this.path.texture+"up"+config.format,
        this.path.texture+"down"+config.format,
        this.path.texture+"front"+config.format,
        this.path.texture+"back"+config.format,
    ];

    var materials = [];
    for(var i = 0;i<config.urls.length;i++){
        materials.push(new THREE.MeshBasicMaterial({
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
    this.renderer.render(this.scene,this.camera);
};
three.onresize = function(){
    this.width = this.container.width();
    this.height = this.container.height();

    this.camera.aspect = this.width/this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width,this.height);
};


/***********************webgl***********************/
var webgl = new function(){
    /*debug模式
     * 增加fps工具:webgl.fps = three.addFps()
     * 关闭镜头的自动向前功能:webgl.person.direction = 0,
     *
     *
     * */
    this.debug = true;

    this.fps = undefined;//左上角fps
    this.orbit = undefined;//键盘+鼠标控制器
    this.gravity = undefined;//重力控制器

    this.loader = {
        haveLoad:0,
        total:0,
    };//加载计数器
    this.touchObjects = [];//可被touch到的物体,this.touchObjects.indexOf(testObj) !=-1

    this.OBJData = {//一般为带纹理的整个模型,配置信息
        city:{
            name:"city",
            baseUrl:"assets/",
            mtlFile:"models/city/scenes/scenes.mtl",
            objFile:"assets/models/city/scenes/scenes.obj",

            position:{x:0,y:0,z:0},
            rotation:{x:0,y:0,z:0},
            scale:{x:1,y:1,z:1},

            needTouch:true,
            obj:undefined,
        },
        robot:{
            name:"robot",
            baseUrl:"assets/",
            mtlFile:"models/robot/robot1.mtl",
            objFile:"assets/models/robot/robot1.obj",

            position:{x:0,y:0,z:0},
            rotation:{x:0,y:0,z:0},
            scale:{x:1,y:1,z:1},

            needTouch:true,
            obj:undefined,
        }
    };

    this.TextureData={

    };//待加载的纹理--配置信息
};
webgl.init = function(){
    if(this.debug){
        this.addFps();
    }
    this.loader.total = Object.keys(this.OBJData).length;

    this.addAmbientLight();//光线
    this.addOrbit();//加控制器
    this.addSky();//加天空

};
webgl.load = function(){
    for(var prop in this.OBJData){
        var config = this.OBJData[prop];
        three.loadMTL({
            modelName:config.name,
            mtlFile:config.mtlFile,
            objFile:config.objFile,
            baseUrl:config.baseUrl
        })
    }
};
webgl.addFps = function(){
    this.fps = three.getFps();
    document.getElementById("FPS").appendChild(this.fps.domElement);
};
webgl.addAmbientLight = function(){
    var ambientLight = three.getAmbientLight({
        color:0xffffff
    });//可被移除的对象
    three.scene.add(ambientLight);
};//加环境光
webgl.addOrbit = function(){
    this.orbit = new THREE.OrbitControls( three.camera , three.renderer.domElement);
    this.orbit.enableZoom = false;
};//加控制器
webgl.addSky = function(){
    var texture = three.loadTexture();
    var skyMesh = three.getSkyBySphere({

    });
    three.scene.add(skyMesh);
};
webgl.render = function(){
    // this.orbit.update();
    // if(this.fps){
    this.fps.update();
    // }
};

/***********************main***********************/
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

    this.picUrl = "assets/images/";//图片路径
    this.ImageList = [
        this.picUrl+"phone.png"
    ];
    this.RAF = undefined;

    this.loader = {
        haveLoad:0,
        total:0,
        complete:false,
    };

};
main.init=function(){
    three.init();
    webgl.init();
    this.loader.total = this.ImageList.length + webgl.loader.total;
};
main.start=function(){
    Utils.preloadImage(this.ImageList,function(){
        main.loadCallBack();
    },true);
    webgl.load();
};
main.loadCallBack = function(){
    vm.ploading.visible = false;
    vm.pwebgl.visible = true;
    this.startRender();
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

main.scrollInit=function(selector){
    this.touch.ScrollObj = $(selector);
    this.touch.container = $(selector).parent();
    this.touch.StartY = 0;
    this.touch.NewY = 0;
    this.touch.addY = 0;
    this.touch.scrollY = 0;
    this.touch.limitDown = this.touch.ScrollObj.height() < this.touch.container.height() ? 0 :(this.touch.container.height()-this.touch.ScrollObj.height());
};
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
        three.render();
        webgl.render();
        main.RAF = window.requestAnimationFrame(loop);
    };
    loop();
};//开始渲染
main.stopRender = function(){
    window.cancelAnimationFrame(main.RAF);
};
main.addEvent=function(){
    $(window).on("orientationchange",function(e){
        if(window.orientation == 0 || window.orientation == 180 )
        {
            vm.hpwarn.visible = false;
        }
        else if(window.orientation == 90 || window.orientation == -90)
        {
            vm.hpwarn.visible = true;
        }
    });
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

main.init();
main.start();









