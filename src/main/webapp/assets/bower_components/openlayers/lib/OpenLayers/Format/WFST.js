/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.WFST = function(options) {
    options = OpenLayers.Util.applyDefaults(
        options, OpenLayers.Format.WFST.DEFAULTS
    );
    var cls = OpenLayers.Format.WFST["v"+options.version.replace(/\./g, "_")];
    if(!cls) {
        throw "Unsupported WFST version: " + options.version;
    }
    return new cls(options);
};

OpenLayers.Format.WFST.DEFAULTS = {
    "version": "1.0.0"
};
