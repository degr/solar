Engine.define("MovementProgram", function() {
    function MovementProgram(courseX, courseY){
        this.setCourse(courseX, courseY);
        this.onCourse = false;
        this.shuntingEngine = false;
    }
    MovementProgram.prototype.setCourse = function(courseX, courseY){
        this.courseX = courseX;
        this.courseY = courseY;
        this.onCourse = true;
        this.setShuntingEngine(false);
    };

    MovementProgram.prototype.setShuntingEngine = function(shuntingEngine) {
        this.shuntingEngine = shuntingEngine;
    };

    MovementProgram.prototype.isShuntingEngine = function(){
        return this.shuntingEngine;
    };
    MovementProgram.prototype.calculateDestination = function(currentX, currentY, pointX, pointY) {
        return Math.sqrt(
            Math.pow(currentX - (pointX === undefined ? this.courseX : pointX), 2) +
            Math.pow(currentY - (pointY === undefined ? this.courseY : pointY), 2)
        );
    };

    MovementProgram.prototype.isOnCourse = function(currentX, currentY, pointX, pointY) {
        return this.onCourse;
    };

    /**
     * Get turn speed between -1 and 1
     * @param currentAngle current angle of ship
     * @param destinationAngle destination angle of course
     * @param currentVector speed vector of the ship
     * @param maxTurn angle absolute value, that can be changed
     */
    MovementProgram.prototype.getTurnSpeed = function(currentAngle, destinationAngle, currentVector, maxTurn) {
        throw "Implement this function";
    };

    /**
     *
     * @param currentAngle cur
     * @param destinationAngle
     * @param currentVector
     * @param maxAcceleration
     */
    MovementProgram.prototype.getAcceleration = function(currentAngle, destinationAngle, currentVector, maxAcceleration) {
        throw "Implement this function";
    };

    return MovementProgram;
});