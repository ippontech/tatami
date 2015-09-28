/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Renderer.VML = OpenLayers.Class(OpenLayers.Renderer.Elements, {

        xmlns: "urn:schemas-microsoft-com:vml",
    
        symbolCache: {},

        offset: null,
    
        initialize: function(containerID) {
        if (!this.supported()) { 
            return; 
        }
        if (!document.namespaces.olv) {
            document.namespaces.add("olv", this.xmlns);
            var style = document.createStyleSheet();
            var shapes = ['shape','rect', 'oval', 'fill', 'stroke', 'imagedata', 'group','textbox']; 
            for (var i = 0, len = shapes.length; i < len; i++) {

                style.addRule('olv\\:' + shapes[i], "behavior: url(#default#VML); " +
                              "position: absolute; display: inline-block;");
            }                  
        }
        
        OpenLayers.Renderer.Elements.prototype.initialize.apply(this, 
                                                                arguments);
    },

        supported: function() {
        return !!(document.namespaces);
    },    

        setExtent: function(extent, resolutionChanged) {
        var coordSysUnchanged = OpenLayers.Renderer.Elements.prototype.setExtent.apply(this, arguments);
        var resolution = this.getResolution();
    
        var left = (extent.left/resolution) | 0;
        var top = (extent.top/resolution - this.size.h) | 0;
        if (resolutionChanged || !this.offset) {
            this.offset = {x: left, y: top};
            left = 0;
            top = 0;
        } else {
            left = left - this.offset.x;
            top = top - this.offset.y;
        }

        
        var org = (left - this.xOffset) + " " + top;
        this.root.coordorigin = org;
        var roots = [this.root, this.vectorRoot, this.textRoot];
        var root;
        for(var i=0, len=roots.length; i<len; ++i) {
            root = roots[i];

            var size = this.size.w + " " + this.size.h;
            root.coordsize = size;
            
        }
        this.root.style.flip = "y";
        
        return coordSysUnchanged;
    },


        setSize: function(size) {
        OpenLayers.Renderer.prototype.setSize.apply(this, arguments);
        var roots = [
            this.rendererRoot,
            this.root,
            this.vectorRoot,
            this.textRoot
        ];
        var w = this.size.w + "px";
        var h = this.size.h + "px";
        var root;
        for(var i=0, len=roots.length; i<len; ++i) {
            root = roots[i];
            root.style.width = w;
            root.style.height = h;
        }
    },

        getNodeType: function(geometry, style) {
        var nodeType = null;
        switch (geometry.CLASS_NAME) {
            case "OpenLayers.Geometry.Point":
                if (style.externalGraphic) {
                    nodeType = "olv:rect";
                } else if (this.isComplexSymbol(style.graphicName)) {
                    nodeType = "olv:shape";
                } else {
                    nodeType = "olv:oval";
                }
                break;
            case "OpenLayers.Geometry.Rectangle":
                nodeType = "olv:rect";
                break;
            case "OpenLayers.Geometry.LineString":
            case "OpenLayers.Geometry.LinearRing":
            case "OpenLayers.Geometry.Polygon":
            case "OpenLayers.Geometry.Curve":
                nodeType = "olv:shape";
                break;
            default:
                break;
        }
        return nodeType;
    },

        setStyle: function(node, style, options, geometry) {
        style = style  || node._style;
        options = options || node._options;
        var fillColor = style.fillColor;

        var title = style.title || style.graphicTitle;
        if (title) {
            node.title = title;
        } 

        if (node._geometryClass === "OpenLayers.Geometry.Point") {
            if (style.externalGraphic) {
                options.isFilled = true;
                var width = style.graphicWidth || style.graphicHeight;
                var height = style.graphicHeight || style.graphicWidth;
                width = width ? width : style.pointRadius*2;
                height = height ? height : style.pointRadius*2;

                var resolution = this.getResolution();
                var xOffset = (style.graphicXOffset != undefined) ?
                    style.graphicXOffset : -(0.5 * width);
                var yOffset = (style.graphicYOffset != undefined) ?
                    style.graphicYOffset : -(0.5 * height);
                
                node.style.left = ((((geometry.x - this.featureDx)/resolution - this.offset.x)+xOffset) | 0) + "px";
                node.style.top = (((geometry.y/resolution - this.offset.y)-(yOffset+height)) | 0) + "px";
                node.style.width = width + "px";
                node.style.height = height + "px";
                node.style.flip = "y";
                fillColor = "none";
                options.isStroked = false;
            } else if (this.isComplexSymbol(style.graphicName)) {
                var cache = this.importSymbol(style.graphicName);
                node.path = cache.path;
                node.coordorigin = cache.left + "," + cache.bottom;
                var size = cache.size;
                node.coordsize = size + "," + size;        
                this.drawCircle(node, geometry, style.pointRadius);
                node.style.flip = "y";
            } else {
                this.drawCircle(node, geometry, style.pointRadius);
            }
        }
        if (options.isFilled) { 
            node.fillcolor = fillColor; 
        } else { 
            node.filled = "false"; 
        }
        var fills = node.getElementsByTagName("fill");
        var fill = (fills.length == 0) ? null : fills[0];
        if (!options.isFilled) {
            if (fill) {
                node.removeChild(fill);
            }
        } else {
            if (!fill) {
                fill = this.createNode('olv:fill', node.id + "_fill");
            }
            fill.opacity = style.fillOpacity;

            if (node._geometryClass === "OpenLayers.Geometry.Point" &&
                    style.externalGraphic) {
                if (style.graphicOpacity) {
                    fill.opacity = style.graphicOpacity;
                }
                
                fill.src = style.externalGraphic;
                fill.type = "frame";
                
                if (!(style.graphicWidth && style.graphicHeight)) {
                  fill.aspect = "atmost";
                }                
            }
            if (fill.parentNode != node) {
                node.appendChild(fill);
            }
        }
        var rotation = style.rotation;
        if ((rotation !== undefined || node._rotation !== undefined)) {
            node._rotation = rotation;
            if (style.externalGraphic) {
                this.graphicRotate(node, xOffset, yOffset, style);
                fill.opacity = 0;
            } else if(node._geometryClass === "OpenLayers.Geometry.Point") {
                node.style.rotation = rotation || 0;
            }
        }
        var strokes = node.getElementsByTagName("stroke");
        var stroke = (strokes.length == 0) ? null : strokes[0];
        if (!options.isStroked) {
            node.stroked = false;
            if (stroke) {
                stroke.on = false;
            }
        } else {
            if (!stroke) {
                stroke = this.createNode('olv:stroke', node.id + "_stroke");
                node.appendChild(stroke);
            }
            stroke.on = true;
            stroke.color = style.strokeColor; 
            stroke.weight = style.strokeWidth + "px"; 
            stroke.opacity = style.strokeOpacity;
            stroke.endcap = style.strokeLinecap == 'butt' ? 'flat' :
                (style.strokeLinecap || 'round');
            if (style.strokeDashstyle) {
                stroke.dashstyle = this.dashStyle(style);
            }
        }
        
        if (style.cursor != "inherit" && style.cursor != null) {
            node.style.cursor = style.cursor;
        }
        return node;
    },

        graphicRotate: function(node, xOffset, yOffset, style) {
        var style = style || node._style;
        var rotation = style.rotation || 0;
        
        var aspectRatio, size;
        if (!(style.graphicWidth && style.graphicHeight)) {
            var img = new Image();
            img.onreadystatechange = OpenLayers.Function.bind(function() {
                if(img.readyState == "complete" ||
                        img.readyState == "interactive") {
                    aspectRatio = img.width / img.height;
                    size = Math.max(style.pointRadius * 2, 
                        style.graphicWidth || 0,
                        style.graphicHeight || 0);
                    xOffset = xOffset * aspectRatio;
                    style.graphicWidth = size * aspectRatio;
                    style.graphicHeight = size;
                    this.graphicRotate(node, xOffset, yOffset, style);
                }
            }, this);
            img.src = style.externalGraphic;
            return;
        } else {
            size = Math.max(style.graphicWidth, style.graphicHeight);
            aspectRatio = style.graphicWidth / style.graphicHeight;
        }
        
        var width = Math.round(style.graphicWidth || size * aspectRatio);
        var height = Math.round(style.graphicHeight || size);
        node.style.width = width + "px";
        node.style.height = height + "px";
        var image = document.getElementById(node.id + "_image");
        if (!image) {
            image = this.createNode("olv:imagedata", node.id + "_image");
            node.appendChild(image);
        }
        image.style.width = width + "px";
        image.style.height = height + "px";
        image.src = style.externalGraphic;
        image.style.filter =
            "progid:DXImageTransform.Microsoft.AlphaImageLoader(" + 
            "src='', sizingMethod='scale')";

        var rot = rotation * Math.PI / 180;
        var sintheta = Math.sin(rot);
        var costheta = Math.cos(rot);
        var filter =
            "progid:DXImageTransform.Microsoft.Matrix(M11=" + costheta +
            ",M12=" + (-sintheta) + ",M21=" + sintheta + ",M22=" + costheta +
            ",SizingMethod='auto expand')\n";
        var opacity = style.graphicOpacity || style.fillOpacity;
        if (opacity && opacity != 1) {
            filter += 
                "progid:DXImageTransform.Microsoft.BasicImage(opacity=" + 
                opacity+")\n";
        }
        node.style.filter = filter;
        var centerPoint = new OpenLayers.Geometry.Point(-xOffset, -yOffset);
        var imgBox = new OpenLayers.Bounds(0, 0, width, height).toGeometry();
        imgBox.rotate(style.rotation, centerPoint);
        var imgBounds = imgBox.getBounds();

        node.style.left = Math.round(
            parseInt(node.style.left) + imgBounds.left) + "px";
        node.style.top = Math.round(
            parseInt(node.style.top) - imgBounds.bottom) + "px";
    },

        postDraw: function(node) {
        node.style.visibility = "visible";
        var fillColor = node._style.fillColor;
        var strokeColor = node._style.strokeColor;
        if (fillColor == "none" &&
                node.fillcolor != fillColor) {
            node.fillcolor = fillColor;
        }
        if (strokeColor == "none" &&
                node.strokecolor != strokeColor) {
            node.strokecolor = strokeColor;
        }
    },


        setNodeDimension: function(node, geometry) {

        var bbox = geometry.getBounds();
        if(bbox) {
            var resolution = this.getResolution();
        
            var scaledBox = 
                new OpenLayers.Bounds(((bbox.left - this.featureDx)/resolution - this.offset.x) | 0,
                                      (bbox.bottom/resolution - this.offset.y) | 0,
                                      ((bbox.right - this.featureDx)/resolution - this.offset.x) | 0,
                                      (bbox.top/resolution - this.offset.y) | 0);
            node.style.left = scaledBox.left + "px";
            node.style.top = scaledBox.top + "px";
            node.style.width = scaledBox.getWidth() + "px";
            node.style.height = scaledBox.getHeight() + "px";
    
            node.coordorigin = scaledBox.left + " " + scaledBox.top;
            node.coordsize = scaledBox.getWidth()+ " " + scaledBox.getHeight();
        }
    },
    
        dashStyle: function(style) {
        var dash = style.strokeDashstyle;
        switch (dash) {
            case 'solid':
            case 'dot':
            case 'dash':
            case 'dashdot':
            case 'longdash':
            case 'longdashdot':
                return dash;
            default:
                var parts = dash.split(/[ ,]/);
                if (parts.length == 2) {
                    if (1*parts[0] >= 2*parts[1]) {
                        return "longdash";
                    }
                    return (parts[0] == 1 || parts[1] == 1) ? "dot" : "dash";
                } else if (parts.length == 4) {
                    return (1*parts[0] >= 2*parts[1]) ? "longdashdot" :
                        "dashdot";
                }
                return "solid";
        }
    },

        createNode: function(type, id) {
        var node = document.createElement(type);
        if (id) {
            node.id = id;
        }
        node.unselectable = 'on';
        node.onselectstart = OpenLayers.Function.False;
        
        return node;    
    },
    
        nodeTypeCompare: function(node, type) {
        var subType = type;
        var splitIndex = subType.indexOf(":");
        if (splitIndex != -1) {
            subType = subType.substr(splitIndex+1);
        }
        var nodeName = node.nodeName;
        splitIndex = nodeName.indexOf(":");
        if (splitIndex != -1) {
            nodeName = nodeName.substr(splitIndex+1);
        }

        return (subType == nodeName);
    },

        createRenderRoot: function() {
        return this.nodeFactory(this.container.id + "_vmlRoot", "div");
    },

        createRoot: function(suffix) {
        return this.nodeFactory(this.container.id + suffix, "olv:group");
    },
    
        
        drawPoint: function(node, geometry) {
        return this.drawCircle(node, geometry, 1);
    },

        drawCircle: function(node, geometry, radius) {
        if(!isNaN(geometry.x)&& !isNaN(geometry.y)) {
            var resolution = this.getResolution();

            node.style.left = ((((geometry.x - this.featureDx) /resolution - this.offset.x) | 0) - radius) + "px";
            node.style.top = (((geometry.y /resolution - this.offset.y) | 0) - radius) + "px";
    
            var diameter = radius * 2;
            
            node.style.width = diameter + "px";
            node.style.height = diameter + "px";
            return node;
        }
        return false;
    },


        drawLineString: function(node, geometry) {
        return this.drawLine(node, geometry, false);
    },

        drawLinearRing: function(node, geometry) {
        return this.drawLine(node, geometry, true);
    },

        drawLine: function(node, geometry, closeLine) {

        this.setNodeDimension(node, geometry);

        var resolution = this.getResolution();
        var numComponents = geometry.components.length;
        var parts = new Array(numComponents);

        var comp, x, y;
        for (var i = 0; i < numComponents; i++) {
            comp = geometry.components[i];
            x = ((comp.x - this.featureDx)/resolution - this.offset.x) | 0;
            y = (comp.y/resolution - this.offset.y) | 0;
            parts[i] = " " + x + "," + y + " l ";
        }
        var end = (closeLine) ? " x e" : " e";
        node.path = "m" + parts.join("") + end;
        return node;
    },

        drawPolygon: function(node, geometry) {
        this.setNodeDimension(node, geometry);

        var resolution = this.getResolution();
    
        var path = [];
        var j, jj, points, area, first, second, i, ii, comp, pathComp, x, y;
        for (j=0, jj=geometry.components.length; j<jj; j++) {
            path.push("m");
            points = geometry.components[j].components;
            area = (j === 0);
            first = null;
            second = null;
            for (i=0, ii=points.length; i<ii; i++) {
                comp = points[i];
                x = ((comp.x - this.featureDx) / resolution - this.offset.x) | 0;
                y = (comp.y / resolution - this.offset.y) | 0;
                pathComp = " " + x + "," + y;
                path.push(pathComp);
                if (i==0) {
                    path.push(" l");
                }
                if (!area) {
                    if (!first) {
                        first = pathComp;
                    } else if (first != pathComp) {
                        if (!second) {
                            second = pathComp;
                        } else if (second != pathComp) {
                            area = true;
                        }
                    }
                }
            }
            path.push(area ? " x " : " ");
        }
        path.push("e");
        node.path = path.join("");
        return node;
    },

        drawRectangle: function(node, geometry) {
        var resolution = this.getResolution();
    
        node.style.left = (((geometry.x - this.featureDx)/resolution - this.offset.x) | 0) + "px";
        node.style.top = ((geometry.y/resolution - this.offset.y) | 0) + "px";
        node.style.width = ((geometry.width/resolution) | 0) + "px";
        node.style.height = ((geometry.height/resolution) | 0) + "px";
        
        return node;
    },
    
        drawText: function(featureId, style, location) {
        var label = this.nodeFactory(featureId + this.LABEL_ID_SUFFIX, "olv:rect");
        var textbox = this.nodeFactory(featureId + this.LABEL_ID_SUFFIX + "_textbox", "olv:textbox");
        
        var resolution = this.getResolution();
        label.style.left = (((location.x - this.featureDx)/resolution - this.offset.x) | 0) + "px";
        label.style.top = ((location.y/resolution - this.offset.y) | 0) + "px";
        label.style.flip = "y";

        textbox.innerText = style.label;

        if (style.cursor != "inherit" && style.cursor != null) {
            textbox.style.cursor = style.cursor;
        }
        if (style.fontColor) {
            textbox.style.color = style.fontColor;
        }
        if (style.fontOpacity) {
            textbox.style.filter = 'alpha(opacity=' + (style.fontOpacity * 100) + ')';
        }
        if (style.fontFamily) {
            textbox.style.fontFamily = style.fontFamily;
        }
        if (style.fontSize) {
            textbox.style.fontSize = style.fontSize;
        }
        if (style.fontWeight) {
            textbox.style.fontWeight = style.fontWeight;
        }
        if (style.fontStyle) {
            textbox.style.fontStyle = style.fontStyle;
        }
        if(style.labelSelect === true) {
            label._featureId = featureId;
            textbox._featureId = featureId;
            textbox._geometry = location;
            textbox._geometryClass = location.CLASS_NAME;
        }
        textbox.style.whiteSpace = "nowrap";
        textbox.inset = "1px,0px,0px,0px";

        if(!label.parentNode) {
            label.appendChild(textbox);
            this.textRoot.appendChild(label);
        }

        var align = style.labelAlign || "cm";
        if (align.length == 1) {
            align += "m";
        }
        var xshift = textbox.clientWidth *
            (OpenLayers.Renderer.VML.LABEL_SHIFT[align.substr(0,1)]);
        var yshift = textbox.clientHeight *
            (OpenLayers.Renderer.VML.LABEL_SHIFT[align.substr(1,1)]);
        label.style.left = parseInt(label.style.left)-xshift-1+"px";
        label.style.top = parseInt(label.style.top)+yshift+"px";
        
    },
    
        moveRoot: function(renderer) {
        var layer = this.map.getLayer(renderer.container.id);
        if(layer instanceof OpenLayers.Layer.Vector.RootContainer) {
            layer = this.map.getLayer(this.container.id);
        }
        layer && layer.renderer.clear();
        OpenLayers.Renderer.Elements.prototype.moveRoot.apply(this, arguments);
        layer && layer.redraw();
    },
    
    OpenLayers.Renderer.VML.LABEL_SHIFT = {
    "l": 0,
    "c": .5,
    "r": 1,
    "t": 0,
    "m": .5,
    "b": 1
};
