

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
    var vm = new Vue({
        el:"#iCreative",
        data:{



            /*页面切换控制*/
            p1:false,
            p2:false,
            pvideo:false,
            prule:false,
            hpwarn:false,//横屏提示
            /*页面切换控制*/


        },
        methods:{

        },
    });
    var main = new function(){

        this.touch ={
            ScrollObj:undefined,
            isScroll:false,
            limitUp:0,
            limitDown:undefined,
            overlimit:false,
            StartY:0,
            NewY:0,
            addY:0,
            scrollY:0,
            touchAllow:true
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

        this.picUrl = "images/";//图片路径
        this.ImageList = [
            this.picUrl+"barrageBtn.png",
            this.picUrl+"bg.jpg",
            this.picUrl+"bo.gif",
            this.picUrl+"button-0.png",
            this.picUrl+"button-1.png",
            this.picUrl+"button-2.png",
            this.picUrl+"button-3.png",
            this.picUrl+"close.png",
            this.picUrl+"esc.png",
            this.picUrl+"esc-1.png",
            this.picUrl+"fenxiang.png",
            this.picUrl+"haha.gif",
            this.picUrl+"jiantou.png",
            this.picUrl+"loadgif.gif",
            this.picUrl+"logo.png",
            this.picUrl+"music_btn.png",
            this.picUrl+"otttl.png",
            this.picUrl+"p0-text-1.png",
            this.picUrl+"p0-text-2.png",
            this.picUrl+"p0-text-3.png",
            this.picUrl+"p0-text-4.png",
            this.picUrl+"p0-text-5.png",
            this.picUrl+"p0-text-6.png",
            this.picUrl+"p0-text-7.png",
            this.picUrl+"p1-1.jpg",
            this.picUrl+"p1-2.jpg",
            this.picUrl+"p1-3.jpg",
            this.picUrl+"p1-4.jpg",
            this.picUrl+"p1-5.jpg",
            this.picUrl+"p1-6.jpg",
            this.picUrl+"p1-7.jpg",
            this.picUrl+"p1-button-2.png",
            this.picUrl+"p1-img-1.png",
            this.picUrl+"p1-text-1.png",
            this.picUrl+"p1-text-2.png",
            this.picUrl+"p2-button-1.png",
            this.picUrl+"p2-button-2.png",
            this.picUrl+"p2-button-3.png",
            this.picUrl+"p2-button-4.png",
            this.picUrl+"p2-button-5.png",
            this.picUrl+"p2-button-6.png",
            this.picUrl+"p2-button-7.png",
            this.picUrl+"p2-img-1.png",
            this.picUrl+"p2-text-1.png",
            this.picUrl+"p2-text-2.png",
            this.picUrl+"p2-text-3.png",
            this.picUrl+"p2_img_4.png",
            this.picUrl+"p2_img_5.png",
            this.picUrl+"p2_img_6.png",
            this.picUrl+"p3-button-1.png",
            this.picUrl+"p3-button-2.png",
            this.picUrl+"p3-img-1.png",
            this.picUrl+"p3-img-2.png",
            this.picUrl+"p3-img-3.png",
            this.picUrl+"p3-img-4.png",
            this.picUrl+"p3-img-5.png",
            this.picUrl+"p3-img-6.png",
            this.picUrl+"p3-img-7.png",
            this.picUrl+"p3-img-8.png",
            this.picUrl+"p3-img-9.png",
            this.picUrl+"p3-text-1.png",
            this.picUrl+"p3-text-2.png",
            this.picUrl+"p3-text-3.png",
            this.picUrl+"p3-text-4.png",
            this.picUrl+"p3-text-5.png",
            this.picUrl+"p4-button-1.png",
            this.picUrl+"p4-img-1.png",
            this.picUrl+"p4-text-1.png",
            this.picUrl+"p5-img-1.png",
            this.picUrl+"p5-img-2.png",
            this.picUrl+"p5-img-3.png",
            this.picUrl+"p5-img-4.png",
            this.picUrl+"p5-img-5.png",
            this.picUrl+"p5-text-1.png",
            this.picUrl+"p6-img-1.png",
            this.picUrl+"p7-img-1.png",
            this.picUrl+"p7-text-1.png",
            this.picUrl+"p7-text-2.png",
            this.picUrl+"p8.jpg",
            this.picUrl+"p9.jpg",
            this.picUrl+"p9-button.png",
            this.picUrl+"p10.jpg",
            this.picUrl+"p11-img-1.png",
            this.picUrl+"p11-text-1.png",
            this.picUrl+"phone.png",
            this.picUrl+"poster.png",
            this.picUrl+"prztitle.png",
            this.picUrl+"tankuang.png",
            this.picUrl+"text.png",
            this.picUrl+"text-1.png",
            this.picUrl+"voiceBtn.png",
            this.picUrl+"vplayBtn.png",
            this.picUrl+"weile.png",
            this.picUrl+"yinbo.gif",
            this.picUrl+"yinbo.png",
            this.picUrl+"yinboxiao.png"
        ];
        
        this.RAF = undefined;


    };
    /***********************流程***********************/
    main.init=function(){
        
    };
    main.start=function(){

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
            if(window.orientation == 0 || window.orientation == 180 )
            {
                $(".hp").hide();
            }
            else if(window.orientation == 90 || window.orientation == -90)
            {
                $(".hp").show();
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
    /***********************功能***********************/

    /***********************辅助公式***********************/
    main.easeInOut=function(nowTime,startPosition,delta,duration){
        return 1 > (nowTime /= duration / 2) ? delta / 2 * nowTime * nowTime + startPosition : -delta / 2 * (--nowTime * (nowTime - 2) - 1) + startPosition
    };
    main.easeOut=function(nowTime,startPosition,delta,duration){
        return -delta*(nowTime/=duration)*(nowTime-2)+startPosition;
    };
    main.min = function(a,b){
        return (a>b?b:a);
    };//获取较小的数
    /***********************辅助公式***********************/










