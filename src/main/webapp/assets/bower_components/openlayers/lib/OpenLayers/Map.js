/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Map = OpenLayers.Class({
    
        Z_INDEX_BASE: {
        BaseLayer: 100,
        Overlay: 325,
        Feature: 725,
        Popup: 750,
        Control: 1000
    },

    
        id: null,
    
        fractionalZoom: false,
    
        events: null,
    
        allOverlays: false,

        div: null,
    
        dragging: false,

        size: null,
    
        viewPortDiv: null,

        layerContainerOrigin: null,

        layerContainerDiv: null,

        layers: null,

        controls: null,

        popups: null,

        baseLayer: null,
    
        center: null,

        resolution: null,

        zoom: 0,    

        panRatio: 1.5,    

        options: null,

        tileSize: null,

        projection: "EPSG:4326",    
        
        units: null,

        resolutions: null,

        maxResolution: null,

        minResolution: null,

        maxScale: null,

        minScale: null,

        maxExtent: null,
    
        minExtent: null,
    
        restrictedExtent: null,

        numZoomLevels: 16,

        theme: null,
    
        displayProjection: null,

    
        fallThrough: false,

        autoUpdateSize: true,
    
        eventListeners: null,

        panTween: null,

        panMethod: OpenLayers.Easing.Expo.easeOut,
    
        panDuration: 50,
    
        zoomTween: null,

        zoomMethod: OpenLayers.Easing.Quad.easeOut,
    
        zoomDuration: 20,
    
        paddingForPopups : null,
    
        layerContainerOriginPx: null,
    
        minPx: null,
    
        maxPx: null,
    
                delete this.center;
            delete this.zoom;
            this.addLayers(options.layers);
            if (options.center && !this.getCenter()) {
                this.setCenter(options.center, options.zoom);
            }
        }

        if (this.panMethod) {
            this.panTween = new OpenLayers.Tween(this.panMethod);
        }
        if (this.zoomMethod && this.applyTransform.transform) {
            this.zoomTween = new OpenLayers.Tween(this.zoomMethod);
        }
    },

        getViewport: function() {
        return this.viewPortDiv;
    },
    
        render: function(div) {
        this.div = OpenLayers.Util.getElement(div);
        OpenLayers.Element.addClass(this.div, 'olMap');
        this.viewPortDiv.parentNode.removeChild(this.viewPortDiv);
        this.div.appendChild(this.viewPortDiv);
        this.updateSize();
    },

        unloadDestroy: null,
    
        updateSizeDestroy: null,

        destroy:function() {
        if (!this.unloadDestroy) {
            return false;
        }
        if(this.panTween) {
            this.panTween.stop();
            this.panTween = null;
        }
        if(this.zoomTween) {
            this.zoomTween.stop();
            this.zoomTween = null;
        }
        OpenLayers.Event.stopObserving(window, 'unload', this.unloadDestroy);
        this.unloadDestroy = null;

        if (this.updateSizeDestroy) {
            OpenLayers.Event.stopObserving(window, 'resize', 
                                           this.updateSizeDestroy);
        }
        
        this.paddingForPopups = null;    

        if (this.controls != null) {
            for (var i = this.controls.length - 1; i>=0; --i) {
                this.controls[i].destroy();
            } 
            this.controls = null;
        }
        if (this.layers != null) {
            for (var i = this.layers.length - 1; i>=0; --i) {
                this.layers[i].destroy(false);
            } 
            this.layers = null;
        }
        if (this.viewPortDiv && this.viewPortDiv.parentNode) {
            this.viewPortDiv.parentNode.removeChild(this.viewPortDiv);
        }
        this.viewPortDiv = null;
        
        if (this.tileManager) {
            this.tileManager.removeMap(this);
            this.tileManager = null;
        }

        if(this.eventListeners) {
            this.events.un(this.eventListeners);
            this.eventListeners = null;
        }
        this.events.destroy();
        this.events = null;

        this.options = null;
    },

        setOptions: function(options) {
        var updatePxExtent = this.minPx &&
            options.restrictedExtent != this.restrictedExtent;
        OpenLayers.Util.extend(this, options);
        updatePxExtent && this.moveTo(this.getCachedCenter(), this.zoom, {
            forceZoomChange: true
        });
    },

         getTileSize: function() {
         return this.tileSize;
     },


        getBy: function(array, property, match) {
        var test = (typeof match.test == "function");
        var found = OpenLayers.Array.filter(this[array], function(item) {
            return item[property] == match || (test && match.test(item[property]));
        });
        return found;
    },

        getLayersBy: function(property, match) {
        return this.getBy("layers", property, match);
    },

        getLayersByName: function(match) {
        return this.getLayersBy("name", match);
    },

        getLayersByClass: function(match) {
        return this.getLayersBy("CLASS_NAME", match);
    },

        getControlsBy: function(property, match) {
        return this.getBy("controls", property, match);
    },

        getControlsByClass: function(match) {
        return this.getControlsBy("CLASS_NAME", match);
    },

    /*                                                      */
  /*                  Layer Functions                     */
  /*                                                      */
  /*     The following functions deal with adding and     */
  /*        removing Layers to and from the Map           */
  /*                                                      */
      getLayer: function(id) {
        var foundLayer = null;
        for (var i=0, len=this.layers.length; i<len; i++) {
            var layer = this.layers[i];
            if (layer.id == id) {
                foundLayer = layer;
                break;
            }
        }
        return foundLayer;
    },

        resetLayersZIndex: function() {
        for (var i=0, len=this.layers.length; i<len; i++) {
            var layer = this.layers[i];
            this.setLayerZIndex(layer, i);
        }
    },

        removeLayer: function(layer, setNewBaseLayer) {
        if (this.events.triggerEvent("preremovelayer", {layer: layer}) === false) {
            return;
        }
        if (setNewBaseLayer == null) {
            setNewBaseLayer = true;
        }

        if (layer.isFixed) {
            this.viewPortDiv.removeChild(layer.div);
        } else {
            this.layerContainerDiv.removeChild(layer.div);
        }
        OpenLayers.Util.removeItem(this.layers, layer);
        layer.removeMap(this);
        layer.map = null;
        if(this.baseLayer == layer) {
            this.baseLayer = null;
            if(setNewBaseLayer) {
                for(var i=0, len=this.layers.length; i<len; i++) {
                    var iLayer = this.layers[i];
                    if (iLayer.isBaseLayer || this.allOverlays) {
                        this.setBaseLayer(iLayer);
                        break;
                    }
                }
            }
        }

        this.resetLayersZIndex();

        this.events.triggerEvent("removelayer", {layer: layer});
        layer.events.triggerEvent("removed", {map: this, layer: layer});
    },

        getNumLayers: function () {
        return this.layers.length;
    },

        getLayerIndex: function (layer) {
        return OpenLayers.Util.indexOf(this.layers, layer);
    },
    
        setLayerIndex: function (layer, idx) {
        var base = this.getLayerIndex(layer);
        if (idx < 0) {
            idx = 0;
        } else if (idx > this.layers.length) {
            idx = this.layers.length;
        }
        if (base != idx) {
            this.layers.splice(base, 1);
            this.layers.splice(idx, 0, layer);
            for (var i=0, len=this.layers.length; i<len; i++) {
                this.setLayerZIndex(this.layers[i], i);
            }
            this.events.triggerEvent("changelayer", {
                layer: layer, property: "order"
            });
            if(this.allOverlays) {
                if(idx === 0) {
                    this.setBaseLayer(layer);
                } else if(this.baseLayer !== this.layers[0]) {
                    this.setBaseLayer(this.layers[0]);
                }
            }
        }
    },

        raiseLayer: function (layer, delta) {
        var idx = this.getLayerIndex(layer) + delta;
        this.setLayerIndex(layer, idx);
    },
    
        setBaseLayer: function(newBaseLayer) {
        
        if (newBaseLayer != this.baseLayer) {
            if (OpenLayers.Util.indexOf(this.layers, newBaseLayer) != -1) {
                var center = this.getCachedCenter();
                var oldResolution = this.getResolution();
                var newResolution = OpenLayers.Util.getResolutionFromScale(
                    this.getScale(), newBaseLayer.units
                );
                if (this.baseLayer != null && !this.allOverlays) {
                    this.baseLayer.setVisibility(false);
                }
                this.baseLayer = newBaseLayer;
                
                if(!this.allOverlays || this.baseLayer.visibility) {
                    this.baseLayer.setVisibility(true);
                    if (this.baseLayer.inRange === false) {
                        this.baseLayer.redraw();
                    }
                }
                if (center != null) {
                    var newZoom = this.getZoomForResolution(
                        newResolution || this.resolution, true
                    );
                    this.setCenter(center, newZoom, false, oldResolution != newResolution);
                }

                this.events.triggerEvent("changebaselayer", {
                    layer: this.baseLayer
                });
            }        
        }
    },


    /*                                                      */
  /*                 Control Functions                    */
  /*                                                      */
  /*     The following functions deal with adding and     */
  /*        removing Controls to and from the Map         */
  /*                                                      */
    /*                                                      */
  /*                  Popup Functions                     */
  /*                                                      */
  /*     The following functions deal with adding and     */
  /*        removing Popups to and from the Map           */
  /*                                                      */
      addPopup: function(popup, exclusive) {

        if (exclusive) {
            for (var i = this.popups.length - 1; i >= 0; --i) {
                this.removePopup(this.popups[i]);
            }
        }

        popup.map = this;
        this.popups.push(popup);
        var popupDiv = popup.draw();
        if (popupDiv) {
            popupDiv.style.zIndex = this.Z_INDEX_BASE['Popup'] +
                                    this.popups.length;
            this.layerContainerDiv.appendChild(popupDiv);
        }
    },
    
        removePopup: function(popup) {
        OpenLayers.Util.removeItem(this.popups, popup);
        if (popup.div) {
            try { this.layerContainerDiv.removeChild(popup.div); }
            catch (e) { } // Popups sometimes apparently get disconnected
        }
        popup.map = null;
    },

    /*                                                      */
  /*              Container Div Functions                 */
  /*                                                      */
  /*   The following functions deal with the access to    */
  /*    and maintenance of the size of the container div  */
  /*                                                      */
      getSize: function () {
        var size = null;
        if (this.size != null) {
            size = this.size.clone();
        }
        return size;
    },

        updateSize: function() {
        var newSize = this.getCurrentSize();
        if (newSize && !isNaN(newSize.h) && !isNaN(newSize.w)) {
            this.events.clearMouseCache();
            var oldSize = this.getSize();
            if (oldSize == null) {
                this.size = oldSize = newSize;
            }
            if (!newSize.equals(oldSize)) {
                this.size = newSize;
                for(var i=0, len=this.layers.length; i<len; i++) {
                    this.layers[i].onMapResize();                
                }
    
                var center = this.getCachedCenter();
    
                if (this.baseLayer != null && center != null) {
                    var zoom = this.getZoom();
                    this.zoom = null;
                    this.setCenter(center, zoom);
                }
    
            }
        }
        this.events.triggerEvent("updatesize");
    },
    
        getCurrentSize: function() {

        var size = new OpenLayers.Size(this.div.clientWidth, 
                                       this.div.clientHeight);

        if (size.w == 0 && size.h == 0 || isNaN(size.w) && isNaN(size.h)) {
            size.w = this.div.offsetWidth;
            size.h = this.div.offsetHeight;
        }
        if (size.w == 0 && size.h == 0 || isNaN(size.w) && isNaN(size.h)) {
            size.w = parseInt(this.div.style.width);
            size.h = parseInt(this.div.style.height);
        }
        return size;
    },

        calculateBounds: function(center, resolution) {

        var extent = null;
        
        if (center == null) {
            center = this.getCachedCenter();
        }                
        if (resolution == null) {
            resolution = this.getResolution();
        }
    
        if ((center != null) && (resolution != null)) {
            var halfWDeg = (this.size.w * resolution) / 2;
            var halfHDeg = (this.size.h * resolution) / 2;
        
            extent = new OpenLayers.Bounds(center.lon - halfWDeg,
                                           center.lat - halfHDeg,
                                           center.lon + halfWDeg,
                                           center.lat + halfHDeg);
        }

        return extent;
    },


    /*                                                      */
  /*            Zoom, Center, Pan Functions               */
  /*                                                      */
  /*    The following functions handle the validation,    */
  /*   getting and setting of the Zoom Level and Center   */
  /*       as well as the panning of the Map              */
  /*                                                      */
          getCenter: function () {
        var center = null;
        var cachedCenter = this.getCachedCenter();
        if (cachedCenter) {
            center = cachedCenter.clone();
        }
        return center;
    },

        getCachedCenter: function() {
        if (!this.center && this.size) {
            this.center = this.getLonLatFromViewPortPx({
                x: this.size.w / 2,
                y: this.size.h / 2
            });
        }
        return this.center;
    },

        getZoom: function () {
        return this.zoom;
    },
    
        pan: function(dx, dy, options) {
        options = OpenLayers.Util.applyDefaults(options, {
            animate: true,
            dragging: false
        });
        if (options.dragging) {
            if (dx != 0 || dy != 0) {
                this.moveByPx(dx, dy);
            }
        } else {
            var centerPx = this.getViewPortPxFromLonLat(this.getCachedCenter());
            var newCenterPx = centerPx.add(dx, dy);

            if (this.dragging || !newCenterPx.equals(centerPx)) {
                var newCenterLonLat = this.getLonLatFromViewPortPx(newCenterPx);
                if (options.animate) {
                    this.panTo(newCenterLonLat);
                } else {
                    this.moveTo(newCenterLonLat);
                    if(this.dragging) {
                        this.dragging = false;
                        this.events.triggerEvent("moveend");
                    }
                }    
            }
        }        

   },
   
       panTo: function(lonlat) {
        if (this.panTween && this.getExtent().scale(this.panRatio).containsLonLat(lonlat)) {
            var center = this.getCachedCenter();
            if (lonlat.equals(center)) {
                return;
            }

            var from = this.getPixelFromLonLat(center);
            var to = this.getPixelFromLonLat(lonlat);
            var vector = { x: to.x - from.x, y: to.y - from.y };
            var last = { x: 0, y: 0 };

            this.panTween.start( { x: 0, y: 0 }, vector, this.panDuration, {
                callbacks: {
                    eachStep: OpenLayers.Function.bind(function(px) {
                        var x = px.x - last.x,
                            y = px.y - last.y;
                        this.moveByPx(x, y);
                        last.x = Math.round(px.x);
                        last.y = Math.round(px.y);
                    }, this),
                    done: OpenLayers.Function.bind(function(px) {
                        this.moveTo(lonlat);
                        this.dragging = false;
                        this.events.triggerEvent("moveend");
                    }, this)
                }
            });
        } else {
            this.setCenter(lonlat);
        }
    },

        setCenter: function(lonlat, zoom, dragging, forceZoomChange) {
        if (this.panTween) {
            this.panTween.stop();
        }
        if (this.zoomTween) {
            this.zoomTween.stop();
        }            
        this.moveTo(lonlat, zoom, {
            'dragging': dragging,
            'forceZoomChange': forceZoomChange
        });
    },
    
        moveByPx: function(dx, dy) {
        var hw = this.size.w / 2;
        var hh = this.size.h / 2;
        var x = hw + dx;
        var y = hh + dy;
        var wrapDateLine = this.baseLayer.wrapDateLine;
        var xRestriction = 0;
        var yRestriction = 0;
        if (this.restrictedExtent) {
            xRestriction = hw;
            yRestriction = hh;
            wrapDateLine = false;
        }
        dx = wrapDateLine ||
                    x <= this.maxPx.x - xRestriction &&
                    x >= this.minPx.x + xRestriction ? Math.round(dx) : 0;
        dy = y <= this.maxPx.y - yRestriction &&
                    y >= this.minPx.y + yRestriction ? Math.round(dy) : 0;
        if (dx || dy) {
            if (!this.dragging) {
                this.dragging = true;
                this.events.triggerEvent("movestart");
            }
            this.center = null;
            if (dx) {
                this.layerContainerOriginPx.x -= dx;
                this.minPx.x -= dx;
                this.maxPx.x -= dx;
            }
            if (dy) {
                this.layerContainerOriginPx.y -= dy;
                this.minPx.y -= dy;
                this.maxPx.y -= dy;
            }
            this.applyTransform();
            var layer, i, len;
            for (i=0, len=this.layers.length; i<len; ++i) {
                layer = this.layers[i];
                if (layer.visibility &&
                    (layer === this.baseLayer || layer.inRange)) {
                    layer.moveByPx(dx, dy);
                    layer.events.triggerEvent("move");
                }
            }
            this.events.triggerEvent("move");
        }
    },
    
        adjustZoom: function(zoom) {
        if (this.baseLayer && this.baseLayer.wrapDateLine) {
            var resolution, resolutions = this.baseLayer.resolutions,
                maxResolution = this.getMaxExtent().getWidth() / this.size.w;
            if (this.getResolutionForZoom(zoom) > maxResolution) {
                if (this.fractionalZoom) {
                    zoom = this.getZoomForResolution(maxResolution);
                } else {
                    for (var i=zoom|0, ii=resolutions.length; i<ii; ++i) {
                        if (resolutions[i] <= maxResolution) {
                            zoom = i;
                            break;
                        }
                    }
                } 
            }
        }
        return zoom;
    },
    
        getMinZoom: function() {
        return this.adjustZoom(0);
    },

        moveTo: function(lonlat, zoom, options) {
        if (lonlat != null && !(lonlat instanceof OpenLayers.LonLat)) {
            lonlat = new OpenLayers.LonLat(lonlat);
        }
        if (!options) { 
            options = {};
        }
        if (zoom != null) {
            zoom = parseFloat(zoom);
            if (!this.fractionalZoom) {
                zoom = Math.round(zoom);
            }
        }
        var requestedZoom = zoom;
        zoom = this.adjustZoom(zoom);
        if (zoom !== requestedZoom) {
            lonlat = this.getCenter();
        }
        var dragging = options.dragging || this.dragging;
        var forceZoomChange = options.forceZoomChange;

        if (!this.getCachedCenter() && !this.isValidLonLat(lonlat)) {
            lonlat = this.maxExtent.getCenterLonLat();
            this.center = lonlat.clone();
        }

        if(this.restrictedExtent != null) {
            if(lonlat == null) { 
                lonlat = this.center; 
            }
            if(zoom == null) { 
                zoom = this.getZoom(); 
            }
            var resolution = this.getResolutionForZoom(zoom);
            var extent = this.calculateBounds(lonlat, resolution); 
            if(!this.restrictedExtent.containsBounds(extent)) {
                var maxCenter = this.restrictedExtent.getCenterLonLat(); 
                if(extent.getWidth() > this.restrictedExtent.getWidth()) { 
                    lonlat = new OpenLayers.LonLat(maxCenter.lon, lonlat.lat); 
                } else if(extent.left < this.restrictedExtent.left) {
                    lonlat = lonlat.add(this.restrictedExtent.left -
                                        extent.left, 0); 
                } else if(extent.right > this.restrictedExtent.right) { 
                    lonlat = lonlat.add(this.restrictedExtent.right -
                                        extent.right, 0); 
                } 
                if(extent.getHeight() > this.restrictedExtent.getHeight()) { 
                    lonlat = new OpenLayers.LonLat(lonlat.lon, maxCenter.lat); 
                } else if(extent.bottom < this.restrictedExtent.bottom) { 
                    lonlat = lonlat.add(0, this.restrictedExtent.bottom -
                                        extent.bottom); 
                } 
                else if(extent.top > this.restrictedExtent.top) { 
                    lonlat = lonlat.add(0, this.restrictedExtent.top -
                                        extent.top); 
                } 
            }
        }
        
        var zoomChanged = forceZoomChange || (
                            (this.isValidZoomLevel(zoom)) && 
                            (zoom != this.getZoom()) );

        var centerChanged = (this.isValidLonLat(lonlat)) && 
                            (!lonlat.equals(this.center));
        if (zoomChanged || centerChanged || dragging) {
            dragging || this.events.triggerEvent("movestart", {
                zoomChanged: zoomChanged
            });

            if (centerChanged) {
                if (!zoomChanged && this.center) { 
                    this.centerLayerContainer(lonlat);
                }
                this.center = lonlat.clone();
            }

            var res = zoomChanged ?
                this.getResolutionForZoom(zoom) : this.getResolution();
            if (zoomChanged || this.layerContainerOrigin == null) {
                this.layerContainerOrigin = this.getCachedCenter();
                this.layerContainerOriginPx.x = 0;
                this.layerContainerOriginPx.y = 0;
                this.applyTransform();
                var maxExtent = this.getMaxExtent({restricted: true});
                var maxExtentCenter = maxExtent.getCenterLonLat();
                var lonDelta = this.center.lon - maxExtentCenter.lon;
                var latDelta = maxExtentCenter.lat - this.center.lat;
                var extentWidth = Math.round(maxExtent.getWidth() / res);
                var extentHeight = Math.round(maxExtent.getHeight() / res);
                this.minPx = {
                    x: (this.size.w - extentWidth) / 2 - lonDelta / res,
                    y: (this.size.h - extentHeight) / 2 - latDelta / res
                };
                this.maxPx = {
                    x: this.minPx.x + Math.round(maxExtent.getWidth() / res),
                    y: this.minPx.y + Math.round(maxExtent.getHeight() / res)
                };
            }

            if (zoomChanged) {
                this.zoom = zoom;
                this.resolution = res;
            }    
            
            var bounds = this.getExtent();

            if(this.baseLayer.visibility) {
                this.baseLayer.moveTo(bounds, zoomChanged, options.dragging);
                options.dragging || this.baseLayer.events.triggerEvent(
                    "moveend", {zoomChanged: zoomChanged}
                );
            }
            
            bounds = this.baseLayer.getExtent();
            
            for (var i=this.layers.length-1; i>=0; --i) {
                var layer = this.layers[i];
                if (layer !== this.baseLayer && !layer.isBaseLayer) {
                    var inRange = layer.calculateInRange();
                    if (layer.inRange != inRange) {
                        layer.inRange = inRange;
                        if (!inRange) {
                            layer.display(false);
                        }
                        this.events.triggerEvent("changelayer", {
                            layer: layer, property: "visibility"
                        });
                    }
                    if (inRange && layer.visibility) {
                        layer.moveTo(bounds, zoomChanged, options.dragging);
                        options.dragging || layer.events.triggerEvent(
                            "moveend", {zoomChanged: zoomChanged}
                        );
                    }
                }                
            }
            
            this.events.triggerEvent("move");
            dragging || this.events.triggerEvent("moveend");

            if (zoomChanged) {
                for (var i=0, len=this.popups.length; i<len; i++) {
                    this.popups[i].updatePosition();
                }
                this.events.triggerEvent("zoomend");
            }
        }
    },

        centerLayerContainer: function (lonlat) {
        var originPx = this.getViewPortPxFromLonLat(this.layerContainerOrigin);
        var newPx = this.getViewPortPxFromLonLat(lonlat);

        if ((originPx != null) && (newPx != null)) {
            var oldLeft = this.layerContainerOriginPx.x;
            var oldTop = this.layerContainerOriginPx.y;
            var newLeft = Math.round(originPx.x - newPx.x);
            var newTop = Math.round(originPx.y - newPx.y);
            this.applyTransform(
                (this.layerContainerOriginPx.x = newLeft),
                (this.layerContainerOriginPx.y = newTop));
            var dx = oldLeft - newLeft;
            var dy = oldTop - newTop;
            this.minPx.x -= dx;
            this.maxPx.x -= dx;
            this.minPx.y -= dy;
            this.maxPx.y -= dy;
        }        
    },

        isValidZoomLevel: function(zoomLevel) {
        return ( (zoomLevel != null) &&
                 (zoomLevel >= 0) && 
                 (zoomLevel < this.getNumZoomLevels()) );
    },
    
        isValidLonLat: function(lonlat) {
        var valid = false;
        if (lonlat != null) {
            var maxExtent = this.getMaxExtent();
            var worldBounds = this.baseLayer.wrapDateLine && maxExtent;
            valid = maxExtent.containsLonLat(lonlat, {worldBounds: worldBounds});
        }
        return valid;
    },

    /*                                                      */
  /*                 Layer Options                        */
  /*                                                      */
  /*    Accessor functions to Layer Options parameters    */
  /*                                                      */
      
        getProjection: function() {
        var projection = this.getProjectionObject();
        return projection ? projection.getCode() : null;
    },
    
        getProjectionObject: function() {
        var projection = null;
        if (this.baseLayer != null) {
            projection = this.baseLayer.projection;
        }
        return projection;
    },
    
        getMaxResolution: function() {
        var maxResolution = null;
        if (this.baseLayer != null) {
            maxResolution = this.baseLayer.maxResolution;
        }
        return maxResolution;
    },
        
        getMaxExtent: function (options) {
        var maxExtent = null;
        if(options && options.restricted && this.restrictedExtent){
            maxExtent = this.restrictedExtent;
        } else if (this.baseLayer != null) {
            maxExtent = this.baseLayer.maxExtent;
        }        
        return maxExtent;
    },
    
        getNumZoomLevels: function() {
        var numZoomLevels = null;
        if (this.baseLayer != null) {
            numZoomLevels = this.baseLayer.numZoomLevels;
        }
        return numZoomLevels;
    },

    /*                                                      */
  /*                 Baselayer Functions                  */
  /*                                                      */
  /*    The following functions, all publicly exposed     */
  /*       in the API?, are all merely wrappers to the    */
  /*       the same calls on whatever layer is set as     */
  /*                the current base layer                */
  /*                                                      */
  
        getExtent: function () {
        var extent = null;
        if (this.baseLayer != null) {
            extent = this.baseLayer.getExtent();
        }
        return extent;
    },

        getResolution: function () {
        var resolution = null;
        if (this.baseLayer != null) {
            resolution = this.baseLayer.getResolution();
        } else if(this.allOverlays === true && this.layers.length > 0) {
            resolution = this.layers[0].getResolution();
        }
        return resolution;
    },

        getUnits: function () {
        var units = null;
        if (this.baseLayer != null) {
            units = this.baseLayer.units;
        }
        return units;
    },

         getScale: function () {
        var scale = null;
        if (this.baseLayer != null) {
            var res = this.getResolution();
            var units = this.baseLayer.units;
            scale = OpenLayers.Util.getScaleFromResolution(res, units);
        }
        return scale;
    },


        getZoomForExtent: function (bounds, closest) {
        var zoom = null;
        if (this.baseLayer != null) {
            zoom = this.baseLayer.getZoomForExtent(bounds, closest);
        }
        return zoom;
    },

        getResolutionForZoom: function(zoom) {
        var resolution = null;
        if(this.baseLayer) {
            resolution = this.baseLayer.getResolutionForZoom(zoom);
        }
        return resolution;
    },

        getZoomForResolution: function(resolution, closest) {
        var zoom = null;
        if (this.baseLayer != null) {
            zoom = this.baseLayer.getZoomForResolution(resolution, closest);
        }
        return zoom;
    },

    /*                                                      */
  /*                  Zooming Functions                   */
  /*                                                      */
  /*    The following functions, all publicly exposed     */
  /*       in the API, are all merely wrappers to the     */
  /*               the setCenter() function               */
  /*                                                      */
    
        zoomTo: function(zoom, xy) {
        
        var map = this;
        if (map.isValidZoomLevel(zoom)) {
            if (map.baseLayer.wrapDateLine) {
                zoom = map.adjustZoom(zoom);
            }
            var center = xy ?
                map.getZoomTargetCenter(xy, map.getResolutionForZoom(zoom)) :
                map.getCenter();
            if (center) {
                map.events.triggerEvent('zoomstart', {
                    center: center,
                    zoom: zoom
                });
            }
            if (map.zoomTween) {
                map.zoomTween.stop();
                var currentRes = map.getResolution(),
                    targetRes = map.getResolutionForZoom(zoom),
                    start = {scale: 1},
                    end = {scale: currentRes / targetRes};
                if (!xy) {
                    var size = map.getSize();
                    xy = {x: size.w / 2, y: size.h / 2};
                }
                map.zoomTween.start(start, end, map.zoomDuration, {
                    minFrameRate: 50, // don't spend much time zooming
                    callbacks: {
                        eachStep: function(data) {
                            var containerOrigin = map.layerContainerOriginPx,
                                scale = data.scale,
                                dx = ((scale - 1) * (containerOrigin.x - xy.x)) | 0,
                                dy = ((scale - 1) * (containerOrigin.y - xy.y)) | 0;
                            map.applyTransform(containerOrigin.x + dx, containerOrigin.y + dy, scale);
                        },
                        done: function(data) {
                            map.applyTransform();
                            var resolution = map.getResolution() / data.scale,
                                newZoom = map.getZoomForResolution(resolution, true),
                                newCenter = data.scale === 1 ? center :
                                        map.getZoomTargetCenter(xy, resolution);
                            map.moveTo(newCenter, newZoom);
                        }
                    }
                });
            } else {
                map.setCenter(center, zoom);
            }
        }
    },
        
        zoomIn: function() {
        if (this.zoomTween) {
            this.zoomTween.stop();
        }
        this.zoomTo(this.getZoom() + 1);
    },
    
        zoomOut: function() {
        if (this.zoomTween) {
            this.zoomTween.stop();
        }
        this.zoomTo(this.getZoom() - 1);
    },

        zoomToExtent: function(bounds, closest) {
        if (!(bounds instanceof OpenLayers.Bounds)) {
            bounds = new OpenLayers.Bounds(bounds);
        }
        var center = bounds.getCenterLonLat();
        if (this.baseLayer.wrapDateLine) {
            var maxExtent = this.getMaxExtent();
            bounds = bounds.clone();
            while (bounds.right < bounds.left) {
                bounds.right += maxExtent.getWidth();
            }
            center = bounds.getCenterLonLat().wrapDateLine(maxExtent);
        }
        this.setCenter(center, this.getZoomForExtent(bounds, closest));
    },

        zoomToMaxExtent: function(options) {
        var restricted = (options) ? options.restricted : true;

        var maxExtent = this.getMaxExtent({
            'restricted': restricted 
        });
        this.zoomToExtent(maxExtent);
    },

        zoomToScale: function(scale, closest) {
        var res = OpenLayers.Util.getResolutionFromScale(scale, 
                                                         this.baseLayer.units);

        var halfWDeg = (this.size.w * res) / 2;
        var halfHDeg = (this.size.h * res) / 2;
        var center = this.getCachedCenter();

        var extent = new OpenLayers.Bounds(center.lon - halfWDeg,
                                           center.lat - halfHDeg,
                                           center.lon + halfWDeg,
                                           center.lat + halfHDeg);
        this.zoomToExtent(extent, closest);
    },
    
    /*                                                      */
  /*             Translation Functions                    */
  /*                                                      */
  /*      The following functions translate between       */
  /*           LonLat, LayerPx, and ViewPortPx            */
  /*                                                      */

        getLonLatFromViewPortPx: function (viewPortPx) {
        var lonlat = null; 
        if (this.baseLayer != null) {
            lonlat = this.baseLayer.getLonLatFromViewPortPx(viewPortPx);
        }
        return lonlat;
    },

        getViewPortPxFromLonLat: function (lonlat) {
        var px = null; 
        if (this.baseLayer != null) {
            px = this.baseLayer.getViewPortPxFromLonLat(lonlat);
        }
        return px;
    },

        getZoomTargetCenter: function (xy, resolution) {
        var lonlat = null,
            size = this.getSize(),
            deltaX  = size.w/2 - xy.x,
            deltaY  = xy.y - size.h/2,
            zoomPoint = this.getLonLatFromPixel(xy);
        if (zoomPoint) {
            lonlat = new OpenLayers.LonLat(
                zoomPoint.lon + deltaX * resolution,
                zoomPoint.lat + deltaY * resolution
            );
        }
        return lonlat;
    },

        getLonLatFromPixel: function (px) {
        return this.getLonLatFromViewPortPx(px);
    },

        getPixelFromLonLat: function (lonlat) {
        var px = this.getViewPortPxFromLonLat(lonlat);
        px.x = Math.round(px.x);
        px.y = Math.round(px.y);
        return px;
    },
    
        getGeodesicPixelSize: function(px) {
        var lonlat = px ? this.getLonLatFromPixel(px) : (
            this.getCachedCenter() || new OpenLayers.LonLat(0, 0));
        var res = this.getResolution();
        var left = lonlat.add(-res / 2, 0);
        var right = lonlat.add(res / 2, 0);
        var bottom = lonlat.add(0, -res / 2);
        var top = lonlat.add(0, res / 2);
        var dest = new OpenLayers.Projection("EPSG:4326");
        var source = this.getProjectionObject() || dest;
        if(!source.equals(dest)) {
            left.transform(source, dest);
            right.transform(source, dest);
            bottom.transform(source, dest);
            top.transform(source, dest);
        }
        
        return new OpenLayers.Size(
            OpenLayers.Util.distVincenty(left, right),
            OpenLayers.Util.distVincenty(bottom, top)
        );
    },

        getViewPortPxFromLayerPx:function(layerPx) {
        var viewPortPx = null;
        if (layerPx != null) {
            var dX = this.layerContainerOriginPx.x;
            var dY = this.layerContainerOriginPx.y;
            viewPortPx = layerPx.add(dX, dY);            
        }
        return viewPortPx;
    },
    
        getLayerPxFromViewPortPx:function(viewPortPx) {
        var layerPx = null;
        if (viewPortPx != null) {
            var dX = -this.layerContainerOriginPx.x;
            var dY = -this.layerContainerOriginPx.y;
            layerPx = viewPortPx.add(dX, dY);
            if (isNaN(layerPx.x) || isNaN(layerPx.y)) {
                layerPx = null;
            }
        }
        return layerPx;
    },

        getLonLatFromLayerPx: function (px) {
       px = this.getViewPortPxFromLayerPx(px);
       return this.getLonLatFromViewPortPx(px);         
    },
    
        getLayerPxFromLonLat: function (lonlat) {
       var px = this.getPixelFromLonLat(lonlat);
       return this.getLayerPxFromViewPortPx(px);         
    },

         applyTransform: function(x, y, scale) {
         scale = scale || 1;
         var origin = this.layerContainerOriginPx,
             needTransform = scale !== 1;
         x = x || origin.x;
         y = y || origin.y;
            
         var style = this.layerContainerDiv.style,
             transform = this.applyTransform.transform,
             template = this.applyTransform.template;
        
         if (transform === undefined) {
             transform = OpenLayers.Util.vendorPrefix.style('transform');
             this.applyTransform.transform = transform;
             if (transform) {
                 var computedStyle = OpenLayers.Element.getStyle(this.viewPortDiv,
                     OpenLayers.Util.vendorPrefix.css('transform'));
                 if (!computedStyle || computedStyle !== 'none') {
                     template = ['translate3d(', ',0) ', 'scale3d(', ',1)'];
                     style[transform] = [template[0], '0,0', template[1]].join('');
                 }
                 if (!template || !~style[transform].indexOf(template[0])) {
                     template = ['translate(', ') ', 'scale(', ')'];
                 }
                 this.applyTransform.template = template;
             }
         }
         if (transform !== null && (template[0] === 'translate3d(' || needTransform === true)) {
             if (needTransform === true && template[0] === 'translate(') {
                 x -= origin.x;
                 y -= origin.y;
                 style.left = origin.x + 'px';
                 style.top = origin.y + 'px';
             }
             style[transform] = [
                 template[0], x, 'px,', y, 'px', template[1],
                 template[2], scale, ',', scale, template[3]
             ].join('');
         } else {
             style.left = x + 'px';
             style.top = y + 'px';
             if (transform !== null) {
                 style[transform] = '';
             }
         }
     },
    
    CLASS_NAME: "OpenLayers.Map"
});

OpenLayers.Map.TILE_WIDTH = 256;
OpenLayers.Map.TILE_HEIGHT = 256;
