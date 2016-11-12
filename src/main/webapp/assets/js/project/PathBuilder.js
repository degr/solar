Engine.define("PathBuilder", function(){
    function PathBuilder(seed) {
        this.seed = seed;
    }

    PathBuilder.prototype.buildPath = function(module) {
        var path = null;
        switch (module) {
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
        }
        return (path ? 'assets/js/project/' + path + ".js?seed" + this.seed  : '');
    };

    return PathBuilder;
});