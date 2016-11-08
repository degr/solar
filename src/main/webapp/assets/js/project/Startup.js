Engine.define('Startup', ['SolarCanvas'], function () {

    var SolarCanvas = Engine.require('SolarCanvas');
    var Startup = {
        start: function () {
            var solarCanvas = new SolarCanvas();
            solarCanvas.beforeOpen();
            solarCanvas.start();
        }
    };
    return Startup;
});