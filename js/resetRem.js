/**
 * Created by Z on 2017/6/21.
 */
( function() {

    var setSize = function() {

        var standard  = 750;

        var _width    = window.innerWidth;
        var _height   = window.innerHeight;

        //横屏的standard
        if( _width >= _height ){

            standard = 1334

        }
        //竖屏的standard
        else {

            standard = 750

        }
        var size = ( _width / standard ) * 100;
        document.documentElement.style.fontSize = size + 'px';

    };

    setSize();

    window.addEventListener( "resize", function(){

        // setSize();

    } )

} )();