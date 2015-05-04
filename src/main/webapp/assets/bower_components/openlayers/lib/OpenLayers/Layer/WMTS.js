/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Layer.WMTS = OpenLayers.Class(OpenLayers.Layer.Grid, {
    
        isBaseLayer: true,

        version: "1.0.0",
    
        requestEncoding: "KVP",
    
        url: null,

        layer: null,
    
        matrixSet: null,

        style: null,
    
        format: "image/jpeg",
    
        tileOrigin: null,
    
        tileFullExtent: null,

        formatSuffix: null,    

        matrixIds: null,
    
        dimensions: null,
    
        params: null,
    
        zoomOffset: 0,

        serverResolutions: null,

        formatSuffixMap: {
        "image/png": "png",
        "image/png8": "png",
        "image/png24": "png",
        "image/png32": "png",
        "png": "png",
        "image/jpeg": "jpg",
        "image/jpg": "jpg",
        "jpeg": "jpg",
        "jpg": "jpg"
    },
    
        matrix: null,
    
        initialize: function(config) {
        var required = {
            url: true,
            layer: true,
            style: true,
            matrixSet: true
        };
        for (var prop in required) {
            if (!(prop in config)) {
                throw new Error("Missing property '" + prop + "' in layer configuration.");
            }
        }

        config.params = OpenLayers.Util.upperCaseObject(config.params);
        var args = [config.name, config.url, config.params, config];
        OpenLayers.Layer.Grid.prototype.initialize.apply(this, args);
        if (!this.formatSuffix) {
            this.formatSuffix = this.formatSuffixMap[this.format] || this.format.split("/").pop();            
        }
        if (this.matrixIds) {
            var len = this.matrixIds.length;
            if (len && typeof this.matrixIds[0] === "string") {
                var ids = this.matrixIds;
                this.matrixIds = new Array(len);
                for (var i=0; i<len; ++i) {
                    this.matrixIds[i] = {identifier: ids[i]};
                }
            }
        }

    },
    
        setMap: function() {
        OpenLayers.Layer.Grid.prototype.setMap.apply(this, arguments);
    },
    
        updateMatrixProperties: function() {
        this.matrix = this.getMatrix();
        if (this.matrix) {
            if (this.matrix.topLeftCorner) {
                this.tileOrigin = this.matrix.topLeftCorner;
            }
            if (this.matrix.tileWidth && this.matrix.tileHeight) {
                this.tileSize = new OpenLayers.Size(
                    this.matrix.tileWidth, this.matrix.tileHeight
                );
            }
            if (!this.tileOrigin) { 
                this.tileOrigin = new OpenLayers.LonLat(
                    this.maxExtent.left, this.maxExtent.top
                );
            }   
            if (!this.tileFullExtent) { 
                this.tileFullExtent = this.maxExtent;
            }
        }
    },
    
        moveTo:function(bounds, zoomChanged, dragging) {
        if (zoomChanged || !this.matrix) {
            this.updateMatrixProperties();
        }
        return OpenLayers.Layer.Grid.prototype.moveTo.apply(this, arguments);
    },

        clone: function(obj) {
        if (obj == null) {
            obj = new OpenLayers.Layer.WMTS(this.options);
        }
        obj = OpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);
        return obj;
    },

        getIdentifier: function() {
        return this.getServerZoom();
    },
    
        getMatrix: function() {
        var matrix;
        if (!this.matrixIds || this.matrixIds.length === 0) {
            matrix = {identifier: this.getIdentifier()};
        } else {
            if ("scaleDenominator" in this.matrixIds[0]) {
                var denom = 
                    OpenLayers.METERS_PER_INCH * 
                    OpenLayers.INCHES_PER_UNIT[this.units] * 
                    this.getServerResolution() / 0.28E-3;
                var diff = Number.POSITIVE_INFINITY;
                var delta;
                for (var i=0, ii=this.matrixIds.length; i<ii; ++i) {
                    delta = Math.abs(1 - (this.matrixIds[i].scaleDenominator / denom));
                    if (delta < diff) {
                        diff = delta;
                        matrix = this.matrixIds[i];
                    }
                }
            } else {
                matrix = this.matrixIds[this.getIdentifier()];
            }
        }
        return matrix;
    },
    
        getTileInfo: function(loc) {
        var res = this.getServerResolution();
        
        var fx = (loc.lon - this.tileOrigin.lon) / (res * this.tileSize.w);
        var fy = (this.tileOrigin.lat - loc.lat) / (res * this.tileSize.h);

        var col = Math.floor(fx);
        var row = Math.floor(fy);
        
        return {
            col: col, 
            row: row,
            i: Math.floor((fx - col) * this.tileSize.w),
            j: Math.floor((fy - row) * this.tileSize.h)
        };
    },
    
        getURL: function(bounds) {
        bounds = this.adjustBounds(bounds);
        var url = "";
        if (!this.tileFullExtent || this.tileFullExtent.intersectsBounds(bounds)) {            

            var center = bounds.getCenterLonLat();            
            var info = this.getTileInfo(center);
            var matrixId = this.matrix.identifier;
            var dimensions = this.dimensions, params;

            if (OpenLayers.Util.isArray(this.url)) {
                url = this.selectUrl([
                    this.version, this.style, this.matrixSet,
                    this.matrix.identifier, info.row, info.col
                ].join(","), this.url);
            } else {
                url = this.url;
            }

            if (this.requestEncoding.toUpperCase() === "REST") {
                params = this.params;
                if (url.indexOf("{") !== -1) {
                    var template = url.replace(/\{/g, "${");
                    var context = {
                        style: this.style, Style: this.style,
                        TileMatrixSet: this.matrixSet,
                        TileMatrix: this.matrix.identifier,
                        TileRow: info.row,
                        TileCol: info.col
                    };
                    if (dimensions) {
                        var dimension, i;
                        for (i=dimensions.length-1; i>=0; --i) {
                            dimension = dimensions[i];
                            context[dimension] = params[dimension.toUpperCase()];
                        }
                    }
                    url = OpenLayers.String.format(template, context);
                } else {
                    var path = this.version + "/" + this.layer + "/" + this.style + "/";
                    if (dimensions) {
                        for (var i=0; i<dimensions.length; i++) {
                            if (params[dimensions[i]]) {
                                path = path + params[dimensions[i]] + "/";
                            }
                        }
                    }
                    path = path + this.matrixSet + "/" + this.matrix.identifier + 
                        "/" + info.row + "/" + info.col + "." + this.formatSuffix;

                    if (!url.match(/\/$/)) {
                        url = url + "/";
                    }
                    url = url + path;
                }
            } else if (this.requestEncoding.toUpperCase() === "KVP") {
                params = {
                    SERVICE: "WMTS",
                    REQUEST: "GetTile",
                    VERSION: this.version,
                    LAYER: this.layer,
                    STYLE: this.style,
                    TILEMATRIXSET: this.matrixSet,
                    TILEMATRIX: this.matrix.identifier,
                    TILEROW: info.row,
                    TILECOL: info.col,
                    FORMAT: this.format
                };
                url = OpenLayers.Layer.Grid.prototype.getFullRequestString.apply(this, [params]);

            }
        }
        return url;    
    },
    
        mergeNewParams: function(newParams) {
        if (this.requestEncoding.toUpperCase() === "KVP") {
            return OpenLayers.Layer.Grid.prototype.mergeNewParams.apply(
                this, [OpenLayers.Util.upperCaseObject(newParams)]
            );
        }
    },

    CLASS_NAME: "OpenLayers.Layer.WMTS"
});
