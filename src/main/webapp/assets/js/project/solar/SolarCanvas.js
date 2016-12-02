Engine.define('SolarCanvas', ['ScreenUtils', 'Dom', 'ZoomWindow',
    'SolarSystem', 'CanvasImage','CanvasPattern', 'Profile', 'LayeredCanvas'], function () {

    var ScreenUtils = Engine.require('ScreenUtils');
    var SolarSystem = Engine.require('SolarSystem');
    var ZoomWindow = Engine.require('ZoomWindow');
    var Dom = Engine.require('Dom');
    var CanvasImage = Engine.require('CanvasImage');
    var CanvasPattern = Engine.require('CanvasPattern');
    var Profile = Engine.require('Profile');
    var LayeredCanvas = Engine.require('LayeredCanvas');


    function SolarCanvas(context, clickProxyManager) {
        var me = this;
        me.context = context;
        me.clickProxyManager = clickProxyManager;

        var screen = ScreenUtils.window();
        me.canvas = new LayeredCanvas(10, screen.width, screen.height);
        me.canvas.setClass('solar');
        me.sizeX = screen.width;
        me.sizeY = screen.height;
        me.context = me.canvas.getContext(0);
        me.offset = {};
        me.updateZoomWindow = false;
        me.mouseDown = {active: false, x: null, y: null};


        Dom.addListeners(me.canvas.getCanvas(0), {
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
        me.listeners = {
            onresize: function (e) {
                me.onResize();
            }
        };
        me.background = new CanvasPattern(0, 0, Profile.path + "/assets/images/space/2.jpg", 0, 0);
        me.onResize();
        me.x = this.canvas.width / 2;
        me.y = this.canvas.height / 2;
        me.background.drawInCenter = false;
        me.zoomWindow = new ZoomWindow(1, me.sizeX, me.sizeY);
        me.objects = [];
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
        this.clickProxyManager.perform(this.zoomWindow.onClick(e, this.offset));
    };
    SolarCanvas.prototype.onMouseMove = function (e) {
        this.x = e.clientX + window.scrollX - this.offset.left;
        this.y = e.clientY + window.scrollY - this.offset.top;

        if(this.mouseDown.active && this.zoomWindow.zoom > 1) {
            this.zoomWindow.onDrag(this.x, this.y, this.mouseDown)
        }
    };
    SolarCanvas.prototype.start = function () {
        var me = this;
        var context = me.context;
        var zoomWindow = me.getZoomWindow();
        setInterval(function () {
            me.context.clearRect(0, 0, me.sizeX, me.sizeY);
            me.background.draw(context);
            for(var i = 0; i < me.objects.length; i++) {
                me.objects[i].draw(context, zoomWindow);
            }
            zoomWindow.draw(context);
        }, Profile.interval);
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
                this.zoomWindow.zoomIn(this.x, this.y, this.sizeX, this.sizeY)
            } else {
                if(this.zoomWindow.zoom > 1) {
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
    SolarCanvas.prototype.addObject = function (object) {
        this.objects.push(object);
    };

    SolarCanvas.prototype.zoomTo = function (object, scale) {
        while(scale--) {
            var cc = this.zoomWindow.canvasCoordinates(object.x, object.y);
            this.zoomWindow.zoomIn(cc.x, cc.y, this.sizeX, this.sizeY);
        }
    };

    SolarCanvas.prototype.onResize = function () {
        var screen = ScreenUtils.window();
        this.sizeX = screen.width;
        this.sizeY = screen.height;
        this.canvas.resize(this.sizeX, this.sizeY);
        var offset = Dom.calculateOffset(this.canvas.getCanvas(0));
        this.offset.left = offset.left;
        this.offset.top = offset.top;
        this.background.width = this.sizeX;
        this.background.height = this.sizeY;
    };
    return SolarCanvas;
});