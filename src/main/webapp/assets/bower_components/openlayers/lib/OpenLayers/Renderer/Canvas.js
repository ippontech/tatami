/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Renderer.Canvas = OpenLayers.Class(OpenLayers.Renderer, {
    
        hitDetection: true,
    
        hitOverflow: 0,

        canvas: null, 
    
        features: null,
    
        pendingRedraw: false,
    
        cachedSymbolBounds: {},
    
        initialize: function(containerID, options) {
        OpenLayers.Renderer.prototype.initialize.apply(this, arguments);
        this.root = document.createElement("canvas");
        this.container.appendChild(this.root);
        this.canvas = this.root.getContext("2d");
        this._clearRectId = OpenLayers.Util.createUniqueID();
        this.features = {};
        if (this.hitDetection) {
            this.hitCanvas = document.createElement("canvas");
            this.hitContext = this.hitCanvas.getContext("2d");
        }
    },
    
        setExtent: function() {
        OpenLayers.Renderer.prototype.setExtent.apply(this, arguments);
        return false;
    },
    
        eraseGeometry: function(geometry, featureId) {
        this.eraseFeatures(this.features[featureId][0]);
    },

        supported: function() {
        return OpenLayers.CANVAS_SUPPORTED;
    },    
    
        setSize: function(size) {
        this.size = size.clone();
        var root = this.root;
        root.style.width = size.w + "px";
        root.style.height = size.h + "px";
        root.width = size.w;
        root.height = size.h;
        this.resolution = null;
        if (this.hitDetection) {
            var hitCanvas = this.hitCanvas;
            hitCanvas.style.width = size.w + "px";
            hitCanvas.style.height = size.h + "px";
            hitCanvas.width = size.w;
            hitCanvas.height = size.h;
        }
    },
    
        drawFeature: function(feature, style) {
        var rendered;
        if (feature.geometry) {
            style = this.applyDefaultSymbolizer(style || feature.style);
            var bounds = feature.geometry.getBounds();

            var worldBounds;
            if (this.map.baseLayer && this.map.baseLayer.wrapDateLine) {
                worldBounds = this.map.getMaxExtent();
            }

            var intersects = bounds && bounds.intersectsBounds(this.extent, {worldBounds: worldBounds});

            rendered = (style.display !== "none") && !!bounds && intersects;
            if (rendered) {
                this.features[feature.id] = [feature, style];
            }
            else {
                delete(this.features[feature.id]);
            }
            this.pendingRedraw = true;
        }
        if (this.pendingRedraw && !this.locked) {
            this.redraw();
            this.pendingRedraw = false;
        }
        return rendered;
    },

        drawGeometry: function(geometry, style, featureId) {
        var className = geometry.CLASS_NAME;
        if ((className == "OpenLayers.Geometry.Collection") ||
            (className == "OpenLayers.Geometry.MultiPoint") ||
            (className == "OpenLayers.Geometry.MultiLineString") ||
            (className == "OpenLayers.Geometry.MultiPolygon")) {
            var worldBounds = (this.map.baseLayer && this.map.baseLayer.wrapDateLine) && this.map.getMaxExtent();
            for (var i = 0; i < geometry.components.length; i++) {
                this.calculateFeatureDx(geometry.components[i].getBounds(), worldBounds);
                this.drawGeometry(geometry.components[i], style, featureId);
            }
            return;
        }
        switch (geometry.CLASS_NAME) {
            case "OpenLayers.Geometry.Point":
                this.drawPoint(geometry, style, featureId);
                break;
            case "OpenLayers.Geometry.LineString":
                this.drawLineString(geometry, style, featureId);
                break;
            case "OpenLayers.Geometry.LinearRing":
                this.drawLinearRing(geometry, style, featureId);
                break;
            case "OpenLayers.Geometry.Polygon":
                this.drawPolygon(geometry, style, featureId);
                break;
            default:
                break;
        }
    },

        setCanvasStyle: function(type, style) {
        if (type === "fill") {     
            this.canvas.globalAlpha = style['fillOpacity'];
            this.canvas.fillStyle = style['fillColor'];
        } else if (type === "stroke") {  
            this.canvas.globalAlpha = style['strokeOpacity'];
            this.canvas.strokeStyle = style['strokeColor'];
            this.canvas.lineWidth = style['strokeWidth'];
        } else {
            this.canvas.globalAlpha = 0;
            this.canvas.lineWidth = 1;
        }
    },
    
        featureIdToHex: function(featureId) {
        var id = Number(featureId.split("_").pop()) + 1; // zero for no feature
        if (id >= 16777216) {
            this.hitOverflow = id - 16777215;
            id = id % 16777216 + 1;
        }
        var hex = "000000" + id.toString(16);
        var len = hex.length;
        hex = "#" + hex.substring(len-6, len);
        return hex;
    },
    
        setHitContextStyle: function(type, featureId, symbolizer, strokeScaling) {
        var hex = this.featureIdToHex(featureId);
        if (type == "fill") {
            this.hitContext.globalAlpha = 1.0;
            this.hitContext.fillStyle = hex;
        } else if (type == "stroke") {  
            this.hitContext.globalAlpha = 1.0;
            this.hitContext.strokeStyle = hex;
            if (typeof strokeScaling === "undefined") {
                this.hitContext.lineWidth = symbolizer.strokeWidth + 2;
            } else {
                if (!isNaN(strokeScaling)) { this.hitContext.lineWidth = symbolizer.strokeWidth + 2.0 / strokeScaling; }
            }
        } else {
            this.hitContext.globalAlpha = 0;
            this.hitContext.lineWidth = 1;
        }
    },

        renderPath: function(context, geometry, style, featureId, type) {
        var components = geometry.components;
        var len = components.length;
        context.beginPath();
        var start = this.getLocalXY(components[0]);
        var x = start[0];
        var y = start[1];
        if (!isNaN(x) && !isNaN(y)) {
            context.moveTo(start[0], start[1]);
            for (var i=1; i<len; ++i) {
                var pt = this.getLocalXY(components[i]);
                context.lineTo(pt[0], pt[1]);
            }
            if (type === "fill") {
                context.fill();
            } else {
                context.stroke();
            }
        }
    },
    
                this.canvas.globalCompositeOperation = "destination-out";
            if (this.hitDetection) {
                this.hitContext.globalCompositeOperation = "destination-out";
            }
            this.drawLinearRing(
                components[i], 
                OpenLayers.Util.applyDefaults({stroke: false, fillOpacity: 1.0}, style),
                featureId
            );
            this.canvas.globalCompositeOperation = "source-over";
            if (this.hitDetection) {
                this.hitContext.globalCompositeOperation = "source-over";
            }
            this.drawLinearRing(
                components[i], 
                OpenLayers.Util.applyDefaults({fill: false}, style),
                featureId
            );
        }
    },
    
        drawText: function(location, style) {
        var pt = this.getLocalXY(location);

        this.setCanvasStyle("reset");
        this.canvas.fillStyle = style.fontColor;
        this.canvas.globalAlpha = style.fontOpacity || 1.0;
        var fontStyle = [style.fontStyle ? style.fontStyle : "normal",
                         "normal", // "font-variant" not supported
                         style.fontWeight ? style.fontWeight : "normal",
                         style.fontSize ? style.fontSize : "1em",
                         style.fontFamily ? style.fontFamily : "sans-serif"].join(" ");
        var labelRows = style.label.split('\n');
        var numRows = labelRows.length;
        if (this.canvas.fillText) {
            this.canvas.font = fontStyle;
            this.canvas.textAlign =
                OpenLayers.Renderer.Canvas.LABEL_ALIGN[style.labelAlign[0]] ||
                "center";
            this.canvas.textBaseline =
                OpenLayers.Renderer.Canvas.LABEL_ALIGN[style.labelAlign[1]] ||
                "middle";
            var vfactor =
                OpenLayers.Renderer.Canvas.LABEL_FACTOR[style.labelAlign[1]];
            if (vfactor == null) {
                vfactor = -.5;
            }
            var lineHeight =
                this.canvas.measureText('Mg').height ||
                this.canvas.measureText('xx').width;
            pt[1] += lineHeight*vfactor*(numRows-1);
            for (var i = 0; i < numRows; i++) {
                if (style.labelOutlineWidth) {
                    this.canvas.save();
                    this.canvas.globalAlpha = style.labelOutlineOpacity || style.fontOpacity || 1.0;
                    this.canvas.strokeStyle = style.labelOutlineColor;
                    this.canvas.lineWidth = style.labelOutlineWidth;
                    this.canvas.strokeText(labelRows[i], pt[0], pt[1] + (lineHeight*i) + 1);
                    this.canvas.restore();
                }
                this.canvas.fillText(labelRows[i], pt[0], pt[1] + (lineHeight*i));
            }
        } else if (this.canvas.mozDrawText) {
            this.canvas.mozTextStyle = fontStyle;
            var hfactor =
                OpenLayers.Renderer.Canvas.LABEL_FACTOR[style.labelAlign[0]];
            if (hfactor == null) {
                hfactor = -.5;
            }
            var vfactor =
                OpenLayers.Renderer.Canvas.LABEL_FACTOR[style.labelAlign[1]];
            if (vfactor == null) {
                vfactor = -.5;
            }
            var lineHeight = this.canvas.mozMeasureText('xx');
            pt[1] += lineHeight*(1 + (vfactor*numRows));
            for (var i = 0; i < numRows; i++) {
                var x = pt[0] + (hfactor*this.canvas.mozMeasureText(labelRows[i]));
                var y = pt[1] + (i*lineHeight);
                this.canvas.translate(x, y);
                this.canvas.mozDrawText(labelRows[i]);
                this.canvas.translate(-x, -y);
            }
        }
        this.setCanvasStyle("reset");
    },
    
        getLocalXY: function(point) {
        var resolution = this.getResolution();
        var extent = this.extent;
        var x = ((point.x - this.featureDx) / resolution + (-extent.left / resolution));
        var y = ((extent.top / resolution) - point.y / resolution);
        return [x, y];
    },

        getFeatureIdFromEvent: function(evt) {
        var featureId, feature;
        
        if (this.hitDetection && this.root.style.display !== "none") {
            if (!this.map.dragging) {
                var xy = evt.xy;
                var x = xy.x | 0;
                var y = xy.y | 0;
                var data = this.hitContext.getImageData(x, y, 1, 1).data;
                if (data[3] === 255) { // antialiased
                    var id = data[2] + (256 * (data[1] + (256 * data[0])));
                    if (id) {
                        featureId = "OpenLayers_Feature_Vector_" + (id - 1 + this.hitOverflow);
                        try {
                            feature = this.features[featureId][0];
                        } catch(err) {
                        }
                    }
                }
            }
        }
        return feature;
    },
    
        eraseFeatures: function(features) {
        if(!(OpenLayers.Util.isArray(features))) {
            features = [features];
        }
        for(var i=0; i<features.length; ++i) {
            delete this.features[features[i].id];
        }
        this.redraw();
    },

        redraw: function() {
        if (!this.locked) {
            this.clearCanvas();
            var labelMap = [];
            var feature, geometry, style;
            var worldBounds = (this.map.baseLayer && this.map.baseLayer.wrapDateLine) && this.map.getMaxExtent();
            for (var id in this.features) {
                if (!this.features.hasOwnProperty(id)) { continue; }
                feature = this.features[id][0];
                geometry = feature.geometry;
                this.calculateFeatureDx(geometry.getBounds(), worldBounds);
                style = this.features[id][1];
                this.drawGeometry(geometry, style, feature.id);
                if(style.label) {
                    labelMap.push([feature, style]);
                }
            }
            var item;
            for (var i=0, len=labelMap.length; i<len; ++i) {
                item = labelMap[i];
                this.drawText(item[0].geometry.getCentroid(), item[1]);
            }
        }    
    },

    CLASS_NAME: "OpenLayers.Renderer.Canvas"
});

OpenLayers.Renderer.Canvas.LABEL_ALIGN = {
    "l": "left",
    "r": "right",
    "t": "top",
    "b": "bottom"
};

OpenLayers.Renderer.Canvas.LABEL_FACTOR = {
    "l": 0,
    "r": -1,
    "t": 0,
    "b": -1
};

OpenLayers.Renderer.Canvas.drawImageScaleFactor = null;
