Engine.define('SpaceShip', ['CanvasImage', 'CanvasClickProxy'], function() {

    var CanvasImage = Engine.require('CanvasImage');
    var CanvasClickProxy = Engine.require('CanvasClickProxy');

    function SpaceShip(x, y, params) {
        this.x = x;
        this.y = y;
        this.name = params.name;
        this.radius = 0.1;
        this.image = new CanvasImage(-10, -10, "/solar/assets/images/ships/ship.png", this.radius, this.radius);
    }

    SpaceShip.prototype.onClick = function(params) {
        console.log(params)
    };
    SpaceShip.prototype.draw = function(context, zoomWindow, locations) {

        var fixed = zoomWindow.canvasCoordinates(this.x, this.y);
        var canvasX = fixed.x;
        var canvasY = fixed.y;

        var canvasRadius = zoomWindow.ratio * this.radius;
        if(canvasRadius < 16) {
            canvasRadius = 16;
        }
       // if(!this.image.isLoaded) {
            context.beginPath();
            context.arc(canvasX, canvasY, canvasRadius, 0, Math.PI * 2);
            context.stroke();
            context.strokeStyle = '';
            context.strokeText(this.name, canvasX, canvasY);
       /// } else {
            this.image.width = canvasRadius;
            this.image.height = canvasRadius;
            this.image.x = canvasX;
            this.image.y = canvasY;
            this.image.draw(context);
      //  }
        var me = this;
        locations.push(
            new CanvasClickProxy(canvasX, canvasY, canvasRadius, function(params){
                me.onClick(params);
            })
        )
    };

    return SpaceShip;
});