Engine.define('SpaceShip', ['CanvasImage','Profile', 'SpaceShipParams', 'Renderable', 'Geometry', 'CanvasClickProxy', 'Dom', 'SpaceShipInfo'], function() {

    var CanvasImage = Engine.require('CanvasImage');
    var SpaceShipParams = Engine.require('SpaceShipParams');
    var CanvasClickProxy = Engine.require('CanvasClickProxy');
    var SpaceShipInfo = Engine.require('SpaceShipInfo');
    var Geometry = Engine.require('Geometry');
    var Renderable = Engine.require('Renderable');
    var Dom = Engine.require('Dom');
    var Profile = Engine.require('Profile');

    function SpaceShip(params) {
        Renderable.apply(this, arguments);
        if(!(params instanceof SpaceShipParams)) {
            throw "Ship should be instantiated with SpaceShipParams class"
        }
        this.params = params;
        this.infoForm = null;
    }
    SpaceShip.prototype = Object.create(Renderable.prototype);
    SpaceShip.constructor = SpaceShip;

    SpaceShip.prototype.drawInfo = function(clickContext) {
        if(this.infoForm === null) {
            this.infoForm = new SpaceShipInfo(this.params);
        }
        clickContext.infoPopup.setTitle(Dom.el('h3', null, 'Spaceship ' + this.params.player));
        clickContext.infoPopup.setContent(this.infoForm);
    };


    SpaceShip.prototype.onMove = function() {
        var params = this.params;
        var movementProgram = params.movementProgram;
        if(!movementProgram.isOnCourse()) {
            return;
        }
        var distance = Geometry.distance(params.x, params.y, movementProgram.courseX, movementProgram.courseY);
        if(params.vector.x === 0 && params.vector.y === 0 && distance < 10) {
            movementProgram.setShuntingEngine(true);
        }
        if(movementProgram.isShuntingEngine()) {
            var shuntingSpeed = this.params.acceleration / (10 * Profile.fps);
            var dist = Geometry.distance(this.params.x, this.params.y, movementProgram.courseX, movementProgram.courseY);
            if(shuntingSpeed > distance) {
                params.x = movementProgram.courseX;
                params.y = movementProgram.courseY;
                params.vector.x = 0;
                params.vector.y = 0;
                return;
            }

            var shuntAngle = Geometry.angle(this.params.x, this.params.y, movementProgram.courseX, movementProgram.courseY);
            var shiftX = Math.cos(shuntAngle) * shuntingSpeed;
            var shiftY = Math.sin(shuntAngle) * shuntingSpeed;
            this.params.x += shiftX;
            if(Geometry.distance(this.params.x, this.params.y, movementProgram.courseX, movementProgram.courseY) > dist) {
                this.params.x -= 2 * shiftX;
            }
            this.params.y += shiftY;
            if(Geometry.distance(this.params.x, this.params.y, movementProgram.courseX, movementProgram.courseY) > dist) {
                this.params.y -= 2 * shiftY;
            }
            return;
        }
        var angle = Geometry.angle(params.x, params.y, movementProgram.courseX, movementProgram.courseY);
        var maxTurnSpeed = params.angleSpeed / Profile.fps;
        var turnSpeed = params.movementProgram.getTurnSpeed(params.x, params.y, params.angle, angle, params.vector, maxTurnSpeed);
        if(turnSpeed > 1 || turnSpeed < -1) {
            throw "Invalid turn speed";
        }
        params.angle = Geometry.truncateAngle(params.angle + maxTurnSpeed * turnSpeed);

        var maxAcceleration = params.acceleration / Profile.fps;
        var growAcceleration = params.movementProgram.getAcceleration(params.x, params.y, params.angle, angle, params.vector, maxAcceleration, maxTurnSpeed);
        if(growAcceleration < 0 || growAcceleration > 1) {
            throw "Invalid acceleration"
        }
        var realAcceleration = maxAcceleration * growAcceleration;
        if(realAcceleration != 0) {
            var tickVector = {
                x: Math.cos(params.angle) * realAcceleration,
                y: Math.sin(params.angle) * realAcceleration
            };
            params.vector = Geometry.vectorSum(params.vector, tickVector);
        }
        if(distance < 1 && Geometry.vectorLength(params.vector) < 2 ) {
            movementProgram.setShuntingEngine(true);
            params.vector.x = 0;
            params.vector.y = 0;
        }
        params.x += params.vector.x;
        params.y += params.vector.y;
    };

    SpaceShip.prototype.isArrive = function() {
        var params = this.params;
        var vector = params.vector;
        if(vector.x == 0 && vector.y == 0) {
            return params.x === params.courseX && params.y === params.courseY
        } else {
            return false;
        }
    };

    SpaceShip.prototype.setCourse = function(spaceX, spaceY) {
        this.params.courseX = spaceX;
        this.params.courseY = spaceY;
        this.params.movementProgram.setCourse(spaceX, spaceY);

        //SpaceShip.lines.push([this.params.x, this.params.y, spaceX, spaceY]);

    };

    SpaceShip.prototype.draw = function(context, zoomWindow) {
        this.onMove();

        var params = this.params;
        var movementProgram = params.movementProgram;
        var ratio = zoomWindow.getRatio();
        var fixed = zoomWindow.canvasCoordinates(params.x, params.y);
        var canvasX = fixed.x;
        var canvasY = fixed.y;
        var canvasRadius = ratio * params.radius;
        if(canvasRadius < 16) {
            canvasRadius = 16;
        }
        if(this.selected) {
            context.beginPath();
            context.arc(canvasX, canvasY, canvasRadius * 1.2, 0, Math.PI * 2);

            context.shadowBlur = 20;
            context.shadowColor = "steelblue";
            context.strokeStyle = "steelblue";
            context.strokeWidth = 1;
            context.stroke();

            context.strokeStyle = 'black';
            context.textAlign = 'center';
            context.shadowBlur = 0;
            context.strokeWidth = 1;
            context.strokeText(params.name, canvasX, canvasY + canvasRadius * 1.2 + 8);
        }
        params.image.width = canvasRadius * 2;
        params.image.height = canvasRadius* 2;
        params.image.x = canvasX;
        params.image.y = canvasY;
        params.image.angle = params.angle;
        params.image.draw(context);

        if(!this.isArrive()) {
            var courseFixed = zoomWindow.canvasCoordinates(movementProgram.courseX, movementProgram.courseY);
            context.beginPath();
            context.moveTo(canvasX, canvasY);
            context.lineTo(courseFixed.x, courseFixed.y);
            context.strokeStyle = '#00FF40';
            var d = Geometry.distance(params.x, params.y, movementProgram.courseX, movementProgram.courseY);
            context.strokeText(zoomWindow.getReadableDistance(d, d > 1 ? 200 : 0), courseFixed.x, courseFixed.y);
            context.stroke();
        }
        context.save();
        context.beginPath();
        context.translate(canvasX, canvasY);
        context.moveTo(0, 0);
        context.lineTo(this.params.vector.x * zoomWindow.ratio * Profile.fps, this.params.vector.y* zoomWindow.ratio* Profile.fps);
        context.stroke();
        context.restore();

        context.save();
        context.beginPath();
        context.translate(canvasX, canvasY);
        context.moveTo(0, 0);
        context.strokeStyle = "red";
        var x = Math.cos(this.params.angle) * 40;
        var y = Math.sin(this.params.angle) * 40;
        context.lineTo(x, y);
        context.stroke();
        context.restore();



        this.onChange({x: canvasX, y: canvasY, radius: canvasRadius});
        if(this.infoForm !== null) {
            var speed = Geometry.vectorLength(this.params.vector);
            this.infoForm.form.fields.speed.setValue(
                speed
            );
        }

        /*if(this.params.vector.x != 0 && this.params.vector.y != 0 && Math.random() * 100 > 95) {
            SpaceShip.points.push({x: params.x, y: params.y});
        }
        for(var i = 0; i < SpaceShip.points.length; i++) {
            context.beginPath();
            var c = zoomWindow.canvasCoordinates(SpaceShip.points[i].x, SpaceShip.points[i].y);
            console.log(c);
            context.arc(
                c.x,
                c.y,
                3,
                0,
                Math.PI * 2
            );
            context.stroke();
        }*/
    };

    SpaceShip.points = [];

    SpaceShip.correctSpeed = function(speed){
        return Math.round((speed * 60 * 60 / 2 /* ?? */) );
    };

    return SpaceShip;
});