Engine.define('Startup', ['SolarWrapper'], function () {

    var SolarWrapper = Engine.require('SolarWrapper');
    var Startup = {
        start: function () {
            var solarWrapper = new SolarWrapper({});
            solarWrapper.start();
        }
    };
    return Startup;
});