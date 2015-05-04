/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.WPSClient = OpenLayers.Class({
    
        servers: null,
    
        version: '1.0.0',
    
        lazy: false,
    
        events: null,
    
        initialize: function(options) {
        OpenLayers.Util.extend(this, options);
        this.events = new OpenLayers.Events(this);
        this.servers = {};
        for (var s in options.servers) {
            this.servers[s] = typeof options.servers[s] == 'string' ? {
                url: options.servers[s],
                version: this.version,
                processDescription: {}
            } : options.servers[s];
        }
    },
    
        execute: function(options) {
        var process = this.getProcess(options.server, options.process);
        process.execute({
            inputs: options.inputs,
            success: options.success,
            scope: options.scope
        });
    },
    
        getProcess: function(serverID, processID, options) {
        var process = new OpenLayers.WPSProcess({
            client: this,
            server: serverID,
            identifier: processID
        });
        if (!this.lazy) {
            process.describe(options);
        }
        return process;
    },
    
        describeProcess: function(serverID, processID, callback, scope) {
        var server = this.servers[serverID];
        if (!server.processDescription[processID]) {
            if (!(processID in server.processDescription)) {
                server.processDescription[processID] = null;
                OpenLayers.Request.GET({
                    url: server.url,
                    params: {
                        SERVICE: 'WPS',
                        VERSION: server.version,
                        REQUEST: 'DescribeProcess',
                        IDENTIFIER: processID
                    },
                    success: function(response) {
                        server.processDescription[processID] = response.responseText;
                        this.events.triggerEvent('describeprocess', {
                            identifier: processID,
                            raw: response.responseText
                        });
                        callback.call(scope, response.responseText);
                    },
                    scope: this
                });
            } else {
                this.events.register('describeprocess', this, function describe(evt) {
                    if (evt.identifier === processID) {
                        this.events.unregister('describeprocess', this, describe);
                        callback.call(scope, evt.raw);
                    }
                });
            }
        } else {
            window.setTimeout(function() {
                callback.call(scope, server.processDescription[processID]);
            }, 0);
        }
    },
    
        destroy: function() {
        this.events.destroy();
        this.events = null;
        this.servers = null;
    },
    
    CLASS_NAME: 'OpenLayers.WPSClient'
    
});
