/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Layer.MapServer = OpenLayers.Class(OpenLayers.Layer.Grid, {

        DEFAULT_PARAMS: {
        mode: "map",
        map_imagetype: "png"
    },

        initialize: function(name, url, params, options) {
        OpenLayers.Layer.Grid.prototype.initialize.apply(this, arguments);

        this.params = OpenLayers.Util.applyDefaults(
            this.params, this.DEFAULT_PARAMS
        );
        if (options == null || options.isBaseLayer == null) {
            this.isBaseLayer = ((this.params.transparent != "true") && 
                                (this.params.transparent != true));
        }
    },

        clone: function (obj) {
        if (obj == null) {
            obj = new OpenLayers.Layer.MapServer(this.name,
                                           this.url,
                                           this.params,
                                           this.getOptions());
        }
        obj = OpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);

        return obj;
    },
    
        getURL: function (bounds) {
        bounds = this.adjustBounds(bounds);
        var extent = [bounds.left, bounds. bottom, bounds.right, bounds.top];

        var imageSize = this.getImageSize(bounds); 
        var url = this.getFullRequestString(
                     {mapext:   extent,
                      imgext:   extent,
                      map_size: [imageSize.w, imageSize.h],
                      imgx:     imageSize.w / 2,
                      imgy:     imageSize.h / 2,
                      imgxy:    [imageSize.w, imageSize.h]
                      });
        
        return url;
    },
    
        getFullRequestString:function(newParams, altUrl) {
        var url = (altUrl == null) ? this.url : altUrl;
        var allParams = OpenLayers.Util.extend({}, this.params);
        allParams = OpenLayers.Util.extend(allParams, newParams);
        var paramsString = OpenLayers.Util.getParameterString(allParams);
        if (OpenLayers.Util.isArray(url)) {
            url = this.selectUrl(paramsString, url);
        }   
        var urlParams = OpenLayers.Util.upperCaseObject(
                            OpenLayers.Util.getParameters(url));
        for(var key in allParams) {
            if(key.toUpperCase() in urlParams) {
                delete allParams[key];
            }
        }
        paramsString = OpenLayers.Util.getParameterString(allParams);
        var requestString = url;        
        paramsString = paramsString.replace(/,/g, "+");
        
        if (paramsString != "") {
            var lastServerChar = url.charAt(url.length - 1);
            if ((lastServerChar == "&") || (lastServerChar == "?")) {
                requestString += paramsString;
            } else {
                if (url.indexOf('?') == -1) {
                    requestString += '?' + paramsString;
                } else {
                    requestString += '&' + paramsString;
                }
            }
        }
        return requestString;
    },

    CLASS_NAME: "OpenLayers.Layer.MapServer"
});
