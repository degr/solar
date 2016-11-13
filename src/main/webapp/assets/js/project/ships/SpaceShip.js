Engine.define('SpaceShip', ['CanvasImage', 'SpaceShipParams', 'Geometry','FlyTask', 'CanvasClickProxy'], function() {

    var CanvasImage = Engine.require('CanvasImage');
    var SpaceShipParams = Engine.require('SpaceShipParams');
    var CanvasClickProxy = Engine.require('CanvasClickProxy');
    var Geometry = Engine.require('Geometry');
    var FlyTask = Engine.require('FlyTask');

    function SpaceShip(params) {
        if(!(params instanceof SpaceShipParams)) {
            throw "Ship should be instantiated with SpaceShipParams class"
        }
        this.params = params;
    }

    SpaceShip.prototype.onClick = function(clickContext) {
        if(this.params.player === clickContext.player) {
            clickContext.playerShip = this;
        } else {
            clickContext.playerShip = null;
        }
        clickContext.infoObject = this;
    };
    SpaceShip.prototype.onMove = function() {
        var flyTasks = this.params.flyTasks;
        var length = flyTasks.length;
        if(length === 0) {
            return;
        }
        var acceleration = this.params.acceleration / flyTasks.length;
        while(length--) {
            var task = flyTasks[length];
            task.onTick(this.params, length, acceleration);
            if(task.isFinished()) {
                flyTasks.splice(length, 1);
            }
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
       // if(!this.image.isLoaded) {
            context.beginPath();
            context.arc(canvasX, canvasY, canvasRadius, 0, Math.PI * 2);
            context.stroke();
            context.strokeStyle = '';
            context.strokeText(params.name, canvasX, canvasY);
       /// } else {
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
            context.stroke();
            /*for(var i = 0;i < SpaceShip.lines.length;i++) {
                var l = SpaceShip.lines[i];
                var a = zoomWindow.canvasCoordinates(l[0], l[1]);
                var b = zoomWindow.canvasCoordinates(l[2], l[3]);
                context.beginPath();
                context.moveTo(a.x, a.y);
                context.lineTo(b.x, b.y);
                context.strokeStyle = 'red';
                context.stroke();
            }*/
        }
      //  }
        var me = this;
        locations.push(
            new CanvasClickProxy(canvasX, canvasY, canvasRadius, function(clickContext){
                me.onClick(clickContext);
            })
        )
    };

    //SpaceShip.lines = [];

    return SpaceShip;
});