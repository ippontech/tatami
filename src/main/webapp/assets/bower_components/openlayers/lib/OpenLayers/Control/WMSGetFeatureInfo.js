/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Control.WMSGetFeatureInfo = OpenLayers.Class(OpenLayers.Control, {

       hover: false,

        drillDown: false,

        maxFeatures: 10,

        clickCallback: "click",

        output: "features",

        layers: null,

        queryVisible: false,

        url: null,

        layerUrls: null,

        infoFormat: 'text/html',

        vendorParams: {},

        format: null,

        formatOptions: null,

    
        handler: null,

        hoverRequest: null,

    
        initialize: function(options) {
        options = options || {};
        options.handlerOptions = options.handlerOptions || {};

        OpenLayers.Control.prototype.initialize.apply(this, [options]);

        if(!this.format) {
            this.format = new OpenLayers.Format.WMSGetFeatureInfo(
                options.formatOptions
            );
        }

        if(this.drillDown === true) {
            this.hover = false;
        }

        if(this.hover) {
            this.handler = new OpenLayers.Handler.Hover(
                   this, {
                       'move': this.cancelHover,
                       'pause': this.getInfoForHover
                   },
                   OpenLayers.Util.extend(this.handlerOptions.hover || {}, {
                       'delay': 250
                   }));
        } else {
            var callbacks = {};
            callbacks[this.clickCallback] = this.getInfoForClick;
            this.handler = new OpenLayers.Handler.Click(
                this, callbacks, this.handlerOptions.click || {});
        }
    },

        getInfoForClick: function(evt) {
        this.events.triggerEvent("beforegetfeatureinfo", {xy: evt.xy});
        OpenLayers.Element.addClass(this.map.viewPortDiv, "olCursorWait");
        this.request(evt.xy, {});
    },

        getInfoForHover: function(evt) {
        this.events.triggerEvent("beforegetfeatureinfo", {xy: evt.xy});
        this.request(evt.xy, {hover: true});
    },

        cancelHover: function() {
        if (this.hoverRequest) {
            this.hoverRequest.abort();
            this.hoverRequest = null;
        }
    },

        findLayers: function() {

        var candidates = this.layers || this.map.layers;
        var layers = [];
        var layer, url;
        for(var i = candidates.length - 1; i >= 0; --i) {
            layer = candidates[i];
            if(layer instanceof OpenLayers.Layer.WMS &&
               (!this.queryVisible || layer.getVisibility())) {
                url = OpenLayers.Util.isArray(layer.url) ? layer.url[0] : layer.url;
                if(this.drillDown === false && !this.url) {
                    this.url = url;
                }
                if(this.drillDown === true || this.urlMatches(url)) {
                    layers.push(layer);
                }
            }
        }
        return layers;
    },

        urlMatches: function(url) {
        var matches = OpenLayers.Util.isEquivalentUrl(this.url, url);
        if(!matches && this.layerUrls) {
            for(var i=0, len=this.layerUrls.length; i<len; ++i) {
                if(OpenLayers.Util.isEquivalentUrl(this.layerUrls[i], url)) {
                    matches = true;
                    break;
                }
            }
        }
        return matches;
    },

        buildWMSOptions: function(url, layers, clickPosition, format) {
        var layerNames = [], styleNames = [];
        for (var i = 0, len = layers.length; i < len; i++) {
            if (layers[i].params.LAYERS != null) {
                layerNames = layerNames.concat(layers[i].params.LAYERS);
                styleNames = styleNames.concat(this.getStyleNames(layers[i]));
            }
        }
        var firstLayer = layers[0];
        var projection = this.map.getProjection();
        var layerProj = firstLayer.projection;
        if (layerProj && layerProj.equals(this.map.getProjectionObject())) {
            projection = layerProj.getCode();
        }
        var params = OpenLayers.Util.extend({
            service: "WMS",
            version: firstLayer.params.VERSION,
            request: "GetFeatureInfo",
            exceptions: firstLayer.params.EXCEPTIONS,
            bbox: this.map.getExtent().toBBOX(null,
                firstLayer.reverseAxisOrder()),
            feature_count: this.maxFeatures,
            height: this.map.getSize().h,
            width: this.map.getSize().w,
            format: format,
            info_format: firstLayer.params.INFO_FORMAT || this.infoFormat
        }, (parseFloat(firstLayer.params.VERSION) >= 1.3) ?
            {
                crs: projection,
                i: parseInt(clickPosition.x),
                j: parseInt(clickPosition.y)
            } :
            {
                srs: projection,
                x: parseInt(clickPosition.x),
                y: parseInt(clickPosition.y)
            }
        );
        if (layerNames.length != 0) {
            params = OpenLayers.Util.extend({
                layers: layerNames,
                query_layers: layerNames,
                styles: styleNames
            }, params);
        }
        OpenLayers.Util.applyDefaults(params, this.vendorParams);
        return {
            url: url,
            params: OpenLayers.Util.upperCaseObject(params),
            callback: function(request) {
                this.handleResponse(clickPosition, request, url);
            },
            scope: this
        };
    },

        getStyleNames: function(layer) {
        var styleNames;
        if (layer.params.STYLES) {
            styleNames = layer.params.STYLES;
        } else {
            if (OpenLayers.Util.isArray(layer.params.LAYERS)) {
                styleNames = new Array(layer.params.LAYERS.length);
            } else {
                styleNames = layer.params.LAYERS.toString().replace(/[^,]/g, "");
            }
        }
        return styleNames;
    },

        request: function(clickPosition, options) {
        var layers = this.findLayers();
        if(layers.length == 0) {
            this.events.triggerEvent("nogetfeatureinfo");
            OpenLayers.Element.removeClass(this.map.viewPortDiv, "olCursorWait");
            return;
        }

        options = options || {};
        if(this.drillDown === false) {
            var wmsOptions = this.buildWMSOptions(this.url, layers,
                clickPosition, layers[0].params.FORMAT);
            var request = OpenLayers.Request.GET(wmsOptions);

            if (options.hover === true) {
                this.hoverRequest = request;
            }
        } else {
            this._requestCount = 0;
            this._numRequests = 0;
            this.features = [];
            var services = {}, url;
            for(var i=0, len=layers.length; i<len; i++) {
                var layer = layers[i];
                var service, found = false;
                url = OpenLayers.Util.isArray(layer.url) ? layer.url[0] : layer.url;
                if(url in services) {
                    services[url].push(layer);
                } else {
                    this._numRequests++;
                    services[url] = [layer];
                }
            }
            var layers;
            for (var url in services) {
                layers = services[url];
                var wmsOptions = this.buildWMSOptions(url, layers,
                    clickPosition, layers[0].params.FORMAT);
                OpenLayers.Request.GET(wmsOptions);
            }
        }
    },

        triggerGetFeatureInfo: function(request, xy, features) {
        this.events.triggerEvent("getfeatureinfo", {
            text: request.responseText,
            features: features,
            request: request,
            xy: xy
        });
        OpenLayers.Element.removeClass(this.map.viewPortDiv, "olCursorWait");
    },

        handleResponse: function(xy, request, url) {

        var doc = request.responseXML;
        if(!doc || !doc.documentElement) {
            doc = request.responseText;
        }

        var features = [];
        var responseHeaders = request.getAllResponseHeaders();
        if(responseHeaders && this.infoFormat === "application/json" && responseHeaders.indexOf("application/json") !== -1) {
            features = new OpenLayers.Format.GeoJSON().read(doc);
        }
        else {
            features = this.format.read(doc);
        }

        if (this.drillDown === false) {
            this.triggerGetFeatureInfo(request, xy, features);
        } else {
            this._requestCount++;
            if (this.output === "object") {
                this._features = (this._features || []).concat(
                    {url: url, features: features}
                );
            } else {
            this._features = (this._features || []).concat(features);
            }

            if (this._requestCount === this._numRequests) {
                this.triggerGetFeatureInfo(request, xy, this._features.concat());
                delete this._features;
                delete this._requestCount;
                delete this._numRequests;
            }
        }
    },

    CLASS_NAME: "OpenLayers.Control.WMSGetFeatureInfo"
});
