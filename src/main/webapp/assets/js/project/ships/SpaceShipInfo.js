Engine.define('SpaceShipInfo', ['Dom','Profile', 'GenericForm'], function(){

    var Dom = Engine.require('Dom');
    var Profile = Engine.require('Profile');
    var GenericForm = Engine.require('GenericForm');

    function SpaceShipInfo(params) {
        var model = {
            acceleration : (params.acceleration * 1000) + " m/s2",
            name : params.name,
            length : (params.radius * 2000) + ' m',
            speed : this.calculateSpeed(params.flyTasks)
        };
        console.log(params.speed);
        var meta = {
            name: {
                label: 'Pilot Name'
            },
            acceleration: {
                label: 'Max acceleration'
            }
        };
        var formData = {
            submitButton: false,
            onSubmit: function(){}
        };
        this.form = new GenericForm(model, meta, formData);
        this.container = Dom.el('div', 'ship-info', this.form)
    }

    SpaceShipInfo.prototype.calculateSpeed = function(tasks) {
        if(!tasks || tasks.length === 0) {
            return 0;
        }

        return Math.ceil(tasks[0].speed * Profile.fps * 3600) + " km/h";
    };
    return SpaceShipInfo;
});