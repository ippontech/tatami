/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Layer.MapGuide = OpenLayers.Class(OpenLayers.Layer.Grid, {

        isBaseLayer: true,
    
        useHttpTile: false,
    
        singleTile: false,
    
        useOverlay: false,
    
        useAsyncOverlay: true,
    
        TILE_PARAMS: {
         operation: 'GETTILEIMAGE',
         version: '1.2.0'
    },

        SINGLE_TILE_PARAMS: {
        operation: 'GETMAPIMAGE',
        format: 'PNG',
        locale: 'en',
        clip: '1',
        version: '1.0.0'
    },
    
        OVERLAY_PARAMS: {
        operation: 'GETDYNAMICMAPOVERLAYIMAGE',
        format: 'PNG',
        locale: 'en',
        clip: '1',
        version: '2.0.0'
    },
    
        FOLDER_PARAMS: {
        tileColumnsPerFolder: 30,
        tileRowsPerFolder: 30,
        format: 'png',
        querystring: null
    },

        defaultSize: new OpenLayers.Size(300,300),

        tileOriginCorner: "tl",

        initialize: function(name, url, params, options) {
        
        OpenLayers.Layer.Grid.prototype.initialize.apply(this, arguments);
        if (options == null || options.isBaseLayer == null) {
            this.isBaseLayer = ((this.transparent != "true") && 
                                (this.transparent != true));
        }

        if (options && options.useOverlay!=null) {
          this.useOverlay = options.useOverlay;
        }
        if (this.singleTile) {
          if (this.useOverlay) {
            OpenLayers.Util.applyDefaults(
                           this.params,
                           this.OVERLAY_PARAMS
                           );
            if (!this.useAsyncOverlay) {
              this.params.version = "1.0.0";
            }
          } else {
            OpenLayers.Util.applyDefaults(
                           this.params,
                           this.SINGLE_TILE_PARAMS
                           );
          }         
        } else {
            if (this.useHttpTile) {
                OpenLayers.Util.applyDefaults(
                               this.params,
                               this.FOLDER_PARAMS
                               );
            } else {
                OpenLayers.Util.applyDefaults(
                               this.params,
                               this.TILE_PARAMS
                               );
            }
            this.setTileSize(this.defaultSize); 
        }
    },

        clone: function (obj) {
      if (obj == null) {
            obj = new OpenLayers.Layer.MapGuide(this.name,
                                           this.url,
                                           this.params,
                                           this.getOptions());
      }
      obj = OpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);

      return obj;
    },

        getURL: function (bounds) {
        var url;
        var center = bounds.getCenterLonLat();
        var mapSize = this.map.getSize();

        if (this.singleTile) {
          var params = {
            setdisplaydpi: OpenLayers.DOTS_PER_INCH,
            setdisplayheight: mapSize.h*this.ratio,
            setdisplaywidth: mapSize.w*this.ratio,
            setviewcenterx: center.lon,
            setviewcentery: center.lat,
            setviewscale: this.map.getScale()
          };
          
          if (this.useOverlay && !this.useAsyncOverlay) {
            var getVisParams = {};
            getVisParams = OpenLayers.Util.extend(getVisParams, params);
            getVisParams.operation = "GETVISIBLEMAPEXTENT";
            getVisParams.version = "1.0.0";
            getVisParams.session = this.params.session;
            getVisParams.mapName = this.params.mapName;
            getVisParams.format = 'text/xml';
            url = this.getFullRequestString( getVisParams );
            
            OpenLayers.Request.GET({url: url, async: false});
          }
          url = this.getFullRequestString( params );
        } else {
          var currentRes = this.map.getResolution();
          var colidx = Math.floor((bounds.left-this.maxExtent.left)/currentRes);
          colidx = Math.round(colidx/this.tileSize.w);
          var rowidx = Math.floor((this.maxExtent.top-bounds.top)/currentRes);
          rowidx = Math.round(rowidx/this.tileSize.h);

          if (this.useHttpTile){
              url = this.getImageFilePath(
                   {
                       tilecol: colidx,
                       tilerow: rowidx,
                       scaleindex: this.resolutions.length - this.map.zoom - 1
                    });

          } else {
            url = this.getFullRequestString(
                   {
                       tilecol: colidx,
                       tilerow: rowidx,
                       scaleindex: this.resolutions.length - this.map.zoom - 1
                    });
          }
       }
       return url;
    },

        getFullRequestString:function(newParams, altUrl) {
        var url = (altUrl == null) ? this.url : altUrl;
        if (typeof url == "object") {
            url = url[Math.floor(Math.random()*url.length)];
        }   
        var requestString = url;        
        var allParams = OpenLayers.Util.extend({}, this.params);
        allParams = OpenLayers.Util.extend(allParams, newParams);
        var urlParams = OpenLayers.Util.upperCaseObject(
                            OpenLayers.Util.getParameters(url));
        for(var key in allParams) {
            if(key.toUpperCase() in urlParams) {
                delete allParams[key];
            }
        }
        var paramsString = OpenLayers.Util.getParameterString(allParams);
        
        /* MapGuide needs '+' separating things like bounds/height/width.
           Since typically this is URL encoded, we use a slight hack: we
           depend on the list-like functionality of getParameterString to
           leave ',' only in the case of list items (since otherwise it is
           encoded) then do a regular expression replace on the , characters
           to '+' */
        paramsString = paramsString.replace(/,/g, "+");
        
        if (paramsString != "") {
            var lastServerChar = url.charAt(url.length - 1);
            if ((lastServerChar == "&") || (lastServerChar == "?")) {
                requestString += paramsString;
            } else {
                if (url.indexOf('?') == -1) {
                    requestString += '?' + paramsString;
                } else {
                    requestString += '&' + paramsString;
                }
            }
        }
        return requestString;
    },

         getImageFilePath:function(newParams, altUrl) {
        var url = (altUrl == null) ? this.url : altUrl;
        if (typeof url == "object") {
            url = url[Math.floor(Math.random()*url.length)];
        }   
        var requestString = url;        

        var tileRowGroup = "";
        var tileColGroup = "";
        
        if (newParams.tilerow < 0) {
          tileRowGroup =  '-';
        }
          
        if (newParams.tilerow == 0 ) {
          tileRowGroup += '0';
        } else {
          tileRowGroup += Math.floor(Math.abs(newParams.tilerow/this.params.tileRowsPerFolder)) * this.params.tileRowsPerFolder;
        }
          
        if (newParams.tilecol < 0) {
          tileColGroup =  '-';
        }
        
        if (newParams.tilecol == 0) {
          tileColGroup += '0';
        } else {
          tileColGroup += Math.floor(Math.abs(newParams.tilecol/this.params.tileColumnsPerFolder)) * this.params.tileColumnsPerFolder;
        }
        
        var tilePath = '/S' + Math.floor(newParams.scaleindex)
                + '/' + this.params.basemaplayergroupname
                + '/R' + tileRowGroup
                + '/C' + tileColGroup
                + '/' + (newParams.tilerow % this.params.tileRowsPerFolder) 
                + '_' + (newParams.tilecol % this.params.tileColumnsPerFolder) 
                + '.' + this.params.format;
    
        if (this.params.querystring) {
               tilePath += "?" + this.params.querystring;
        }
        
        requestString += tilePath;
        return requestString;
    },
    
    CLASS_NAME: "OpenLayers.Layer.MapGuide"
});
