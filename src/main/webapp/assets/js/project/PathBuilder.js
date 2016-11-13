Engine.define("PathBuilder", function(){
    function PathBuilder(seed) {
        this.seed = seed;
    }

    PathBuilder.prototype.buildPath = function(module) {
        var path = null;
        switch (module) {
            case 'ShipPopup':
                path = 'components/popups/' + module;
                break;
            case 'ClickContext':
                path = 'canvas/' + module;
                break;
            case 'FlyTask':
            case 'SpaceShip':
            case 'SpaceShipParams':
                path = 'ships/' + module;
                break;
            case 'Planet':
            case 'Planets':
            case 'ZoomWindow':
            case 'SolarSystem':
            case 'SolarCanvas':
            case 'SolarWrapper':
                path = 'solar/' + module;
                break;
            case 'Geometry':
            case 'Startup':
            case 'Profile':
                path = module;
                break;
        }
        return (path ? 'assets/js/project/' + path + ".js?seed=" + this.seed  : '');
    };

    return PathBuilder;
});