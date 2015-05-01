/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Control.Measure = OpenLayers.Class(OpenLayers.Control, {

    
    
        callbacks: null,

        displaySystem: 'metric',

        geodesic: false,

        displaySystemUnits: {
        geographic: ['dd'],
        english: ['mi', 'ft', 'in'],
        metric: ['km', 'm']
    },

        partialDelay: 300,

        delayedTrigger: null,

        persist: false,

        immediate : false,

        initialize: function(handler, options) {
        OpenLayers.Control.prototype.initialize.apply(this, [options]);
        var callbacks = {done: this.measureComplete,
            point: this.measurePartial};
        if (this.immediate){
            callbacks.modify = this.measureImmediate;
        }
        this.callbacks = OpenLayers.Util.extend(callbacks, this.callbacks);
        this.handlerOptions = OpenLayers.Util.extend(
            {persist: this.persist}, this.handlerOptions
        );
        this.handler = new handler(this, this.callbacks, this.handlerOptions);
    },

        deactivate: function() {
        this.cancelDelay();
        return OpenLayers.Control.prototype.deactivate.apply(this, arguments);
    },

        cancel: function() {
        this.cancelDelay();
        this.handler.cancel();
    },

        setImmediate: function(immediate) {
        this.immediate = immediate;
        if (this.immediate){
            this.callbacks.modify = this.measureImmediate;
        } else {
            delete this.callbacks.modify;
        }
    },

        updateHandler: function(handler, options) {
        var active = this.active;
        if(active) {
            this.deactivate();
        }
        this.handler = new handler(this, this.callbacks, options);
        if(active) {
            this.activate();
        }
    },

        measureComplete: function(geometry) {
        this.cancelDelay();
        this.measure(geometry, "measure");
    },

        measurePartial: function(point, geometry) {
        this.cancelDelay();
        geometry = geometry.clone();
        if (this.handler.freehandMode(this.handler.evt)) {
            this.measure(geometry, "measurepartial");
        } else {
            this.delayedTrigger = window.setTimeout(
                OpenLayers.Function.bind(function() {
                    this.delayedTrigger = null;
                    this.measure(geometry, "measurepartial");
                }, this),
                this.partialDelay
            );
        }
    },

        measureImmediate : function(point, feature, drawing) {
        if (drawing && !this.handler.freehandMode(this.handler.evt)) {
            this.cancelDelay();
            this.measure(feature.geometry, "measurepartial");
        }
    },

        cancelDelay: function() {
        if (this.delayedTrigger !== null) {
            window.clearTimeout(this.delayedTrigger);
            this.delayedTrigger = null;
        }
    },

        measure: function(geometry, eventType) {
        var stat, order;
        if(geometry.CLASS_NAME.indexOf('LineString') > -1) {
            stat = this.getBestLength(geometry);
            order = 1;
        } else {
            stat = this.getBestArea(geometry);
            order = 2;
        }
        this.events.triggerEvent(eventType, {
            measure: stat[0],
            units: stat[1],
            order: order,
            geometry: geometry
        });
    },

        getBestArea: function(geometry) {
        var units = this.displaySystemUnits[this.displaySystem];
        var unit, area;
        for(var i=0, len=units.length; i<len; ++i) {
            unit = units[i];
            area = this.getArea(geometry, unit);
            if(area > 1) {
                break;
            }
        }
        return [area, unit];
    },

        getArea: function(geometry, units) {
        var area, geomUnits;
        if(this.geodesic) {
            area = geometry.getGeodesicArea(this.map.getProjectionObject());
            geomUnits = "m";
        } else {
            area = geometry.getArea();
            geomUnits = this.map.getUnits();
        }
        var inPerDisplayUnit = OpenLayers.INCHES_PER_UNIT[units];
        if(inPerDisplayUnit) {
            var inPerMapUnit = OpenLayers.INCHES_PER_UNIT[geomUnits];
            area *= Math.pow((inPerMapUnit / inPerDisplayUnit), 2);
        }
        return area;
    },

        getBestLength: function(geometry) {
        var units = this.displaySystemUnits[this.displaySystem];
        var unit, length;
        for(var i=0, len=units.length; i<len; ++i) {
            unit = units[i];
            length = this.getLength(geometry, unit);
            if(length > 1) {
                break;
            }
        }
        return [length, unit];
    },

        getLength: function(geometry, units) {
        var length, geomUnits;
        if(this.geodesic) {
            length = geometry.getGeodesicLength(this.map.getProjectionObject());
            geomUnits = "m";
        } else {
            length = geometry.getLength();
            geomUnits = this.map.getUnits();
        }
        var inPerDisplayUnit = OpenLayers.INCHES_PER_UNIT[units];
        if(inPerDisplayUnit) {
            var inPerMapUnit = OpenLayers.INCHES_PER_UNIT[geomUnits];
            length *= (inPerMapUnit / inPerDisplayUnit);
        }
        return length;
    },

    CLASS_NAME: "OpenLayers.Control.Measure"
});
