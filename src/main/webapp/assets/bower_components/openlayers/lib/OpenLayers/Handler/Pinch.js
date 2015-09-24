/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Handler.Pinch = OpenLayers.Class(OpenLayers.Handler, {

        started: false,

        stopDown: false,

        pinching: false,

        last: null,

        start: null,

    
        touchstart: function(evt) {
        var propagate = true;
        this.pinching = false;
        if (OpenLayers.Event.isMultiTouch(evt)) {
            this.started = true;
            this.last = this.start = {
                distance: this.getDistance(evt.touches),
                delta: 0,
                scale: 1
            };
            this.callback("start", [evt, this.start]);
            propagate = !this.stopDown;
        } else if (this.started) {
            return false;
        } else {
            this.started = false;
            this.start = null;
            this.last = null;
        }
        OpenLayers.Event.preventDefault(evt);
        return propagate;
    },

        touchmove: function(evt) {
        if (this.started && OpenLayers.Event.isMultiTouch(evt)) {
            this.pinching = true;
            var current = this.getPinchData(evt);
            this.callback("move", [evt, current]);
            this.last = current;
            OpenLayers.Event.stop(evt);
        } else if (this.started) {
            return false;
        }
        return true;
    },

        touchend: function(evt) {
        if (this.started && !OpenLayers.Event.isMultiTouch(evt)) {
            this.started = false;
            this.pinching = false;
            this.callback("done", [evt, this.start, this.last]);
            this.start = null;
            this.last = null;
            return false;
        }
        return true;
    },

        activate: function() {
        var activated = false;
        if (OpenLayers.Handler.prototype.activate.apply(this, arguments)) {
            this.pinching = false;
            activated = true;
        }
        return activated;
    },

        deactivate: function() {
        var deactivated = false;
        if (OpenLayers.Handler.prototype.deactivate.apply(this, arguments)) {
            this.started = false;
            this.pinching = false;
            this.start = null;
            this.last = null;
            deactivated = true;
        }
        return deactivated;
    },

        getDistance: function(touches) {
        var t0 = touches[0];
        var t1 = touches[1];
        return Math.sqrt(
            Math.pow(t0.olClientX - t1.olClientX, 2) +
            Math.pow(t0.olClientY - t1.olClientY, 2)
        );
    },


        getPinchData: function(evt) {
        var distance = this.getDistance(evt.touches);
        var scale = distance / this.start.distance;
        return {
            distance: distance,
            delta: this.last.distance - distance,
            scale: scale
        };
    },

    CLASS_NAME: "OpenLayers.Handler.Pinch"
});

