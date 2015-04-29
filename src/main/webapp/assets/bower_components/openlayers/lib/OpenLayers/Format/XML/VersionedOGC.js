/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.XML.VersionedOGC = OpenLayers.Class(OpenLayers.Format.XML, {
    
        defaultVersion: null,
    
        version: null,

        profile: null,

        allowFallback: false,

        name: null,

        stringifyOutput: false,

        parser: null,

        initialize: function(options) {
        OpenLayers.Format.XML.prototype.initialize.apply(this, [options]);
        var className = this.CLASS_NAME;
        this.name = className.substring(className.lastIndexOf(".")+1);
    },

        getVersion: function(root, options) {
        var version;
        if (root) {
            version = this.version;
            if(!version) {
                version = root.getAttribute("version");
                if(!version) {
                    version = this.defaultVersion;
                }
            }
        } else { // write
            version = (options && options.version) || 
                this.version || this.defaultVersion;
        }
        return version;
    },

        getParser: function(version) {
        version = version || this.defaultVersion;
        var profile = this.profile ? "_" + this.profile : "";
        if(!this.parser || this.parser.VERSION != version) {
            var format = OpenLayers.Format[this.name][
                "v" + version.replace(/\./g, "_") + profile
            ];
            if(!format) {
                if (profile !== "" && this.allowFallback) {
                    profile = "";
                    format = OpenLayers.Format[this.name][
                        "v" + version.replace(/\./g, "_")
                    ];
                }
                if (!format) {
                    throw "Can't find a " + this.name + " parser for version " +
                          version + profile;
                }
            }
            this.parser = new format(this.options);
        }
        return this.parser;
    },

        write: function(obj, options) {
        var version = this.getVersion(null, options);
        this.parser = this.getParser(version);
        var root = this.parser.write(obj, options);
        if (this.stringifyOutput === false) {
            return root;
        } else {
            return OpenLayers.Format.XML.prototype.write.apply(this, [root]);
        }
    },

        read: function(data, options) {
        if(typeof data == "string") {
            data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
        }
        var root = data.documentElement;
        var version = this.getVersion(root);
        this.parser = this.getParser(version);          // Select the parser
        var obj = this.parser.read(data, options);      // Parse the data

        var errorProperty = this.parser.errorProperty || null;
        if (errorProperty !== null && obj[errorProperty] === undefined) {
            var format = new OpenLayers.Format.OGCExceptionReport();
            obj.error = format.read(data);
        }
        obj.version = version;
        obj.requestType = this.name;
        return obj;
    },

    CLASS_NAME: "OpenLayers.Format.XML.VersionedOGC"
});
