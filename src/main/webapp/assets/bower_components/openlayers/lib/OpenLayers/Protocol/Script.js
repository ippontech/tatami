/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Protocol.Script = OpenLayers.Class(OpenLayers.Protocol, {

        url: null,

        params: null,
    
        callback: null,

        callbackTemplate: "OpenLayers.Protocol.Script.registry.${id}",

        callbackKey: "callback",

        callbackPrefix: "",

        scope: null,

        format: null,

        pendingRequests: null,

        srsInBBOX: false,

        initialize: function(options) {
        options = options || {};
        this.params = {};
        this.pendingRequests = {};
        OpenLayers.Protocol.prototype.initialize.apply(this, arguments);
        if (!this.format) {
            this.format = new OpenLayers.Format.GeoJSON();
        }

        if (!this.filterToParams && OpenLayers.Format.QueryStringFilter) {
            var format = new OpenLayers.Format.QueryStringFilter({
                srsInBBOX: this.srsInBBOX
            });
            this.filterToParams = function(filter, params) {
                return format.write(filter, params);
            };
        }
    },
    
        read: function(options) {
        OpenLayers.Protocol.prototype.read.apply(this, arguments);
        options = OpenLayers.Util.applyDefaults(options, this.options);
        options.params = OpenLayers.Util.applyDefaults(
            options.params, this.options.params
        );
        if (options.filter && this.filterToParams) {
            options.params = this.filterToParams(
                options.filter, options.params
            );
        }
        var response = new OpenLayers.Protocol.Response({requestType: "read"});
        var request = this.createRequest(
            options.url, 
            options.params, 
            OpenLayers.Function.bind(function(data) {
                response.data = data;
                this.handleRead(response, options);
            }, this)
        );
        response.priv = request;
        return response;
    },

    
        createRequest: function(url, params, callback) {
        var id = OpenLayers.Protocol.Script.register(callback);
        var name = OpenLayers.String.format(this.callbackTemplate, {id: id});
        params = OpenLayers.Util.extend({}, params);
        params[this.callbackKey] = this.callbackPrefix + name;
        url = OpenLayers.Util.urlAppend(
            url, OpenLayers.Util.getParameterString(params)
        );
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.id = "OpenLayers_Protocol_Script_" + id;
        this.pendingRequests[script.id] = script;
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(script);
        return script;
    },
    
        destroyRequest: function(script) {
        OpenLayers.Protocol.Script.unregister(script.id.split("_").pop());
        delete this.pendingRequests[script.id];
        if (script.parentNode) {
            script.parentNode.removeChild(script);
        }
    },

        handleRead: function(response, options) {
        this.handleResponse(response, options);
    },

        handleResponse: function(response, options) {
        if (options.callback) {
            if (response.data) {
                response.features = this.parseFeatures(response.data);
                response.code = OpenLayers.Protocol.Response.SUCCESS;
            } else {
                response.code = OpenLayers.Protocol.Response.FAILURE;
            }
            this.destroyRequest(response.priv);
            options.callback.call(options.scope, response);
        }
    },

        parseFeatures: function(data) {
        return this.format.read(data);
    },

        abort: function(response) {
        if (response) {
            this.destroyRequest(response.priv);
        } else {
            for (var key in this.pendingRequests) {
                this.destroyRequest(this.pendingRequests[key]);
            }
        }
    },
    
        destroy: function() {
        this.abort();
        delete this.params;
        delete this.format;
        OpenLayers.Protocol.prototype.destroy.apply(this);
    },

    CLASS_NAME: "OpenLayers.Protocol.Script" 
});

(function() {
    var o = OpenLayers.Protocol.Script;
    var counter = 0;
    o.registry = {};
    
        o.register = function(callback) {
        var id = "c"+(++counter);
        o.registry[id] = function() {
            callback.apply(this, arguments);
        };
        return id;
    };
    
        o.unregister = function(id) {
        delete o.registry[id];
    };
})();
