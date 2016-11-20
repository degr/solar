Engine.define("CanvasClickProxy", function(){
    function CanvasClickProxy(callback) {
        this.x = 0;
        this.y = 0;
        this.radius = 0;
        this.callback = callback;
    }
    CanvasClickProxy.prototype.inCircle = function(x, y) {
        var dx = Math.abs(x-this.x);
        if (dx >  this.radius) return false;
        var dy = Math.abs(y-this.y);
        if (dy >  this.radius ) return false;
        if (dx+dy <= this.radius ) return true;
        return ( dx*dx + dy*dy <= Math.pow(this.radius, 2));
    };
    CanvasClickProxy.prototype.onChange = function(properties) {
        this.x = properties.x;
        this.y = properties.y;
        this.radius = properties.radius;
    };
    CanvasClickProxy.prototype.onClick = function(clickContext) {
        if (this.inCircle(clickContext.x, clickContext.y)) {
            var out = this.callback(clickContext);
            return out === undefined ? true : out;
        }
        return false;
    };
    return CanvasClickProxy;
});