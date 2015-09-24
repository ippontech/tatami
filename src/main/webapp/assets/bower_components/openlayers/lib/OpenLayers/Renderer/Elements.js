/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.ElementsIndexer = OpenLayers.Class({
   
        maxZIndex: null,
    
        order: null, 
    
        indices: null,
    
        compare: null,
    
        initialize: function(yOrdering) {

        this.compare = yOrdering ? 
            OpenLayers.ElementsIndexer.IndexingMethods.Z_ORDER_Y_ORDER :
            OpenLayers.ElementsIndexer.IndexingMethods.Z_ORDER_DRAWING_ORDER;

        this.clear();
    },
    
        insert: function(newNode) {
        if (this.exists(newNode)) {
            this.remove(newNode);
        }
        
        var nodeId = newNode.id;
        
        this.determineZIndex(newNode);       

        var leftIndex = -1;
        var rightIndex = this.order.length;
        var middle;

        while (rightIndex - leftIndex > 1) {
            middle = parseInt((leftIndex + rightIndex) / 2);
            
            var placement = this.compare(this, newNode,
                OpenLayers.Util.getElement(this.order[middle]));
            
            if (placement > 0) {
                leftIndex = middle;
            } else {
                rightIndex = middle;
            } 
        }
        
        this.order.splice(rightIndex, 0, nodeId);
        this.indices[nodeId] = this.getZIndex(newNode);
        return this.getNextElement(rightIndex);
    },
    
        remove: function(node) {
        var nodeId = node.id;
        var arrayIndex = OpenLayers.Util.indexOf(this.order, nodeId);
        if (arrayIndex >= 0) {
            this.order.splice(arrayIndex, 1);
            delete this.indices[nodeId];
            if (this.order.length > 0) {
                var lastId = this.order[this.order.length - 1];
                this.maxZIndex = this.indices[lastId];
            } else {
                this.maxZIndex = 0;
            }
        }
    },
    
        clear: function() {
        this.order = [];
        this.indices = {};
        this.maxZIndex = 0;
    },
    
        exists: function(node) {
        return (this.indices[node.id] != null);
    },

        getZIndex: function(node) {
        return node._style.graphicZIndex;  
    },
    
        determineZIndex: function(node) {
        var zIndex = node._style.graphicZIndex;
        if (zIndex == null) {
            zIndex = this.maxZIndex;
            node._style.graphicZIndex = zIndex; 
        } else if (zIndex > this.maxZIndex) {
            this.maxZIndex = zIndex;
        }
    },

        getNextElement: function(index) {
        for (var nextIndex = index + 1, nextElement = undefined;
            (nextIndex < this.order.length) && (nextElement == undefined);
            nextIndex++) {
            nextElement = OpenLayers.Util.getElement(this.order[nextIndex]);
        }
        
        return nextElement || null;
    },
    
    CLASS_NAME: "OpenLayers.ElementsIndexer"
});

OpenLayers.ElementsIndexer.IndexingMethods = {
    
        Z_ORDER: function(indexer, newNode, nextNode) {
        var newZIndex = indexer.getZIndex(newNode);

        var returnVal = 0;
        if (nextNode) {
            var nextZIndex = indexer.getZIndex(nextNode);
            returnVal = newZIndex - nextZIndex; 
        }
        
        return returnVal;
    },

        Z_ORDER_DRAWING_ORDER: function(indexer, newNode, nextNode) {
        var returnVal = OpenLayers.ElementsIndexer.IndexingMethods.Z_ORDER(
            indexer, 
            newNode, 
            nextNode
        );
        if (nextNode && returnVal == 0) {
            returnVal = 1;
        }
        
        return returnVal;
    },

        Z_ORDER_Y_ORDER: function(indexer, newNode, nextNode) {
        var returnVal = OpenLayers.ElementsIndexer.IndexingMethods.Z_ORDER(
            indexer, 
            newNode, 
            nextNode
        );
        
        if (nextNode && returnVal === 0) {            
            var result = nextNode._boundsBottom - newNode._boundsBottom;
            returnVal = (result === 0) ? 1 : result;
        }
        
        return returnVal;       
    }
};

OpenLayers.Renderer.Elements = OpenLayers.Class(OpenLayers.Renderer, {

        rendererRoot: null,
    
        root: null,
    
        vectorRoot: null,

        textRoot: null,

        xOffset: 0,
    
        
        indexer: null, 
    
        BACKGROUND_ID_SUFFIX: "_background",
    
        LABEL_ID_SUFFIX: "_label",
    
        LABEL_OUTLINE_SUFFIX: "_outline",

        initialize: function(containerID, options) {
        OpenLayers.Renderer.prototype.initialize.apply(this, arguments);

        this.rendererRoot = this.createRenderRoot();
        this.root = this.createRoot("_root");
        this.vectorRoot = this.createRoot("_vroot");
        this.textRoot = this.createRoot("_troot");
        
        this.root.appendChild(this.vectorRoot);
        this.root.appendChild(this.textRoot);
        
        this.rendererRoot.appendChild(this.root);
        this.container.appendChild(this.rendererRoot);
        
        if(options && (options.zIndexing || options.yOrdering)) {
            this.indexer = new OpenLayers.ElementsIndexer(options.yOrdering);
        }
    },
    
        destroy: function() {

        this.clear(); 

        this.rendererRoot = null;
        this.root = null;
        this.xmlns = null;

        OpenLayers.Renderer.prototype.destroy.apply(this, arguments);
    },
    
        setExtent: function(extent, resolutionChanged) {
        var coordSysUnchanged = OpenLayers.Renderer.prototype.setExtent.apply(this, arguments);
        var resolution = this.getResolution();
        if (this.map.baseLayer && this.map.baseLayer.wrapDateLine) {
            var rightOfDateLine,
                ratio = extent.getWidth() / this.map.getExtent().getWidth(),
                extent = extent.scale(1 / ratio),
                world = this.map.getMaxExtent();
            if (world.right > extent.left && world.right < extent.right) {
                rightOfDateLine = true;
            } else if (world.left > extent.left && world.left < extent.right) {
                rightOfDateLine = false;
            }
            if (rightOfDateLine !== this.rightOfDateLine || resolutionChanged) {
                coordSysUnchanged = false;
                this.xOffset = rightOfDateLine === true ?
                    world.getWidth() / resolution : 0;
            }
            this.rightOfDateLine = rightOfDateLine;
        }
        return coordSysUnchanged;
    },

        getNodeType: function(geometry, style) { },

        drawGeometry: function(geometry, style, featureId) {
        var className = geometry.CLASS_NAME;
        var rendered = true;
        if ((className == "OpenLayers.Geometry.Collection") ||
            (className == "OpenLayers.Geometry.MultiPoint") ||
            (className == "OpenLayers.Geometry.MultiLineString") ||
            (className == "OpenLayers.Geometry.MultiPolygon")) {
            for (var i = 0, len=geometry.components.length; i<len; i++) {
                rendered = this.drawGeometry(
                    geometry.components[i], style, featureId) && rendered;
            }
            return rendered;
        }

        rendered = false;
        var removeBackground = false;
        if (style.display != "none") {
            if (style.backgroundGraphic) {
                this.redrawBackgroundNode(geometry.id, geometry, style,
                    featureId);
            } else {
                removeBackground = true;
            }
            rendered = this.redrawNode(geometry.id, geometry, style,
                featureId);
        }
        if (rendered == false) {
            var node = document.getElementById(geometry.id);
            if (node) {
                if (node._style.backgroundGraphic) {
                    removeBackground = true;
                }
                node.parentNode.removeChild(node);
            }
        }
        if (removeBackground) {
            var node = document.getElementById(
                geometry.id + this.BACKGROUND_ID_SUFFIX);
            if (node) {
                node.parentNode.removeChild(node);
            }
        }
        return rendered;
    },
    
        redrawNode: function(id, geometry, style, featureId) {
        style = this.applyDefaultSymbolizer(style);
        var node = this.nodeFactory(id, this.getNodeType(geometry, style));
        node._featureId = featureId;
        node._boundsBottom = geometry.getBounds().bottom;
        node._geometryClass = geometry.CLASS_NAME;
        node._style = style;

        var drawResult = this.drawGeometryNode(node, geometry, style);
        if(drawResult === false) {
            return false;
        }
         
        node = drawResult.node;
        if (this.indexer) {
            var insert = this.indexer.insert(node);
            if (insert) {
                this.vectorRoot.insertBefore(node, insert);
            } else {
                this.vectorRoot.appendChild(node);
            }
        } else {
            if (node.parentNode !== this.vectorRoot){ 
                this.vectorRoot.appendChild(node);
            }
        }
        
        this.postDraw(node);
        
        return drawResult.complete;
    },
    
        redrawBackgroundNode: function(id, geometry, style, featureId) {
        var backgroundStyle = OpenLayers.Util.extend({}, style);
        backgroundStyle.externalGraphic = backgroundStyle.backgroundGraphic;
        backgroundStyle.graphicXOffset = backgroundStyle.backgroundXOffset;
        backgroundStyle.graphicYOffset = backgroundStyle.backgroundYOffset;
        backgroundStyle.graphicZIndex = backgroundStyle.backgroundGraphicZIndex;
        backgroundStyle.graphicWidth = backgroundStyle.backgroundWidth || backgroundStyle.graphicWidth;
        backgroundStyle.graphicHeight = backgroundStyle.backgroundHeight || backgroundStyle.graphicHeight;
        backgroundStyle.backgroundGraphic = null;
        backgroundStyle.backgroundXOffset = null;
        backgroundStyle.backgroundYOffset = null;
        backgroundStyle.backgroundGraphicZIndex = null;
        
        return this.redrawNode(
            id + this.BACKGROUND_ID_SUFFIX, 
            geometry, 
            backgroundStyle, 
            null
        );
    },

        drawGeometryNode: function(node, geometry, style) {
        style = style || node._style;

        var options = {
            'isFilled': style.fill === undefined ?
                true :
                style.fill,
            'isStroked': style.stroke === undefined ?
                !!style.strokeWidth :
                style.stroke
        };
        var drawn;
        switch (geometry.CLASS_NAME) {
            case "OpenLayers.Geometry.Point":
                if(style.graphic === false) {
                    options.isFilled = false;
                    options.isStroked = false;
                }
                drawn = this.drawPoint(node, geometry);
                break;
            case "OpenLayers.Geometry.LineString":
                options.isFilled = false;
                drawn = this.drawLineString(node, geometry);
                break;
            case "OpenLayers.Geometry.LinearRing":
                drawn = this.drawLinearRing(node, geometry);
                break;
            case "OpenLayers.Geometry.Polygon":
                drawn = this.drawPolygon(node, geometry);
                break;
            case "OpenLayers.Geometry.Rectangle":
                drawn = this.drawRectangle(node, geometry);
                break;
            default:
                break;
        }

        node._options = options; 
        if (drawn != false) {
            return {
                node: this.setStyle(node, style, options, geometry),
                complete: drawn
            };
        } else {
            return false;
        }
    },
    
        postDraw: function(node) {},
    
        removeText: function(featureId) {
        var label = document.getElementById(featureId + this.LABEL_ID_SUFFIX);
        if (label) {
            this.textRoot.removeChild(label);
        }
        var outline = document.getElementById(featureId + this.LABEL_OUTLINE_SUFFIX);
        if (outline) {
            this.textRoot.removeChild(outline);
        }
    },

        getFeatureIdFromEvent: function(evt) {
        var target = evt.target;
        var useElement = target && target.correspondingUseElement;
        var node = useElement ? useElement : (target || evt.srcElement);
        return node._featureId;
    },

        eraseGeometry: function(geometry, featureId) {
        if ((geometry.CLASS_NAME == "OpenLayers.Geometry.MultiPoint") ||
            (geometry.CLASS_NAME == "OpenLayers.Geometry.MultiLineString") ||
            (geometry.CLASS_NAME == "OpenLayers.Geometry.MultiPolygon") ||
            (geometry.CLASS_NAME == "OpenLayers.Geometry.Collection")) {
            for (var i=0, len=geometry.components.length; i<len; i++) {
                this.eraseGeometry(geometry.components[i], featureId);
            }
        } else {    
            var element = OpenLayers.Util.getElement(geometry.id);
            if (element && element.parentNode) {
                if (element.geometry) {
                    element.geometry.destroy();
                    element.geometry = null;
                }
                element.parentNode.removeChild(element);

                if (this.indexer) {
                    this.indexer.remove(element);
                }
                
                if (element._style.backgroundGraphic) {
                    var backgroundId = geometry.id + this.BACKGROUND_ID_SUFFIX;
                    var bElem = OpenLayers.Util.getElement(backgroundId);
                    if (bElem && bElem.parentNode) {
                        bElem.parentNode.removeChild(bElem);
                    }
                }
            }
        }
    },

        nodeFactory: function(id, type) {
        var node = OpenLayers.Util.getElement(id);
        if (node) {
            if (!this.nodeTypeCompare(node, type)) {
                node.parentNode.removeChild(node);
                node = this.nodeFactory(id, type);
            }
        } else {
            node = this.createNode(type, id);
        }
        return node;
    },
    
        nodeTypeCompare: function(node, type) {},
    
        createNode: function(type, id) {},

        moveRoot: function(renderer) {
        var root = this.root;
        if(renderer.root.parentNode == this.rendererRoot) {
            root = renderer.root;
        }
        root.parentNode.removeChild(root);
        renderer.rendererRoot.appendChild(root);
    },
    
        getRenderLayerId: function() {
        return this.root.parentNode.parentNode.id;
    },
    
        isComplexSymbol: function(graphicName) {
        return (graphicName != "circle") && !!graphicName;
    },

    CLASS_NAME: "OpenLayers.Renderer.Elements"
});

