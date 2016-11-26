Engine.define('ZoomWindow', 'SolarSystem', function () {

    var SolarSystem = Engine.require('SolarSystem');

    function ZoomWindow(zoom, canvasX, canvasY) {
        this.zoom = zoom;
        this.scale = Math.pow(2, zoom - 1);
        this.ratio = this.calculateRatio(canvasX, canvasY);
        this.growingRatio = this.ratio;
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
            var r = this.rectangle;
            var wXB = r.x + r.width;
            var wYB = r.y + r.height;
            if(topX > r.x && topX < wXB && topY > x.y && topY < wYB) {
                return true;
            }
            return r.x < planetX && r.width + r.x > planetX && r.y < planetY && r.y + r.height > planetY;
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
    };
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

    ZoomWindow.prototype.updateRatio = function () {
        if (this.increase && this.growingRatio < this.ratio) {
            this.growingRatio += 0.1;
        } else if (!this.increase && this.growingRatio > this.ratio) {
            this.growingRatio -= 0.1;
        }
    };
    ZoomWindow.prototype.getRatio = function () {
        return this.ratio;
    };
    ZoomWindow.prototype.canvasCoordinates = function (x, y) {
        var rect = this.rectangle;
        return {
            x: (x - rect.x)*this.ratio,
            y: (y - rect.y)*this.ratio
        }
    };

    ZoomWindow.prototype.onClick = function(e, offset) {
        var x = e.clientX + window.scrollX - offset.left;
        var y = e.clientY + window.scrollY - offset.top;
        var r = this.rectangle;
        var spaceX = r.x + x / this.ratio;
        var spaceY = r.y + y / this.ratio;
        return {
            x: x,
            y: y,
            spaceX: spaceX,
            spaceY: spaceY,
            button: e.button === 0 ? 'left' : 'right'
        }
    };

    ZoomWindow.prototype.draw = function (context) {
        var cell = 15;
        var gridStepX = context.canvas.width / cell;
        var stepX = this.rectangle.width / cell;
        context.strokeStyle = "green";
        var limitX = stepX * cell;
        context.textAlign = "center";
        for(var x = 2; x < cell; x++) {
            context.beginPath();
            context.moveTo(x * gridStepX, 20);
            context.lineTo(x * gridStepX, 50);
            var textX = this.getReadableDistance(stepX * x, limitX);
            context.strokeText(textX, x* gridStepX, 65);
            context.stroke();
        }


        var gridStep = context.canvas.height / cell;
        var stepY = this.rectangle.height / cell;
        context.strokeStyle = "green";
        var limitY = stepY * cell;
        context.textAlign = "left";
        for(var y = 2; y < cell; y++) {
            context.beginPath();
            context.moveTo(20, y * gridStep);
            context.lineTo(50, y * gridStep);
            var textY = this.getReadableDistance(stepY * y, limitY);
            context.strokeText(textY, 65, y * gridStep + 3);
            context.stroke();
        }
    };

    ZoomWindow.prototype.getReadableDistance = function (text, limit) {
        var postfix = "km";
        if(limit < 1) {
            postfix = "m";
            text = Math.round(text * 1000 * 1000) / 1000
        } else if(limit < 10) {
            text = Math.round(text * 100) / 100
        } else if (limit < 100) {
            text = Math.round(text * 10) / 10
        } else {
            text = Math.round(text);
            if(text > 10000) {
                var str = text + "";
                text = str.substring(0, 2) + " x10^" + (str.length - 2);
            }
        }
        return text + postfix;
    };
    ZoomWindow.prototype.toString = function () {
        return "ZoomWindow(zoom: " + this.zoom + "; x:" + this.x + "; y:" + this.y + ")";
    };
    return ZoomWindow;
});