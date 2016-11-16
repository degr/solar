Engine.define('SolarWrapper', ['SolarCanvas', 'InfoPopup'], function () {

    var InfoPopup = Engine.require('InfoPopup');
    var SolarCanvas = Engine.require('SolarCanvas');


    function SolarWrapper(context) {
        this.infoPopup = new InfoPopup();
        this.solarCanvas = new SolarCanvas(context, this.infoPopup);
    }

    SolarWrapper.prototype.start = function() {
        this.solarCanvas.beforeOpen();
        this.solarCanvas.start();
    };

    return SolarWrapper;
});