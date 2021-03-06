Engine.define("PathBuilder", function(){
    function PathBuilder(seed) {
        this.seed = seed;
    }

    PathBuilder.prototype.buildPath = function(module) {
        var path = null;
        switch (module) {
            case 'AngleService':
                path = 'services/' + module;
                break;
            case 'InfoPopup':
                path = 'components/popups/' + module;
                break;
            case 'ClickContext':
            case 'Renderable':
                path = 'canvas/' + module;
                break;
            case 'FlyTask':
            case 'SpaceShip':
            case 'SpaceShipInfo':
            case 'SpaceShipParams':
                path = 'ships/' + module;
                break;
            case 'MovementProgram':
            case 'LinuxMovementProgram':
                path = 'ships/soft/' + module;
                break;
            case 'Planet':
            case 'Planets':
            case 'ZoomWindow':
            case 'PlanetInfo':
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