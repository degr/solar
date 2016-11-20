Engine.define('ClickContext', 'CanvasImage', function() {

    var CanvasImage = Engine.require('CanvasImage');

    function ClickContext(params) {
        this.player = params.player || 0;
        this.x = -1;
        this.y = -1;
        this.spaceX = -1;
        this.spaceY = -1;
        this.offset = params.offset;
        this.button = null;
        this.playerShip = null;//player ship object. Null if ship is not selected
        this.infoPopup = params.infoPopup;//object that will build information window
    }

    ClickContext.prototype.update = function(clickEvent) {
        this.x = clickEvent.x;
        this.y = clickEvent.y;
        this.spaceX = clickEvent.spaceX;
        this.spaceY = clickEvent.spaceY;
        this.button = clickEvent.button;
    };

    return ClickContext;
});