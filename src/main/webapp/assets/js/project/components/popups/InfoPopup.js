Engine.define('InfoPopup', ['Popup', 'Dom'], function() {
    var Popup = Engine.require('Popup');
    var Dom = Engine.require('Dom');

    function InfoPopup() {
        var popup = new Popup({title: Dom.el('h3', null, 'Info'), isOpen: true, withOverlay: false, controlClose: false});
        this.popup = popup;
        this.container = popup.container;
        Dom.addClass(this.container, 'info-popup');
        this.container.style.left = 0;
        this.container.style.top = 0;
    }

    InfoPopup.prototype.setTitle = function(title) {
        this.popup.setTitle(title);
    };
    InfoPopup.prototype.setContent = function(content) {
        this.popup.setContent(content)
    };



    return InfoPopup;
});