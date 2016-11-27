Engine.define('Geometry', function(){
    var dPi = Math.PI * 2;

    var Geometry = {
        angleDiff: function (a1, a2) {
            var out = Geometry.truncateAngle(Math.abs(a1 - a2));
            var opposite = dPi - out;
            return Math.min(out, opposite);
        },
        angle: function (x0, y0, x, y) {
            var deltaY = y - y0;
            var deltaX = x - x0;
            return Geometry.truncateAngle(Math.atan2(deltaY, deltaX))
        },
        distance: function(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        },
        vectorSum: function(v1, v2) {
            return {x: v1.x + v2.x, y: v1.y + v2.y};
        },
        vectorLength: function(v1) {
            return Math.sqrt(Math.pow(v1.x, 2) + Math.pow(v1.y, 2))
        },
        truncateAngle: function(a) {
            while (a < 0) {
                a += dPi
            }
            while(a > dPi) {
                a -= dPi;
            }
            return Math.round(a * 10000) / 10000;
        }
    };




    return Geometry;
});