/**
 * Created by Z on 2017/6/21.
 */
(function(){
    var setSize = function(){
        var _width = window.innerWidth;
        var size = (_width/640)*100;
        if(size<50){size=50;}
        if(size>100){size=100;}
        document.documentElement.style.fontSize = size + 'px';
    };
    setSize();
    window.onresize = function(){
//                setSize();
    };
})();