Engine.define("AngleService", ["Geometry", "Profile"], function(){

    var Geometry = Engine.require("Geometry");

    return {
        getTurnDirection: function(currentAngle, angle){
            var pa = currentAngle;
            var clockAngle = null;
            var antiClockAngle = null;
            if(pa >= 0) {
                if(angle >= 0) {
                    if(angle > pa) {
                        clockAngle = angle - pa;
                    } else if (angle < pa) {
                        antiClockAngle = pa - angle;
                    } else {
                        clockAngle = Math.PI;
                    }
                } else {
                    antiClockAngle = pa + (-1 * angle);
                }
            } else {
                if(angle >= 0) {
                    clockAngle = angle + (-1 * pa);
                } else {
                    if(angle < pa) {
                        antiClockAngle = (angle - pa) * -1;
                    } else if (angle > pa) {
                        clockAngle = (pa - angle) * -1;
                    } else {
                        clockAngle = Math.PI;
                    }
                }
            }
            if(clockAngle == null) {
                clockAngle = Math.PI * 2 - antiClockAngle;
            } else {
                antiClockAngle = Math.PI * 2 - clockAngle;
            }

            if(clockAngle < antiClockAngle ) {
                return 1
            } else if(clockAngle > antiClockAngle) {
                return -1
            } else {
                return 0;
            }
        }
    }
});