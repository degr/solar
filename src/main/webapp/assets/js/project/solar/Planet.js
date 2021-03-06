Engine.define('Planet', ['SolarSystem', 'Profile','Renderable', 'PlanetInfo', 'CanvasClickProxy'], function(){

    var CanvasClickProxy = Engine.require('CanvasClickProxy');
    var SolarSystem = Engine.require('SolarSystem');
    var PlanetInfo = Engine.require('PlanetInfo');
    var Profile = Engine.require('Profile');
    var Renderable = Engine.require('Renderable');
    var Dom = Engine.require('Dom');

    function Planet(name, data) {
        Renderable.apply(this, arguments);

        this.name = name;
        if(data.orbit === undefined)throw "Invalid orbit";
        this.orbit = data.orbit;
        if(data.radius=== undefined)throw "Invlid radius";
        this.radius = data.radius;
        this.angle = data.angle || 0;
        if(data.speed=== undefined)throw "Invalid speed";
        this.speed = data.speed;
        this.imageLoaded = false;
        this.image = new Image();
        var me = this;
        this.image.onload = function() {
            me.imageLoaded = true;
        };
        this.image.src = Profile.path + "/assets/images/planets/" + this.name + '/planet.png';
        this.satellites = null;
        if(data.satellites) {
            this.satellites = [];
            for(var i = 0; i < data.satellites.length; i++) {
                var satellite = data.satellites[i];
                this.satellites.push(new Planet(satellite.name, satellite));
            }
        }
    }
    Planet.prototype = Object.create(Renderable.prototype);

    Planet.prototype.draw = function(context, zoomWindow, locations) {
        var planetInfo = Planet.drawPlanetoid(
            this,
            context,
            zoomWindow,
            locations,
            {orbit: 'steelblue', planetoid: '#01DF3A', label: '#00FF40'},
            SolarSystem.radius,
            SolarSystem.radius
        );


        if(this.satellites && this.satellites.length) {
            var ratio = zoomWindow.getRatio();
            if (planetInfo.radius > 2) {
                var shiftX = planetInfo.x / ratio + zoomWindow.rectangle.x;
                var shiftY = planetInfo.y / ratio + zoomWindow.rectangle.y;
                for (var i = 0; i < this.satellites.length; i++) {
                    Planet.drawPlanetoid(
                        this.satellites[i],
                        context,
                        zoomWindow,
                        locations,
                        {orbit: '#FAAC58', planetoid: '#F3E2A9', label: '#F3E2A9'},
                        shiftX,
                        shiftY
                    );
                }
            } else {
                for (var j = 0; j < this.satellites.length; j++) {
                    this.satellites[j].updateAngle();
                }
            }
        }
    };

    Planet.prototype.getX = function( ) {
        return (Math.cos(this.angle) * this.radius) + SolarSystem.radius;
    };

    Planet.prototype.getY = function() {
        return (Math.sin(this.angle) * this.radius) + SolarSystem.radius;
    };


    Planet.prototype.updateAngle = function() {
        if(this.speed > 0) {
            var value =  (2 * Math.PI) / (this.speed * Profile.speed);

            if(this.backMove) {
                this.angle -= value;
            } else {
                this.angle += value;
            }
            if(this.angle > 2 * Math.PI) {
                this.angle -= 2 * Math.PI;
            } else if(this.angle < 0) {
                this.angle += 2 * Math.PI;
            }
        }
    };

    Planet.prototype.drawInfo = function(infoPopup) {
        var planetInfo = new PlanetInfo(this);
        infoPopup.setTitle(Dom.el('h3', null, this.name));
        infoPopup.setContent(planetInfo.container);
    };


    Planet.prototype.drawMenu = function(clickContext) {

    };

    Planet.drawPlanetoid = function(planetoid, context, zoomWindow, locations, colors, shiftX, shiftY) {
        planetoid.updateAngle(planetoid);
        var orbitRadius = planetoid.orbit;
        var ratio = zoomWindow.getRatio();
        var planetRadius = planetoid.radius * ratio;
        var x = ((Math.cos(planetoid.angle) * orbitRadius + shiftX) - zoomWindow.rectangle.x) * ratio;
        var y = ((Math.sin(planetoid.angle) * orbitRadius + shiftY) - zoomWindow.rectangle.y) * ratio;
        context.beginPath();
        context.strokeStyle = colors.orbit;
        if(planetoid.backMove) {
            context.arc(
                (shiftX - zoomWindow.rectangle.x) * ratio,
                (shiftY  - zoomWindow.rectangle.y)* ratio,
                orbitRadius* ratio,
                planetoid.angle ,
                planetoid.angle + Math.PI / 4,
                true
            );
        } else {
            context.arc(
                (shiftX - zoomWindow.rectangle.x) * ratio,
                (shiftY  - zoomWindow.rectangle.y)* ratio,
                orbitRadius* ratio,
                planetoid.angle,
                planetoid.angle - Math.PI / 4,
                true
            );
        }
        context.stroke();

        context.strokeStyle = colors.planetoid;
        var pseudoRadius = planetRadius < 5 ? 5 : planetRadius;
        if (!planetoid.imageLoaded) {
            context.beginPath();
            context.arc(x, y, pseudoRadius, 0, Math.PI * 2);
            context.stroke();
        } else {
            context.drawImage(planetoid.image, x - pseudoRadius, y - pseudoRadius, pseudoRadius * 2, pseudoRadius * 2 );
        }

        /*context.textAlign = 'center';
        context.strokeStyle = colors.label;
        context.strokeText(planetoid.name, x, y);*/
        var out =


        planetoid.onChange({
            x: x,
            y: y,
            radius: pseudoRadius
        });

        context.strokeStyle = 'black';
        return {
            x: x,
            y: y,
            radius: planetRadius
        };
    };

    return Planet;
});