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
        this.anglePrecision = Math.PI / 36;
        this.distance = -1;
    }
    LinuxMovementProgram.prototype = Object.create(MovementProgram.prototype);
    LinuxMovementProgram.prototype.constructor = LinuxMovementProgram;

    /**
     * Override
     * @param courseX
     * @param courseY
     */
    LinuxMovementProgram.prototype.setCourse = function(courseX, courseY) {
        MovementProgram.prototype.setCourse.apply(this, arguments);
        this.turnBack = false;
        this.distance = -1;
    };

    /**
     * Override
     * @param currentX
     * @param currentY
     * @param currentAngle
     * @param destinationAngle
     * @param currentVector
     * @param maxTurn
     */
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
        if(vectorLength > 0) {
            //relocate existing course
            var vectorAngle = this.getVectorAngle(currentVector);
            var diff = Geometry.angleDiff(vectorAngle, destinationAngle);
            if(diff < PiD2) {
                //ship fly in same direction, but require some course correction.
                var corrected = Geometry.truncateAngle(destinationAngle + diff);
                if(Geometry.angleDiff(corrected, vectorAngle) < diff) {
                    corrected = Geometry.truncateAngle(destinationAngle - diff);
                }
                return this.onChangeAngle(currentAngle, corrected, maxTurn);
            } else {
                //ship fly in wrong direction, we should stop it
                return this.onChangeAngle(currentAngle, Geometry.truncateAngle(vectorAngle + Math.PI), maxTurn);
            }
        } else {
            //start to fly from stable position
            return this.onChangeAngle(currentAngle, destinationAngle, maxTurn);
        }
    };


    /**
     * Override
     * @param currentX
     * @param currentY
     * @param currentAngle
     * @param destinationAngle
     * @param currentVector
     * @param maxAcceleration
     * @param maxTurn
     */
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
        if(this.turnBack && this.distance > -1 && this.distance < distance) {
            this.turnBack = false;
            return 0;
        }
        if(this.distance === -1) {
            this.distance = distance;
        }
        this.distance = distance;
        if(this.turnBack) {
            return this.processBreak(currentAngle, destinationAngle, currentVector, maxAcceleration, maxTurn);
        } else {
            return this.processAcceleration(currentAngle, destinationAngle, currentVector, maxAcceleration, maxTurn);
        }

    };

    LinuxMovementProgram.prototype.processAcceleration = function(
        currentAngle, destinationAngle, currentVector, maxAcceleration, maxTurn
    ) {
        var distance = this.distance;
        var isOnCourse = Geometry.angleDiff(currentAngle, destinationAngle) <= this.anglePrecision;
        var isOnBreak = false;
        if(!isOnCourse) {
            var vectorAngle = this.getVectorAngle(currentVector);
            if(vectorAngle !== 0) {
                isOnBreak = Geometry.angleDiff(currentAngle, Geometry.truncateAngle(vectorAngle + Math.PI)) <= this.anglePrecision
            }
        }
        if(isOnCourse || isOnBreak) {
            var speed = Geometry.vectorLength(currentVector);
            var distanceForTurn = ((Math.PI - this.anglePrecision) / maxTurn) * speed;
            var fixedDistance = distance - distanceForTurn;
            if(fixedDistance <= 0) {
                this.turnBack = true;
                return 0;
            } else if(fixedDistance < maxAcceleration) {
                this.turnBack = true;
                return fixedDistance / maxAcceleration;
            } else {
                fixedDistance -= maxAcceleration;
                while (speed > 0) {
                    speed -= maxAcceleration;
                    fixedDistance -= speed;
                }
                if (fixedDistance <= 0) {
                    if(isOnBreak) {
                        return 1;
                    }
                    this.turnBack = true;
                    return 0;
                } else {
                    this.turnBack = false;
                    return 1;
                }
            }
        } else {
            var vectorLength = Geometry.vectorLength(currentVector);
            if(vectorLength) {
                if(vectorLength < maxAcceleration) {
                    return vectorLength / maxAcceleration
                } else {
                    return 1;
                }
            } else {
                return 0;
            }
        }
    };

    LinuxMovementProgram.prototype.onChangeAngle = function(currentAngle, destinationAngle, maxTurn) {
        var direction = AngleService.getTurnDirection(currentAngle, destinationAngle);
        if(direction === 0) {
            return 0;
        } else {
            var val = Geometry.angleDiff(currentAngle, destinationAngle);
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


    LinuxMovementProgram.prototype.processBreak = function(currentAngle, destinationAngle, currentVector, maxAcceleration, maxTurn) {
        var distance = this.distance;
        var realAngle = destinationAngle + Math.PI;


        if(Geometry.angleDiff(realAngle, currentAngle) <= this.anglePrecision) {
            var speed = Geometry.vectorLength(currentVector);
            if(distance < maxAcceleration) {
                if(speed < maxAcceleration) {
                    return speed / maxAcceleration;
                } else {
                    return 1;
                }
            } else {
                return 1;
            }
        } else {
            return 0;
        }
    };

    return LinuxMovementProgram;
});