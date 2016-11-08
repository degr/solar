Engine.define('SolarCanvas', ['ScreenUtils', 'Planets', 'Dom', 'ZoomWindow', 'SolarSystem', 'CanvasImage', 'Profile', 'SpaceShip', 'CanvasClickProxy'], function () {

    var ScreenUtils = Engine.require('ScreenUtils');
    var SolarSystem = Engine.require('SolarSystem');
    var ZoomWindow = Engine.require('ZoomWindow');
    var Planets = Engine.require('Planets');
    var Dom = Engine.require('Dom');
    var CanvasImage = Engine.require('CanvasImage');
    var SpaceShip = Engine.require('SpaceShip');
    var Profile = Engine.require('Profile');


    function SolarCanvas() {
        var me = this;
        me.canvas = document.createElement('canvas');
        me.size = null;
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
        me.onResize();
        me.x = this.canvas.width / 2;
        me.y = this.canvas.height / 2;
        me.zoomWindow = new ZoomWindow(me.zoom, me.size);
        me.background = new CanvasImage(0, 0, Profile.path + "/assets/images/space/1.jpg", me.size, me.size);
        me.background.drawInCenter = false;
        me.canvasLocations = [];
    }

    SolarCanvas.prototype.onMouseDown = function (e) {
        this.mouseDown = {
            active: true,
            x: e.clientX,
            y: e.clientY
        };
    };
    SolarCanvas.prototype.onMouseUp = function (e) {
        var zw = this.zoomWindow;
        var rect = zw.rectangle;
        var x = this.mouseDown.x - this.offset.left + (rect.x) * zw.ratio;
        var y = this.mouseDown.y - this.offset.top + (rect.y) * zw.ratio;
        this.mouseDown = {
            active: false,
            x: null,
            y: null
        };

        for(var i = 0; i < this.canvasLocations.length; i++) {
            var location = this.canvasLocations[i];
            if(location.onClick(x, y, {x: x, y: y})) {
                break;
            }
        }
    };
    SolarCanvas.prototype.start = function () {
        var me = this;
        var context = me.context;
        var ships = [new SpaceShip(SolarSystem.radius, SolarSystem.radius, {name: 'solar'})];
        !function() {
            var size = Math.min(context.canvas.width, context.canvas.height);
            var center = {x: size / 2, y: size / 2};
            var planetoid = Planets.earth;
            var orbitRadius = planetoid.orbit * me.zoomWindow.ratio;
            var x = Math.cos(planetoid.angle) * orbitRadius + center.x + planetoid.radius * me.zoomWindow.ratio;
            var y = Math.sin(planetoid.angle) * orbitRadius + center.y+ planetoid.radius * me.zoomWindow.ratio;
            ships.push(new SpaceShip(x / me.zoomWindow.ratio, y/ me.zoomWindow.ratio, {name: 'player'}))
        }();
        setInterval(function () {
            me.context.clearRect(0, 0, me.size, me.size);
            var rect = me.zoomWindow.rectangle;
            me.canvasLocations = [];
            me.background.draw(context);
            var zw = me.zoomWindow;
            context.stroke();
            context.save();
            context.translate(-(rect.x) * zw.ratio, -(rect.y) * zw.ratio);
            var zoomWindow = me.getZoomWindow();
            for (var planetName in Planets) {
                if (Planets.hasOwnProperty(planetName)) {
                    var planet = Planets[planetName];
                    if(true || zoomWindow.isPlanetVisible(planet)) {
                        planet.draw(context, zoomWindow, me.canvasLocations);
                    }
                }
            }
            for(var i = 0; i < ships.length; i++) {
                ships[i].draw(context, zoomWindow, me.canvasLocations);
            }
            context.restore();
        }, 25);
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
                this.zoomWindow.zoomIn(this.x, this.y, this.size)
            } else {
                if(this.zoom > 1) {
                    this.zoom--;
                    this.zoomWindow.zoomOut(this.x, this.y, this.size)
                }
            }
        }
    };
    SolarCanvas.prototype.onMouseMove = function (e) {
        this.x = e.clientX + window.scrollX - this.offset.left;
        this.y = e.clientY + window.scrollY - this.offset.top;

        if(this.mouseDown.active && this.zoom > 1) {
            this.zoomWindow.onDrag(this.x + this.offset.left, this.y + this.offset.top, this.mouseDown)
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
        this.size = Math.min(screen.width, screen.height) - 2;
        this.canvas.width = this.size;
        this.canvas.height = this.size;
        this.canvas.setAttribute('style', 'margin: 0 auto;display: block;border: 1px solid black');
        this.offset = Dom.calculateOffset(this.canvas);
    };
    return SolarCanvas;
});