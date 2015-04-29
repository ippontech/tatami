/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Protocol.HTTP = OpenLayers.Class(OpenLayers.Protocol, {

        url: null,

        headers: null,

        params: null,
    
        callback: null,

        scope: null,

        readWithPOST: false,

        updateWithPOST: false,
    
        deleteWithPOST: false,

        wildcarded: false,

        srsInBBOX: false,

        initialize: function(options) {
        options = options || {};
        this.params = {};
        this.headers = {};
        OpenLayers.Protocol.prototype.initialize.apply(this, arguments);

        if (!this.filterToParams && OpenLayers.Format.QueryStringFilter) {
            var format = new OpenLayers.Format.QueryStringFilter({
                wildcarded: this.wildcarded,
                srsInBBOX: this.srsInBBOX
            });
            this.filterToParams = function(filter, params) {
                return format.write(filter, params);
            };
        }
    },
    
        destroy: function() {
        this.params = null;
        this.headers = null;
        OpenLayers.Protocol.prototype.destroy.apply(this);
    },

        
        read: function(options) {
        OpenLayers.Protocol.prototype.read.apply(this, arguments);
        options = options || {};
        options.params = OpenLayers.Util.applyDefaults(
            options.params, this.options.params);
        options = OpenLayers.Util.applyDefaults(options, this.options);
        if (options.filter && this.filterToParams) {
            options.params = this.filterToParams(
                options.filter, options.params
            );
        }
        var readWithPOST = (options.readWithPOST !== undefined) ?
                           options.readWithPOST : this.readWithPOST;
        var resp = new OpenLayers.Protocol.Response({requestType: "read"});
        if(readWithPOST) {
            var headers = options.headers || {};
            headers["Content-Type"] = "application/x-www-form-urlencoded";
            resp.priv = OpenLayers.Request.POST({
                url: options.url,
                callback: this.createCallback(this.handleRead, resp, options),
                data: OpenLayers.Util.getParameterString(options.params),
                headers: headers
            });
        } else {
            resp.priv = OpenLayers.Request.GET({
                url: options.url,
                callback: this.createCallback(this.handleRead, resp, options),
                params: options.params,
                headers: options.headers
            });
        }
        return resp;
    },

        handleRead: function(resp, options) {
        this.handleResponse(resp, options);
    },

        create: function(features, options) {
        options = OpenLayers.Util.applyDefaults(options, this.options);

        var resp = new OpenLayers.Protocol.Response({
            reqFeatures: features,
            requestType: "create"
        });

        resp.priv = OpenLayers.Request.POST({
            url: options.url,
            callback: this.createCallback(this.handleCreate, resp, options),
            headers: options.headers,
            data: this.format.write(features)
        });

        return resp;
    },

        handleCreate: function(resp, options) {
        this.handleResponse(resp, options);
    },

        update: function(feature, options) {
        options = options || {};
        var url = options.url ||
                  feature.url ||
                  this.options.url + "/" + feature.fid;
        options = OpenLayers.Util.applyDefaults(options, this.options);

        var resp = new OpenLayers.Protocol.Response({
            reqFeatures: feature,
            requestType: "update"
        });

        var method = this.updateWithPOST ? "POST" : "PUT";
        resp.priv = OpenLayers.Request[method]({
            url: url,
            callback: this.createCallback(this.handleUpdate, resp, options),
            headers: options.headers,
            data: this.format.write(feature)
        });

        return resp;
    },

        handleUpdate: function(resp, options) {
        this.handleResponse(resp, options);
    },

        "delete": function(feature, options) {
        options = options || {};
        var url = options.url ||
                  feature.url ||
                  this.options.url + "/" + feature.fid;
        options = OpenLayers.Util.applyDefaults(options, this.options);

        var resp = new OpenLayers.Protocol.Response({
            reqFeatures: feature,
            requestType: "delete"
        });

        var method = this.deleteWithPOST ? "POST" : "DELETE";
        var requestOptions = {
            url: url,
            callback: this.createCallback(this.handleDelete, resp, options),
            headers: options.headers
        };
        if (this.deleteWithPOST) {
            requestOptions.data = this.format.write(feature);
        }
        resp.priv = OpenLayers.Request[method](requestOptions);

        return resp;
    },

        handleDelete: function(resp, options) {
        this.handleResponse(resp, options);
    },

        handleResponse: function(resp, options) {
        var request = resp.priv;
        if(options.callback) {
            if(request.status >= 200 && request.status < 300) {
                if(resp.requestType != "delete") {
                    resp.features = this.parseFeatures(request);
                }
                resp.code = OpenLayers.Protocol.Response.SUCCESS;
            } else {
                resp.code = OpenLayers.Protocol.Response.FAILURE;
            }
            options.callback.call(options.scope, resp);
        }
    },

        parseFeatures: function(request) {
        var doc = request.responseXML;
        if (!doc || !doc.documentElement) {
            doc = request.responseText;
        }
        if (!doc || doc.length <= 0) {
            return null;
        }
        return this.format.read(doc);
    },

        commit: function(features, options) {
        options = OpenLayers.Util.applyDefaults(options, this.options);
        var resp = [], nResponses = 0;
        var types = {};
        types[OpenLayers.State.INSERT] = [];
        types[OpenLayers.State.UPDATE] = [];
        types[OpenLayers.State.DELETE] = [];
        var feature, list, requestFeatures = [];
        for(var i=0, len=features.length; i<len; ++i) {
            feature = features[i];
            list = types[feature.state];
            if(list) {
                list.push(feature);
                requestFeatures.push(feature); 
            }
        }
        var nRequests = (types[OpenLayers.State.INSERT].length > 0 ? 1 : 0) +
            types[OpenLayers.State.UPDATE].length +
            types[OpenLayers.State.DELETE].length;
        var success = true;
        var finalResponse = new OpenLayers.Protocol.Response({
            reqFeatures: requestFeatures        
        });
        
        function insertCallback(response) {
            var len = response.features ? response.features.length : 0;
            var fids = new Array(len);
            for(var i=0; i<len; ++i) {
                fids[i] = response.features[i].fid;
            }   
            finalResponse.insertIds = fids;
            callback.apply(this, [response]);
        }
 
        function callback(response) {
            this.callUserCallback(response, options);
            success = success && response.success();
            nResponses++;
            if (nResponses >= nRequests) {
                if (options.callback) {
                    finalResponse.code = success ? 
                        OpenLayers.Protocol.Response.SUCCESS :
                        OpenLayers.Protocol.Response.FAILURE;
                    options.callback.apply(options.scope, [finalResponse]);
                }    
            }
        }
        var queue = types[OpenLayers.State.INSERT];
        if(queue.length > 0) {
            resp.push(this.create(
                queue, OpenLayers.Util.applyDefaults(
                    {callback: insertCallback, scope: this}, options.create
                )
            ));
        }
        queue = types[OpenLayers.State.UPDATE];
        for(var i=queue.length-1; i>=0; --i) {
            resp.push(this.update(
                queue[i], OpenLayers.Util.applyDefaults(
                    {callback: callback, scope: this}, options.update
                ))
            );
        }
        queue = types[OpenLayers.State.DELETE];
        for(var i=queue.length-1; i>=0; --i) {
            resp.push(this["delete"](
                queue[i], OpenLayers.Util.applyDefaults(
                    {callback: callback, scope: this}, options["delete"]
                ))
            );
        }
        return resp;
    },

        abort: function(response) {
        if (response) {
            response.priv.abort();
        }
    },

        callUserCallback: function(resp, options) {
        var opt = options[resp.requestType];
        if(opt && opt.callback) {
            opt.callback.call(opt.scope, resp);
        }
    },

    CLASS_NAME: "OpenLayers.Protocol.HTTP" 
});
