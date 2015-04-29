/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.Context = OpenLayers.Class(OpenLayers.Format.XML.VersionedOGC, {

        layerOptions: null,

        layerParams: null,

    
        read: function(data, options) {
        var context = OpenLayers.Format.XML.VersionedOGC.prototype.read.apply(this, 
            arguments);
        var map;
        if(options && options.map) {
            this.context = context;
            if(options.map instanceof OpenLayers.Map) {
                map = this.mergeContextToMap(context, options.map);
            } else {
                var mapOptions = options.map;
                if(OpenLayers.Util.isElement(mapOptions) ||
                   typeof mapOptions == "string") {
                    mapOptions = {div: mapOptions};
                }
                map = this.contextToMap(context, mapOptions);
            }
        } else {
            map = context;
        }
        return map;
    },

        getLayerFromContext: function(layerContext) {
        var i, len;
        var options = {
            queryable: layerContext.queryable, //keep queryable for api compatibility
            visibility: layerContext.visibility,
            maxExtent: layerContext.maxExtent,
            metadata: OpenLayers.Util.applyDefaults(layerContext.metadata, 
            {styles: layerContext.styles,
             formats: layerContext.formats,
             "abstract": layerContext["abstract"],
             dataURL: layerContext.dataURL
            }),
            numZoomLevels: layerContext.numZoomLevels,
            units: layerContext.units,
            isBaseLayer: layerContext.isBaseLayer,
            opacity: layerContext.opacity,
            gutter: layerContext.gutter,
            displayInLayerSwitcher: layerContext.displayInLayerSwitcher,
            singleTile: layerContext.singleTile,
            tileSize: (layerContext.tileSize) ? 
                new OpenLayers.Size(
                    layerContext.tileSize.width, 
                    layerContext.tileSize.height
                ) : undefined,
            minScale: layerContext.minScale || layerContext.maxScaleDenominator,
            maxScale: layerContext.maxScale || layerContext.minScaleDenominator,
            srs: layerContext.srs,
            dimensions: layerContext.dimensions,
            metadataURL: layerContext.metadataURL,
            attribution: layerContext.attribution
        };
        if (this.layerOptions) {
            OpenLayers.Util.applyDefaults(options, this.layerOptions);
        }

        var params = {
            layers: layerContext.name,
            transparent: layerContext.transparent,
            version: layerContext.version
        };
        if (layerContext.formats && layerContext.formats.length>0) {
            params.format = layerContext.formats[0].value;
            for (i=0, len=layerContext.formats.length; i<len; i++) {
                var format = layerContext.formats[i];
                if (format.current == true) {
                    params.format = format.value;
                    break;
                }
            }
        }
        if (layerContext.styles && layerContext.styles.length>0) {
            for (i=0, len=layerContext.styles.length; i<len; i++) {
                var style = layerContext.styles[i];
                if (style.current == true) {
                    if(style.href) {
                        params.sld = style.href;
                    } else if(style.body) {
                        params.sld_body = style.body;
                    } else {
                        params.styles = style.name;
                    }
                    break;
                }
            }
        }
        if (this.layerParams) {
            OpenLayers.Util.applyDefaults(params, this.layerParams);
        }

        var layer = null;
        var service = layerContext.service;
        if (service == OpenLayers.Format.Context.serviceTypes.WFS) {
            options.strategies = [new OpenLayers.Strategy.BBOX()];
            options.protocol = new OpenLayers.Protocol.WFS({
                url: layerContext.url,
                featurePrefix: layerContext.name.split(":")[0],
                featureType: layerContext.name.split(":").pop()
            });
            layer = new OpenLayers.Layer.Vector(
                layerContext.title || layerContext.name,
                options
            );
        } else if (service == OpenLayers.Format.Context.serviceTypes.KML) {
            options.strategies = [new OpenLayers.Strategy.Fixed()];
            options.protocol = new OpenLayers.Protocol.HTTP({
                url: layerContext.url, 
                format: new OpenLayers.Format.KML()
            });
            layer = new OpenLayers.Layer.Vector(
                layerContext.title || layerContext.name,
                options
            );
        } else if (service == OpenLayers.Format.Context.serviceTypes.GML) {
            options.strategies = [new OpenLayers.Strategy.Fixed()];
            options.protocol = new OpenLayers.Protocol.HTTP({
                url: layerContext.url, 
                format: new OpenLayers.Format.GML()
            });
            layer = new OpenLayers.Layer.Vector(
                layerContext.title || layerContext.name,
                options
            );
        } else if (layerContext.features) {
            layer = new OpenLayers.Layer.Vector(
                layerContext.title || layerContext.name,
                options
            );
            layer.addFeatures(layerContext.features);
        } else if (layerContext.categoryLayer !== true) {
            layer = new OpenLayers.Layer.WMS(
                layerContext.title || layerContext.name,
                layerContext.url,
                params,
                options
            );
        }
        return layer;
    },

        getLayersFromContext: function(layersContext) {
        var layers = [];
        for (var i=0, len=layersContext.length; i<len; i++) {
            var layer = this.getLayerFromContext(layersContext[i]);
            if (layer !== null) {
                layers.push(layer);
            }
        }
        return layers;
    },

        contextToMap: function(context, options) {
        options = OpenLayers.Util.applyDefaults({
            maxExtent:  context.maxExtent,
            projection: context.projection,
            units:      context.units
        }, options);

        if (options.maxExtent) {
            options.maxResolution = 
                options.maxExtent.getWidth() / OpenLayers.Map.TILE_WIDTH;
        }

        var metadata = {
            contactInformation: context.contactInformation,
            "abstract":         context["abstract"],
            keywords:           context.keywords,
            logo:               context.logo,
            descriptionURL:     context.descriptionURL
        };

        options.metadata = metadata;

        var map = new OpenLayers.Map(options);
        map.addLayers(this.getLayersFromContext(context.layersContext));
        map.setCenter(
            context.bounds.getCenterLonLat(),
            map.getZoomForExtent(context.bounds, true)
        );
        return map;
    },

        mergeContextToMap: function(context, map) {
        map.addLayers(this.getLayersFromContext(context.layersContext));
        return map;
    },

        write: function(obj, options) {
        obj = this.toContext(obj);
        return OpenLayers.Format.XML.VersionedOGC.prototype.write.apply(this,
            arguments);
    },

    CLASS_NAME: "OpenLayers.Format.Context"
});

OpenLayers.Format.Context.serviceTypes = {
    "WMS": "urn:ogc:serviceType:WMS",
    "WFS": "urn:ogc:serviceType:WFS",
    "WCS": "urn:ogc:serviceType:WCS",
    "GML": "urn:ogc:serviceType:GML",
    "SLD": "urn:ogc:serviceType:SLD",
    "FES": "urn:ogc:serviceType:FES",
    "KML": "urn:ogc:serviceType:KML"
};
