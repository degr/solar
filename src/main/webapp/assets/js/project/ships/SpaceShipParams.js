Engine.define('SpaceShipParams', 'CanvasImage', function() {

    var CanvasImage = Engine.require('CanvasImage');

    function SpaceShipParams(params) {
        if(params.x === undefined || params.y === undefined || params.name === undefined ||
            params.imagePath === undefined || params.radius === undefined) {
            throw "Invalid arguments exception";
        }
        this.x = params.x;
        this.y = params.y;
        this.name = params.name;
        this.imagePath = "/solar/assets/images/ships/" + params.imagePath;
        this.radius = params.radius;
        this.image = new CanvasImage(-10, -10, this.imagePath, this.radius);
        this.acceleration = params.acceleration || 0.03;
        this.player = params.player || 0;
        this.courseX = params.courseX || null;
        this.courseY = params.courseY || null;
        this.angle = params.courseY || 0;
        this.flyTasks = params.flyTasks || [];
    }

    return SpaceShipParams;
});