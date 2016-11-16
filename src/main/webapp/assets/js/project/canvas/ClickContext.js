Engine.define('ClickContext', 'CanvasImage', function() {

    var CanvasImage = Engine.require('CanvasImage');

    function ClickContext(params) {
        this.player = params.player || 0;
        this.x = -1;
        this.y = -1;
        this.spaceX = -1;
        this.spaceY = -1;
        this.offset = params.offset;
        this.zoomWindow = params.zoomWindow;
        this.button = null;
        this.playerShip = null;//player ship object. Null if ship is not selected
        this.infoPopup = params.infoPopup;//object that will build information window
        if(!this.zoomWindow) {
            throw 'ZoomWindow is required field for ClickContext';
        }
    }

    ClickContext.prototype.update = function(e) {
        this.x = e.clientX + window.scrollX - this.offset.left;
        this.y = e.clientY + window.scrollY - this.offset.top;
        var zw = this.zoomWindow;
        var r = zw.rectangle;
        this.spaceX = r.x + this.x / zw.ratio;
        this.spaceY = r.y + this.y / zw.ratio;
        this.button = e.button === 0 ? 'left' : 'right';
    };

    return ClickContext;
});