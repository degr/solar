Engine.define("CanvasPathBuilder", function(){
    function CanvasPathBuilder(seed) {
        this.seed = seed;
    }

    CanvasPathBuilder.prototype.buildPath = function(module) {
        var path = null;
        switch (module) {
            case 'CanvasImage':
            case 'CanvasLayer':
            case 'LayeredCanvas':
            case 'CanvasPattern':
            case 'CanvasClickProxy':
                path = module;
                break;
        }
        return (path ? 'assets/js/org/forweb/canvas/' + path + ".js?seed=" + this.seed  : '');
    };

    return CanvasPathBuilder;
});