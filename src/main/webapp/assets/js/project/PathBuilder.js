Engine.define("PathBuilder", function(){
    function PathBuilder(seed) {
        this.seed = seed;
    }

    PathBuilder.prototype.buildPath = function(module) {
        var path;
        switch (module) {
            case 'CanvasImage':
            case 'CanvasClickProxy':
                path = 'canvas/' + module;
                break;
            case 'SpaceShip':
                path = 'ships/' + module;
                break;
            case 'Planet':
            case 'Planets':
            case 'SolarSystem':
            case 'SolarCanvas':
            case 'ZoomWindow':
                path = 'solar/' + module;
                break;
            case 'Startup':
            case 'Profile':
                path = module;
                break;
            default:
                throw 'Unkown class - ' + module;
        }
        return (path ? 'assets/js/project/' + path + ".js?seed" + this.seed  : '');
    };

    return PathBuilder;
});