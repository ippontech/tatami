/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Control.KeyboardDefaults = OpenLayers.Class(OpenLayers.Control, {

        autoActivate: true,

        slideFactor: 75,

        observeElement: null,

            
        draw: function() {
        var observeElement = this.observeElement || document;
        this.handler = new OpenLayers.Handler.Keyboard( this,
                {"keydown": this.defaultKeyPress},
                {observeElement: observeElement}
        );
    },
    
        defaultKeyPress: function (evt) {
        var size, handled = true;

        var target = OpenLayers.Event.element(evt);
        if (target  &&
            (target.tagName == 'INPUT' ||
             target.tagName == 'TEXTAREA' ||
             target.tagName == 'SELECT')) {
            return;
        }

        switch (evt.keyCode) {
            case OpenLayers.Event.KEY_LEFT:
                this.map.pan(-this.slideFactor, 0);
                break;
            case OpenLayers.Event.KEY_RIGHT: 
                this.map.pan(this.slideFactor, 0);
                break;
            case OpenLayers.Event.KEY_UP:
                this.map.pan(0, -this.slideFactor);
                break;
            case OpenLayers.Event.KEY_DOWN:
                this.map.pan(0, this.slideFactor);
                break;
            
            case 33: // Page Up. Same in all browsers.
                size = this.map.getSize();
                this.map.pan(0, -0.75*size.h);
                break;
            case 34: // Page Down. Same in all browsers.
                size = this.map.getSize();
                this.map.pan(0, 0.75*size.h);
                break; 
            case 35: // End. Same in all browsers.
                size = this.map.getSize();
                this.map.pan(0.75*size.w, 0);
                break; 
            case 36: // Home. Same in all browsers.
                size = this.map.getSize();
                this.map.pan(-0.75*size.w, 0);
                break; 

            case 43:  // +/= (ASCII), keypad + (ASCII, Opera)
            case 61:  // +/= (Mozilla, Opera, some ASCII)
            case 187: // +/= (IE)
            case 107: // keypad + (IE, Mozilla)
                this.map.zoomIn();
                break; 
            case 45:  // -/_ (ASCII, Opera), keypad - (ASCII, Opera)
            case 109: // -/_ (Mozilla), keypad - (Mozilla, IE)
            case 189: // -/_ (IE)
            case 95:  // -/_ (some ASCII)
                this.map.zoomOut();
                break; 
            default:
                handled = false;
        }
        if (handled) {
            OpenLayers.Event.stop(evt);
        }
    },

    CLASS_NAME: "OpenLayers.Control.KeyboardDefaults"
});
