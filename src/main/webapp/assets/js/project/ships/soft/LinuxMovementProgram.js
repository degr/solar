Engine.define('LinuxMovementProgram', ["MovementProgram","Geometry", "AngleService"], function(){
    var MovementProgram = Engine.require("MovementProgram");
    var AngleService = Engine.require("AngleService");
    var Geometry = Engine.require("Geometry");

    var PiD2 = Math.PI / 2;
    var PiM3D2 = Math.PI * 3 / 2;
    var PiM2 = Math.PI * 2;

    function LinuxMovementProgram(courseX, courseY) {
        MovementProgram.apply(this, arguments);
        this.turnBack = false;
        this.anglePrecision = Math.PI / 18;
    }
    LinuxMovementProgram.prototype = Object.create(MovementProgram.prototype);
    LinuxMovementProgram.prototype.constructor = LinuxMovementProgram;

    LinuxMovementProgram.prototype.setCourse = function(courseX, courseY) {
        MovementProgram.prototype.setCourse.apply(this, arguments);
        this.turnBack = false;
    };

    LinuxMovementProgram.prototype.getTurnSpeed = function(
        currentX,
        currentY,
        currentAngle,
        destinationAngle,
        currentVector,
        maxTurn
    ) {
        var vectorLength = this.getVectorLength(currentVector);
        if(this.turnBack) {
            destinationAngle = Geometry.truncateAngle(destinationAngle + Math.PI);
        }
        if(vectorLength) {
            var vectorAngle = this.getVectorAngle(currentVector);
            var resultAngle = this.getResultAngle(destinationAngle, vectorAngle);
            return this.onChangeAngle(currentAngle, resultAngle, maxTurn);
        } else {
            return this.onChangeAngle(currentAngle, destinationAngle, maxTurn);
        }
    };


    LinuxMovementProgram.prototype.getAcceleration = function(
        currentX,
        currentY,
        currentAngle,
        destinationAngle,
        currentVector,
        maxAcceleration,
        maxTurn
    ) {
        var distance = Geometry.distance(currentX, currentY, this.courseX, this.courseY);
        if(this.turnBack) {
            return this.processBreak(distance, currentAngle, destinationAngle, currentVector, maxAcceleration, maxTurn);
        } else {
            return this.processAcceleration(distance, currentAngle, destinationAngle, currentVector, maxAcceleration, maxTurn);
        }

    };

    LinuxMovementProgram.prototype.processAcceleration = function(
        distance, currentAngle, destinationAngle, currentVector, maxAcceleration, maxTurn
    ) {
        if(Math.abs(currentAngle - destinationAngle) <= this.anglePrecision) {
            var speed = Geometry.vectorLength(currentVector);
            var distanceForTurn = (Math.PI / maxTurn) * speed;
            var fixedDistance = distance - distanceForTurn;
            if(fixedDistance <= 0) {
                this.turnBack = true;
                return 0;
            } else if(fixedDistance < maxAcceleration) {
                this.turnBack = true;
                return fixedDistance / maxAcceleration;
            } else {
                while (speed > 0) {
                    speed -= maxAcceleration;
                    fixedDistance -= speed;
                }
                if (fixedDistance <= 0) {
                    this.turnBack = true;
                    return 0;
                } else {
                    this.turnBack = false;
                    return 1;
                }
            }
        } else {
            return 0;
        }
    };

    LinuxMovementProgram.prototype.onChangeAngle = function(currentAngle, destinationAngle, maxTurn) {
        var direction = AngleService.getTurnDirection(currentAngle, destinationAngle);
        if(direction === 0) {
            return 0;
        } else {
            var val = currentAngle - destinationAngle;
            var abs = Math.abs(val);
            if(abs < maxTurn) {
                return direction * val / maxTurn;
            } else {
                return direction
            }
        }
    };
    LinuxMovementProgram.prototype.getVectorLength = function(v) {
        return Geometry.vectorLength(v)
    };

    LinuxMovementProgram.prototype.getVectorAngle = function(v) {
        return Geometry.angle(0, 0, v.x, v.y);
    };
    LinuxMovementProgram.prototype.getResultAngle = function(destinationAngle, vectorAngle){
        if(Math.abs(destinationAngle - vectorAngle) > PiD2) {
            return Geometry.truncateAngle(vectorAngle + Math.PI);
        }
        var step = destinationAngle - vectorAngle;
        var out = Geometry.truncateAngle(destinationAngle + step);
        if(out > 0 && out <= PiD2) {
            if(destinationAngle > Math.PI && destinationAngle <= PiM3D2) {
                return Geometry.truncateAngle(out + Math.PI);
            } else {
                return out;
            }
        } else if(out > PiD2 && out <= Math.PI) {
            if(destinationAngle > PiM3D2 && destinationAngle <= PiM2) {
                return Geometry.truncateAngle(out + Math.PI);
            } else {
                return out;
            }
        } else if(out > Math.PI && out <= PiM3D2) {
            if(destinationAngle > 0 && destinationAngle <= PiD2) {
                return Geometry.truncateAngle(out + Math.PI);
            } else {
                return out;
            }
        } else {
            if(destinationAngle > PiD2 && destinationAngle <= Math.PI) {
                return Geometry.truncateAngle(out + Math.PI);
            } else {
                return out;
            }
        }
    };

    LinuxMovementProgram.prototype.processBreak = function(distance, currentAngle, destinationAngle, currentVector, maxAcceleration, maxTurn) {
        var realAngle = destinationAngle + Math.PI;
        if(Math.abs(realAngle - currentAngle) <= this.anglePrecision) {
            return 1;
        } else {
            return 0;
        }
    };

    return LinuxMovementProgram;
});