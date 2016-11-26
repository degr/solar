Engine.define('FlyTask', ['Geometry', 'Profile', 'AngleService'], function() {

    var AngleService = Engine.require('AngleService');
    var Geometry = Engine.require('Geometry');
    var Profile = Engine.require('Profile');

    function FlyTask(currentX, currentY, courseX, courseY) {
        this.courseX = courseX;
        this.courseY = courseY;
        this.destination = this.calculateDestination(currentX, currentY);
        this.speed = 0;
        this.slowDown = false;
        this.angleSet = false;
    }


    FlyTask.prototype.isFinished = function() {
        return this.speed === 0 && this.angleSet;
    };

    FlyTask.prototype.onTick = function(p, number, acceleration) {
        if(number === 0 && !this.slowDown) {
            var angle = Geometry.angle(p.x, p.y, this.courseX, this.courseY);

            this.speed += acceleration;
            this.xLength = this.courseX - p.x;
            this.yLength = this.courseY - p.y;
            this.distance = Math.sqrt(Math.pow(this.xLength, 2) + Math.pow(this.yLength, 2));
        } else {
            this.angleSet = true;
            this.speed -= acceleration;
            if(this.speed < acceleration + 0.0001) {
                this.speed = 0;
            }
        }

        if(this.distance != 0) {
            var ratioX = this.xLength / this.distance;
            var ratioY = this.yLength / this.distance;
            var speed = this.speed / Profile.fps;

            AngleService.changeVector(p.vector, jj)

            p.x = p.x + ratioX * speed;
            p.y = p.y + ratioY * speed;

            /*var destination = this.calculateDestination(p.x, p.y);
            while(speed > 0) {
                destination -= (speed * Profile.fps);
                speed -= acceleration;
            }
            this.slowDown = destination < 0;*/
        }
    };


    FlyTask.prototype.updateAngle = function(shipParams, angle) {
        AngleService.turn(shipParams, angle);
    };

    return FlyTask;
});