Engine.define('SolarCanvas', ['ScreenUtils', 'Planets', 'Dom', 'ZoomWindow',
    'SolarSystem', 'CanvasImage','CanvasPattern', 'ClickContext', 'Profile',
    'CanvasClickProxy', 'SpaceShip', 'SpaceShipParams'], function () {

    var ScreenUtils = Engine.require('ScreenUtils');
    var SolarSystem = Engine.require('SolarSystem');
    var ZoomWindow = Engine.require('ZoomWindow');
    var Planets = Engine.require('Planets');
    var Dom = Engine.require('Dom');
    var CanvasImage = Engine.require('CanvasImage');
    var ClickContext = Engine.require('ClickContext');
    var CanvasPattern = Engine.require('CanvasPattern');
    var SpaceShip = Engine.require('SpaceShip');
    var SpaceShipParams = Engine.require('SpaceShipParams');
    var Profile = Engine.require('Profile');


    function SolarCanvas() {
        var me = this;
        me.canvas = document.createElement('canvas');
        me.canvas.className = 'solar';
        me.sizeX = null;
        me.sizeY = null;
        me.zoom = 1;
        me.context = me.canvas.getContext('2d');
        me.offset = {};
        me.updateZoomWindow = false;
        me.mouseDown = {active: false, x: null, y: null};

        Dom.addListeners(me.canvas, {
            onmousemove: function (e) {
                me.onMouseMove(e)
            },
            DOMMouseScroll: function (e) {
                me.onScroll(e)
            },
            mousewheel: function (e) {
                me.onScroll(e)
            },
            onmousedown: function(e) {
                me.onMouseDown(e);
            },
            onmouseup: function(e) {
                me.onMouseUp(e);
            },
            oncontextmenu: function(e) {
                me.onContextMenu(e);
            }
        });
        document.body.appendChild(me.canvas);
        me.listeners = {
            onresize: function (e) {
                me.onResize();
            }
        };
        me.subscribers = [];
        me.background = new CanvasPattern(0, 0, Profile.path + "/assets/images/space/2.jpg", 0, 0);
        me.onResize();
        me.x = this.canvas.width / 2;
        me.y = this.canvas.height / 2;
        me.zoomWindow = new ZoomWindow(me.zoom, me.sizeX, me.sizeY);
        me.background.drawInCenter = false;
        me.canvasLocations = [];
        me.clickContext = new ClickContext({zoomWindow: me.zoomWindow, player: 1, offset: this.offset});
    }

    SolarCanvas.prototype.onContextMenu = function (e) {
        this.onMouseDown(e);
        e.preventDefault();
    };
    SolarCanvas.prototype.onMouseDown = function (e) {
        if(e.button !== 0)return;
        this.mouseDown = {
            active: true,
            x: e.clientX + window.scrollX - this.offset.left,
            y: e.clientY + window.scrollY - this.offset.top
        };
    };
    SolarCanvas.prototype.onMouseUp = function (e) {

        this.mouseDown = {
            active: false,
            x: null,
            y: null
        };
        var cc = this.clickContext;
        cc.update(e);
        var clickHasTarget = false;
        for(var i = 0; i < this.canvasLocations.length; i++) {
            var location = this.canvasLocations[i];
            if(location.onClick(cc)) {
                clickHasTarget = true;
                break;
            }
        }
        if(!clickHasTarget) {
            if(cc.playerShip && cc.button === 'right') {
                cc.playerShip.setCourse(cc.spaceX, cc.spaceY);
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
        var ships = [new SpaceShip(new SpaceShipParams({
            x: SolarSystem.radius, y: SolarSystem.radius, name: 'solar', imagePath: 'ship.png', radius: 0.1}
        ))];
       !function() {
            var size = Math.min(context.canvas.width, context.canvas.height);
            var center = {x: size / 2, y: size / 2};
            var planetoid = Planets.earth;
            var ratio = me.zoomWindow.getRatio();
            var orbitRadius = planetoid.orbit * ratio;
            var x = Math.cos(planetoid.angle) * orbitRadius + center.x + planetoid.radius * ratio;
            var y = Math.sin(planetoid.angle) * orbitRadius + center.y+ planetoid.radius * ratio;
            ships.push(new SpaceShip(new SpaceShipParams({
                x: x / ratio, y: y/ ratio, name: 'player', player: 1, angle: Math.PI, imagePath: 'ship.png', radius: 0.1})))
        }();
        setInterval(function () {
            me.context.clearRect(0, 0, me.sizeX, me.sizeY);
            me.canvasLocations = [];
            me.background.draw(context);
            var zoomWindow = me.getZoomWindow();
            zoomWindow.updateRatio();
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
        }, 20);
    };



    SolarCanvas.prototype.addListener = function (clb) {
        this.subscribers.push(clb);
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
        var offset = Dom.calculateOffset(this.canvas);
        this.offset.left = offset.left;
        this.offset.top = offset.top;
        this.background.width = this.sizeX;
        this.background.height = this.sizeY;
    };
    return SolarCanvas;
});