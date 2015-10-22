/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Control.Graticule = OpenLayers.Class(OpenLayers.Control, {

        autoActivate: true,

        intervals: [90, 45, 30, 20, 10, 5, 2, 1,
        0.5, 0.2, 0.1, 0.05, 0.01,
        0.005, 0.002, 0.001
    ],

        intervalHeights: null,

        intervalHeightFactor: 1,

        displayInLayerSwitcher: true,

        visible: true,

        numPoints: 50,

        targetSize: 200,

        layerName: null,

        labelled: true,

        labelFormat: 'dm',

        labelLonYOffset: 2,

        labelLatXOffset: -2,

        lineSymbolizer: {
        strokeColor: "#333",
        strokeWidth: 1,
        strokeOpacity: 0.5
    },

        labelSymbolizer: null,

        gratLayer: null,

        epsg4326Projection: null,

        projection: null,

        projectionCenterLonLat: null,

        maxLat: Infinity,

        maxLon: Infinity,

        minLat: -Infinity,

        minLon: -Infinity,

        meridians: null,

        parallels: null,

        initialize: function(options) {
        options = options || {};
        options.layerName = options.layerName || OpenLayers.i18n("Graticule");
        OpenLayers.Control.prototype.initialize.apply(this, [options]);

        this.labelSymbolizer = {
            stroke: false,
            fill: false,
            label: "${label}",
            labelAlign: "${labelAlign}",
            labelXOffset: "${xOffset}",
            labelYOffset: "${yOffset}"
        };

        this.epsg4326Projection = new OpenLayers.Projection('EPSG:4326');
        this.parallels = [];
        this.meridians = [];
    },

        destroy: function() {
        this.deactivate();
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
        if (this.gratLayer) {
            this.gratLayer.destroy();
            this.gratLayer = null;
        }
    },

        draw: function() {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        if (!this.gratLayer) {
            var gratStyle = new OpenLayers.Style({}, {
                rules: [new OpenLayers.Rule({
                    'symbolizer': {
                        "Point": this.labelSymbolizer,
                        "Line": this.lineSymbolizer
                    }
                })]
            });
            this.gratLayer = new OpenLayers.Layer.Vector(this.layerName, {
                styleMap: new OpenLayers.StyleMap({
                    'default': gratStyle
                }),
                visibility: this.visible,
                displayInLayerSwitcher: this.displayInLayerSwitcher,
                renderers: ['Canvas', 'VML', 'SVG']
            });
        }
        return this.div;
    },

        activate: function() {
        if (OpenLayers.Control.prototype.activate.apply(this, arguments)) {
            this.map.addLayer(this.gratLayer);
            this.map.events.register('moveend', this, this.update);
            this.update();
            return true;
        } else {
            return false;
        }
    },

        deactivate: function() {
        if (OpenLayers.Control.prototype.deactivate.apply(this, arguments)) {
            this.map.events.unregister('moveend', this, this.update);
            this.map.removeLayer(this.gratLayer);
            return true;
        } else {
            return false;
        }
    },

        update: function() {
        var map = this.map;
        var extent = this.map.getExtent();
        if (!extent) {
            return;
        }
        var center = map.getCenter();
        var projection = map.getProjectionObject();
        var resolution = map.getResolution();
        var squaredTolerance = resolution * resolution / 4;

        var updateProjectionInfo = !this.projection || !this.projection.equals(projection);

        if (updateProjectionInfo) {
            this.updateProjectionInfo(projection);
        }

        this.createGraticule(extent, center, resolution, squaredTolerance);
        this.gratLayer.destroyFeatures();
        this.gratLayer.addFeatures(this.meridians);
        this.gratLayer.addFeatures(this.parallels);
        if (this.labelled) {
            var left = new OpenLayers.Geometry.LineString([
                new OpenLayers.Geometry.Point(extent.left, extent.bottom),
                new OpenLayers.Geometry.Point(extent.left, extent.top)
            ]);
            var top = new OpenLayers.Geometry.LineString([
                new OpenLayers.Geometry.Point(extent.left, extent.top),
                new OpenLayers.Geometry.Point(extent.right, extent.top)
            ]);
            var labels = [];
            var i, ii, line, labelPoint, split, labelAlign;
            for (i = 0, ii = this.meridians.length; i < ii; ++i) {
                line = this.meridians[i];
                labelPoint = line.attributes.labelPoint;
                labelAlign = 'cb';
                if (!labelPoint) {
                    split = line.geometry.split(left);
                    if (split) {
                        labelPoint = split[0].components[1];
                        labelAlign = 'lt';
                    }
                }
                if (labelPoint) {
                    labels.push(new OpenLayers.Feature.Vector(labelPoint, {
                        value: line.attributes.lon,
                        label: OpenLayers.Util.getFormattedLonLat(
                            line.attributes.lon, 'lon', this.labelFormat),
                        labelAlign: labelAlign,
                        xOffset: 0,
                        yOffset: this.labelLonYOffset
                    }));
                }
            }
            for (i = 0, ii = this.parallels.length; i < ii; ++i) {
                line = this.parallels[i];
                labelPoint = line.attributes.labelPoint;
                labelAlign = 'rb';
                if (!labelPoint) {
                    split = line.geometry.split(top);
                    if (split) {
                        labelPoint = split[0].components[1];
                        labelAlign = 'ct';
                    }
                }
                if (labelPoint) {
                    labels.push(new OpenLayers.Feature.Vector(labelPoint, {
                        value: line.attributes.lat,
                        label: OpenLayers.Util.getFormattedLonLat(
                            line.attributes.lat, 'lat', this.labelFormat),
                        labelAlign: labelAlign,
                        xOffset: this.labelLatXOffset,
                        yOffset: 2
                    }));
                }
            }
            this.gratLayer.addFeatures(labels);
        }
    },

        createGraticule: function(extent, center, resolution, squaredTolerance) {
        var centerLonLat = center.clone().transform(
            this.projection, this.epsg4326Projection);
        if (isNaN(centerLonLat.lon) || isNaN(centerLonLat.lat)) {
            centerLonLat = center.add(0.000000001, 0.000000001).transform(
                this.projection, this.epsg4326Projection);
        }
        var extentGeom = extent.toGeometry();
        var extent4326 = extent.clone()
            .transform(this.projection, this.epsg4326Projection);
        var minLon, minLat, maxLon, maxLat;
        var pixelSize = this.map.getGeodesicPixelSize();
        if (pixelSize.w < 0.5 && pixelSize.h < 0.5 &&
                extent4326.right > extent4326.left &&
                extent4326.top > extent4326.bottom &&
                Math.abs(extent4326.bottom) / extent4326.bottom ==
                Math.abs(extent4326.top) / extent4326.top &&
                Math.abs(extent4326.left) / extent4326.left ==
                Math.abs(extent4326.right) / extent4326.right) {
            minLon = Math.max(extent4326.left, this.minLon);
            minLat = Math.max(extent4326.bottom, this.minLat);
            maxLon = Math.min(extent4326.right, this.maxLon);
            maxLat = Math.min(extent4326.top, this.maxLat);
        } else {
            minLon = this.minLon;
            minLat = this.minLat;
            maxLon = this.maxLon;
            maxLat = this.maxLat;
        }

        var size = this.map.getSize();
        var idx, prevIdx, lon, lat, visibleIntervals, interval, intervalIndex;
        var centerLon, centerLat;
        visibleIntervals = Math.ceil(size.w / this.targetSize);
        intervalIndex = 0;
        do {
            interval = this.intervals[intervalIndex++];
            centerLon = Math.floor(centerLonLat.lon / interval) * interval;

            lon = Math.max(centerLon, this.minLon);
            lon = Math.min(lon, this.maxLon);

            idx = this.addMeridian(
                lon, minLat, maxLat, squaredTolerance, extentGeom, 0);

            while (lon != this.minLon) {
                lon = Math.max(lon - interval, this.minLon);
                prevIdx = idx;
                idx = this.addMeridian(
                    lon, minLat, maxLat, squaredTolerance, extentGeom, idx);
                if (prevIdx == idx) {
                    break;
                }
            }

            lon = Math.max(centerLon, this.minLon);
            lon = Math.min(lon, this.maxLon);

            while (lon != this.maxLon) {
                lon = Math.min(lon + interval, this.maxLon);
                prevIdx = idx;
                idx = this.addMeridian(
                    lon, minLat, maxLat, squaredTolerance, extentGeom, idx);
                if (prevIdx == idx) {
                    break;
                }
            }
        } while (intervalIndex < this.intervals.length &&
            idx <= visibleIntervals);

        this.meridians.length = idx;
        visibleIntervals = Math.ceil(size.h / this.targetSize);
        intervalIndex = 0;
        do {
            interval = this.intervalHeights ?
                this.intervalHeights[intervalIndex++] :
                this.intervals[intervalIndex++] * this.intervalHeightFactor;
            centerLat = Math.floor(centerLonLat.lat / interval) * interval;

            lat = Math.max(centerLat, this.minLat);
            lat = Math.min(lat, this.maxLat);

            idx = this.addParallel(
                lat, minLon, maxLon, squaredTolerance, extentGeom, 0);

            while (lat != this.minLat) {
                lat = Math.max(lat - interval, this.minLat);
                prevIdx = idx;
                idx = this.addParallel(
                    lat, minLon, maxLon, squaredTolerance, extentGeom, idx);
                if (prevIdx == idx) {
                    break;
                }
            }

            lat = Math.max(centerLat, this.minLat);
            lat = Math.min(lat, this.maxLat);

            while (lat != this.maxLat) {
                lat = Math.min(lat + interval, this.maxLat);
                prevIdx = idx;
                idx = this.addParallel(
                    lat, minLon, maxLon, squaredTolerance, extentGeom, idx);
                if (prevIdx == idx) {
                    break;
                }
            }

        } while (intervalIndex < this.intervals.length &&
            idx <= visibleIntervals);

        this.parallels.length = idx;
    },

        updateProjectionInfo: function(projection) {
        var defaults = OpenLayers.Projection.defaults[projection.getCode()];
        var extent = defaults && defaults.maxExtent ?
            OpenLayers.Bounds.fromArray(defaults.maxExtent) :
            this.map.getMaxExtent();
        var worldExtent = defaults && defaults.worldExtent ?
            defaults.worldExtent : [-180, -90, 180, 90];

        this.maxLat = worldExtent[3];
        this.maxLon = worldExtent[2];
        this.minLat = worldExtent[1];
        this.minLon = worldExtent[0];
        this.projectionCenterLonLat = extent.clone().transform(
            projection, this.epsg4326Projection).getCenterLonLat();

        this.projection = projection;
    },

        addMeridian: function(
            lon, minLat, maxLat, squaredTolerance, extentGeom, index) {
        var lineString = OpenLayers.Geometry.LineString.geodesicMeridian(
            lon, minLat, maxLat, this.projection, squaredTolerance);
        var split = lineString.split(new OpenLayers.Geometry.LineString(
            extentGeom.components[0].components.slice(0, 2)));
        if (split || extentGeom.intersects(lineString)) {
            this.meridians[index++] =
                new OpenLayers.Feature.Vector(lineString, {
                    lon: lon,
                    labelPoint: split ? split[0].components[1] : undefined
                });
        }
        return index;
    },

        addParallel: function(
            lat, minLon, maxLon, squaredTolerance, extentGeom, index) {
        var lineString = OpenLayers.Geometry.LineString.geodesicParallel(
            lat, minLon, maxLon, this.projection, squaredTolerance);
        var split = lineString.split(new OpenLayers.Geometry.LineString(
            extentGeom.components[0].components.slice(1, 3)));
        if (split || extentGeom.intersects(lineString)) {
            this.parallels[index++] =
                new OpenLayers.Feature.Vector(lineString, {
                    lat: lat,
                    labelPoint: split ? split[0].components[1] : undefined
                });
        }
        return index;
    },

    CLASS_NAME: "OpenLayers.Control.Graticule"
});
