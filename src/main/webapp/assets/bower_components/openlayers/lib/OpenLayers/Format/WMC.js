/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.WMC = OpenLayers.Class(OpenLayers.Format.Context, {
    
        defaultVersion: "1.1.0",

        
        layerToContext: function(layer) {
        var parser = this.getParser();
        var layerContext = {
            queryable: layer.queryable,
            visibility: layer.visibility,
            name: layer.params["LAYERS"],
            title: layer.name,
            "abstract": layer.metadata["abstract"],
            dataURL: layer.metadata.dataURL,
            metadataURL: layer.metadataURL,
            attribution: layer.attribution,
            server: {
                version: layer.params["VERSION"],
                url: layer.url
            },
            maxExtent: layer.maxExtent,
            transparent: layer.params["TRANSPARENT"],
            numZoomLevels: layer.numZoomLevels,
            units: layer.units,
            isBaseLayer: layer.isBaseLayer,
            opacity: layer.opacity == 1 ? undefined : layer.opacity,
            gutter: layer.gutter == 0 ? undefined : layer.gutter,
            displayInLayerSwitcher: layer.displayInLayerSwitcher,
            singleTile: layer.singleTile,
            tileSize: (layer.singleTile || !layer.tileSize) ? 
                undefined : {width: layer.tileSize.w, height: layer.tileSize.h},
            minScale : (layer.options.resolutions ||
                        layer.options.scales || 
                        layer.options.maxResolution || 
                        layer.options.minScale) ? 
                        layer.minScale : undefined,
            maxScale : (layer.options.resolutions ||
                        layer.options.scales || 
                        layer.options.minResolution || 
                        layer.options.maxScale) ? 
                        layer.maxScale : undefined,
            formats: [],
            styles: [],
            srs: layer.srs,
            dimensions: layer.dimensions
        };


        if (layer.metadata.servertitle) {
            layerContext.server.title = layer.metadata.servertitle;
        }

        if (layer.metadata.formats && layer.metadata.formats.length > 0) {
            for (var i=0, len=layer.metadata.formats.length; i<len; i++) {
                var format = layer.metadata.formats[i];
                layerContext.formats.push({
                    value: format.value,
                    current: (format.value == layer.params["FORMAT"])
                });
            }
        } else {
            layerContext.formats.push({
                value: layer.params["FORMAT"],
                current: true
            });
        }

        if (layer.metadata.styles && layer.metadata.styles.length > 0) {
            for (var i=0, len=layer.metadata.styles.length; i<len; i++) {
                var style = layer.metadata.styles[i];
                if ((style.href == layer.params["SLD"]) ||
                    (style.body == layer.params["SLD_BODY"]) ||
                    (style.name == layer.params["STYLES"])) {
                    style.current = true;
                } else {
                    style.current = false;
                }
                layerContext.styles.push(style);
            }
        } else {
            layerContext.styles.push({
                href: layer.params["SLD"],
                body: layer.params["SLD_BODY"],
                name: layer.params["STYLES"] || parser.defaultStyleName,
                title: parser.defaultStyleTitle,
                current: true
            });
        }

        return layerContext;
    },
    
        toContext: function(obj) {
        var context = {};
        var layers = obj.layers;
        if (obj.CLASS_NAME == "OpenLayers.Map") {
            var metadata = obj.metadata || {};
            context.size = obj.getSize();
            context.bounds = obj.getExtent();
            context.projection = obj.projection;
            context.title = obj.title;
            context.keywords = metadata.keywords;
            context["abstract"] = metadata["abstract"];
            context.logo = metadata.logo;
            context.descriptionURL = metadata.descriptionURL;
            context.contactInformation = metadata.contactInformation;
            context.maxExtent = obj.maxExtent;
        } else {
            OpenLayers.Util.applyDefaults(context, obj);
            if (context.layers != undefined) {
                delete(context.layers);
            }
        }

        if (context.layersContext == undefined) {
            context.layersContext = [];
        }
        if (layers != undefined && OpenLayers.Util.isArray(layers)) {
            for (var i=0, len=layers.length; i<len; i++) {
                var layer = layers[i];
                if (layer instanceof OpenLayers.Layer.WMS) {
                    context.layersContext.push(this.layerToContext(layer));
                }
            }
        }
        return context;
    },

    CLASS_NAME: "OpenLayers.Format.WMC" 

});
