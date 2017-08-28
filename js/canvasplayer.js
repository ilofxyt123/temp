function Player( id ){
    this.canvas = document.getElementById( id );
    this.ctx = this.canvas.getContext("2d");
    
    this.frames = [];//播放的序列帧
    this.framesLength = 0;//总帧数
    this.frame = 0;//当前播放到第几帧
    this.speed = 50;
    this.paused = true;//默认是暂停状态
    this.over = false;
    this._loop = false;//无限循环
    this._repeat = 0;//重复次数
    this.clock = undefined;//定时器句柄
    this.callback1 = undefined;//正向结束后回调
    this.callback2 = undefined;//反向结束后回调
    this.everycallback = undefined;

    this.direction = 1;//播放方向,1代表正向,-1代表反向
}


Object.defineProperties( Player.prototype, {
    
    loop: {

         set: function( value ){

             this._loop = value;
             this._repeat = 0;

         },
            get:function(){
                return this._loop
            }

    },

    repeat: {

        set: function( value ){

            this._repeat = value;
            this._loop = false;

        }
    }
})
$.extend(Player.prototype,{
    init:function( array ){
        this.frames = array;
        this.framesLength = this.frames.length;
        this.setSize( this.frames[0].naturalWidth, this.frames[0].naturalHeight);
    },
    play:function(){
        this.paused = false;
        this.over = false;
        var _self = this;
        if(!this.clock){
            this.clock = setTimeout( function(){
                _self.render();
            }, this.speed)
        }
    },
    pause:function(){
        this.paused = true;
    },
    set:function( frame ){
        this.frame = frame;
    },
    render:function(){
        var _self = this;
        if( !this.paused ){
            this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage( this.frames[this.frame],0,0,this.canvas.width,this.canvas.height,0,0,this.canvas.width,this.canvas.height);
            switch(this.direction){
                case 1:
                    if( this.frame < this.framesLength-1){
                        this.frame++;
                    }else{
                        if(!this._loop){
                            if(this._repeat>0){
                                if(this.everycallback){
                                    this.everycallback();
                                }
                                this.frame = 0;
                                this._repeat--;
                            }else{
                                this.over = true;
                                this.callback1 && this.callback1();
                            }
                            

                        }else{//正向无限循环
                            if(this.everycallback){
                                this.everycallback();
                            }
                            this.frame = 0;     
                        }
                    }
                break;
                case -1:
                    if( this.frame > 0){
                            this.frame--;
                    }else{
                        if(!this._loop){
                            if(this._repeat>0){
                                if(this.everycallback){
                                    this.everycallback();
                                }
                                this.frame = this.framesLength - 1;
                                this._repeat--;
                            }else{
                                this.over = true;
                                this.callback2 && this.callback2();
                            }
                        }else{//逆向无限循环
                            if(this.everycallback){
                                this.everycallback();
                            }
                            this.frame = this.framesLength - 1;
                        }
                    }
                break;
            };
            

        }
        

        if(!this.over){
            this.clock = setTimeout( function(){
                _self.render()
            },this.speed);
        }else{
            this.clock = undefined;
            this.paused = true;
        }
        
        
    },
    setSize:function( width, height){
        this.canvas.width = width;
        this.canvas.height = height;
    },
   
})