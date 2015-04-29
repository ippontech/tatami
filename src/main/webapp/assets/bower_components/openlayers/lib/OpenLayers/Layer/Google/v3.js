/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */



OpenLayers.Layer.Google.v3 = {
    
        DEFAULTS: {
        sphericalMercator: true,
        projection: "EPSG:900913"
    },

        animationEnabled: true, 

        loadMapObject: function() {
        if (!this.type) {
            this.type = google.maps.MapTypeId.ROADMAP;
        }
        var mapObject;
        var cache = OpenLayers.Layer.Google.cache[this.map.id];
        if (cache) {
            mapObject = cache.mapObject;
            ++cache.count;
        } else {
            var center = this.map.getCenter();
            var container = document.createElement('div');
            container.className = "olForeignContainer";
            container.style.width = '100%';
            container.style.height = '100%';
            mapObject = new google.maps.Map(container, {
                center: center ?
                    new google.maps.LatLng(center.lat, center.lon) :
                    new google.maps.LatLng(0, 0),
                zoom: this.map.getZoom() || 0,
                mapTypeId: this.type,
                disableDefaultUI: true,
                keyboardShortcuts: false,
                draggable: false,
                disableDoubleClickZoom: true,
                scrollwheel: false,
                streetViewControl: false,
                tilt: (this.useTiltImages ? 45: 0)
            });
            var googleControl = document.createElement('div');
            googleControl.style.width = '100%';
            googleControl.style.height = '100%';
            mapObject.controls[google.maps.ControlPosition.TOP_LEFT].push(googleControl);
            cache = {
                googleControl: googleControl,
                mapObject: mapObject,
                count: 1
            };
            OpenLayers.Layer.Google.cache[this.map.id] = cache;
        }
        this.mapObject = mapObject;
        this.setGMapVisibility(this.visibility);
    },
    
        onMapResize: function() {
        if (this.visibility) {
            google.maps.event.trigger(this.mapObject, "resize");
        }
    },

        setGMapVisibility: function(visible) {
        var cache = OpenLayers.Layer.Google.cache[this.map.id];
        var map = this.map;
        if (cache) {
            var type = this.type;
            var layers = map.layers;
            var layer;
            for (var i=layers.length-1; i>=0; --i) {
                layer = layers[i];
                if (layer instanceof OpenLayers.Layer.Google &&
                            layer.visibility === true && layer.inRange === true) {
                    type = layer.type;
                    visible = true;
                    break;
                }
            }
            var container = this.mapObject.getDiv();
            if (visible === true) {
                if (container.parentNode !== map.div) {
                    if (!cache.rendered) {
                        var me = this;
                        google.maps.event.addListenerOnce(this.mapObject, 'tilesloaded', function() {
                            cache.rendered = true;
                            me.setGMapVisibility(me.getVisibility());
                            me.moveTo(me.map.getCenter());
                        });
                    } else {
                        map.div.appendChild(container);
                        cache.googleControl.appendChild(map.viewPortDiv);
                        google.maps.event.trigger(this.mapObject, 'resize');
                    }
                }
                this.mapObject.setMapTypeId(type);                
            } else if (cache.googleControl.hasChildNodes()) {
                map.div.appendChild(map.viewPortDiv);
                map.div.removeChild(container);
            }
        }
    },
    
        getMapContainer: function() {
        return this.mapObject.getDiv();
    },

        getMapObjectBoundsFromOLBounds: function(olBounds) {
        var moBounds = null;
        if (olBounds != null) {
            var sw = this.sphericalMercator ? 
              this.inverseMercator(olBounds.bottom, olBounds.left) : 
              new OpenLayers.LonLat(olBounds.bottom, olBounds.left);
            var ne = this.sphericalMercator ? 
              this.inverseMercator(olBounds.top, olBounds.right) : 
              new OpenLayers.LonLat(olBounds.top, olBounds.right);
            moBounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(sw.lat, sw.lon),
                new google.maps.LatLng(ne.lat, ne.lon)
            );
        }
        return moBounds;
    },
  
        getMapObjectLonLatFromMapObjectPixel: function(moPixel) {
        var size = this.map.getSize();
        var lon = this.getLongitudeFromMapObjectLonLat(this.mapObject.center);
        var lat = this.getLatitudeFromMapObjectLonLat(this.mapObject.center);
        var res = this.map.getResolution();

        var delta_x = moPixel.x - (size.w / 2);
        var delta_y = moPixel.y - (size.h / 2);
    
        var lonlat = new OpenLayers.LonLat(
            lon + delta_x * res,
            lat - delta_y * res
        ); 

        if (this.wrapDateLine) {
            lonlat = lonlat.wrapDateLine(this.maxExtent);
        }
        return this.getMapObjectLonLatFromLonLat(lonlat.lon, lonlat.lat);
    },

        getMapObjectPixelFromMapObjectLonLat: function(moLonLat) {
        var lon = this.getLongitudeFromMapObjectLonLat(moLonLat);
        var lat = this.getLatitudeFromMapObjectLonLat(moLonLat);
        var res = this.map.getResolution();
        var extent = this.map.getExtent();
        return this.getMapObjectPixelFromXY((1/res * (lon - extent.left)),
                                            (1/res * (extent.top - lat)));
    },

  
        setMapObjectCenter: function(center, zoom) {
        if (this.animationEnabled === false && zoom != this.mapObject.zoom) {
            var mapContainer = this.getMapContainer();
            google.maps.event.addListenerOnce(
                this.mapObject, 
                "idle", 
                function() {
                    mapContainer.style.visibility = "";
                }
            );
            mapContainer.style.visibility = "hidden";
        }
        this.mapObject.setOptions({
            center: center,
            zoom: zoom
        });
    },
  
        getMapObjectZoomFromMapObjectBounds: function(moBounds) {
        return this.mapObject.getBoundsZoomLevel(moBounds);
    },
    
        getMapObjectLonLatFromLonLat: function(lon, lat) {
        var gLatLng;
        if(this.sphericalMercator) {
            var lonlat = this.inverseMercator(lon, lat);
            gLatLng = new google.maps.LatLng(lonlat.lat, lonlat.lon);
        } else {
            gLatLng = new google.maps.LatLng(lat, lon);
        }
        return gLatLng;
    },
    
        getMapObjectPixelFromXY: function(x, y) {
        return new google.maps.Point(x, y);
    }
    
};
