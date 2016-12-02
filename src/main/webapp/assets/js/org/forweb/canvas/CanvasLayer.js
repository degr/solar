Engine.define("CanvasLayer", ['Dom'], function(){

    var Dom = Engine.require("Dom");

    function CanvasLayer(width, height, zIndex) {
        this.container = Dom.el('canvas', {width: width, height: height});
        this.context = this.container.getContext('2d');
        this.container.style.zIndex = zIndex;
        this.container.style.position = 'absolute';
    }

    CanvasLayer.prototype.resize = function(width, height){
        this.container.width = width;
        this.container.height = height;
    };
    CanvasLayer.prototype.getContext = function(){
        return this.context;
    };



    return CanvasLayer;
});