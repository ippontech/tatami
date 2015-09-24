/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Layer.Bing = OpenLayers.Class(OpenLayers.Layer.XYZ, {

        key: null,

        serverResolutions: [
        156543.03390625, 78271.516953125, 39135.7584765625,
        19567.87923828125, 9783.939619140625, 4891.9698095703125,
        2445.9849047851562, 1222.9924523925781, 611.4962261962891,
        305.74811309814453, 152.87405654907226, 76.43702827453613,
        38.218514137268066, 19.109257068634033, 9.554628534317017,
        4.777314267158508, 2.388657133579254, 1.194328566789627,
        0.5971642833948135, 0.29858214169740677, 0.14929107084870338,
        0.07464553542435169, 0.03732276771218, 0.01866138385609
    ],
    
        attributionTemplate: '<span class="olBingAttribution ${type}">' +
         '<div><a target="_blank" href="http://www.bing.com/maps/">' +
         '<img src="${logo}" /></a></div>${copyrights}' +
         '<a style="white-space: nowrap" target="_blank" '+
         'href="http://www.microsoft.com/maps/product/terms.html">' +
         'Terms of Use</a></span>',

        metadata: null,

        protocolRegex: /^http:/i,
    
        type: "Road",
    
        culture: "en-US",
    
        metadataParams: null,

        tileOptions: null,

        protocol: ~window.location.href.indexOf('http') ? '' : 'http:',

        initialize: function(options) {
        options = OpenLayers.Util.applyDefaults({
            sphericalMercator: true
        }, options);
        var name = options.name || "Bing " + (options.type || this.type);
        
        var newArgs = [name, null, options];
        OpenLayers.Layer.XYZ.prototype.initialize.apply(this, newArgs);
        this.tileOptions = OpenLayers.Util.extend({
            crossOriginKeyword: 'anonymous'
        }, this.options.tileOptions);
        this.loadMetadata(); 
    },

        loadMetadata: function() {
        this._callbackId = "_callback_" + this.id.replace(/\./g, "_");
        window[this._callbackId] = OpenLayers.Function.bind(
            OpenLayers.Layer.Bing.processMetadata, this
        );
        var params = OpenLayers.Util.applyDefaults({
            key: this.key,
            jsonp: this._callbackId,
            include: "ImageryProviders"
        }, this.metadataParams);
        var url = this.protocol + "//dev.virtualearth.net/REST/v1/Imagery/Metadata/" +
            this.type + "?" + OpenLayers.Util.getParameterString(params);
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.id = this._callbackId;
        document.getElementsByTagName("head")[0].appendChild(script);
    },
    
        initLayer: function() {
        var res = this.metadata.resourceSets[0].resources[0];
        var url = res.imageUrl.replace("{quadkey}", "${quadkey}");
        url = url.replace("{culture}", this.culture);
        url = url.replace(this.protocolRegex, this.protocol);
        this.url = [];
        for (var i=0; i<res.imageUrlSubdomains.length; ++i) {
            this.url.push(url.replace("{subdomain}", res.imageUrlSubdomains[i]));
        }
        this.addOptions({
            maxResolution: Math.min(
                this.serverResolutions[res.zoomMin],
                this.maxResolution || Number.POSITIVE_INFINITY
            ),
            numZoomLevels: Math.min(
                res.zoomMax + 1 - res.zoomMin, this.numZoomLevels
            )
        }, true);
        if (!this.isBaseLayer) {
            this.redraw();
        }
        this.updateAttribution();
    },
    
        getURL: function(bounds) {
        if (!this.url) {
            return;
        }
        var xyz = this.getXYZ(bounds), x = xyz.x, y = xyz.y, z = xyz.z;
        var quadDigits = [];
        for (var i = z; i > 0; --i) {
            var digit = '0';
            var mask = 1 << (i - 1);
            if ((x & mask) != 0) {
                digit++;
            }
            if ((y & mask) != 0) {
                digit++;
                digit++;
            }
            quadDigits.push(digit);
        }
        var quadKey = quadDigits.join("");
        var url = this.selectUrl('' + x + y + z, this.url);

        return OpenLayers.String.format(url, {'quadkey': quadKey});
    },
    
        updateAttribution: function() {
        var metadata = this.metadata;
        if (!metadata.resourceSets || !this.map || !this.map.center) {
            return;
        }
        var res = metadata.resourceSets[0].resources[0];
        var extent = this.map.getExtent().transform(
            this.map.getProjectionObject(),
            new OpenLayers.Projection("EPSG:4326")
        );
        var providers = res.imageryProviders || [],
            zoom = OpenLayers.Util.indexOf(this.serverResolutions,
                                           this.getServerResolution()),
            copyrights = "", provider, i, ii, j, jj, bbox, coverage;
        for (i=0,ii=providers.length; i<ii; ++i) {
            provider = providers[i];
            for (j=0,jj=provider.coverageAreas.length; j<jj; ++j) {
                coverage = provider.coverageAreas[j];
                bbox = OpenLayers.Bounds.fromArray(coverage.bbox, true);
                if (extent.intersectsBounds(bbox) &&
                        zoom <= coverage.zoomMax && zoom >= coverage.zoomMin) {
                    copyrights += provider.attribution + " ";
                }
            }
        }
        var logo = metadata.brandLogoUri.replace(this.protocolRegex, this.protocol);
        this.attribution = OpenLayers.String.format(this.attributionTemplate, {
            type: this.type.toLowerCase(),
            logo: logo,
            copyrights: copyrights
        });
        this.map && this.map.events.triggerEvent("changelayer", {
            layer: this,
            property: "attribution"
        });
    },
    
        setMap: function() {
        OpenLayers.Layer.XYZ.prototype.setMap.apply(this, arguments);
        this.map.events.register("moveend", this, this.updateAttribution);
    },
    
        clone: function(obj) {
        if (obj == null) {
            obj = new OpenLayers.Layer.Bing(this.options);
        }
        obj = OpenLayers.Layer.XYZ.prototype.clone.apply(this, [obj]);
        return obj;
    },
    
        destroy: function() {
        this.map &&
            this.map.events.unregister("moveend", this, this.updateAttribution);
        OpenLayers.Layer.XYZ.prototype.destroy.apply(this, arguments);
    },
    
    CLASS_NAME: "OpenLayers.Layer.Bing"
});

OpenLayers.Layer.Bing.processMetadata = function(metadata) {
    this.metadata = metadata;
    this.initLayer();
    var script = document.getElementById(this._callbackId);
    script.parentNode.removeChild(script);
    window[this._callbackId] = undefined; // cannot delete from window in IE
    delete this._callbackId;
};
