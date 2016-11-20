Engine.define(
    'SolarWrapper',
    [
        'SolarCanvas',
        'InfoPopup',
        'ZoomWindow',
        'SolarSystem',
        'SpaceShip',
        'SpaceShipParams',
        'Planet',
        'Planets',
        'ClickContext'
    ],
    function () {

        var InfoPopup = Engine.require('InfoPopup');
        var SolarCanvas = Engine.require('SolarCanvas');
        var SolarSystem = Engine.require('SolarSystem');
        var SpaceShip = Engine.require('SpaceShip');
        var SpaceShipParams = Engine.require('SpaceShipParams');
        var ClickContext = Engine.require('ClickContext');
        var Planets = Engine.require('Planets');
        var Planet = Engine.require('Planet');
        var CanvasClickProxy = Engine.require('CanvasClickProxy');

        function SolarWrapper(context) {
            var me = this;
            me.infoPopup = new InfoPopup();
            me.clickLocations = [];
            this.clickContext = new ClickContext({
                infoPopup: me.infoPopup,
                player: 1
            });
            this.solarCanvas = new SolarCanvas(context, {
                perform: function (clickEvent) {
                    var cc = me.clickContext;
                    cc.update(clickEvent);
                    var clickHasTarget = false;
                    for (var i = 0; i < me.clickLocations.length; i++) {
                        var location = me.clickLocations[i];
                        if (location.onClick(cc)) {
                            clickHasTarget = true;
                            break;
                        }
                    }
                    if (!clickHasTarget) {
                        if (cc.playerShip) {
                            if (cc.button === 'right') {
                                cc.playerShip.setCourse(cc.spaceX, cc.spaceY);
                            }
                        }
                    }
                }
            });
            this.clickContext.zoomWindow = this.solarCanvas.zoomWindow;
            document.body.appendChild(me.solarCanvas.canvas);

            !function () {
                context.canvas = me.solarCanvas.canvas;
                var size = Math.min(context.canvas.width, context.canvas.height);
                var center = {x: size / 2, y: size / 2};
                var planetoid = Planets.earth;
                var ratio = me.solarCanvas.zoomWindow.getRatio();
                var orbitRadius = planetoid.orbit * ratio;
                var x = Math.cos(planetoid.angle) * orbitRadius + center.x + planetoid.radius * ratio;
                var y = Math.sin(planetoid.angle) * orbitRadius + center.y + planetoid.radius * ratio;
                var spaceShip = new SpaceShip(new SpaceShipParams({
                    x: x / ratio,
                    y: y / ratio,
                    name: 'player',
                    player: 1,
                    angle: Math.PI,
                    imagePath: 'ship.png',
                    radius: 0.1
                }));
                var spaceShipClickProxy = new CanvasClickProxy(function(clickContext){
                    spaceShip.selected = true;
                    if(spaceShip.params.player === clickContext.player) {
                        clickContext.playerShip = spaceShip;
                    } else {
                        clickContext.playerShip = null;
                    }
                    spaceShip.drawInfo(clickContext);
                });
                spaceShip.addListener(spaceShipClickProxy);
                me.clickLocations.push(spaceShipClickProxy);
                me.solarCanvas.addObject(spaceShip)
            }();

            for(var planetName in Planets) {
                if(Planets.hasOwnProperty(planetName)) {
                    !function() {
                        var planet = Planets[planetName];
                        me.solarCanvas.addObject(planet);
                        var planetClickProxy = new CanvasClickProxy(function (clickContext) {
                            if (clickContext.button == 'left') {
                                planet.drawInfo(clickContext.infoPopup);
                            } else {
                                planet.drawMenu(clickContext);
                            }
                        });
                        me.clickLocations.push(planetClickProxy);
                        planet.addListener(planetClickProxy)
                    }()
                }
            }
        }

        SolarWrapper.prototype.start = function () {
            this.solarCanvas.beforeOpen();
            this.solarCanvas.start();
        };

        return SolarWrapper;
    });