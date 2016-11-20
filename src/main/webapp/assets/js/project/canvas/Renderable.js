Engine.define("Renderable", function(){
    function Renderable(){
        this.listeners = [];
    }

    Renderable.prototype.addListener = function(listener) {
        this.listeners.push(listener);
    };

    Renderable.prototype.onChange = function(params) {
        for(var i = 0; i < this.listeners.length; i++) {
            this.listeners[i].onChange(params);
        }
    };

    return Renderable;
});