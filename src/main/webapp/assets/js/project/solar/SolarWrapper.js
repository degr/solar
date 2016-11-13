Engine.define('SolarWrapper', ['SolarCanvas', 'ShipPopup'], function () {

    var ShipPopup = Engine.require('ShipPopup');
    var SolarCanvas = Engine.require('SolarCanvas');


    function SolarWrapper() {
        this.shipPopup = new ShipPopup();
        this.solarCanvas = new SolarCanvas();
        var me = this;
        this.solarCanvas.addListener(function(params){
            me.shipPopup.update(params);
        })
    }

    SolarWrapper.prototype.start = function() {
        this.solarCanvas.beforeOpen();
        this.solarCanvas.start();
    };

    return SolarWrapper;
});