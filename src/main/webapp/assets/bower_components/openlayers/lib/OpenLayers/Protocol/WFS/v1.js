/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Protocol.WFS.v1 = OpenLayers.Class(OpenLayers.Protocol, {
    
        version: null,
    
        srsName: "EPSG:4326",
    
        featureType: null,
    
        featureNS: null,
    
        geometryName: "the_geom",

        
        schema: null,

        featurePrefix: "feature",
    
        formatOptions: null,

        readOptions: null,
    
        initialize: function(options) {
        OpenLayers.Protocol.prototype.initialize.apply(this, [options]);
        if(!options.format) {
            this.format = OpenLayers.Format.WFST(OpenLayers.Util.extend({
                version: this.version,
                featureType: this.featureType,
                featureNS: this.featureNS,
                featurePrefix: this.featurePrefix,
                geometryName: this.geometryName,
                srsName: this.srsName,
                schema: this.schema
            }, this.formatOptions));
        }
        if (!options.geometryName && parseFloat(this.format.version) > 1.0) {
            this.setGeometryName(null);
        }
    },
    
        destroy: function() {
        if(this.options && !this.options.format) {
            this.format.destroy();
        }
        this.format = null;
        OpenLayers.Protocol.prototype.destroy.apply(this);
    },

        read: function(options) {
        OpenLayers.Protocol.prototype.read.apply(this, arguments);
        options = OpenLayers.Util.extend({}, options);
        OpenLayers.Util.applyDefaults(options, this.options || {});
        var response = new OpenLayers.Protocol.Response({requestType: "read"});
        
        var data = OpenLayers.Format.XML.prototype.write.apply(
            this.format, [this.format.writeNode("wfs:GetFeature", options)]
        );

        response.priv = OpenLayers.Request.POST({
            url: options.url,
            callback: this.createCallback(this.handleRead, response, options),
            params: options.params,
            headers: options.headers,
            data: data
        });

        return response;
    },

        setFeatureType: function(featureType) {
        this.featureType = featureType;
        this.format.featureType = featureType;
    },
 
        setGeometryName: function(geometryName) {
        this.geometryName = geometryName;
        this.format.geometryName = geometryName;
    },
    
        handleRead: function(response, options) {
        options = OpenLayers.Util.extend({}, options);
        OpenLayers.Util.applyDefaults(options, this.options);

        if(options.callback) {
            var request = response.priv;
            if(request.status >= 200 && request.status < 300) {
                var result = this.parseResponse(request, options.readOptions);
                if (result && result.success !== false) { 
                    if (options.readOptions && options.readOptions.output == "object") {
                        OpenLayers.Util.extend(response, result);
                    } else {
                        response.features = result;
                    }
                    response.code = OpenLayers.Protocol.Response.SUCCESS;
                } else {
                    response.code = OpenLayers.Protocol.Response.FAILURE;
                    response.error = result;
                }
            } else {
                response.code = OpenLayers.Protocol.Response.FAILURE;
            }
            options.callback.call(options.scope, response);
        }
    },

        parseResponse: function(request, options) {
        var doc = request.responseXML;
        if(!doc || !doc.documentElement) {
            doc = request.responseText;
        }
        if(!doc || doc.length <= 0) {
            return null;
        }
        var result = (this.readFormat !== null) ? this.readFormat.read(doc) : 
            this.format.read(doc, options);
        if (!this.featureNS) {
            var format = this.readFormat || this.format;
            this.featureNS = format.featureNS;
            format.autoConfig = false;
            if (!this.geometryName) {
                this.setGeometryName(format.geometryName);
            }
        }
        return result;
    },

        commit: function(features, options) {

        options = OpenLayers.Util.extend({}, options);
        OpenLayers.Util.applyDefaults(options, this.options);
        
        var response = new OpenLayers.Protocol.Response({
            requestType: "commit",
            reqFeatures: features
        });
        response.priv = OpenLayers.Request.POST({
            url: options.url,
            headers: options.headers,
            data: this.format.write(features, options),
            callback: this.createCallback(this.handleCommit, response, options)
        });
        
        return response;
    },
    
        handleCommit: function(response, options) {
        if(options.callback) {
            var request = response.priv;
            var data = request.responseXML;
            if(!data || !data.documentElement) {
                data = request.responseText;
            }
            
            var obj = this.format.read(data) || {};
            
            response.insertIds = obj.insertIds || [];
            if (obj.success) {
                response.code = OpenLayers.Protocol.Response.SUCCESS;
            } else {
                response.code = OpenLayers.Protocol.Response.FAILURE;
                response.error = obj;
            }
            options.callback.call(options.scope, response);
        }
    },
    
        filterDelete: function(filter, options) {
        options = OpenLayers.Util.extend({}, options);
        OpenLayers.Util.applyDefaults(options, this.options);    
        
        var response = new OpenLayers.Protocol.Response({
            requestType: "commit"
        });    
        
        var root = this.format.createElementNSPlus("wfs:Transaction", {
            attributes: {
                service: "WFS",
                version: this.version
            }
        });
        
        var deleteNode = this.format.createElementNSPlus("wfs:Delete", {
            attributes: {
                typeName: (options.featureNS ? this.featurePrefix + ":" : "") +
                    options.featureType
            }
        });       
        
        if(options.featureNS) {
            deleteNode.setAttribute("xmlns:" + this.featurePrefix, options.featureNS);
        }
        var filterNode = this.format.writeNode("ogc:Filter", filter);
        
        deleteNode.appendChild(filterNode);
        
        root.appendChild(deleteNode);
        
        var data = OpenLayers.Format.XML.prototype.write.apply(
            this.format, [root]
        );
        
        return OpenLayers.Request.POST({
            url: this.url,
            callback : options.callback || function(){},
            data: data
        });   
        
    },

        abort: function(response) {
        if (response) {
            response.priv.abort();
        }
    },
  
    CLASS_NAME: "OpenLayers.Protocol.WFS.v1" 
});
