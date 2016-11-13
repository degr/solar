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
    CanvasClickProxy.prototype.onClick = function(params) {
        if (this.inCircle(params.x, params.y)) {
            this.callback(params);
            return true;
        }
        return false;
    };
    return CanvasClickProxy;
});