/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.ProxyHost = "";

if (!OpenLayers.Request) {
        OpenLayers.Request = {};
}
OpenLayers.Util.extend(OpenLayers.Request, {
    
        DEFAULT_CONFIG: {
        method: "GET",
        url: window.location.href,
        async: true,
        user: undefined,
        password: undefined,
        params: null,
        proxy: OpenLayers.ProxyHost,
        headers: {},
        data: null,
        callback: function() {},
        success: null,
        failure: null,
        scope: null
    },
    
        URL_SPLIT_REGEX: /([^:]*:)\/\/([^:]*:?[^@]*@)?([^:\/\?]*):?([^\/\?]*)/,
    
        events: new OpenLayers.Events(this),
    
        makeSameOrigin: function(url, proxy) {
        var sameOrigin = url.indexOf("http") !== 0;
        var urlParts = !sameOrigin && url.match(this.URL_SPLIT_REGEX);
        if (urlParts) {
            var location = window.location;
            sameOrigin =
                urlParts[1] == location.protocol &&
                urlParts[3] == location.hostname;
            var uPort = urlParts[4], lPort = location.port;
            if (uPort != 80 && uPort != "" || lPort != "80" && lPort != "") {
                sameOrigin = sameOrigin && uPort == lPort;
            }
        }
        if (!sameOrigin) {
            if (proxy) {
                if (typeof proxy == "function") {
                    url = proxy(url);
                } else {
                    url = proxy + encodeURIComponent(url);
                }
            }
        }
        return url;
    },

        issue: function(config) {        
        var defaultConfig = OpenLayers.Util.extend(
            this.DEFAULT_CONFIG,
            {proxy: OpenLayers.ProxyHost}
        );
        config = config || {};
        config.headers = config.headers || {};
        config = OpenLayers.Util.applyDefaults(config, defaultConfig);
        config.headers = OpenLayers.Util.applyDefaults(config.headers, defaultConfig.headers);
        var customRequestedWithHeader = false,
            headerKey;
        for(headerKey in config.headers) {
            if (config.headers.hasOwnProperty( headerKey )) {
                if (headerKey.toLowerCase() === 'x-requested-with') {
                    customRequestedWithHeader = true;
                }
            }
        }
        if (customRequestedWithHeader === false) {
            config.headers['X-Requested-With'] = 'XMLHttpRequest';
        }
        var request = new OpenLayers.Request.XMLHttpRequest();
        var url = OpenLayers.Util.urlAppend(config.url, 
            OpenLayers.Util.getParameterString(config.params || {}));
        url = OpenLayers.Request.makeSameOrigin(url, config.proxy);
        request.open(
            config.method, url, config.async, config.user, config.password
        );
        for(var header in config.headers) {
            request.setRequestHeader(header, config.headers[header]);
        }

        var events = this.events;
        var self = this;
        
        request.onreadystatechange = function() {
            if(request.readyState == OpenLayers.Request.XMLHttpRequest.DONE) {
                var proceed = events.triggerEvent(
                    "complete",
                    {request: request, config: config, requestUrl: url}
                );
                if(proceed !== false) {
                    self.runCallbacks(
                        {request: request, config: config, requestUrl: url}
                    );
                }
            }
        };
        if(config.async === false) {
            request.send(config.data);
        } else {
            window.setTimeout(function(){
                if (request.readyState !== 0) { // W3C: 0-UNSENT
                    request.send(config.data);
                }
            }, 0);
        }
        return request;
    },
    
        runCallbacks: function(options) {
        var request = options.request;
        var config = options.config;
        var complete = (config.scope) ?
            OpenLayers.Function.bind(config.callback, config.scope) :
            config.callback;
        var success;
        if(config.success) {
            success = (config.scope) ?
                OpenLayers.Function.bind(config.success, config.scope) :
                config.success;
        }
        var failure;
        if(config.failure) {
            failure = (config.scope) ?
                OpenLayers.Function.bind(config.failure, config.scope) :
                config.failure;
        }

        if (OpenLayers.Util.createUrlObject(config.url).protocol == "file:" &&
                                                        request.responseText) {
            request.status = 200;
        }
        complete(request);

        if (!request.status || (request.status >= 200 && request.status < 300)) {
            this.events.triggerEvent("success", options);
            if(success) {
                success(request);
            }
        }
        if(request.status && (request.status < 200 || request.status >= 300)) {                    
            this.events.triggerEvent("failure", options);
            if(failure) {
                failure(request);
            }
        }
    },
    
        GET: function(config) {
        config = OpenLayers.Util.extend(config, {method: "GET"});
        return OpenLayers.Request.issue(config);
    },
    
        POST: function(config) {
        config = OpenLayers.Util.extend(config, {method: "POST"});
        config.headers = config.headers ? config.headers : {};
        if(!("CONTENT-TYPE" in OpenLayers.Util.upperCaseObject(config.headers))) {
            config.headers["Content-Type"] = "application/xml";
        }
        return OpenLayers.Request.issue(config);
    },
    
        PUT: function(config) {
        config = OpenLayers.Util.extend(config, {method: "PUT"});
        config.headers = config.headers ? config.headers : {};
        if(!("CONTENT-TYPE" in OpenLayers.Util.upperCaseObject(config.headers))) {
            config.headers["Content-Type"] = "application/xml";
        }
        return OpenLayers.Request.issue(config);
    },
    
        DELETE: function(config) {
        config = OpenLayers.Util.extend(config, {method: "DELETE"});
        return OpenLayers.Request.issue(config);
    },
  
        HEAD: function(config) {
        config = OpenLayers.Util.extend(config, {method: "HEAD"});
        return OpenLayers.Request.issue(config);
    },
    
        OPTIONS: function(config) {
        config = OpenLayers.Util.extend(config, {method: "OPTIONS"});
        return OpenLayers.Request.issue(config);
    }

});
