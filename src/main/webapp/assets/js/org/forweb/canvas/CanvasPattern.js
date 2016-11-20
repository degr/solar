Engine.define('CanvasPattern', function() {
    function CanvasPattern(x, y, src, width, height) {
        var me = this;
        me.x = x;
        me.y = y;
        me.width = width;
        me.height = height || width;
        me.image = new Image();
        me.image.src = src;
        me.isLoaded = false;
        me.pattern = null;
        me.image.onload = function(){
            me.isLoaded = true;
        };
    }
    CanvasPattern.prototype.getPattern = function(context) {
        if(this.pattern === null) {
            this.pattern = context.createPattern(this.image, "repeat");
        }
        return this.pattern;
    };
    CanvasPattern.prototype.draw = function(context) {
        var me = this;
        if(me.isLoaded) {
            context.beginPath();
            context.rect(me.x, me.y, me.width, me.height);
            context.fillStyle = me.getPattern(context);
            context.fill();
        }
    };
    return CanvasPattern;
});