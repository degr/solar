Engine.define('ZoomWindow', 'SolarSystem', function () {

    var SolarSystem = Engine.require('SolarSystem');

    function ZoomWindow(zoom, canvasSize) {
        this.zoom = zoom;
        this.scale = Math.pow(2, zoom - 1);
        this.calculateRatio(canvasSize);
        this.growingFactor = 1;
        this.increase = true;
        this.rectangle = this.getClearRect();
    }

    ZoomWindow.prototype.calculateRatio = function (canvasSize) {
        this.ratio = (canvasSize / 2) * this.scale / SolarSystem.radius;
    };
    ZoomWindow.prototype.isPlanetVisible = function (planet) {
        if (this.zoom === 1) {
            return true;
        } else {
            var planetX = (Math.cos(planet.angle) * planet.radius) + SolarSystem.radius;
            var planetY = (Math.sin(planet.angle) * planet.radius) + SolarSystem.radius;
            var w = this.rectangle;
            return w.x < planetX && w.width + w.x > planetX && w.y < planetY && w.y + w.height > planetY;
        }
    };

    ZoomWindow.prototype.getClearRect = function () {
        return {
            x: 0,
            y: 0,
            width: SolarSystem.radius * 2,
            height: SolarSystem.radius * 2
        }
    };
    ZoomWindow.prototype.zoomIn = function (x, y, canvasSize) {
        this.zoom++;
        this.scale = this.scale * 2;
        this.calculateRatio(canvasSize);
        var d = SolarSystem.diameter;
        var currentCenter = {
            x: x / this.ratio,
            y: y / this.ratio
        };
        var galaxySide = canvasSize / this.ratio;
        var half = galaxySide / 2;
        this.rectangle = {
            x: this.rectangle.x + currentCenter.x - half,
            y: this.rectangle.y + currentCenter.y - half
        };
        this.rectangle.width = galaxySide;
        this.rectangle.height = galaxySide;
    };

    ZoomWindow.prototype.onDrag = function (x, y, mouseDown) {
        var rX = (mouseDown.x - x) / this.ratio;
        var rY = (mouseDown.y - y) / this.ratio;
        this.rectangle.x += rX;
        this.rectangle.y += rY;
        mouseDown.x = x;
        mouseDown.y = y;
    };

    ZoomWindow.prototype.zoomOut = function (x, y, canvasSize) {
        if (this.zoom === 1)return;

        this.zoom--;
        this.scale = this.scale / 2;
        this.calculateRatio(canvasSize);
        if (this.zoom == 1) {
            this.rectangle = this.getClearRect();
            return;
        }


        var shiftX = x / this.ratio;
        var shiftY = y / this.ratio;
        this.rectangle.width = this.rectangle.width * 2;
        this.rectangle.height = this.rectangle.height * 2;
        this.rectangle.x = this.rectangle.x + shiftX - (this.rectangle.width / 2);
        this.rectangle.y = this.rectangle.y + shiftY - (this.rectangle.height / 2);
    };

    ZoomWindow.prototype.getFactor = function () {
        if (this.increase && this.growingFactor < this.scale) {
            this.growingFactor += 0.1;
        } else if (!this.increase && this.growingFactor > this.scale) {
            this.growingFactor -= 0.1;
        }
        return this.growingFactor;
    };
    ZoomWindow.prototype.canvasCoordinates = function (x, y) {
        if(this.zoom === 1) {
            return {x: x * this.ratio, y: y*this.ratio};
        } else {
            var rect = this.rectangle;
            var halfX = rect.width / 2;
            var halfY = rect.height / 2;
            return {
                x: (x - (SolarSystem.radius - halfX))*this.ratio,
                y: (y - (SolarSystem.radius - halfY))*this.ratio
            }
        }
    };

    ZoomWindow.prototype.toString = function () {
        return "ZoomWindow(zoom: " + this.zoom + "; x:" + this.x + "; y:" + this.y + ")";
    };
    return ZoomWindow;
});