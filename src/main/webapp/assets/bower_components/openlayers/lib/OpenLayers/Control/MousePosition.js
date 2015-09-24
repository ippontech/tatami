/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Control.MousePosition = OpenLayers.Class(OpenLayers.Control, {

        autoActivate: true,

        element: null,

        prefix: '',

        separator: ', ',

        suffix: '',

        numDigits: 5,

        granularity: 10,

        emptyString: null,

        lastXy: null,

        displayProjection: null,

    
         destroy: function() {
         this.deactivate();
         OpenLayers.Control.prototype.destroy.apply(this, arguments);
     },

        activate: function() {
        if (OpenLayers.Control.prototype.activate.apply(this, arguments)) {
            this.map.events.register('mousemove', this, this.redraw);
            this.map.events.register('mouseout', this, this.reset);
            this.redraw();
            return true;
        } else {
            return false;
        }
    },

        deactivate: function() {
        if (OpenLayers.Control.prototype.deactivate.apply(this, arguments)) {
            this.map.events.unregister('mousemove', this, this.redraw);
            this.map.events.unregister('mouseout', this, this.reset);
            this.element.innerHTML = "";
            return true;
        } else {
            return false;
        }
    },

        draw: function() {
        OpenLayers.Control.prototype.draw.apply(this, arguments);

        if (!this.element) {
            this.div.left = "";
            this.div.top = "";
            this.element = this.div;
        }

        return this.div;
    },

        redraw: function(evt) {

        var lonLat;

        if (evt == null) {
            this.reset();
            return;
        } else {
            if (this.lastXy == null ||
                Math.abs(evt.xy.x - this.lastXy.x) > this.granularity ||
                Math.abs(evt.xy.y - this.lastXy.y) > this.granularity)
            {
                this.lastXy = evt.xy;
                return;
            }

            lonLat = this.map.getLonLatFromPixel(evt.xy);
            if (!lonLat) {
                return;
            }
            if (this.displayProjection) {
                lonLat.transform(this.map.getProjectionObject(),
                                 this.displayProjection );
            }
            this.lastXy = evt.xy;

        }

        var newHtml = this.formatOutput(lonLat);

        if (newHtml != this.element.innerHTML) {
            this.element.innerHTML = newHtml;
        }
    },

        reset: function(evt) {
        if (this.emptyString != null) {
            this.element.innerHTML = this.emptyString;
        }
    },

        formatOutput: function(lonLat) {
        var digits = parseInt(this.numDigits);
        var newHtml =
            this.prefix +
            lonLat.lon.toFixed(digits) +
            this.separator +
            lonLat.lat.toFixed(digits) +
            this.suffix;
        return newHtml;
    },

    CLASS_NAME: "OpenLayers.Control.MousePosition"
});
