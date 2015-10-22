/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Control.WMTSGetFeatureInfo = OpenLayers.Class(OpenLayers.Control, {

       hover: false,
    
        requestEncoding: "KVP",

        drillDown: false,

        maxFeatures: 10,

        clickCallback: "click",
    
        layers: null,

        queryVisible: true,

        infoFormat: 'text/html',
    
        vendorParams: {},
    
        format: null,
    
        formatOptions: null,

        
        handler: null,
    
        hoverRequest: null,
    
        
        pending: 0,

        initialize: function(options) {
        options = options || {};
        options.handlerOptions = options.handlerOptions || {};

        OpenLayers.Control.prototype.initialize.apply(this, [options]);
        
        if (!this.format) {
            this.format = new OpenLayers.Format.WMSGetFeatureInfo(
                options.formatOptions
            );
        }
        
        if (this.drillDown === true) {
            this.hover = false;
        }

        if (this.hover) {
            this.handler = new OpenLayers.Handler.Hover(
                this, {
                    move: this.cancelHover,
                    pause: this.getInfoForHover
                },
                OpenLayers.Util.extend(
                    this.handlerOptions.hover || {}, {delay: 250}
                )
            );
        } else {
            var callbacks = {};
            callbacks[this.clickCallback] = this.getInfoForClick;
            this.handler = new OpenLayers.Handler.Click(
                this, callbacks, this.handlerOptions.click || {}
            );
        }
    },

        getInfoForClick: function(evt) {
        this.request(evt.xy, {});
    },
   
        getInfoForHover: function(evt) {
        this.request(evt.xy, {hover: true});
    },

        cancelHover: function() {
        if (this.hoverRequest) {
            --this.pending;
            if (this.pending <= 0) {
                OpenLayers.Element.removeClass(this.map.viewPortDiv, "olCursorWait");
                this.pending = 0;
            }            
            this.hoverRequest.abort();
            this.hoverRequest = null;
        }
    },

        findLayers: function() {
        var candidates = this.layers || this.map.layers;
        var layers = [];
        var layer;
        for (var i=candidates.length-1; i>=0; --i) {
            layer = candidates[i];
            if (layer instanceof OpenLayers.Layer.WMTS &&
                layer.requestEncoding === this.requestEncoding &&
                (!this.queryVisible || layer.getVisibility())) {
                layers.push(layer);
                if (!this.drillDown || this.hover) {
                    break;
                }
            }
        }
        return layers;
    },
    
        buildRequestOptions: function(layer, xy) {
        var loc = this.map.getLonLatFromPixel(xy);
        var getTileUrl = layer.getURL(
            new OpenLayers.Bounds(loc.lon, loc.lat, loc.lon, loc.lat)
        );
        var params = OpenLayers.Util.getParameters(getTileUrl);
        var tileInfo = layer.getTileInfo(loc);
        OpenLayers.Util.extend(params, {
            service: "WMTS",
            version: layer.version,
            request: "GetFeatureInfo",
            infoFormat: this.infoFormat,
            feature_count: this.maxFeatures,
            i: tileInfo.i,
            j: tileInfo.j
        });
        OpenLayers.Util.applyDefaults(params, this.vendorParams);
        return {
            url: OpenLayers.Util.isArray(layer.url) ? layer.url[0] : layer.url,
            params: OpenLayers.Util.upperCaseObject(params),
            callback: function(request) {
                this.handleResponse(xy, request, layer);
            },
            scope: this
        };
    },

        request: function(xy, options) {
        options = options || {};
        var layers = this.findLayers();
        if (layers.length > 0) {
            var issue, layer;
            for (var i=0, len=layers.length; i<len; i++) {
                layer = layers[i];
                issue = this.events.triggerEvent("beforegetfeatureinfo", {
                    xy: xy,
                    layer: layer
                });
                if (issue !== false) {
                    ++this.pending;
                    var requestOptions = this.buildRequestOptions(layer, xy);
                    var request = OpenLayers.Request.GET(requestOptions);
                    if (options.hover === true) {
                        this.hoverRequest = request;
                    }
                }
            }
            if (this.pending > 0) {
                OpenLayers.Element.addClass(this.map.viewPortDiv, "olCursorWait");
            }
        }
    },

        handleResponse: function(xy, request, layer) {
        --this.pending;
        if (this.pending <= 0) {
            OpenLayers.Element.removeClass(this.map.viewPortDiv, "olCursorWait");
            this.pending = 0;
        }
        if (request.status && (request.status < 200 || request.status >= 300)) {
            this.events.triggerEvent("exception", {
                xy: xy, 
                request: request,
                layer: layer
            });
        } else {
            var doc = request.responseXML;
            if (!doc || !doc.documentElement) {
                doc = request.responseText;
            }
            var features, except;
            try {
                features = this.format.read(doc);
            } catch (error) {
                except = true;
                this.events.triggerEvent("exception", {
                    xy: xy,
                    request: request,
                    error: error,
                    layer: layer
                });
            }
            if (!except) {
                this.events.triggerEvent("getfeatureinfo", {
                    text: request.responseText,
                    features: features,
                    request: request,
                    xy: xy,
                    layer: layer
                });
            }
        }
    },

    CLASS_NAME: "OpenLayers.Control.WMTSGetFeatureInfo"
});
