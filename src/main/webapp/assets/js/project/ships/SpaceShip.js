Engine.define('SpaceShip', ['CanvasImage','Profile', 'SpaceShipParams', 'Renderable', 'Geometry','FlyTask', 'CanvasClickProxy', 'Dom', 'SpaceShipInfo'], function() {

    var CanvasImage = Engine.require('CanvasImage');
    var SpaceShipParams = Engine.require('SpaceShipParams');
    var CanvasClickProxy = Engine.require('CanvasClickProxy');
    var SpaceShipInfo = Engine.require('SpaceShipInfo');
    var Geometry = Engine.require('Geometry');
    var FlyTask = Engine.require('FlyTask');
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

    SpaceShip.prototype.drawInfo = function(clickContext) {
        if(this.infoForm === null) {
            this.infoForm = new SpaceShipInfo(this.params);
        }
        clickContext.infoPopup.setTitle(Dom.el('h3', null, 'Spaceship ' + this.params.player));
        clickContext.infoPopup.setContent(this.infoForm);
    };


    SpaceShip.prototype.onMove = function() {
        var flyTasks = this.params.flyTasks;
        var length = flyTasks.length;
        if(length === 0) {
            return;
        }
        var acceleration = this.params.acceleration / Profile.fps /*flyTasks.length **/ ;
        while(length--) {
            var task = flyTasks[length];
            task.onTick(this.params, length, acceleration);
            if(task.isFinished()) {
                flyTasks.splice(length, 1);
            }
        }
        if(flyTasks.length === 0) {
            this.params.courseX = null;
            this.params.courseY = null;
        }
    };

    SpaceShip.prototype.setCourse = function(spaceX, spaceY) {
        this.params.courseX = spaceX;
        this.params.courseY = spaceY;
        this.params.flyTasks.unshift(new FlyTask(this.params.x, this.params.y, spaceX, spaceY));

        //SpaceShip.lines.push([this.params.x, this.params.y, spaceX, spaceY]);

    };

    SpaceShip.prototype.draw = function(context, zoomWindow, locations) {
        var params = this.params;
        this.onMove();
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

        if(params.courseX !== null && params.courseY !== null) {
            var courseFixed = zoomWindow.canvasCoordinates(params.courseX, params.courseY);
            context.beginPath();
            context.moveTo(canvasX, canvasY);
            context.lineTo(courseFixed.x, courseFixed.y);
            context.strokeStyle = '#00FF40';
            var d = params.flyTasks[0].distance;
            context.strokeText(zoomWindow.getReadableDistance(d, d > 1 ? 200 : 0), courseFixed.x, courseFixed.y);
            context.stroke();
        }
        this.onChange({x: canvasX, y: canvasY, radius: canvasRadius});
        if(this.infoForm !== null) {
            var speed;
            var fl = this.params.flyTasks;
            if(fl.length === 1) {
                speed = SpaceShip.correctSpeed(fl[0].speed) + " km/h";
            } else if(fl.length > 1) {
                speed = "~" + SpaceShip.correctSpeed(fl[0].speed) + " km/h";
            } else {
                speed = 0;
            }
            this.infoForm.form.fields.speed.setValue(
                speed
            );
        }
    };

    SpaceShip.correctSpeed = function(speed){
        return Math.round((speed * 60 * 60 / 2 /* ?? */) );
    };

    return SpaceShip;
});