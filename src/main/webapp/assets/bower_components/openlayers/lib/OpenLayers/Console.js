/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Console = {
        
        log: function() {},

        debug: function() {},

        info: function() {},

        warn: function() {},

        error: function() {},
    
        userError: function(error) {
        alert(error);
    },

        assert: function() {},

        dir: function() {},

        dirxml: function() {},

        trace: function() {},

        group: function() {},

        groupEnd: function() {},
    
        time: function() {},

        timeEnd: function() {},

        profile: function() {},

        profileEnd: function() {},

        count: function() {},

    CLASS_NAME: "OpenLayers.Console"
};

(function() {
        var scripts = document.getElementsByTagName("script");
    for(var i=0, len=scripts.length; i<len; ++i) {
        if(scripts[i].src.indexOf("firebug.js") != -1) {
            if(console) {
                OpenLayers.Util.extend(OpenLayers.Console, console);
                break;
            }
        }
    }
})();
