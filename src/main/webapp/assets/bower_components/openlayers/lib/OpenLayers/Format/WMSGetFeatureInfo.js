/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.WMSGetFeatureInfo = OpenLayers.Class(OpenLayers.Format.XML, {

        layerIdentifier: '_layer',

        featureIdentifier: '_feature',

        regExes: {
        trimSpace: (/^\s*|\s*$/g),
        removeSpace: (/\s*/g),
        splitSpace: (/\s+/),
        trimComma: (/\s*,\s*/g)
    },

        gmlFormat: null,

    
        read: function(data) {
        var result;
        if(typeof data == "string") {
            data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
        }
        var root = data.documentElement;
        if(root) {
            var scope = this;
            var read = this["read_" + root.nodeName];
            if(read) {
                result = read.call(this, root);
            } else {
                result = new OpenLayers.Format.GML((this.options ? this.options : {})).read(data);
            }
        } else {
            result = data;
        }
        return result;
    },


        read_msGMLOutput: function(data) {
        var response = [];
        var layerNodes = this.getSiblingNodesByTagCriteria(data,
            this.layerIdentifier);
        if (layerNodes) {
            for (var i=0, len=layerNodes.length; i<len; ++i) {
                var node = layerNodes[i];
                var layerName = node.nodeName;
                if (node.prefix) {
                    layerName = layerName.split(':')[1];
                }
                var layerName = layerName.replace(this.layerIdentifier, '');
                var featureNodes = this.getSiblingNodesByTagCriteria(node,
                    this.featureIdentifier);
                if (featureNodes) {
                    for (var j = 0; j < featureNodes.length; j++) {
                        var featureNode = featureNodes[j];
                        var geomInfo = this.parseGeometry(featureNode);
                        var attributes = this.parseAttributes(featureNode);
                        var feature = new OpenLayers.Feature.Vector(geomInfo.geometry,
                            attributes, null);
                        feature.bounds = geomInfo.bounds;
                        feature.type = layerName;
                        response.push(feature);
                    }
                }
            }
        }
        return response;
    },

        read_FeatureInfoResponse: function(data) {
        var response = [];
        var featureNodes = this.getElementsByTagNameNS(data, '*',
            'FIELDS');

        for(var i=0, len=featureNodes.length;i<len;i++) {
            var featureNode = featureNodes[i];
            var geom = null;
            var attributes = {};
            var j;
            var jlen = featureNode.attributes.length;
            if (jlen > 0) {
                for(j=0; j<jlen; j++) {
                    var attribute = featureNode.attributes[j];
                    attributes[attribute.nodeName] = attribute.nodeValue;
                }
            } else {
                var nodes = featureNode.childNodes;
                for (j=0, jlen=nodes.length; j<jlen; ++j) {
                    var node = nodes[j];
                    if (node.nodeType != 3) {
                        attributes[node.getAttribute("name")] =
                            node.getAttribute("value");
                    }
                }
            }

            response.push(
                new OpenLayers.Feature.Vector(geom, attributes, null)
            );
        }
        return response;
    },

        getSiblingNodesByTagCriteria: function(node, criteria){
        var nodes = [];
        var children, tagName, n, matchNodes, child;
        if (node && node.hasChildNodes()) {
            children = node.childNodes;
            n = children.length;

            for(var k=0; k<n; k++){
                child = children[k];
                while (child && child.nodeType != 1) {
                    child = child.nextSibling;
                    k++;
                }
                tagName = (child ? child.nodeName : '');
                if (tagName.length > 0 && tagName.indexOf(criteria) > -1) {
                    nodes.push(child);
                } else {
                    matchNodes = this.getSiblingNodesByTagCriteria(
                        child, criteria);

                    if(matchNodes.length > 0){
                        (nodes.length == 0) ?
                            nodes = matchNodes : nodes.push(matchNodes);
                    }
                }
            }

        }
        return nodes;
    },

        parseAttributes: function(node){
        var attributes = {};
        if (node.nodeType == 1) {
            var children = node.childNodes;
            var n = children.length;
            for (var i = 0; i < n; ++i) {
                var child = children[i];
                if (child.nodeType == 1) {
                    var grandchildren = child.childNodes;
                    var name = (child.prefix) ?
                        child.nodeName.split(":")[1] : child.nodeName;
                    if (grandchildren.length == 0) {
                        attributes[name] = null;
                    } else if (grandchildren.length == 1 ||
                            grandchildren[0].nodeValue.replace(
                                this.regExes.trimSpace, "").length > 0) {
                        var grandchild = grandchildren[0];
                        if (grandchild.nodeType == 3 ||
                                grandchild.nodeType == 4) {
                            var attribute = grandchild.wholeText ?
                                grandchild.wholeText :
                                grandchild.nodeValue;
                            attributes[name] = attribute.replace(
                                    this.regExes.trimSpace, "");
                        }
                    }
                }
            }
        }
        return attributes;
    },

        parseGeometry: function(node) {
        if (!this.gmlFormat) {
            this.gmlFormat = new OpenLayers.Format.GML();
        }
        var feature = this.gmlFormat.parseFeature(node);
        var geometry, bounds = null;
        if (feature) {
            geometry = feature.geometry && feature.geometry.clone();
            bounds = feature.bounds && feature.bounds.clone();
            feature.destroy();
        }
        return {geometry: geometry, bounds: bounds};
    },

    CLASS_NAME: "OpenLayers.Format.WMSGetFeatureInfo"

});
