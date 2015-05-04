/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Layer = OpenLayers.Class({

        id: null,

        name: null,

        div: null,

        opacity: 1,

        alwaysInRange: null,   

        RESOLUTION_PROPERTIES: [
        'scales', 'resolutions',
        'maxScale', 'minScale',
        'maxResolution', 'minResolution',
        'numZoomLevels', 'maxZoomLevel'
    ],

        events: null,

        map: null,
    
        isBaseLayer: false,
 
        alpha: false,

        displayInLayerSwitcher: true,

        visibility: true,

        attribution: null,

        inRange: false,
    
        imageSize: null,

        options: null,

        eventListeners: null,

        projection: null,    
    
        units: null,

        scales: null,

        resolutions: null,
    
        maxExtent: null,
    
        minExtent: null,
    
        maxResolution: null,

        minResolution: null,

        numZoomLevels: null,
    
        minScale: null,
    
        maxScale: null,

        displayOutsideMaxExtent: false,

        wrapDateLine: false,
    
        metadata: null,
    
        initialize: function(name, options) {

        this.metadata = {};
        
        options = OpenLayers.Util.extend({}, options);
        if (this.alwaysInRange != null) {
            options.alwaysInRange = this.alwaysInRange;
        }
        this.addOptions(options);

        this.name = name;
        
        if (this.id == null) {

            this.id = OpenLayers.Util.createUniqueID(this.CLASS_NAME + "_");

            this.div = OpenLayers.Util.createDiv(this.id);
            this.div.style.width = "100%";
            this.div.style.height = "100%";
            this.div.dir = "ltr";

            this.events = new OpenLayers.Events(this, this.div);
            if(this.eventListeners instanceof Object) {
                this.events.on(this.eventListeners);
            }

        }
    },
    
        destroy: function(setNewBaseLayer) {
        if (setNewBaseLayer == null) {
            setNewBaseLayer = true;
        }
        if (this.map != null) {
            this.map.removeLayer(this, setNewBaseLayer);
        }
        this.projection = null;
        this.map = null;
        this.name = null;
        this.div = null;
        this.options = null;

        if (this.events) {
            if(this.eventListeners) {
                this.events.un(this.eventListeners);
            }
            this.events.destroy();
        }
        this.eventListeners = null;
        this.events = null;
    },
    
       clone: function (obj) {
        
        if (obj == null) {
            obj = new OpenLayers.Layer(this.name, this.getOptions());
        }
        OpenLayers.Util.applyDefaults(obj, this);
        obj.map = null;
        
        return obj;
    },
    
        getOptions: function() {
        var options = {};
        for(var o in this.options) {
            options[o] = this[o];
        }
        return options;
    },
    
        setName: function(newName) {
        if (newName != this.name) {
            this.name = newName;
            if (this.map != null) {
                this.map.events.triggerEvent("changelayer", {
                    layer: this,
                    property: "name"
                });
            }
        }
    },    
    
       addOptions: function (newOptions, reinitialize) {

        if (this.options == null) {
            this.options = {};
        }
        
        if (newOptions) {
            if(typeof newOptions.projection == "string") {
                newOptions.projection = new OpenLayers.Projection(newOptions.projection);
            }
            if (newOptions.projection) {
                OpenLayers.Util.applyDefaults(newOptions,
                    OpenLayers.Projection.defaults[newOptions.projection.getCode()]);
            }
            if (newOptions.maxExtent && !(newOptions.maxExtent instanceof OpenLayers.Bounds)) {
                newOptions.maxExtent = new OpenLayers.Bounds(newOptions.maxExtent);
            }
            if (newOptions.minExtent && !(newOptions.minExtent instanceof OpenLayers.Bounds)) {
                newOptions.minExtent = new OpenLayers.Bounds(newOptions.minExtent);
            }
        }
        OpenLayers.Util.extend(this.options, newOptions);
        OpenLayers.Util.extend(this, newOptions);
        if(this.projection && this.projection.getUnits()) {
            this.units = this.projection.getUnits();
        }
        if(this.map) {
            var resolution = this.map.getResolution();
            var properties = this.RESOLUTION_PROPERTIES.concat(
                ["projection", "units", "minExtent", "maxExtent"]
            );
            for(var o in newOptions) {
                if(newOptions.hasOwnProperty(o) &&
                   OpenLayers.Util.indexOf(properties, o) >= 0) {

                    this.initResolutions();
                    if (reinitialize && this.map.baseLayer === this) {
                        this.map.setCenter(this.map.getCenter(),
                            this.map.getZoomForResolution(resolution),
                            false, true
                        );
                        this.map.events.triggerEvent("changebaselayer", {
                            layer: this
                        });
                    }
                    break;
                }
            }
        }
    },

        onMapResize: function() {
    },

        redraw: function() {
        var redrawn = false;
        if (this.map) {
            this.inRange = this.calculateInRange();
            var extent = this.getExtent();

            if (extent && this.inRange && this.visibility) {
                var zoomChanged = true;
                this.moveTo(extent, zoomChanged, false);
                this.events.triggerEvent("moveend",
                    {"zoomChanged": zoomChanged});
                redrawn = true;
            }
        }
        return redrawn;
    },

        moveTo:function(bounds, zoomChanged, dragging) {
        var display = this.visibility;
        if (!this.isBaseLayer) {
            display = display && this.inRange;
        }
        this.display(display);
    },

        moveByPx: function(dx, dy) {
    },

        setMap: function(map) {
        if (this.map == null) {
        
            this.map = map;
            this.maxExtent = this.maxExtent || this.map.maxExtent;
            this.minExtent = this.minExtent || this.map.minExtent;

            this.projection = this.projection || this.map.projection;
            if (typeof this.projection == "string") {
                this.projection = new OpenLayers.Projection(this.projection);
            }
            if (this.projection && this.projection.getUnits()) {
                this.units = this.projection.getUnits();
            }
            else {
                this.units = this.units || this.map.units;
            }
            
            this.initResolutions();
            
            if (!this.isBaseLayer) {
                this.inRange = this.calculateInRange();
                var show = ((this.visibility) && (this.inRange));
                this.div.style.display = show ? "" : "none";
            }
            this.setTileSize();
        }
    },
    
        afterAdd: function() {
    },
    
        removeMap: function(map) {
    },
    
        setTileSize: function(size) {
        var tileSize = (size) ? size :
                                ((this.tileSize) ? this.tileSize :
                                                   this.map.getTileSize());
        this.tileSize = tileSize;
        if(this.gutter) {
            this.imageSize = new OpenLayers.Size(tileSize.w + (2*this.gutter), 
                                                 tileSize.h + (2*this.gutter)); 
        }
    },

        getVisibility: function() {
        return this.visibility;
    },

        setVisibility: function(visibility) {
        if (visibility != this.visibility) {
            this.visibility = visibility;
            this.display(visibility);
            this.redraw();
            if (this.map != null) {
                this.map.events.triggerEvent("changelayer", {
                    layer: this,
                    property: "visibility"
                });
            }
            this.events.triggerEvent("visibilitychanged");
        }
    },

        display: function(display) {
        if (display != (this.div.style.display != "none")) {
            this.div.style.display = (display && this.calculateInRange()) ? "block" : "none";
        }
    },

        calculateInRange: function() {
        var inRange = false;

        if (this.alwaysInRange) {
            inRange = true;
        } else {
            if (this.map) {
                var resolution = this.map.getResolution();
                inRange = ( (resolution >= this.minResolution) &&
                            (resolution <= this.maxResolution) );
            }
        }
        return inRange;
    },

        setIsBaseLayer: function(isBaseLayer) {
        if (isBaseLayer != this.isBaseLayer) {
            this.isBaseLayer = isBaseLayer;
            if (this.map != null) {
                this.map.events.triggerEvent("changebaselayer", {
                    layer: this
                });
            }
        }
    },

    /*                                                      */
  /*                 Baselayer Functions                  */
  /*                                                      */
    
        initResolutions: function() {

        var i, len, p;
        var props = {}, alwaysInRange = true;
        for(i=0, len=this.RESOLUTION_PROPERTIES.length; i<len; i++) {
            p = this.RESOLUTION_PROPERTIES[i];
            props[p] = this.options[p];
            if(alwaysInRange && this.options[p]) {
                alwaysInRange = false;
            }
        }
        if(this.options.alwaysInRange == null) {
            this.alwaysInRange = alwaysInRange;
        }
        if(props.resolutions == null) {
            props.resolutions = this.resolutionsFromScales(props.scales);
        }
        if(props.resolutions == null) {
            props.resolutions = this.calculateResolutions(props);
        }
        if(props.resolutions == null) {
            for(i=0, len=this.RESOLUTION_PROPERTIES.length; i<len; i++) {
                p = this.RESOLUTION_PROPERTIES[i];
                props[p] = this.options[p] != null ?
                    this.options[p] : this.map[p];
            }
            if(props.resolutions == null) {
                props.resolutions = this.resolutionsFromScales(props.scales);
            }
            if(props.resolutions == null) {
                props.resolutions = this.calculateResolutions(props);
            }
        }
        var maxResolution;
        if(this.options.maxResolution &&
           this.options.maxResolution !== "auto") {
            maxResolution = this.options.maxResolution;
        }
        if(this.options.minScale) {
            maxResolution = OpenLayers.Util.getResolutionFromScale(
                this.options.minScale, this.units);
        }
        var minResolution;
        if(this.options.minResolution &&
           this.options.minResolution !== "auto") {
            minResolution = this.options.minResolution;
        }
        if(this.options.maxScale) {
            minResolution = OpenLayers.Util.getResolutionFromScale(
                this.options.maxScale, this.units);
        }

        if(props.resolutions) {
            props.resolutions.sort(function(a, b) {
                return (b - a);
            });
            if(!maxResolution) {
                maxResolution = props.resolutions[0];
            }
            if(!minResolution) {
                var lastIdx = props.resolutions.length - 1;
                minResolution = props.resolutions[lastIdx];
            }
        }

        this.resolutions = props.resolutions;
        if(this.resolutions) {
            len = this.resolutions.length;
            this.scales = new Array(len);
            for(i=0; i<len; i++) {
                this.scales[i] = OpenLayers.Util.getScaleFromResolution(
                    this.resolutions[i], this.units);
            }
            this.numZoomLevels = len;
        }
        this.minResolution = minResolution;
        if(minResolution) {
            this.maxScale = OpenLayers.Util.getScaleFromResolution(
                minResolution, this.units);
        }
        this.maxResolution = maxResolution;
        if(maxResolution) {
            this.minScale = OpenLayers.Util.getScaleFromResolution(
                maxResolution, this.units);
        }
    },

        resolutionsFromScales: function(scales) {
        if(scales == null) {
            return;
        }
        var resolutions, i, len;
        len = scales.length;
        resolutions = new Array(len);
        for(i=0; i<len; i++) {
            resolutions[i] = OpenLayers.Util.getResolutionFromScale(
                scales[i], this.units);
        }
        return resolutions;
    },

        calculateResolutions: function(props) {

        var viewSize, wRes, hRes;
        var maxResolution = props.maxResolution;
        if(props.minScale != null) {
            maxResolution =
                OpenLayers.Util.getResolutionFromScale(props.minScale,
                                                       this.units);
        } else if(maxResolution == "auto" && this.maxExtent != null) {
            viewSize = this.map.getSize();
            wRes = this.maxExtent.getWidth() / viewSize.w;
            hRes = this.maxExtent.getHeight() / viewSize.h;
            maxResolution = Math.max(wRes, hRes);
        }
        var minResolution = props.minResolution;
        if(props.maxScale != null) {
            minResolution =
                OpenLayers.Util.getResolutionFromScale(props.maxScale,
                                                       this.units);
        } else if(props.minResolution == "auto" && this.minExtent != null) {
            viewSize = this.map.getSize();
            wRes = this.minExtent.getWidth() / viewSize.w;
            hRes = this.minExtent.getHeight()/ viewSize.h;
            minResolution = Math.max(wRes, hRes);
        }

        if(typeof maxResolution !== "number" &&
           typeof minResolution !== "number" &&
           this.maxExtent != null) {
            var tileSize = this.map.getTileSize();
            maxResolution = Math.max(
                this.maxExtent.getWidth() / tileSize.w,
                this.maxExtent.getHeight() / tileSize.h
            );
        }
        var maxZoomLevel = props.maxZoomLevel;
        var numZoomLevels = props.numZoomLevels;
        if(typeof minResolution === "number" &&
           typeof maxResolution === "number" && numZoomLevels === undefined) {
            var ratio = maxResolution / minResolution;
            numZoomLevels = Math.floor(Math.log(ratio) / Math.log(2)) + 1;
        } else if(numZoomLevels === undefined && maxZoomLevel != null) {
            numZoomLevels = maxZoomLevel + 1;
        }
        if(typeof numZoomLevels !== "number" || numZoomLevels <= 0 ||
           (typeof maxResolution !== "number" &&
                typeof minResolution !== "number")) {
            return;
        }

        var resolutions = new Array(numZoomLevels);
        var base = 2;
        if(typeof minResolution == "number" &&
           typeof maxResolution == "number") {
            base = Math.pow(
                    (maxResolution / minResolution),
                (1 / (numZoomLevels - 1))
            );
        }

        var i;
        if(typeof maxResolution === "number") {
            for(i=0; i<numZoomLevels; i++) {
                resolutions[i] = maxResolution / Math.pow(base, i);
            }
        } else {
            for(i=0; i<numZoomLevels; i++) {
                resolutions[numZoomLevels - 1 - i] =
                    minResolution * Math.pow(base, i);
            }
        }

        return resolutions;
    },

        getResolution: function() {
        var zoom = this.map.getZoom();
        return this.getResolutionForZoom(zoom);
    },

        getExtent: function() {
        return this.map.calculateBounds();
    },

        getZoomForExtent: function(extent, closest) {
        var viewSize = this.map.getSize();
        var idealResolution = Math.max( extent.getWidth()  / viewSize.w,
                                        extent.getHeight() / viewSize.h );

        return this.getZoomForResolution(idealResolution, closest);
    },
    
        getDataExtent: function () {
    },

        getResolutionForZoom: function(zoom) {
        zoom = Math.max(0, Math.min(zoom, this.resolutions.length - 1));
        var resolution;
        if(this.map.fractionalZoom) {
            var low = Math.floor(zoom);
            var high = Math.ceil(zoom);
            resolution = this.resolutions[low] -
                ((zoom-low) * (this.resolutions[low]-this.resolutions[high]));
        } else {
            resolution = this.resolutions[Math.round(zoom)];
        }
        return resolution;
    },

        getZoomForResolution: function(resolution, closest) {
        var zoom, i, len;
        if(this.map.fractionalZoom) {
            var lowZoom = 0;
            var highZoom = this.resolutions.length - 1;
            var highRes = this.resolutions[lowZoom];
            var lowRes = this.resolutions[highZoom];
            var res;
            for(i=0, len=this.resolutions.length; i<len; ++i) {
                res = this.resolutions[i];
                if(res >= resolution) {
                    highRes = res;
                    lowZoom = i;
                }
                if(res <= resolution) {
                    lowRes = res;
                    highZoom = i;
                    break;
                }
            }
            var dRes = highRes - lowRes;
            if(dRes > 0) {
                zoom = lowZoom + ((highRes - resolution) / dRes);
            } else {
                zoom = lowZoom;
            }
        } else {
            var diff;
            var minDiff = Number.POSITIVE_INFINITY;
            for(i=0, len=this.resolutions.length; i<len; i++) {            
                if (closest) {
                    diff = Math.abs(this.resolutions[i] - resolution);
                    if (diff > minDiff) {
                        break;
                    }
                    minDiff = diff;
                } else {
                    if (this.resolutions[i] < resolution) {
                        break;
                    }
                }
            }
            zoom = Math.max(0, i-1);
        }
        return zoom;
    },
    
        getLonLatFromViewPortPx: function (viewPortPx) {
        var lonlat = null;
        var map = this.map;
        if (viewPortPx != null && map.minPx) {
            var res = map.getResolution();
            var maxExtent = map.getMaxExtent({restricted: true});
            var lon = (viewPortPx.x - map.minPx.x) * res + maxExtent.left;
            var lat = (map.minPx.y - viewPortPx.y) * res + maxExtent.top;
            lonlat = new OpenLayers.LonLat(lon, lat);

            if (this.wrapDateLine) {
                lonlat = lonlat.wrapDateLine(this.maxExtent);
            }
        }
        return lonlat;
    },

        getViewPortPxFromLonLat: function (lonlat, resolution) {
        var px = null; 
        if (lonlat != null) {
            resolution = resolution || this.map.getResolution();
            var extent = this.map.calculateBounds(null, resolution);
            px = new OpenLayers.Pixel(
                (1/resolution * (lonlat.lon - extent.left)),
                (1/resolution * (extent.top - lonlat.lat))
            );    
        }
        return px;
    },
    
        setOpacity: function(opacity) {
        if (opacity != this.opacity) {
            this.opacity = opacity;
            var childNodes = this.div.childNodes;
            for(var i = 0, len = childNodes.length; i < len; ++i) {
                var element = childNodes[i].firstChild || childNodes[i];
                var lastChild = childNodes[i].lastChild;
                if (lastChild && lastChild.nodeName.toLowerCase() === "iframe") {
                    element = lastChild.parentNode;
                }
                OpenLayers.Util.modifyDOMElement(element, null, null, null, 
                                                 null, null, null, opacity);
            }
            if (this.map != null) {
                this.map.events.triggerEvent("changelayer", {
                    layer: this,
                    property: "opacity"
                });
            }
        }
    },

        adjustBounds: function (bounds) {

        if (this.gutter) {
            var mapGutter = this.gutter * this.map.getResolution();
            bounds = new OpenLayers.Bounds(bounds.left - mapGutter,
                                           bounds.bottom - mapGutter,
                                           bounds.right + mapGutter,
                                           bounds.top + mapGutter);
        }

        if (this.wrapDateLine) {
            var wrappingOptions = { 
                'rightTolerance':this.getResolution(),
                'leftTolerance':this.getResolution()
            };    
            bounds = bounds.wrapDateLine(this.maxExtent, wrappingOptions);
                              
        }
        return bounds;
    },

    CLASS_NAME: "OpenLayers.Layer"
});
