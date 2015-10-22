/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Handler.Hover = OpenLayers.Class(OpenLayers.Handler, {

        delay: 500,
    
        pixelTolerance: null,

        stopMove: false,

        px: null,

        timerId: null,
 
    
        mousemove: function(evt) {
        if(this.passesTolerance(evt.xy)) {
            this.clearTimer();
            this.callback('move', [evt]);
            this.px = evt.xy;
            evt = OpenLayers.Util.extend({}, evt);
            this.timerId = window.setTimeout(
                OpenLayers.Function.bind(this.delayedCall, this, evt),
                this.delay
            );
        }
        return !this.stopMove;
    },

        mouseout: function(evt) {
        if (OpenLayers.Util.mouseLeft(evt, this.map.viewPortDiv)) {
            this.clearTimer();
            this.callback('move', [evt]);
        }
        return true;
    },

        passesTolerance: function(px) {
        var passes = true;
        if(this.pixelTolerance && this.px) {
            var dpx = Math.sqrt(
                Math.pow(this.px.x - px.x, 2) +
                Math.pow(this.px.y - px.y, 2)
            );
            if(dpx < this.pixelTolerance) {
                passes = false;
            }
        }
        return passes;
    },

        clearTimer: function() {
        if(this.timerId != null) {
            window.clearTimeout(this.timerId);
            this.timerId = null;
        }
    },

        delayedCall: function(evt) {
        this.callback('pause', [evt]);
    },

        deactivate: function() {
        var deactivated = false;
        if(OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            this.clearTimer();
            deactivated = true;
        }
        return deactivated;
    },

    CLASS_NAME: "OpenLayers.Handler.Hover"
});
