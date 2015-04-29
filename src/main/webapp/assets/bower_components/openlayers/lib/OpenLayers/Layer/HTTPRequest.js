/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Layer.HTTPRequest = OpenLayers.Class(OpenLayers.Layer, {

    
        URL_HASH_FACTOR: (Math.sqrt(5) - 1) / 2,

        url: null,

        params: null,
    
        reproject: false,

        initialize: function(name, url, params, options) {
        OpenLayers.Layer.prototype.initialize.apply(this, [name, options]);
        this.url = url;
        if (!this.params) {
            this.params = OpenLayers.Util.extend({}, params);
        }
    },

        destroy: function() {
        this.url = null;
        this.params = null;
        OpenLayers.Layer.prototype.destroy.apply(this, arguments); 
    },
    
        clone: function (obj) {
        
        if (obj == null) {
            obj = new OpenLayers.Layer.HTTPRequest(this.name,
                                                   this.url,
                                                   this.params,
                                                   this.getOptions());
        }
        obj = OpenLayers.Layer.prototype.clone.apply(this, [obj]);
        
        return obj;
    },

        setUrl: function(newUrl) {
        this.url = newUrl;
    },

        mergeNewParams:function(newParams) {
        this.params = OpenLayers.Util.extend(this.params, newParams);
        var ret = this.redraw();
        if(this.map != null) {
            this.map.events.triggerEvent("changelayer", {
                layer: this,
                property: "params"
            });
        }
        return ret;
    },

        redraw: function(force) { 
        if (force) {
            this.events.triggerEvent('refresh');
            return this.mergeNewParams({"_olSalt": Math.random()});
        } else {
            return OpenLayers.Layer.prototype.redraw.apply(this, []);
        }
    },
    
        selectUrl: function(paramString, urls) {
        var product = 1;
        for (var i=0, len=paramString.length; i<len; i++) { 
            product *= paramString.charCodeAt(i) * this.URL_HASH_FACTOR; 
            product -= Math.floor(product); 
        }
        return urls[Math.floor(product * urls.length)];
    },

        getFullRequestString:function(newParams, altUrl) {
        var url = altUrl || this.url;
        var allParams = OpenLayers.Util.extend({}, this.params);
        allParams = OpenLayers.Util.extend(allParams, newParams);
        var paramsString = OpenLayers.Util.getParameterString(allParams);
        if (OpenLayers.Util.isArray(url)) {
            url = this.selectUrl(paramsString, url);
        }   
        var urlParams = 
            OpenLayers.Util.upperCaseObject(OpenLayers.Util.getParameters(url));
        for(var key in allParams) {
            if(key.toUpperCase() in urlParams) {
                delete allParams[key];
            }
        }
        paramsString = OpenLayers.Util.getParameterString(allParams);
        
        return OpenLayers.Util.urlAppend(url, paramsString);
    },

    CLASS_NAME: "OpenLayers.Layer.HTTPRequest"
});
