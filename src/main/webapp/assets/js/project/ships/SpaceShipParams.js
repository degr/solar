Engine.define('SpaceShipParams', ['CanvasImage', 'LinuxMovementProgram'], function() {

    var CanvasImage = Engine.require('CanvasImage');
    var LinuxMovementProgram = Engine.require('LinuxMovementProgram');

    function SpaceShipParams(params) {
        if(params.x === undefined || params.y === undefined || params.name === undefined ||
            params.imagePath === undefined || params.radius === undefined || params.angleSpeed === undefined) {
            throw "Invalid arguments exception";
        }
        this.x = params.x;
        this.y = params.y;
        this.name = params.name;
        this.imagePath = "/solar/assets/images/ships/" + params.imagePath;
        this.radius = params.radius;
        this.image = new CanvasImage(-10, -10, this.imagePath, this.radius);
        this.acceleration = params.acceleration || 0.33;
        this.player = params.player || 0;
        this.angle = params.angle || 0;
        this.angleSpeed = params.angleSpeed;
        this.movementProgram = params.movementProgram || new LinuxMovementProgram(params.courseX || params.x, params.courseY || params.y);
        this.vector = {x: 0, y: 0};
    }

    return SpaceShipParams;
});