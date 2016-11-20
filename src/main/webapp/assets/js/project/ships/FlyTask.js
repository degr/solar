Engine.define('FlyTask', ['Geometry', 'Profile'], function() {

    var Geometry = Engine.require('Geometry');
    var Profile = Engine.require('Profile');

    function FlyTask(currentX, currentY, courseX, courseY) {
        this.courseX = courseX;
        this.courseY = courseY;
        this.destination = this.calculateDestination(currentX, currentY);
        this.speed = 0;
        this.slowDown = false;
    }



    FlyTask.prototype.calculateDestination = function(currentX, currentY, pointX, pointY) {
        return Math.sqrt(
            Math.pow(currentX - (pointX === undefined ? this.courseX : pointX), 2) +
            Math.pow(currentY - (pointY === undefined ? this.courseY : pointY), 2)
        );
    };

    FlyTask.prototype.isFinished = function() {
        return this.speed === 0;
    };

    FlyTask.prototype.onTick = function(p, number, acceleration) {
        if(number === 0 && !this.slowDown) {
            var angle = Geometry.angle(p.x, p.y, this.courseX, this.courseY);
            if(angle != p.angle) {
                this.updateAngle(p, angle);
            }
            this.speed += acceleration;
            this.xLength = this.courseX - p.x;
            this.yLength = this.courseY - p.y;
            this.distance = Math.sqrt(Math.pow(this.xLength, 2) + Math.pow(this.yLength, 2));
        } else {
            this.speed -= acceleration;
            if(this.speed < acceleration + 0.0001) {
                this.speed = 0;
            }
        }

        if(this.distance != 0) {
            var ratioX = this.xLength / this.distance;
            var ratioY = this.yLength / this.distance;
            var speed = this.speed / Profile.fps;

            p.x = p.x + ratioX * speed;
            p.y = p.y + ratioY * speed;

            var destination = this.calculateDestination(p.x, p.y);
            while(speed > 0) {
                destination -= (speed * Profile.fps);
                speed -= acceleration;
            }
            this.slowDown = destination < 0;
        }
    };


    FlyTask.prototype.updateAngle = function(shipParams, angle) {
        var pa = shipParams.angle;
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

        var direction;
        if(clockAngle < antiClockAngle ) {
            direction = (clockAngle > 0.3 ? 0.2 : 0.1);
        } else if(clockAngle > antiClockAngle) {
            direction = (antiClockAngle > 0.3 ? -0.2 : -0.1);
        } else {
            direction = 0;
        }

        if(Math.abs(Math.abs(shipParams.angle) - Math.abs(angle)) < Math.abs(direction)) {
            shipParams.angle = angle;
        } else {
            shipParams.angle = Geometry.truncateAngle(shipParams.angle + direction);
        }
    };

    return FlyTask;
});