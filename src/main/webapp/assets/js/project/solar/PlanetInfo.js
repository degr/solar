Engine.define('PlanetInfo', ['Dom', 'GenericForm'], function(){

    var Dom = Engine.require('Dom');
    var GenericForm = Engine.require('GenericForm');

    function PlanetInfo(planetoid) {
        var model = {
            orbit : planetoid.orbit + " km",
            diameter : planetoid.radius * 2 + " km",
            satellites : planetoid.satellites ? planetoid.satellites.length : "0",
            turnSpeed : planetoid.speed + ' years',
            speed: (Math.ceil(planetoid.orbit * 2 * Math.PI / (365 * 24))) + " km/h"
        };
        var meta = {
            orbit: {
                attr: {
                    disabled: true
                }
            },
            turnSpeed: {
                label: 'One turn take ',
                disabled: true
            }
        };
        var formData = {
            submitButton: false,
            onSubmit: function(){}
        };
        var form = new GenericForm(model, meta, formData);
        this.container = Dom.el('div', 'planet-info', form)
    }
    return PlanetInfo;
});