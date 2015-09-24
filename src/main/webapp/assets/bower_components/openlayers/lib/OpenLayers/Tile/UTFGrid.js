/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Tile.UTFGrid = OpenLayers.Class(OpenLayers.Tile, {

        url: null,
    
        utfgridResolution: 2,
    
        json: null,
    
        format: null,

    
        destroy: function() {
        this.clear();
        OpenLayers.Tile.prototype.destroy.apply(this, arguments);
    },
    
        draw: function() {
        var drawn = OpenLayers.Tile.prototype.draw.apply(this, arguments);
        if (drawn) {
            if (this.isLoading) {
                this.abortLoading();
                this.events.triggerEvent("reload"); 
            } else {
                this.isLoading = true;
                this.events.triggerEvent("loadstart");
            }
            this.url = this.layer.getURL(this.bounds);

            if (this.layer.useJSONP) {
                var ols = new OpenLayers.Protocol.Script({
                    url: this.url,
                    callback: function(response) {
                        this.isLoading = false;
                        this.events.triggerEvent("loadend");
                        this.json = response.data;
                    },
                    scope: this
                });
                ols.read();
                this.request = ols;
            } else {
                this.request = OpenLayers.Request.GET({
                    url: this.url,
                    callback: function(response) {
                        this.isLoading = false;
                        this.events.triggerEvent("loadend");
                        if (response.status === 200) {
                            this.parseData(response.responseText);
                        }
                    },
                    scope: this
                });
            }
        } else {
            this.unload();
        }
        return drawn;
    },
    
        abortLoading: function() {
        if (this.request) {
            this.request.abort();
            delete this.request;
        }
        this.isLoading = false;
    },
    
        getFeatureInfo: function(i, j) {
        var info = null;
        if (this.json) {
            var id = this.getFeatureId(i, j);
            if (id !== null) {
                info = {id: id, data: this.json.data[id]};
            }
        }
        return info;
    },
    
        getFeatureId: function(i, j) {
        var id = null;
        if (this.json) {
            var resolution = this.utfgridResolution;
            var row = Math.floor(j / resolution);
            var col = Math.floor(i / resolution);
            var charCode = this.json.grid[row].charCodeAt(col);
            var index = this.indexFromCharCode(charCode);
            var keys = this.json.keys;
            if (!isNaN(index) && (index in keys)) {
                id = keys[index];
            }
        }
        return id;
    },
    
        indexFromCharCode: function(charCode) {
        if (charCode >= 93) {
            charCode--;
        }
        if (charCode >= 35) {
            charCode --;
        }
        return charCode - 32;
    },
    
        parseData: function(str) {
        if (!this.format) {
            this.format = new OpenLayers.Format.JSON();
        }
        this.json = this.format.read(str);
    },
    
        clear: function() {
        this.json = null;
    },
    
    CLASS_NAME: "OpenLayers.Tile.UTFGrid"

});
