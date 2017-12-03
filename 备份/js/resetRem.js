/**
 * Created by Z on 2017/6/21.
 */
( function() {

    var setSize = function() {

        var standard = 640;

        var _width = window.innerWidth;

        if( _width >= 640 ){
            standard = 1136
        }else{
            standard = 640
        }
        var size = ( _width / standard ) * 100;
        document.documentElement.style.fontSize = size + 'px';

    };

    setSize();

    window.addEventListener( "resize", function(){

        setSize();

    } )

} )();