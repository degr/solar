Engine.define("CanvasClickProxy", function(){
    function CanvasClickProxy(x, y, r, callback) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.callback = callback;
    }
    CanvasClickProxy.prototype.inCircle = function(x, y) {
        var dx = Math.abs(x-this.x);
        if (    dx >  this.r) return false;
        var dy = Math.abs(y-this.y);
        if (    dy >  this.r ) return false;
        if ( dx+dy <= this.r ) return true;
        return ( dx*dx + dy*dy <= Math.pow(this.r, 2));
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