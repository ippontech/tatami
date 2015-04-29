/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Control.SLDSelect = OpenLayers.Class(OpenLayers.Control, {

    
        clearOnDeactivate: false,

        layers: null,

        callbacks: null,

        selectionSymbolizer: {
        'Polygon': {fillColor: '#FF0000', stroke: false},
        'Line': {strokeColor: '#FF0000', strokeWidth: 2},
        'Point': {graphicName: 'square', fillColor: '#FF0000', pointRadius: 5}
    },

        layerOptions: null,

    
        sketchStyle: null,

        wfsCache: {},

        layerCache: {},

        initialize: function(handler, options) {
        OpenLayers.Control.prototype.initialize.apply(this, [options]);

        this.callbacks = OpenLayers.Util.extend({done: this.select, 
            click: this.select}, this.callbacks);
        this.handlerOptions = this.handlerOptions || {};
        this.layerOptions = OpenLayers.Util.applyDefaults(this.layerOptions, {
            displayInLayerSwitcher: false,
            tileOptions: {maxGetUrlLength: 2048}
        });
        if (this.sketchStyle) {
            this.handlerOptions.layerOptions = OpenLayers.Util.applyDefaults(
                this.handlerOptions.layerOptions,
                {styleMap: new OpenLayers.StyleMap({"default": this.sketchStyle})}
            );
        }
        this.handler = new handler(this, this.callbacks, this.handlerOptions);
    },

        destroy: function() {
        for (var key in this.layerCache) {
            delete this.layerCache[key];
        }
        for (var key in this.wfsCache) {
            delete this.wfsCache[key];
        }
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },

        coupleLayerVisiblity: function(evt) {
        this.setVisibility(evt.object.getVisibility());
    },

        createSelectionLayer: function(source) {
        var selectionLayer;
        if (!this.layerCache[source.id]) {
            selectionLayer = new OpenLayers.Layer.WMS(source.name, 
                source.url, source.params, 
                OpenLayers.Util.applyDefaults(
                    this.layerOptions,
                    source.getOptions())
            );
            this.layerCache[source.id] = selectionLayer;
            if (this.layerOptions.displayInLayerSwitcher === false) {
                source.events.on({
                    "visibilitychanged": this.coupleLayerVisiblity,
                    scope: selectionLayer});
            }
            this.map.addLayer(selectionLayer);
        } else {
            selectionLayer = this.layerCache[source.id];
        }
        return selectionLayer;
    },

        createSLD: function(layer, filters, geometryAttributes) {
        var sld = {version: "1.0.0", namedLayers: {}};
        var layerNames = [layer.params.LAYERS].join(",").split(",");
        for (var i=0, len=layerNames.length; i<len; i++) { 
            var name = layerNames[i];
            sld.namedLayers[name] = {name: name, userStyles: []};
            var symbolizer = this.selectionSymbolizer;
            var geometryAttribute = geometryAttributes[i];
            if (geometryAttribute.type.indexOf('Polygon') >= 0) {
                symbolizer = {Polygon: this.selectionSymbolizer['Polygon']};
            } else if (geometryAttribute.type.indexOf('LineString') >= 0) {
                symbolizer = {Line: this.selectionSymbolizer['Line']};
            } else if (geometryAttribute.type.indexOf('Point') >= 0) {
                symbolizer = {Point: this.selectionSymbolizer['Point']};
            }
            var filter = filters[i];
            sld.namedLayers[name].userStyles.push({name: 'default', rules: [
                new OpenLayers.Rule({symbolizer: symbolizer, 
                    filter: filter, 
                    maxScaleDenominator: layer.options.minScale})
            ]});
        }
        return new OpenLayers.Format.SLD({srsName: this.map.getProjection()}).write(sld);
    },

        parseDescribeLayer: function(request) {
        var format = new OpenLayers.Format.WMSDescribeLayer();
        var doc = request.responseXML;
        if(!doc || !doc.documentElement) {
            doc = request.responseText;
        }
        var describeLayer = format.read(doc);
        var typeNames = [];
        var url = null;
        for (var i=0, len=describeLayer.length; i<len; i++) {
            if (describeLayer[i].owsType == "WFS") {
                typeNames.push(describeLayer[i].typeName);
                url = describeLayer[i].owsURL;
            }
        }
        var options = {
            url: url,
            params: {
                SERVICE: "WFS",
                TYPENAME: typeNames.toString(),
                REQUEST: "DescribeFeatureType",
                VERSION: "1.0.0"
            },
            callback: function(request) {
                var format = new OpenLayers.Format.WFSDescribeFeatureType();
                var doc = request.responseXML;
                if(!doc || !doc.documentElement) {
                    doc = request.responseText;
                }
                var describeFeatureType = format.read(doc);
                this.control.wfsCache[this.layer.id] = describeFeatureType;
                this.control._queue && this.control.applySelection();
            },
            scope: this
        };
        OpenLayers.Request.GET(options);
    },

       activate: function() {
        var activated = OpenLayers.Control.prototype.activate.call(this);
        if(activated) {
            for (var i=0, len=this.layers.length; i<len; i++) {
                var layer = this.layers[i];
                if (layer && !this.wfsCache[layer.id]) {
                    var options = {
                        url: layer.url,
                        params: {
                            SERVICE: "WMS",
                            VERSION: layer.params.VERSION,
                            LAYERS: layer.params.LAYERS,
                            REQUEST: "DescribeLayer"
                        },
                        callback: this.parseDescribeLayer,
                        scope: {layer: layer, control: this}
                    };
                    OpenLayers.Request.GET(options);
                }
            }
        }
        return activated;
    },

        deactivate: function() {
        var deactivated = OpenLayers.Control.prototype.deactivate.call(this);
        if(deactivated) {
            for (var i=0, len=this.layers.length; i<len; i++) {
                var layer = this.layers[i];
                if (layer && this.clearOnDeactivate === true) {
                    var layerCache = this.layerCache;
                    var selectionLayer = layerCache[layer.id];
                    if (selectionLayer) {
                        layer.events.un({
                            "visibilitychanged": this.coupleLayerVisiblity,
                            scope: selectionLayer});
                        selectionLayer.destroy();
                        delete layerCache[layer.id];
                    }
                }
            }
        }
        return deactivated;
    },

        setLayers: function(layers) {
        if(this.active) {
            this.deactivate();
            this.layers = layers;
            this.activate();
        } else {
            this.layers = layers;
        }
    },

        createFilter: function(geometryAttribute, geometry) {
        var filter = null;
        if (this.handler instanceof OpenLayers.Handler.RegularPolygon) {
            if (this.handler.irregular === true) {
                filter = new OpenLayers.Filter.Spatial({
                    type: OpenLayers.Filter.Spatial.BBOX,
                    property: geometryAttribute.name,
                    value: geometry.getBounds()}
                );
            } else {
                filter = new OpenLayers.Filter.Spatial({
                    type: OpenLayers.Filter.Spatial.INTERSECTS,
                    property: geometryAttribute.name,
                    value: geometry}
                );
            }
        } else if (this.handler instanceof OpenLayers.Handler.Polygon) {
            filter = new OpenLayers.Filter.Spatial({
                type: OpenLayers.Filter.Spatial.INTERSECTS,
                property: geometryAttribute.name,
                value: geometry}
            );
        } else if (this.handler instanceof OpenLayers.Handler.Path) {
            if (geometryAttribute.type.indexOf('Point') >= 0) {
                filter = new OpenLayers.Filter.Spatial({
                    type: OpenLayers.Filter.Spatial.DWITHIN,
                    property: geometryAttribute.name,
                    distance: this.map.getExtent().getWidth()*0.01 ,
                    distanceUnits: this.map.getUnits(),
                    value: geometry}
                );
            } else {
                filter = new OpenLayers.Filter.Spatial({
                    type: OpenLayers.Filter.Spatial.INTERSECTS,
                    property: geometryAttribute.name,
                    value: geometry}
                );
            }
        } else if (this.handler instanceof OpenLayers.Handler.Click) {
            if (geometryAttribute.type.indexOf('Polygon') >= 0) {
                filter = new OpenLayers.Filter.Spatial({
                    type: OpenLayers.Filter.Spatial.INTERSECTS,
                    property: geometryAttribute.name,
                    value: geometry}
                );
            } else {
                filter = new OpenLayers.Filter.Spatial({
                    type: OpenLayers.Filter.Spatial.DWITHIN,
                    property: geometryAttribute.name,
                    distance: this.map.getExtent().getWidth()*0.01 ,
                    distanceUnits: this.map.getUnits(),
                    value: geometry}
                );
            }
        }
        return filter;
    },

        select: function(geometry) {
        this._queue = function() {
            for (var i=0, len=this.layers.length; i<len; i++) {
                var layer = this.layers[i];
                var geometryAttributes = this.getGeometryAttributes(layer);
                var filters = [];
                for (var j=0, lenj=geometryAttributes.length; j<lenj; j++) {
                    var geometryAttribute = geometryAttributes[j];
                    if (geometryAttribute !== null) {
                        if (!(geometry instanceof OpenLayers.Geometry)) {
                            var point = this.map.getLonLatFromPixel(
                                geometry.xy);
                            geometry = new OpenLayers.Geometry.Point(
                                point.lon, point.lat);
                        }
                        var filter = this.createFilter(geometryAttribute,
                        geometry);
                        if (filter !== null) {
                            filters.push(filter);
                        }
                    }
                }
    
                var selectionLayer = this.createSelectionLayer(layer);
    
                this.events.triggerEvent("selected", {
                    layer: layer,
                    filters: filters
                });

                var sld = this.createSLD(layer, filters, geometryAttributes);
    
                selectionLayer.mergeNewParams({SLD_BODY: sld});
                delete this._queue;
            }
        };
        this.applySelection();
    },
    
        applySelection: function() {
        var canApply = true;
        for (var i=0, len=this.layers.length; i<len; i++) {
            if(!this.wfsCache[this.layers[i].id]) {
                canApply = false;
                break;
            }
        }
        canApply && this._queue.call(this);
    },

    CLASS_NAME: "OpenLayers.Control.SLDSelect"
});
