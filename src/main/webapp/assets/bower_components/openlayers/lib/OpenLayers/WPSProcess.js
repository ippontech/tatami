/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.WPSProcess = OpenLayers.Class({
    
        client: null,
    
        server: null,
    
        identifier: null,
    
        description: null,
    
        localWPS: 'http://geoserver/wps',
    
        formats: null,
    
        chained: 0,
    
        executeCallbacks: null,
    
        initialize: function(options) {
        OpenLayers.Util.extend(this, options);        
        this.executeCallbacks = [];
        this.formats = {
            'application/wkt': new OpenLayers.Format.WKT(),
            'application/json': new OpenLayers.Format.GeoJSON()
        };
    },
    
        describe: function(options) {
        options = options || {};
        if (!this.description) {
            this.client.describeProcess(this.server, this.identifier, function(description) {
                if (!this.description) {
                    this.parseDescription(description);
                }
                if (options.callback) {
                    options.callback.call(options.scope, this.description);
                }
            }, this);
        } else if (options.callback) {
            var description = this.description;
            window.setTimeout(function() {
                options.callback.call(options.scope, description);
            }, 0);
        }
    },
    
        configure: function(options) {
        this.describe({
            callback: function() {
                var description = this.description,
                    inputs = options.inputs,
                    input, i, ii;
                for (i=0, ii=description.dataInputs.length; i<ii; ++i) {
                    input = description.dataInputs[i];
                    this.setInputData(input, inputs[input.identifier]);
                }
                if (options.callback) {
                    options.callback.call(options.scope);
                }
            },
            scope: this
        });
        return this;
    },
    
        execute: function(options) {
        this.configure({
            inputs: options.inputs,
            callback: function() {
                var me = this;
                var outputIndex = this.getOutputIndex(
                    me.description.processOutputs, options.output
                );
                me.setResponseForm({outputIndex: outputIndex});
                (function callback() {
                    OpenLayers.Util.removeItem(me.executeCallbacks, callback);
                    if (me.chained !== 0) {
                        me.executeCallbacks.push(callback);
                        return;
                    }
                    OpenLayers.Request.POST({
                        url: me.client.servers[me.server].url,
                        data: new OpenLayers.Format.WPSExecute().write(me.description),
                        success: function(response) {
                            var output = me.description.processOutputs[outputIndex];
                            var result;
                            if (output.literalOutput) {
                                 if (output.literalOutput.dataType === "boolean") {
                                   result = (OpenLayers.String.trim(
                                       response.responseText).toLowerCase() === 'true');
                                 } else if (output.literalOutput.dataType === "double") {
                                   result = parseFloat(response.responseText);
                                 } else {
                                   result = response.responseText;
                                 }
                            } else if (output.complexOutput) {
                                var mimeType = me.findMimeType(
                                    output.complexOutput.supported.formats
                                );
                                result = me.formats[mimeType].read(response.responseText);
                                if (result instanceof OpenLayers.Feature.Vector) {
                                    result = [result];
                                }
                            }
                            if (options.success) {
                                var outputs = {};
                                outputs[options.output || 'result'] = result;
                                options.success.call(options.scope, outputs);
                            }
                        },
                        scope: me
                    });
                })();
            },
            scope: this
        });
    },
    
        output: function(identifier) {
        return new OpenLayers.WPSProcess.ChainLink({
            process: this,
            output: identifier
        });
    },
    
        parseDescription: function(description) {
        var server = this.client.servers[this.server];
        this.description = new OpenLayers.Format.WPSDescribeProcess()
            .read(server.processDescription[this.identifier])
            .processDescriptions[this.identifier];
    },
    
        setInputData: function(input, data) {
        delete input.data;
        delete input.reference;
        if (data instanceof OpenLayers.WPSProcess.ChainLink) {
            ++this.chained;
            input.reference = {
                method: 'POST',
                href: data.process.server === this.server ?
                    this.localWPS : this.client.servers[data.process.server].url
            };
            data.process.describe({
                callback: function() {
                    --this.chained;
                    this.chainProcess(input, data);
                },
                scope: this
            });
        } else {
            input.data = {};
            var complexData = input.complexData;
            if (complexData) {
                var format = this.findMimeType(complexData.supported.formats);
                input.data.complexData = {
                    mimeType: format,
                    value: this.formats[format].write(this.toFeatures(data))
                };
            } else {
                input.data.literalData = {
                    value: data
                };
            }
        }
    },
    
        setResponseForm: function(options) {
        options = options || {};
        var output = this.description.processOutputs[options.outputIndex || 0];
        var mimeType;
        if (output.complexOutput) {
            mimeType = this.findMimeType(output.complexOutput.supported.formats, options.supportedFormats);
        }
        this.description.responseForm = {
            rawDataOutput: {
                identifier: output.identifier,
                mimeType: mimeType
            }
        };
    },
    
        getOutputIndex: function(outputs, identifier) {
        var output;
        if (identifier) {
            for (var i=outputs.length-1; i>=0; --i) {
                if (outputs[i].identifier === identifier) {
                    output = i;
                    break;
                }
            }
        } else {
            output = 0;
        }
        return output;
    },
    
        chainProcess: function(input, chainLink) {
        var output = this.getOutputIndex(
            chainLink.process.description.processOutputs, chainLink.output
        );
        input.reference.mimeType = this.findMimeType(
            input.complexData.supported.formats,
            chainLink.process.description.processOutputs[output].complexOutput.supported.formats
        );
        var formats = {};
        formats[input.reference.mimeType] = true;
        chainLink.process.setResponseForm({
            outputIndex: output,
            supportedFormats: formats
        });
        input.reference.body = chainLink.process.description;
        while (this.executeCallbacks.length > 0) {
            this.executeCallbacks[0]();
        }
    },
    
        toFeatures: function(source) {
        var isArray = OpenLayers.Util.isArray(source);
        if (!isArray) {
            source = [source];
        }
        var target = new Array(source.length),
            current;
        for (var i=0, ii=source.length; i<ii; ++i) {
            current = source[i];
            target[i] = current instanceof OpenLayers.Feature.Vector ?
                current : new OpenLayers.Feature.Vector(current);
        }
        return isArray ? target : target[0];
    },
    
        findMimeType: function(sourceFormats, targetFormats) {
        targetFormats = targetFormats || this.formats;
        for (var f in sourceFormats) {
            if (f in targetFormats) {
                return f;
            }
        }
    },
    
    CLASS_NAME: "OpenLayers.WPSProcess"
    
});

OpenLayers.WPSProcess.ChainLink = OpenLayers.Class({
    
        process: null,
    
        output: null,
    
        initialize: function(options) {
        OpenLayers.Util.extend(this, options);
    },
    
    CLASS_NAME: "OpenLayers.WPSProcess.ChainLink"
    
});
