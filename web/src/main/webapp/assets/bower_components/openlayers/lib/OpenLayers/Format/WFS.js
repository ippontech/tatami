/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.WFS = OpenLayers.Class(OpenLayers.Format.GML, {
    
        layer: null,
    
        wfsns: "http://www.opengis.net/wfs",
    
        ogcns: "http://www.opengis.net/ogc",
    
        initialize: function(options, layer) {
        OpenLayers.Format.GML.prototype.initialize.apply(this, [options]);
        this.layer = layer;
        if (this.layer.featureNS) {
            this.featureNS = this.layer.featureNS;
        }    
        if (this.layer.options.geometry_column) {
            this.geometryName = this.layer.options.geometry_column;
        }
        if (this.layer.options.typename) {
            this.featureName = this.layer.options.typename;
        }
    },
    
        write: function(features) {
    
        var transaction = this.createElementNS(this.wfsns, 'wfs:Transaction');
        transaction.setAttribute("version","1.0.0");
        transaction.setAttribute("service","WFS");
        for (var i=0; i < features.length; i++) {
            switch (features[i].state) {
                case OpenLayers.State.INSERT:
                    transaction.appendChild(this.insert(features[i]));
                    break;
                case OpenLayers.State.UPDATE:
                    transaction.appendChild(this.update(features[i]));
                    break;
                case OpenLayers.State.DELETE:
                    transaction.appendChild(this.remove(features[i]));
                    break;
            }
        }
        
        return OpenLayers.Format.XML.prototype.write.apply(this,[transaction]);
    },
   
        insert: function(feature) {
        var insertNode = this.createElementNS(this.wfsns, 'wfs:Insert');
        insertNode.appendChild(this.createFeatureXML(feature));
        return insertNode;
    },
    
        update: function(feature) {
        if (!feature.fid) { OpenLayers.Console.userError(OpenLayers.i18n("noFID")); }
        var updateNode = this.createElementNS(this.wfsns, 'wfs:Update');
        updateNode.setAttribute("typeName", this.featurePrefix + ':' + this.featureName); 
        updateNode.setAttribute("xmlns:" + this.featurePrefix, this.featureNS); 

        var propertyNode = this.createElementNS(this.wfsns, 'wfs:Property');
        var nameNode = this.createElementNS(this.wfsns, 'wfs:Name');
        
        var txtNode = this.createTextNode(this.geometryName);
        nameNode.appendChild(txtNode);
        propertyNode.appendChild(nameNode);
        
        var valueNode = this.createElementNS(this.wfsns, 'wfs:Value');
        
        var geometryNode = this.buildGeometryNode(feature.geometry);
        
        if(feature.layer){
            geometryNode.setAttribute(
                "srsName", feature.layer.projection.getCode()
            );
        }
        
        valueNode.appendChild(geometryNode);
        
        propertyNode.appendChild(valueNode);
        updateNode.appendChild(propertyNode);
        for(var propName in feature.attributes) {
            propertyNode = this.createElementNS(this.wfsns, 'wfs:Property');
            nameNode = this.createElementNS(this.wfsns, 'wfs:Name');
            nameNode.appendChild(this.createTextNode(propName));
            propertyNode.appendChild(nameNode);
            valueNode = this.createElementNS(this.wfsns, 'wfs:Value');
            valueNode.appendChild(this.createTextNode(feature.attributes[propName]));
            propertyNode.appendChild(valueNode);
            updateNode.appendChild(propertyNode);
        }
        
        
        var filterNode = this.createElementNS(this.ogcns, 'ogc:Filter');
        var filterIdNode = this.createElementNS(this.ogcns, 'ogc:FeatureId');
        filterIdNode.setAttribute("fid", feature.fid);
        filterNode.appendChild(filterIdNode);
        updateNode.appendChild(filterNode);

        return updateNode;
    },
    
        remove: function(feature) {
        if (!feature.fid) { 
            OpenLayers.Console.userError(OpenLayers.i18n("noFID")); 
            return false; 
        }
        var deleteNode = this.createElementNS(this.wfsns, 'wfs:Delete');
        deleteNode.setAttribute("typeName", this.featurePrefix + ':' + this.featureName); 
        deleteNode.setAttribute("xmlns:" + this.featurePrefix, this.featureNS); 

        var filterNode = this.createElementNS(this.ogcns, 'ogc:Filter');
        var filterIdNode = this.createElementNS(this.ogcns, 'ogc:FeatureId');
        filterIdNode.setAttribute("fid", feature.fid);
        filterNode.appendChild(filterIdNode);
        deleteNode.appendChild(filterNode);

        return deleteNode;
    },

        destroy: function() {
        this.layer = null;
    },

    CLASS_NAME: "OpenLayers.Format.WFS" 
});    
