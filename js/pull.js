/**
 * Created by Administrator on 2017/7/22.
 */
function Scroll(obj){
    this.$container = $(obj.container);//外层容器
    this.$scrollObj = $(obj.scrollObj);

    this.visibleWidth  = parseFloat(this.$container.css("width"));
    this.visibleHeight = parseFloat(this.$container.css("height"));

    this.scrollWidth = parseFloat(this.$scrollObj.css("width"));
    this.scrollHeight = parseFloat(this.$scrollObj.css("height"));

    this.newY = 0;
    this.lastY = 0;
    this.deltaY = 0;
    this.scrollY = 0;//当前的位置
    this.limitY = 0;//边界
    this.overlimitY = 0;//超出的距离
    this.slideK = 2;

    this.startTime = 0;
    this.offsetTime = 0;

    this.isBottom = false;
    this.refresh = obj.refresh ? obj.refresh : undefined;
    this.isRefreshing = false;//正在刷新
    this.preloader;//加载器ui
    if(this.refresh){
        this.preloader = this.$container.find(".scroll-preloader");
        this.preloader.remove();
        this.refresh();
    }
    // this.refreshDistance = obj.refreshDistance ? obj.refreshDistance : 50

    this.init();
}
$.extend(Scroll.prototype,{//是否深度合并，二级同名对象进行合并，而不是简单覆盖
    init:function(){
        this.newY = 0;
        this.lastY = 0;
        this.deltaY = 0;
        this.scrollY = 0;

        this.update();

        if(this.scrollY == this.limitY){
            this.isBottom = true;
        }

        this.bindEvent();
    },
    update:function(){//重新计算limitY
        this.visibleWidth  = parseFloat(this.$container.css("width"));
        this.visibleHeight = parseFloat(this.$container.css("height"));

        this.scrollWidth = parseFloat(this.$scrollObj.css("width"));
        this.scrollHeight = parseFloat(this.$scrollObj.css("height"));

        this.limitY = (this.scrollHeight > this.visibleHeight) ? -(this.scrollHeight - this.visibleHeight) : 0;

        var paddingTop = parseFloat(this.$container.css("paddingTop"));
        var paddingBottom = parseFloat(this.$container.css("paddingBottom"));
        this.limitY -= (paddingTop+paddingBottom)
    },

    bindEvent:function(){
        this.$container.on({
            touchstart:this.onTouchstart.bind(this),
            touchmove:this.onTouchmove.bind(this),
            touchend:this.onTouchend.bind(this),
        })
    },
    onTouchstart:function(e){
        e.stopPropagation();
        this.newY = e.originalEvent.changedTouches[0].pageY;
        this.lastY = this.newY;
        this.startTime = new Date().getTime();
    },
    onTouchmove:function(e){
        e.stopPropagation();
        e.preventDefault();
        this.offsetTime = new Date().getTime() - this.startTime;

        this.newY = e.originalEvent.changedTouches[0].pageY;
        this.deltaY = this.newY - this.lastY;//touch变化量


        if(this.scrollY + this.deltaY < 0){//上边界限制
            if(this.scrollY + this.deltaY > this.limitY){//下边界限制
                this.scrollY += this.deltaY * this.slideK;
            }
            else{//超出,滑动系数逐渐减小
                this.scrollY = this.limitY
                if(this.refresh && !this.isRefreshing){
                    this.processRefresh();
                }
            }

        }else{
            this.scrollY = 0;
        }

        this.$scrollObj[0].style.webkitTransform="translate3d(0,"+this.scrollY+"px,0)";



        //得到deltaY,处理业务

        this.lastY = this.newY;
    },
    onTouchend:function(e){
        e.stopPropagation();
        this.offsetTime = new Date().getTime() - this.startTime;
    },

    processRefresh:function(){
        this.isRefreshing = true;
        // this.$scrollObj.append(this.preloader);
        // this.preloader.show();
        this.refresh();
    },
    onTransitionEndToBottom:function(){
        console.log("1")
        this.isBottom = false;
        this.scrollY = this.limitY;
        this.slideK = 2;
        this.$scrollObj.off("webkitTransitionEnd");
    },
});