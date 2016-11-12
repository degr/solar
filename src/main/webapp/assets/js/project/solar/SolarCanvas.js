Engine.define('SolarCanvas', ['ScreenUtils', 'Planets', 'Dom', 'ZoomWindow', 'SolarSystem', 'CanvasImage','CanvasPattern', 'Profile', 'SpaceShip', 'CanvasClickProxy'], function () {

    var ScreenUtils = Engine.require('ScreenUtils');
    var SolarSystem = Engine.require('SolarSystem');
    var ZoomWindow = Engine.require('ZoomWindow');
    var Planets = Engine.require('Planets');
    var Dom = Engine.require('Dom');
    var CanvasImage = Engine.require('CanvasImage');
    var CanvasPattern = Engine.require('CanvasPattern');
    var SpaceShip = Engine.require('SpaceShip');
    var Profile = Engine.require('Profile');


    function SolarCanvas() {
        var me = this;
        me.canvas = document.createElement('canvas');
        me.canvas.className = 'solar';
        me.sizeX = null;
        me.sizeY = null;
        me.zoom = 1;
        me.context = me.canvas.getContext('2d');
        me.offset = null;
        me.updateZoomWindow = false;
        me.mouseDown = {active: false, x: null, y: null};
        Dom.addListeners(me.canvas, {
            onmousemove: function (e) {
                me.onMouseMove(e)
            },
            /*DOMMouseScroll: function (e) {
                me.onScroll(e)
            },*/
            mousewheel: function (e) {
                me.onScroll(e)
            },
            onmousedown: function(e) {
                me.onMouseDown(e);
            },
            onmouseup: function(e) {
                me.onMouseUp(e);
            }
        });
        document.body.appendChild(me.canvas);
        me.listeners = {
            onresize: function (e) {
                me.onResize();
            }
        };

        me.background = new CanvasPattern(0, 0, Profile.path + "/assets/images/space/2.jpg", 0, 0);
        me.onResize();
        me.x = this.canvas.width / 2;
        me.y = this.canvas.height / 2;
        me.zoomWindow = new ZoomWindow(me.zoom, me.sizeX, me.sizeY);
        me.background.drawInCenter = false;
        me.canvasLocations = [];
    }

    SolarCanvas.prototype.onMouseDown = function (e) {
        this.mouseDown = {
            active: true,
            x: e.clientX + window.scrollX - this.offset.left,
            y: e.clientY + window.scrollY - this.offset.top
        };
    };
    SolarCanvas.prototype.onMouseUp = function (e) {
        var x = e.clientX + window.scrollX - this.offset.left;
        var y =  e.clientY + window.scrollY - this.offset.top;
        this.mouseDown = {
            active: false,
            x: null,
            y: null
        };

        var zw = this.zoomWindow;
        var r = zw.rectangle;
        var spaceX = r.x + x / zw.ratio;
        var spaceY = r.y + y / zw.ratio;

        for(var i = 0; i < this.canvasLocations.length; i++) {
            var location = this.canvasLocations[i];
            if(location.onClick(x, y, {x: x, y: y, spaceX: spaceX, spaceY: spaceY})) {
                break;
            }
        }
    };
    SolarCanvas.prototype.onMouseMove = function (e) {
        this.x = e.clientX + window.scrollX - this.offset.left;
        this.y = e.clientY + window.scrollY - this.offset.top;

        if(this.mouseDown.active && this.zoom > 1) {
            this.zoomWindow.onDrag(this.x, this.y, this.mouseDown)
        }
    };
    SolarCanvas.prototype.start = function () {
        var me = this;
        var context = me.context;
        var ships = [new SpaceShip(SolarSystem.radius, SolarSystem.radius, {name: 'solar'})];
       /*!function() {
            var size = Math.min(context.canvas.width, context.canvas.height);
            var center = {x: size / 2, y: size / 2};
            var planetoid = Planets.earth;
            var orbitRadius = planetoid.orbit * me.zoomWindow.ratio;
            var x = Math.cos(planetoid.angle) * orbitRadius + center.x + planetoid.radius * me.zoomWindow.ratio;
            var y = Math.sin(planetoid.angle) * orbitRadius + center.y+ planetoid.radius * me.zoomWindow.ratio;
            ships.push(new SpaceShip(x / me.zoomWindow.ratio, y/ me.zoomWindow.ratio, {name: 'player'}))
        }();*/
        setInterval(function () {
            me.context.clearRect(0, 0, me.sizeX, me.sizeY);
            me.canvasLocations = [];
            me.background.draw(context);
            var zoomWindow = me.getZoomWindow();
            for (var planetName in Planets) {
                if (Planets.hasOwnProperty(planetName)) {
                    var planet = Planets[planetName];
                    if(true || zoomWindow.isPlanetVisible(planet)) {
                        planet.draw(context, zoomWindow, me.canvasLocations);
                    }
                }
            }
            /*for(var i = 0; i < ships.length; i++) {
                ships[i].draw(context, zoomWindow, me.canvasLocations);
            }*/
        }, 250);
    };



    SolarCanvas.prototype.getZoomWindow = function () {
        return this.zoomWindow;
    };
    SolarCanvas.prototype.onScroll = function (e) {
        var delta = 0;

        if (e.wheelDelta) { /* IE/Opera. */
            delta = -(e.wheelDelta);
        } else if (e.detail) { /* Mozilla */
            delta = e.detail;
        }

        if (delta) {
            if (delta < 0) {
                this.zoom++;
                this.zoomWindow.zoomIn(this.x, this.y, this.sizeX, this.sizeY)
            } else {
                if(this.zoom > 1) {
                    this.zoom--;
                    this.zoomWindow.zoomOut(this.x, this.y, this.sizeX, this.sizeY)
                }
            }
        }
    };
    SolarCanvas.prototype.beforeOpen = function () {
        Dom.addListeners(this.listeners);
    };
    SolarCanvas.prototype.beforeClose = function () {
        Dom.removeListeners(this.listeners);
    };
    SolarCanvas.prototype.onResize = function () {
        var screen = ScreenUtils.window();
        this.sizeX = screen.width;
        this.sizeY = screen.height;
        this.canvas.width = this.sizeX;
        this.canvas.height = this.sizeY;
        this.offset = Dom.calculateOffset(this.canvas);
        this.background.width = this.sizeX;
        this.background.height = this.sizeY;
    };
    return SolarCanvas;
});