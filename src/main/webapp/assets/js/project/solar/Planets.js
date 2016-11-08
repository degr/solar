Engine.define('Planets', ['Planet'], function () {
    var Planet = Engine.require('Planet');
    var data = {
        neptune: {
            orbit: 4452940833,
            radius: 24764,
            angle: Math.PI,
            speed: 165
        },
        uranus: {
            orbit: 2748938461,
            radius: 25362,
            angle: Math.PI,
            speed: 84
        },
        saturn: {
            orbit: 1353572956,
            radius: 60268,
            angle: Math.PI,
            speed: 29
        },
        jupiter: {
            orbit: 740573600,
            radius: 60268,
            angle: Math.PI,
            speed: 12
        },
        cerera: {
            orbit: 381028000,
            radius: 481,
            angle: Math.PI,
            speed: 4.6
        },
        mars: {
            orbit: 206655000,
            radius: 3396,
            angle: Math.PI / 2,
            speed: 1.8
        },
        earth: {
            orbit: 147098290,
            radius: 6378,
            angle: Math.PI,
            speed: 1,
            satellites: [
                {
                    name: 'lunar',
                    backMove: true,
                    angle: 0,
                    orbit: 363104,
                    radius: 1737,
                    speed: 0.0747945205479452
                }
            ]
        },
        venus: {
            orbit: 107476259,
            radius: 6051,
            angle: Math.PI,
            speed: 0.6
        },
        mercury: {
            orbit: 46001009,
            radius: 2439,
            angle: Math.PI,
            speed: 0.24
        },
        sun: {
            orbit: 0,
            radius:	695700,
            angle: 0,
            speed: 0
        }
    };
    var Planets = {};
    for(var key in data) {
        Planets[key] = new Planet(key, data[key]);
    }
    return Planets;
});