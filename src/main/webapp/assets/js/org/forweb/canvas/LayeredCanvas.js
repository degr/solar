Engine.define("LayeredCanvas", ['CanvasLayer', 'Dom'], function(){

    var Dom = Engine.require("Dom");
    var CanvasLayer = Engine.require("CanvasLayer");

    function LayeredCanvas(layersNumber, width, height) {
        this.layers = [];
        this.width = width;
        this.height = height;
        var i = 0;
        while(i < layersNumber) {
            this.layers.push(new CanvasLayer(width, height, layersNumber - i++));
        }
        this.container = Dom.el('div', "layered-canvas", this.layers)
    }

    LayeredCanvas.prototype.getContext = function(num)  {
        return this.layers[num].getContext();
    };

    LayeredCanvas.prototype.getCanvas = function(num)  {
        return this.layers[num].container;
    };

    LayeredCanvas.prototype.resize = function(width, height){
        var length = this.layers.length;
        this.width = width;
        this.height = height;
        while(length--) {
            this.layers[length].resize(width, height);
        }
    };
    LayeredCanvas.prototype.setClass = function(clazz){
        var length = this.layers.length;
        while(length--) {
            Dom.addClass(this.layers[length].container, clazz);
        }
    };

    return LayeredCanvas;
});