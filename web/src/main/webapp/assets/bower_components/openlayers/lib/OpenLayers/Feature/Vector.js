/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */
OpenLayers.State = {
        UNKNOWN: 'Unknown',
    INSERT: 'Insert',
    UPDATE: 'Update',
    DELETE: 'Delete'
};


OpenLayers.Feature.Vector = OpenLayers.Class(OpenLayers.Feature, {

        fid: null,
    
        geometry: null,

        attributes: null,

        bounds: null,

        state: null,
    
        style: null,

        url: null,
    
        renderIntent: "default",
    
        modified: null,

        initialize: function(geometry, attributes, style) {
        OpenLayers.Feature.prototype.initialize.apply(this,
                                                      [null, null, attributes]);
        this.lonlat = null;
        this.geometry = geometry ? geometry : null;
        this.state = null;
        this.attributes = {};
        if (attributes) {
            this.attributes = OpenLayers.Util.extend(this.attributes,
                                                     attributes);
        }
        this.style = style ? style : null; 
    },
    
        destroy: function() {
        if (this.layer) {
            this.layer.removeFeatures(this);
            this.layer = null;
        }
            
        this.geometry = null;
        this.modified = null;
        OpenLayers.Feature.prototype.destroy.apply(this, arguments);
    },
    
        clone: function () {
        return new OpenLayers.Feature.Vector(
            this.geometry ? this.geometry.clone() : null,
            this.attributes,
            this.style);
    },

        onScreen:function(boundsOnly) {
        var onScreen = false;
        if(this.layer && this.layer.map) {
            var screenBounds = this.layer.map.getExtent();
            if(boundsOnly) {
                var featureBounds = this.geometry.getBounds();
                onScreen = screenBounds.intersectsBounds(featureBounds);
            } else {
                var screenPoly = screenBounds.toGeometry();
                onScreen = screenPoly.intersects(this.geometry);
            }
        }    
        return onScreen;
    },

        getVisibility: function() {
        return !(this.style && this.style.display == 'none' ||
                 !this.layer ||
                 this.layer && this.layer.styleMap &&
                 this.layer.styleMap.createSymbolizer(this, this.renderIntent).display == 'none' ||
                 this.layer && !this.layer.getVisibility());
    },
    
        createMarker: function() {
        return null;
    },

        destroyMarker: function() {
    },

        createPopup: function() {
        return null;
    },

        atPoint: function(lonlat, toleranceLon, toleranceLat) {
        var atPoint = false;
        if(this.geometry) {
            atPoint = this.geometry.atPoint(lonlat, toleranceLon, 
                                                    toleranceLat);
        }
        return atPoint;
    },

        destroyPopup: function() {
    },

        move: function(location) {

        if(!this.layer || !this.geometry.move){
            return undefined;
        }

        var pixel;
        if (location.CLASS_NAME == "OpenLayers.LonLat") {
            pixel = this.layer.getViewPortPxFromLonLat(location);
        } else {
            pixel = location;
        }
        
        var lastPixel = this.layer.getViewPortPxFromLonLat(this.geometry.getBounds().getCenterLonLat());
        var res = this.layer.map.getResolution();
        this.geometry.move(res * (pixel.x - lastPixel.x),
                           res * (lastPixel.y - pixel.y));
        this.layer.drawFeature(this);
        return lastPixel;
    },
    
        toState: function(state) {
        if (state == OpenLayers.State.UPDATE) {
            switch (this.state) {
                case OpenLayers.State.UNKNOWN:
                case OpenLayers.State.DELETE:
                    this.state = state;
                    break;
                case OpenLayers.State.UPDATE:
                case OpenLayers.State.INSERT:
                    break;
            }
        } else if (state == OpenLayers.State.INSERT) {
            switch (this.state) {
                case OpenLayers.State.UNKNOWN:
                    break;
                default:
                    this.state = state;
                    break;
            }
        } else if (state == OpenLayers.State.DELETE) {
            switch (this.state) {
                case OpenLayers.State.INSERT:
                    break;
                case OpenLayers.State.DELETE:
                    break;
                case OpenLayers.State.UNKNOWN:
                case OpenLayers.State.UPDATE:
                    this.state = state;
                    break;
            }
        } else if (state == OpenLayers.State.UNKNOWN) {
            this.state = state;
        }
    },
    
    CLASS_NAME: "OpenLayers.Feature.Vector"
});


/**
 * Constant: OpenLayers.Feature.Vector.style
 * OpenLayers features can have a number of style attributes. The 'default' 
 *     style will typically be used if no other style is specified. These
 *     styles correspond for the most part, to the styling properties defined
 *     by the SVG standard. 
 *     Information on fill properties: http://www.w3.org/TR/SVG/painting.html#FillProperties
 *     Information on stroke properties: http://www.w3.org/TR/SVG/painting.html#StrokeProperties
 *
 * Symbolizer properties:
 * fill - {Boolean} Set to false if no fill is desired.
 * fillColor - {String} Hex fill color.  Default is "#ee9900".
 * fillOpacity - {Number} Fill opacity (0-1).  Default is 0.4 
 * stroke - {Boolean} Set to false if no stroke is desired.
 * strokeColor - {String} Hex stroke color.  Default is "#ee9900".
 * strokeOpacity - {Number} Stroke opacity (0-1).  Default is 1.
 * strokeWidth - {Number} Pixel stroke width.  Default is 1.
 * strokeLinecap - {String} Stroke cap type.  Default is "round".  [butt | round | square]
 * strokeDashstyle - {String} Stroke dash style.  Default is "solid". [dot | dash | dashdot | longdash | longdashdot | solid]
 * graphic - {Boolean} Set to false if no graphic is desired.
 * pointRadius - {Number} Pixel point radius.  Default is 6.
 * pointerEvents - {String}  Default is "visiblePainted".
 * cursor - {String} Default is "".
 * externalGraphic - {String} Url to an external graphic that will be used for rendering points.
 * graphicWidth - {Number} Pixel width for sizing an external graphic.
 * graphicHeight - {Number} Pixel height for sizing an external graphic.
 * graphicOpacity - {Number} Opacity (0-1) for an external graphic.
 * graphicXOffset - {Number} Pixel offset along the positive x axis for displacing an external graphic.
 * graphicYOffset - {Number} Pixel offset along the positive y axis for displacing an external graphic.
 * rotation - {Number} For point symbolizers, this is the rotation of a graphic in the clockwise direction about its center point (or any point off center as specified by graphicXOffset and graphicYOffset).
 * graphicZIndex - {Number} The integer z-index value to use in rendering.
 * graphicName - {String} Named graphic to use when rendering points.  Supported values include "circle" (default),
 *     "square", "star", "x", "cross", "triangle".
 * graphicTitle - {String} Tooltip when hovering over a feature. *deprecated*, use title instead
 * title - {String} Tooltip when hovering over a feature. Not supported by the canvas renderer.
 * backgroundGraphic - {String} Url to a graphic to be used as the background under an externalGraphic.
 * backgroundGraphicZIndex - {Number} The integer z-index value to use in rendering the background graphic.
 * backgroundXOffset - {Number} The x offset (in pixels) for the background graphic.
 * backgroundYOffset - {Number} The y offset (in pixels) for the background graphic.
 * backgroundHeight - {Number} The height of the background graphic.  If not provided, the graphicHeight will be used.
 * backgroundWidth - {Number} The width of the background width.  If not provided, the graphicWidth will be used.
 * label - {String} The text for an optional label. For browsers that use the canvas renderer, this requires either
 *     fillText or mozDrawText to be available.
 * labelAlign - {String} Label alignment. This specifies the insertion point relative to the text. It is a string
 *     composed of two characters. The first character is for the horizontal alignment, the second for the vertical
 *     alignment. Valid values for horizontal alignment: "l"=left, "c"=center, "r"=right. Valid values for vertical
 *     alignment: "t"=top, "m"=middle, "b"=bottom. Example values: "lt", "cm", "rb". Default is "cm".
 * labelXOffset - {Number} Pixel offset along the positive x axis for displacing the label. Not supported by the canvas renderer.
 * labelYOffset - {Number} Pixel offset along the positive y axis for displacing the label. Not supported by the canvas renderer.
 * labelSelect - {Boolean} If set to true, labels will be selectable using SelectFeature or similar controls.
 *     Default is false.
 * labelOutlineColor - {String} The color of the label outline. Default is 'white'. Only supported by the canvas & SVG renderers.
 * labelOutlineWidth - {Number} The width of the label outline. Default is 3, set to 0 or null to disable. Only supported by the  SVG renderers.
 * labelOutlineOpacity - {Number} The opacity (0-1) of the label outline. Default is fontOpacity. Only supported by the canvas & SVG renderers.
 * fontColor - {String} The font color for the label, to be provided like CSS.
 * fontOpacity - {Number} Opacity (0-1) for the label
 * fontFamily - {String} The font family for the label, to be provided like in CSS.
 * fontSize - {String} The font size for the label, to be provided like in CSS.
 * fontStyle - {String} The font style for the label, to be provided like in CSS.
 * fontWeight - {String} The font weight for the label, to be provided like in CSS.
 * display - {String} Symbolizers will have no effect if display is set to "none".  All other values have no effect.
 */ 
OpenLayers.Feature.Vector.style = {
    'default': {
        fillColor: "#ee9900",
        fillOpacity: 0.4, 
        hoverFillColor: "white",
        hoverFillOpacity: 0.8,
        strokeColor: "#ee9900",
        strokeOpacity: 1,
        strokeWidth: 1,
        strokeLinecap: "round",
        strokeDashstyle: "solid",
        hoverStrokeColor: "red",
        hoverStrokeOpacity: 1,
        hoverStrokeWidth: 0.2,
        pointRadius: 6,
        hoverPointRadius: 1,
        hoverPointUnit: "%",
        pointerEvents: "visiblePainted",
        cursor: "inherit",
        fontColor: "#000000",
        labelAlign: "cm",
        labelOutlineColor: "white",
        labelOutlineWidth: 3
    },
    'select': {
        fillColor: "blue",
        fillOpacity: 0.4, 
        hoverFillColor: "white",
        hoverFillOpacity: 0.8,
        strokeColor: "blue",
        strokeOpacity: 1,
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeDashstyle: "solid",
        hoverStrokeColor: "red",
        hoverStrokeOpacity: 1,
        hoverStrokeWidth: 0.2,
        pointRadius: 6,
        hoverPointRadius: 1,
        hoverPointUnit: "%",
        pointerEvents: "visiblePainted",
        cursor: "pointer",
        fontColor: "#000000",
        labelAlign: "cm",
        labelOutlineColor: "white",
        labelOutlineWidth: 3

    },
    'temporary': {
        fillColor: "#66cccc",
        fillOpacity: 0.2, 
        hoverFillColor: "white",
        hoverFillOpacity: 0.8,
        strokeColor: "#66cccc",
        strokeOpacity: 1,
        strokeLinecap: "round",
        strokeWidth: 2,
        strokeDashstyle: "solid",
        hoverStrokeColor: "red",
        hoverStrokeOpacity: 1,
        hoverStrokeWidth: 0.2,
        pointRadius: 6,
        hoverPointRadius: 1,
        hoverPointUnit: "%",
        pointerEvents: "visiblePainted",
        cursor: "inherit",
        fontColor: "#000000",
        labelAlign: "cm",
        labelOutlineColor: "white",
        labelOutlineWidth: 3

    },
    'delete': {
        display: "none"
    }
};    
