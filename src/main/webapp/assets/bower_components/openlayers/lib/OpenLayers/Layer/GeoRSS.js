/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Layer.GeoRSS = OpenLayers.Class(OpenLayers.Layer.Markers, {

        location: null,

        features: null,
    
        formatOptions: null, 

        selectedFeature: null,

        icon: null,

        popupSize: null, 
    
        useFeedTitle: true,
    
        initialize: function(name, location, options) {
        OpenLayers.Layer.Markers.prototype.initialize.apply(this, [name, options]);
        this.location = location;
        this.features = [];
    },

        destroy: function() {
        OpenLayers.Layer.Markers.prototype.destroy.apply(this, arguments);
        this.clearFeatures();
        this.features = null;
    },

        loadRSS: function() {
        if (!this.loaded) {
            this.events.triggerEvent("loadstart");
            OpenLayers.Request.GET({
                url: this.location,
                success: this.parseData,
                scope: this
            });
            this.loaded = true;
        }    
    },    
    
        moveTo:function(bounds, zoomChanged, minor) {
        OpenLayers.Layer.Markers.prototype.moveTo.apply(this, arguments);
        if(this.visibility && !this.loaded){
            this.loadRSS();
        }
    },
        
        parseData: function(ajaxRequest) {
        var doc = ajaxRequest.responseXML;
        if (!doc || !doc.documentElement) {
            doc = OpenLayers.Format.XML.prototype.read(ajaxRequest.responseText);
        }
        
        if (this.useFeedTitle) {
            var name = null;
            try {
                name = doc.getElementsByTagNameNS('*', 'title')[0].firstChild.nodeValue;
            }
            catch (e) {
                name = doc.getElementsByTagName('title')[0].firstChild.nodeValue;
            }
            if (name) {
                this.setName(name);
            }    
        }
       
        var options = {};
        
        OpenLayers.Util.extend(options, this.formatOptions);
        
        if (this.map && !this.projection.equals(this.map.getProjectionObject())) {
            options.externalProjection = this.projection;
            options.internalProjection = this.map.getProjectionObject();
        }    
        
        var format = new OpenLayers.Format.GeoRSS(options);
        var features = format.read(doc);
        
        for (var i=0, len=features.length; i<len; i++) {
            var data = {};
            var feature = features[i];
            if (!feature.geometry) {
                continue;
            }    
            
            var title = feature.attributes.title ? 
                         feature.attributes.title : "Untitled";
            
            var description = feature.attributes.description ? 
                         feature.attributes.description : "No description.";
            
            var link = feature.attributes.link ? feature.attributes.link : "";

            var location = feature.geometry.getBounds().getCenterLonLat();
            
            
            data.icon = this.icon == null ? 
                                     OpenLayers.Marker.defaultIcon() : 
                                     this.icon.clone();
            
            data.popupSize = this.popupSize ? 
                             this.popupSize.clone() :
                             new OpenLayers.Size(250, 120);
            
            if (title || description) {
                data.title = title;
                data.description = description;
            
                var contentHTML = '<div class="olLayerGeoRSSClose">[x]</div>'; 
                contentHTML += '<div class="olLayerGeoRSSTitle">';
                if (link) {
                    contentHTML += '<a class="link" href="'+link+'" target="_blank">';
                }
                contentHTML += title;
                if (link) {
                    contentHTML += '</a>';
                }
                contentHTML += '</div>';
                contentHTML += '<div style="" class="olLayerGeoRSSDescription">';
                contentHTML += description;
                contentHTML += '</div>';
                data['popupContentHTML'] = contentHTML;                
            }
            var feature = new OpenLayers.Feature(this, location, data);
            this.features.push(feature);
            var marker = feature.createMarker();
            marker.events.register('click', feature, this.markerClick);
            this.addMarker(marker);
        }
        this.events.triggerEvent("loadend");
    },
    
        markerClick: function(evt) {
        var sameMarkerClicked = (this == this.layer.selectedFeature);
        this.layer.selectedFeature = (!sameMarkerClicked) ? this : null;
        for(var i=0, len=this.layer.map.popups.length; i<len; i++) {
            this.layer.map.removePopup(this.layer.map.popups[i]);
        }
        if (!sameMarkerClicked) {
            var popup = this.createPopup();
            OpenLayers.Event.observe(popup.div, "click",
                OpenLayers.Function.bind(function() { 
                    for(var i=0, len=this.layer.map.popups.length; i<len; i++) { 
                        this.layer.map.removePopup(this.layer.map.popups[i]); 
                    }
                }, this)
            );
            this.layer.map.addPopup(popup); 
        }
        OpenLayers.Event.stop(evt);
    },

        clearFeatures: function() {
        if (this.features != null) {
            while(this.features.length > 0) {
                var feature = this.features[0];
                OpenLayers.Util.removeItem(this.features, feature);
                feature.destroy();
            }
        }        
    },
    
    CLASS_NAME: "OpenLayers.Layer.GeoRSS"
});
