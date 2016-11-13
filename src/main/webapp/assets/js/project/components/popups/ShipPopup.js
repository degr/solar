Engine.define('ShipPopup', ['Popup', 'Dom'], function() {
    var Popup = Engine.require('Popup');

    function ShipPopup() {
        var popup = new Popup({title: 'Ship', isOpen: true, withOverlay: false, controlClose: false});
        this.popup = popup;
        this.container = popup.container;
        this.container.style.left = 0;
        this.container.style.top = 0;
    }

    ShipPopup.prototype.update = function(params) {
        console.log(params);
    };

    return ShipPopup;
});