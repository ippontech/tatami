/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Layer.Text = OpenLayers.Class(OpenLayers.Layer.Markers, {

        location:null,

        features: null,
    
        formatOptions: null, 

        selectedFeature: null,

        initialize: function(name, options) {
        OpenLayers.Layer.Markers.prototype.initialize.apply(this, arguments);
        this.features = [];
    },

        destroy: function() {
        OpenLayers.Layer.Markers.prototype.destroy.apply(this, arguments);
        this.clearFeatures();
        this.features = null;
    },
    
        loadText: function() {
        if (!this.loaded) {
            if (this.location != null) {

                var onFail = function(e) {
                    this.events.triggerEvent("loadend");
                };

                this.events.triggerEvent("loadstart");
                OpenLayers.Request.GET({
                    url: this.location,
                    success: this.parseData,
                    failure: onFail,
                    scope: this
                });
                this.loaded = true;
            }
        }    
    },    
    
        moveTo:function(bounds, zoomChanged, minor) {
        OpenLayers.Layer.Markers.prototype.moveTo.apply(this, arguments);
        if(this.visibility && !this.loaded){
            this.loadText();
        }
    },
    
        parseData: function(ajaxRequest) {
        var text = ajaxRequest.responseText;
        
        var options = {};
        
        OpenLayers.Util.extend(options, this.formatOptions);
        
        if (this.map && !this.projection.equals(this.map.getProjectionObject())) {
            options.externalProjection = this.projection;
            options.internalProjection = this.map.getProjectionObject();
        }    
        
        var parser = new OpenLayers.Format.Text(options);
        var features = parser.read(text);
        for (var i=0, len=features.length; i<len; i++) {
            var data = {};
            var feature = features[i];
            var location;
            var iconSize, iconOffset;
            
            location = new OpenLayers.LonLat(feature.geometry.x, 
                                             feature.geometry.y);
            
            if (feature.style.graphicWidth 
                && feature.style.graphicHeight) {
                iconSize = new OpenLayers.Size(
                    feature.style.graphicWidth,
                    feature.style.graphicHeight);
            }        
                        if (feature.style.graphicXOffset !== undefined
                && feature.style.graphicYOffset !== undefined) {
                iconOffset = new OpenLayers.Pixel(
                    feature.style.graphicXOffset, 
                    feature.style.graphicYOffset);
            }
            
            if (feature.style.externalGraphic != null) {
                data.icon = new OpenLayers.Icon(feature.style.externalGraphic, 
                                                iconSize, 
                                                iconOffset);
            } else {
                data.icon = OpenLayers.Marker.defaultIcon();
                if (iconSize != null) {
                    data.icon.setSize(iconSize);
                }
            }
            
            if ((feature.attributes.title != null) 
                && (feature.attributes.description != null)) {
                data['popupContentHTML'] = 
                    '<h2>'+feature.attributes.title+'</h2>' + 
                    '<p>'+feature.attributes.description+'</p>';
            }
            
            data['overflow'] = feature.attributes.overflow || "auto"; 
            
            var markerFeature = new OpenLayers.Feature(this, location, data);
            this.features.push(markerFeature);
            var marker = markerFeature.createMarker();
            if ((feature.attributes.title != null) 
                && (feature.attributes.description != null)) {
              marker.events.register('click', markerFeature, this.markerClick);
            }
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
            this.layer.map.addPopup(this.createPopup()); 
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

    CLASS_NAME: "OpenLayers.Layer.Text"
});
