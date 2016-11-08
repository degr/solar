Engine.define('Planet', ['SolarSystem', 'Profile', 'CanvasClickProxy'], function(){

    var CanvasClickProxy = Engine.require('CanvasClickProxy');
    var SolarSystem = Engine.require('SolarSystem');
    var Profile = Engine.require('Profile');

    function Planet(name, data) {
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
        this.satellites = data.satellites;
    }

    Planet.orbitGradient = null;

    Planet.prototype.draw = function(context, zoomWindow, locations) {
        var size = Math.min(context.canvas.width, context.canvas.height);
        var planetInfo = Planet.drawPlanetoid(this, context, zoomWindow,
            locations,
            {x: size / 2, y: size / 2},
            {orbit: 'steelblue', planetoid: '#01DF3A', label: '#00FF40'}
        );


        if(planetInfo.radius > 2 && this.satellites && this.satellites.length) {
            for(var i = 0; i < this.satellites.length; i++) {
                planetInfo = Planet.drawPlanetoid(
                    this.satellites[i],
                    context,
                    zoomWindow,
                    locations,
                    {x:planetInfo.x, y: planetInfo.y},
                    {orbit: '#FAAC58', planetoid: '#F3E2A9', label: '#F3E2A9'}
                );
            }
        }
    };

    Planet.drawPlanetoid = function(planetoid, context, zoomWindow, locations, center, colors) {
        if(planetoid.speed) {
            if(planetoid.backMove) {
                planetoid.angle -= Math.PI / (planetoid.speed * Profile.speed);
            } else {
                planetoid.angle += Math.PI / (planetoid.speed * Profile.speed);
            }
        }
        var orbitRadius = planetoid.orbit * zoomWindow.ratio;
        var planetRadius = planetoid.radius * zoomWindow.ratio;
        var x = Math.cos(planetoid.angle) * orbitRadius + center.x;
        var y = Math.sin(planetoid.angle) * orbitRadius + center.y;
        context.beginPath();
        context.strokeStyle = colors.orbit;
        if(planetoid.backMove) {
            context.arc(center.x, center.y, orbitRadius,  planetoid.angle, planetoid.angle + Math.PI / 4, false);
        } else {
            context.arc(center.x, center.y, orbitRadius, planetoid.angle, planetoid.angle - Math.PI / 4, true);
        }
        context.stroke();

        context.strokeStyle = colors.planetoid;
        if (!planetoid.imageLoaded) {
            context.beginPath();
            context.arc(x, y, planetRadius < 5 ? 5 : planetRadius, 0, Math.PI * 2);
            context.stroke();
        } else {
            var pseudoRadius = planetRadius < 5 ? 5 : planetRadius;
            context.drawImage(planetoid.image, x - pseudoRadius, y - pseudoRadius, pseudoRadius * 2, pseudoRadius * 2 );
        }

        /*context.textAlign = 'center';
        context.strokeStyle = colors.label;
        context.strokeText(planetoid.name, x, y);*/
        locations.push(new CanvasClickProxy(x, y, planetRadius < 5 ? 5 : planetRadius, function(params){
            console.log(planetoid);
        }));
        context.strokeStyle = 'black';
        return {
            x: x,
            y: y,
            radius: planetRadius
        };
    };

    return Planet;
});