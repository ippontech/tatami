/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.WFST.v1 = OpenLayers.Class(OpenLayers.Format.XML, {
    
        namespaces: {
        xlink: "http://www.w3.org/1999/xlink",
        xsi: "http://www.w3.org/2001/XMLSchema-instance",
        wfs: "http://www.opengis.net/wfs",
        gml: "http://www.opengis.net/gml",
        ogc: "http://www.opengis.net/ogc",
        ows: "http://www.opengis.net/ows",
        xmlns: "http://www.w3.org/2000/xmlns/"
    },
    
        defaultPrefix: "wfs",

        version: null,

        schemaLocations: null,
    
        srsName: null,

        extractAttributes: true,
    
        stateName: null,
    
        initialize: function(options) {
        this.stateName = {};
        this.stateName[OpenLayers.State.INSERT] = "wfs:Insert";
        this.stateName[OpenLayers.State.UPDATE] = "wfs:Update";
        this.stateName[OpenLayers.State.DELETE] = "wfs:Delete";
        OpenLayers.Format.XML.prototype.initialize.apply(this, [options]);
    },
    
        getSrsName: function(feature, options) {
        var srsName = options && options.srsName;
        if(!srsName) {
            if(feature && feature.layer) {
                srsName = feature.layer.projection.getCode();
            } else {
                srsName = this.srsName;
            }
        }
        return srsName;
    },

        read: function(data, options) {
        options = options || {};
        OpenLayers.Util.applyDefaults(options, {
            output: "features"
        });
        
        if(typeof data == "string") { 
            data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
        }
        if(data && data.nodeType == 9) {
            data = data.documentElement;
        }
        var obj = {};
        if(data) {
            this.readNode(data, obj, true);
        }
        if(obj.features && options.output === "features") {
            obj = obj.features;
        }
        return obj;
    },
    
        readers: {
        "wfs": {
            "FeatureCollection": function(node, obj) {
                obj.features = [];
                this.readChildNodes(node, obj);
            }
        }
    },
    
        write: function(features, options) {
        var node = this.writeNode("wfs:Transaction", {
            features:features,
            options: options
        });
        var value = this.schemaLocationAttr();
        if(value) {
            this.setAttributeNS(
                node, this.namespaces["xsi"], "xsi:schemaLocation",  value
            );
        }
        return OpenLayers.Format.XML.prototype.write.apply(this, [node]);
    },
    
        writers: {
        "wfs": {
            "GetFeature": function(options) {
                var node = this.createElementNSPlus("wfs:GetFeature", {
                    attributes: {
                        service: "WFS",
                        version: this.version,
                        handle: options && options.handle,
                        outputFormat: options && options.outputFormat,
                        maxFeatures: options && options.maxFeatures,
                        viewParams: options && options.viewParams,
                        "xsi:schemaLocation": this.schemaLocationAttr(options)
                    }
                });
                if (typeof this.featureType == "string") {
                    this.writeNode("Query", options, node);
                } else {
                    for (var i=0,len = this.featureType.length; i<len; i++) { 
                        options.featureType = this.featureType[i]; 
                        this.writeNode("Query", options, node); 
                    } 
                }
                return node;
            },
            "Transaction": function(obj) {
                obj = obj || {};
                var options = obj.options || {};
                var node = this.createElementNSPlus("wfs:Transaction", {
                    attributes: {
                        service: "WFS",
                        version: this.version,
                        handle: options.handle
                    }
                });
                var i, len;
                var features = obj.features;
                if(features) {
                    if (options.multi === true) {
                        OpenLayers.Util.extend(this.geometryTypes, {
                            "OpenLayers.Geometry.Point": "MultiPoint",
                            "OpenLayers.Geometry.LineString": (this.multiCurve === true) ? "MultiCurve": "MultiLineString",
                            "OpenLayers.Geometry.Polygon": (this.multiSurface === true) ? "MultiSurface" : "MultiPolygon"
                        });
                    }
                    var name, feature;
                    for(i=0, len=features.length; i<len; ++i) {
                        feature = features[i];
                        name = this.stateName[feature.state];
                        if(name) {
                            this.writeNode(name, {
                                feature: feature, 
                                options: options
                            }, node);
                        }
                    }
                    if (options.multi === true) {
                        this.setGeometryTypes();
                    }
                }
                if (options.nativeElements) {
                    for (i=0, len=options.nativeElements.length; i<len; ++i) {
                        this.writeNode("wfs:Native", 
                            options.nativeElements[i], node);
                    }
                }
                return node;
            },
            "Native": function(nativeElement) {
                var node = this.createElementNSPlus("wfs:Native", {
                    attributes: {
                        vendorId: nativeElement.vendorId,
                        safeToIgnore: nativeElement.safeToIgnore
                    },
                    value: nativeElement.value
                });
                return node;
            },
            "Insert": function(obj) {
                var feature = obj.feature;
                var options = obj.options;
                var node = this.createElementNSPlus("wfs:Insert", {
                    attributes: {
                        handle: options && options.handle
                    }
                });
                this.srsName = this.getSrsName(feature);
                this.writeNode("feature:_typeName", feature, node);
                return node;
            },
            "Update": function(obj) {
                var feature = obj.feature;
                var options = obj.options;
                var node = this.createElementNSPlus("wfs:Update", {
                    attributes: {
                        handle: options && options.handle,
                        typeName: (this.featureNS ? this.featurePrefix + ":" : "") +
                            this.featureType
                    }
                });
                if(this.featureNS) {
                    this.setAttributeNS(
                        node, this.namespaces.xmlns,
                        "xmlns:" + this.featurePrefix, this.featureNS
                    );
                }
                var modified = feature.modified;
                if (this.geometryName !== null && (!modified || modified.geometry !== undefined)) {
                    this.srsName = this.getSrsName(feature);
                    this.writeNode(
                        "Property", {name: this.geometryName, value: feature.geometry}, node
                    );
                }
                for(var key in feature.attributes) {
                    if(feature.attributes[key] !== undefined &&
                                (!modified || !modified.attributes ||
                                (modified.attributes && (key in modified.attributes)))) {
                        this.writeNode(
                            "Property", {name: key, value: feature.attributes[key]}, node
                        );
                    }
                }
                this.writeNode("ogc:Filter", new OpenLayers.Filter.FeatureId({
                    fids: [feature.fid]
                }), node);
        
                return node;
            },
            "Property": function(obj) {
                var node = this.createElementNSPlus("wfs:Property");
                this.writeNode("Name", obj.name, node);
                if(obj.value !== null) {
                    this.writeNode("Value", obj.value, node);
                }
                return node;
            },
            "Name": function(name) {
                return this.createElementNSPlus("wfs:Name", {value: name});
            },
            "Value": function(obj) {
                var node;
                if(obj instanceof OpenLayers.Geometry) {
                    node = this.createElementNSPlus("wfs:Value");
                    var geom = this.writeNode("feature:_geometry", obj).firstChild;
                    node.appendChild(geom);
                } else {
                    node = this.createElementNSPlus("wfs:Value", {value: obj});                
                }
                return node;
            },
            "Delete": function(obj) {
                var feature = obj.feature;
                var options = obj.options;
                var node = this.createElementNSPlus("wfs:Delete", {
                    attributes: {
                        handle: options && options.handle,
                        typeName: (this.featureNS ? this.featurePrefix + ":" : "") +
                            this.featureType
                    }
                });
                if(this.featureNS) {
                    this.setAttributeNS(
                        node, this.namespaces.xmlns,
                        "xmlns:" + this.featurePrefix, this.featureNS
                    );
                }
                this.writeNode("ogc:Filter", new OpenLayers.Filter.FeatureId({
                    fids: [feature.fid]
                }), node);
                return node;
            }
        }
    },

        schemaLocationAttr: function(options) {
        options = OpenLayers.Util.extend({
            featurePrefix: this.featurePrefix,
            schema: this.schema
        }, options);
        var schemaLocations = OpenLayers.Util.extend({}, this.schemaLocations);
        if(options.schema) {
            schemaLocations[options.featurePrefix] = options.schema;
        }
        var parts = [];
        var uri;
        for(var key in schemaLocations) {
            uri = this.namespaces[key];
            if(uri) {
                parts.push(uri + " " + schemaLocations[key]);
            }
        }
        var value = parts.join(" ") || undefined;
        return value;
    },
    
        setFilterProperty: function(filter) {
        if(filter.filters) {
            for(var i=0, len=filter.filters.length; i<len; ++i) {
                OpenLayers.Format.WFST.v1.prototype.setFilterProperty.call(this, filter.filters[i]);
            }
        } else {
            if(filter instanceof OpenLayers.Filter.Spatial && !filter.property) {
                filter.property = this.geometryName;
            }
        }
    },

    CLASS_NAME: "OpenLayers.Format.WFST.v1" 

});
