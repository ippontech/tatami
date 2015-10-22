/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Layer.ArcGIS93Rest = OpenLayers.Class(OpenLayers.Layer.Grid, {

        DEFAULT_PARAMS: { 
      format: "png"
    },
        
        isBaseLayer: true,
 
 
        initialize: function(name, url, params, options) {
        var newArguments = [];
        params = OpenLayers.Util.upperCaseObject(params);
        newArguments.push(name, url, params, options);
        OpenLayers.Layer.Grid.prototype.initialize.apply(this, newArguments);
        OpenLayers.Util.applyDefaults(
                       this.params, 
                       OpenLayers.Util.upperCaseObject(this.DEFAULT_PARAMS)
                       );
        if (this.params.TRANSPARENT && 
            this.params.TRANSPARENT.toString().toLowerCase() == "true") {
            if ( (options == null) || (!options.isBaseLayer) ) {
                this.isBaseLayer = false;
            } 
            if (this.params.FORMAT == "jpg") {
                this.params.FORMAT = OpenLayers.Util.alphaHack() ? "gif"
                                                                 : "png";
            }
        }
    },    

        clone: function (obj) {
        
        if (obj == null) {
            obj = new OpenLayers.Layer.ArcGIS93Rest(this.name,
                                           this.url,
                                           this.params,
                                           this.getOptions());
        }
        obj = OpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);

        return obj;
    },
    
    
        getURL: function (bounds) {
        bounds = this.adjustBounds(bounds);
        var projWords = this.projection.getCode().split(":");
        var srid = projWords[projWords.length - 1];

        var imageSize = this.getImageSize(bounds); 
        var newParams = {
            'BBOX': bounds.toBBOX(),
            'SIZE': imageSize.w + "," + imageSize.h,
            'F': "image",
            'BBOXSR': srid,
            'IMAGESR': srid
        };
        if (this.layerDefs) {
            var layerDefStrList = [];
            var layerID;
            for(layerID in this.layerDefs) {
                if (this.layerDefs.hasOwnProperty(layerID)) {
                    if (this.layerDefs[layerID]) {
                        layerDefStrList.push(layerID);
                        layerDefStrList.push(":");
                        layerDefStrList.push(this.layerDefs[layerID]);
                        layerDefStrList.push(";");
                    }
                }
            }
            if (layerDefStrList.length > 0) {
                newParams['LAYERDEFS'] = layerDefStrList.join("");
            }
        }
        var requestString = this.getFullRequestString(newParams);
        return requestString;
    },
    
        setLayerFilter: function ( id, queryDef ) {
        if (!this.layerDefs) {
            this.layerDefs = {};
        }
        if (queryDef) {
            this.layerDefs[id] = queryDef;
        } else {
            delete this.layerDefs[id];
        }
    },
    
        clearLayerFilter: function ( id ) {
        if (id) {
            delete this.layerDefs[id];
        } else {
            delete this.layerDefs;
        }
    },
    
        mergeNewParams:function(newParams) {
        var upperParams = OpenLayers.Util.upperCaseObject(newParams);
        var newArguments = [upperParams];
        return OpenLayers.Layer.Grid.prototype.mergeNewParams.apply(this, 
                                                             newArguments);
    },

    CLASS_NAME: "OpenLayers.Layer.ArcGIS93Rest"
});
