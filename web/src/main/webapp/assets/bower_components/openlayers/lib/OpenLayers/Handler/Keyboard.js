/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Handler.Keyboard = OpenLayers.Class(OpenLayers.Handler, {

    /* http://www.quirksmode.org/js/keys.html explains key x-browser
        key handling quirks in pretty nice detail */

        KEY_EVENTS: ["keydown", "keyup"],

        eventListener: null,

        observeElement: null,

        initialize: function(control, callbacks, options) {
        OpenLayers.Handler.prototype.initialize.apply(this, arguments);
        this.eventListener = OpenLayers.Function.bindAsEventListener(
            this.handleKeyEvent, this
        );
    },
    
        destroy: function() {
        this.deactivate();
        this.eventListener = null;
        OpenLayers.Handler.prototype.destroy.apply(this, arguments);
    },

        activate: function() {
        if (OpenLayers.Handler.prototype.activate.apply(this, arguments)) {
            this.observeElement = this.observeElement || document;
            for (var i=0, len=this.KEY_EVENTS.length; i<len; i++) {
                OpenLayers.Event.observe(
                    this.observeElement, this.KEY_EVENTS[i], this.eventListener);
            }
            return true;
        } else {
            return false;
        }
    },

        deactivate: function() {
        var deactivated = false;
        if (OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            for (var i=0, len=this.KEY_EVENTS.length; i<len; i++) {
                OpenLayers.Event.stopObserving(
                    this.observeElement, this.KEY_EVENTS[i], this.eventListener);
            }
            deactivated = true;
        }
        return deactivated;
    },

        handleKeyEvent: function (evt) {
        if (this.checkModifiers(evt)) {
            this.callback(evt.type, [evt]);
        }
    },

    CLASS_NAME: "OpenLayers.Handler.Keyboard"
});
