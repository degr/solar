Engine.define('ZoomWindow', 'SolarSystem', function () {

    var SolarSystem = Engine.require('SolarSystem');

    function ZoomWindow(zoom, canvasX, canvasY) {
        this.zoom = zoom;
        this.scale = Math.pow(2, zoom - 1);
        this.ratio = this.calculateRatio(canvasX, canvasY);
        this.growingFactor = 1;
        this.increase = true;
        this.rectangle = this.getClearRect(canvasX, canvasY);
    }

    ZoomWindow.prototype.calculateRatio = function (canvasX, canvasY) {
        var canvasSize = Math.min(canvasX, canvasY);
        return (canvasSize / 2) * this.scale / SolarSystem.radius;
    };
    ZoomWindow.prototype.isPlanetVisible = function (planet) {
        return true;
        if (this.zoom === 1) {
            return true;
        } else {
            var planetX = planet.getX();
            var planetY = planet.getY();
            var topX = planetX - planet.radius;
            var topY = planetY - planet.radius;
            var bottomX = planetX + planet.radius;
            var bottomY = planetY + planet.radius;
            var w = this.rectangle;
            var wXB = w.x + w.width;
            var wYB = w.y + w.height;
            if(topX > w.x && topX < wXB && topY > x.y && topY < wYB) {
                return true;
            }
            return w.x < planetX && w.width + w.x > planetX && w.y < planetY && w.y + w.height > planetY;
        }
    };

    ZoomWindow.prototype.getClearRect = function (canvasX, canvasY) {
        var ratio;
        var xGreater = false;
        if(canvasX > canvasY) {
            xGreater = true;
            ratio = canvasY / canvasX;
        } else if(canvasY > canvasX) {
            ratio = canvasX / canvasY;
        } else {
            ratio = 1;
        }
        var w = ((xGreater ? 1 : ratio ) * SolarSystem.radius) * 2;
        var h = ((xGreater ? ratio : 1 ) * SolarSystem.radius) * 2;
        var out = {
            x: xGreater ? (h - w) : 0,
            y: xGreater ? 0 : (h - w),
            width: w,
            height: h
        };

        this.logRect(out);
        return out;
    };



    ZoomWindow.prototype.logRect = function (rect) {
        var d = 1000000;
        var r = rect || this.rectangle;
        console.log('rect: x: ' + r.x / d + " y:" + r.y / d + " width: " + r.width / d + " height: " + r.height / d);
    }
    ZoomWindow.prototype.onDrag = function (x, y, mouseDown) {
        var rX = (mouseDown.x - x) / this.ratio;
        var rY = (mouseDown.y - y) / this.ratio;
        this.rectangle.x += rX;
        this.rectangle.y += rY;
        mouseDown.x = x;
        mouseDown.y = y;
    };

    ZoomWindow.prototype.zoomIn = function (x, y, canvasX, canvasY) {
        this.zoom++;
        this.scale = this.scale * 2;
        this.ratio = this.calculateRatio(canvasX, canvasY);
        this.rectangle.x = this.rectangle.x + x / this.ratio;
        this.rectangle.y = this.rectangle.y + y / this.ratio;
        this.rectangle.width = canvasX / this.ratio;
        this.rectangle.height = canvasY / this.ratio;
    };

    ZoomWindow.prototype.zoomOut = function (x, y, canvasX, canvasY) {
        if (this.zoom === 1) {
            return;
        }
        this.zoom--;
        this.scale = this.scale / 2;
        var shiftX = x / this.ratio;
        var shiftY = y / this.ratio;
        this.ratio = this.calculateRatio(canvasX, canvasY);
        if (this.zoom == 1) {
            this.rectangle = this.getClearRect(canvasX, canvasY);
            return;
        }
        var rect = this.rectangle;
        var oldWidth = rect.width,
            oldHeight = rect.height;
        rect.width = oldWidth * 2;
        rect.height = oldHeight * 2;
        rect.x = this.rectangle.x + shiftX - oldWidth;
        rect.y = this.rectangle.y + shiftY - oldHeight;
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
            var dx = x - rect.x;
            var dy = y - rect.y;
            return {
                x: dx*this.ratio,
                y: dy*this.ratio
            }
        }
    };



    ZoomWindow.prototype.toString = function () {
        return "ZoomWindow(zoom: " + this.zoom + "; x:" + this.x + "; y:" + this.y + ")";
    };
    return ZoomWindow;
});