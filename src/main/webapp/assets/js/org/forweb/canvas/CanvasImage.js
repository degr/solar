Engine.define('CanvasImage', function() {
    function CanvasImage(x, y, src, width, height) {
        var me = this;
        me.x = x;
        me.y = y;
        me.width = width;
        me.height = height || width;
        me.image = new Image();
        me.image.src = src;
        me.isLoaded = false;
        me.drawInCenter = true;
        me.angle = 0;
        me.image.onload = function(){
            me.isLoaded = true;
        }
    }
    CanvasImage.prototype.draw = function(context) {
        var me = this;
        if(me.isLoaded) {
            if(me.angle === 0) {
                if (me.drawInCenter) {
                    context.drawImage(me.image, me.x - me.width / 2, me.y - me.height / 2, me.width, me.height);
                } else {
                    context.drawImage(me.image, me.x, me.y, me.width, me.height);
                }
            } else {
                context.save();
                context.translate(me.x, me.y);
                context.rotate(me.angle);
                if(me.drawInCenter) {
                    context.drawImage(me.image, - me.width / 2, - me.height / 2, me.width, me.height);
                } else {
                    context.drawImage(me.image, 0, 0, me.width, me.height);
                }
                context.restore();
            }
        }
    };
    return CanvasImage;
});