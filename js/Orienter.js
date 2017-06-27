(function (a) {
    "function" === typeof define && define.amd ? define(["exports"], function (b) {
        window.Orienter = a(b)
    }) : "undefined" !== typeof exports ? a(exports) : window.Orienter = a({})
})(function (a) {
    a = function () {
        this.initialize.apply(this, arguments)
    };
    a.prototype = {
        lon: 0,
        lat: 0,
        direction: 0,
        fix: 0,
        os: "",
        initialize: function (a) {
            a = a || {};
            this.onOrient = a.onOrient || function () {
                };
            this.onChange = a.onChange || function () {
                };
            this._orient = this._orient.bind(this);
            this._change = this._change.bind(this);
            this.lat = this.lon = 0;
            this.direction = window.orientation || 0;
            switch (this.direction) {
                case 0:
                    this.fix = 0;
                    break;
                case 90:
                    this.fix = -270;
                    break;
                case -90:
                    this.fix = -90
            }
            navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) ? this.os = "ios" : this.os = -1 < navigator.userAgent.indexOf("Android") || navigator.userAgent.indexOf("Linux") ? "android" : ""
        },
        init: function () {
            window.addEventListener("deviceorientation", this._orient, !1);
            window.addEventListener("orientationchange", this._change, !1)
        },
        destroy: function () {
            window.removeEventListener("deviceorientation", this._orient, !1);
            window.removeEventListener("orientationchange", this._change, !1)
        },
        _change: function (a) {
            this.direction = window.orientation;
            this.onChange(this.direction)
        },
        changeDirectionTo: function (a) {
            this.direction = a
        },
        _orient: function (a) {
            switch (this.os) {
                case "ios":
                    switch (this.direction) {
                        case 0:
                            this.lon = a.alpha + a.gamma;
                            0 < a.beta && (this.lat = a.beta - 90);
                            break;
                        case 90:
                            this.lon = 0 > a.gamma ? a.alpha - 90 : a.alpha - 270;
                            this.lat = 0 < a.gamma ? 90 - a.gamma : -90 - a.gamma;
                            break;
                        case -90:
                            this.lon = 0 > a.gamma ? a.alpha - 90 : a.alpha - 270, this.lat = 0 > a.gamma ? 90 + a.gamma : -90 + a.gamma
                    }
                    break;
                case "android":
                    switch (this.direction) {
                        case 0:
                            this.lon = a.alpha + a.gamma + 30;
                            this.lat = 90 < a.gamma ? 90 - a.beta : a.beta - 90;
                            break;
                        case 90:
                            this.lon = a.alpha - 230;
                            this.lat = 0 < a.gamma ? 270 - a.gamma : -90 - a.gamma;
                            break;
                        case -90:
                            this.lon = a.alpha - 180, this.lat = -90 + a.gamma
                    }
            }
            this.lon += this.fix;
            this.lon %= 360;
            0 > this.lon && (this.lon += 360);
            this.lon = Math.round(this.lon);
            this.lat = Math.round(this.lat);
            this.onOrient({
                a: Math.round(a.alpha),
                b: Math.round(a.beta),
                g: Math.round(a.gamma),
                lon: this.lon,
                lat: this.lat,
                dir: this.direction
            })
        }
    };
    console.log(a)
    return a
});