/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Layer.ArcIMS = OpenLayers.Class(OpenLayers.Layer.Grid, {

        DEFAULT_PARAMS: { 
        ClientVersion: "9.2",
        ServiceName: ''
    },
    
        featureCoordSys: "4326",
    
        filterCoordSys: "4326",
    
        layers: null,
    
        async: true,
    
        name: "ArcIMS",

        isBaseLayer: true,

        DEFAULT_OPTIONS: {
        tileSize: new OpenLayers.Size(512, 512),
        featureCoordSys: "4326",
        filterCoordSys: "4326",
        layers: null,
        isBaseLayer: true,
        async: true,
        name: "ArcIMS"
    }, 
 
        initialize: function(name, url, options) {
        
        this.tileSize = new OpenLayers.Size(512, 512);
        this.params = OpenLayers.Util.applyDefaults(
            {ServiceName: options.serviceName},
            this.DEFAULT_PARAMS
        );
        this.options = OpenLayers.Util.applyDefaults(
            options, this.DEFAULT_OPTIONS
        );
          
        OpenLayers.Layer.Grid.prototype.initialize.apply(
            this, [name, url, this.params, options]
        );
        if (this.transparent) {
            if (!this.isBaseLayer) {
                this.isBaseLayer = false;
            } 
            if (this.format == "image/jpeg") {
                this.format = OpenLayers.Util.alphaHack() ? "image/gif" : "image/png";
            }
        }
        if (this.options.layers === null) {
            this.options.layers = [];
        }
    },    

        getURL: function(bounds) {
        var url = "";
        bounds = this.adjustBounds(bounds);
        var axlReq = new OpenLayers.Format.ArcXML( 
            OpenLayers.Util.extend(this.options, {
                requesttype: "image",
                envelope: bounds.toArray(),
                tileSize: this.tileSize
            })
        );
        var req = new OpenLayers.Request.POST({
            url: this.getFullRequestString(),
            data: axlReq.write(),
            async: false
        });
        if (req != null) {
            var doc = req.responseXML;

            if (!doc || !doc.documentElement) {            
                doc = req.responseText;
            }
            var axlResp = new OpenLayers.Format.ArcXML();
            var arcxml = axlResp.read(doc);
            url = this.getUrlOrImage(arcxml.image.output);
        }
        
        return url;
    },
    
    
        getURLasync: function(bounds, callback, scope) {
        bounds = this.adjustBounds(bounds);
        var axlReq = new OpenLayers.Format.ArcXML(  
            OpenLayers.Util.extend(this.options, { 
                requesttype: "image",
                envelope: bounds.toArray(),
                tileSize: this.tileSize
            })
        );
        OpenLayers.Request.POST({
            url: this.getFullRequestString(),
            async: true,
            data: axlReq.write(),
            callback: function(req) {
                var doc = req.responseXML;
                if (!doc || !doc.documentElement) {            
                    doc = req.responseText;
                }
                var axlResp = new OpenLayers.Format.ArcXML();
                var arcxml = axlResp.read(doc);
                
                callback.call(scope, this.getUrlOrImage(arcxml.image.output));
            },
            scope: this
        });
    },
    
        getUrlOrImage: function(output) {
        var ret = "";
        if(output.url) {
            ret = output.url;
        } else if(output.data) {
            ret = "data:image/" + output.type + 
                  ";base64," + output.data;
        }
        return ret;
    },
    
        setLayerQuery: function(id, querydef) {
        for (var lyr = 0; lyr < this.options.layers.length; lyr++) {
            if (id == this.options.layers[lyr].id) {
                this.options.layers[lyr].query = querydef;
                return;
            }
        }
        this.options.layers.push({id: id, visible: true, query: querydef});
    },
    
        getFeatureInfo: function(geometry, layer, options) {
        var buffer = options.buffer || 1;
        var callback = options.callback || function() {};
        var scope = options.scope || window;
        var requestOptions = {};
        OpenLayers.Util.extend(requestOptions, this.options);
        requestOptions.requesttype = "feature";

        if (geometry instanceof OpenLayers.LonLat) {
            requestOptions.polygon = null;
            requestOptions.envelope = [ 
                geometry.lon - buffer, 
                geometry.lat - buffer,
                geometry.lon + buffer,
                geometry.lat + buffer
            ];
        } else if (geometry instanceof OpenLayers.Geometry.Polygon) {
            requestOptions.envelope = null;
            requestOptions.polygon = geometry;
        }
        var arcxml = new OpenLayers.Format.ArcXML(requestOptions);
        OpenLayers.Util.extend(arcxml.request.get_feature, options);

        arcxml.request.get_feature.layer = layer.id;
        if (typeof layer.query.accuracy == "number") {
            arcxml.request.get_feature.query.accuracy = layer.query.accuracy;
        } else {
            var mapCenter = this.map.getCenter();
            var viewPx = this.map.getViewPortPxFromLonLat(mapCenter);
            viewPx.x++;
            var mapOffCenter = this.map.getLonLatFromPixel(viewPx);
            arcxml.request.get_feature.query.accuracy = mapOffCenter.lon - mapCenter.lon;
        }
        arcxml.request.get_feature.query.where = layer.query.where;
        arcxml.request.get_feature.query.spatialfilter.relation = "area_intersection";
        OpenLayers.Request.POST({
            url: this.getFullRequestString({'CustomService': 'Query'}),
            data: arcxml.write(),
            callback: function(request) {
                var response = arcxml.parseResponse(request.responseText);
                
                if (!arcxml.iserror()) {
                    callback.call(scope, response.features);
                } else {
                    callback.call(scope, null);
                }
            }
        });
    },

        clone: function (obj) {

        if (obj == null) {
            obj = new OpenLayers.Layer.ArcIMS(this.name,
                                           this.url,
                                           this.getOptions());
        }
        obj = OpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);

        return obj;
    },
    
    CLASS_NAME: "OpenLayers.Layer.ArcIMS"
});
