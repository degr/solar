Engine.define('Geometry', function(){
    var Geometry = {
        angle: function (x0, y0, x, y) {
            var deltaY = y - y0;
            var deltaX = x - x0;
            return Geometry.truncateAngle(Math.atan2(deltaY, deltaX))
        },
        truncateAngle: function(a) {
            var dPi = Math.PI * 2;
            while (a < 0.0) {
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