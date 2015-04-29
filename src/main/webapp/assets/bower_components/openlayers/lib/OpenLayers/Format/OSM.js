/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.OSM = OpenLayers.Class(OpenLayers.Format.XML, {

        checkTags: false,

        shareNode: false,

        interestingTagsExclude: null,

        areaTags: null,

        relationsParsers: {},

        initialize: function(options) {
        var layer_defaults = {
          'interestingTagsExclude': ['source', 'source_ref',
              'source:ref', 'history', 'attribution', 'created_by'],
          'areaTags': ['area', 'building', 'leisure', 'tourism', 'ruins',
              'historic', 'landuse', 'military', 'natural', 'sport']
        };
        options = options ? options : {};

        layer_defaults = OpenLayers.Util.extend(layer_defaults, options);

        var interesting = {};
        for (var i = 0; i < layer_defaults.interestingTagsExclude.length; i++) {
            interesting[layer_defaults.interestingTagsExclude[i]] = true;
        }
        layer_defaults.interestingTagsExclude = interesting;

        var area = {};
        for (var i = 0; i < layer_defaults.areaTags.length; i++) {
            area[layer_defaults.areaTags[i]] = true;
        }
        layer_defaults.areaTags = area;
        this.externalProjection = new OpenLayers.Projection("EPSG:4326");

        OpenLayers.Format.XML.prototype.initialize.apply(this, [layer_defaults]);
    },

        read: function(doc) {
        if (typeof doc == "string") {
            doc = OpenLayers.Format.XML.prototype.read.apply(this, [doc]);
        }

        var nodes = this.getNodes(doc);
        var ways = this.getWays(doc);
        var relations = this.getRelations(doc);
        var feat_list = [];

        for (var relation_id in relations) {
            var relation = relations[relation_id];
            if (this.relationsParsers[relation.tags.type]) {
                var features = this.relationsParsers[relation.tags.type](relation, this, nodes, ways, relations);
                for (var i = 0, len = features.length ; i < len ; i++) {
                    feat_list.push(features[i]);
                }
            }
        }

        for (var way_id in ways) {
            var way = ways[way_id];

            if (way.interesting) {
                var poly = this.isWayArea(way) ? 1 : 0;
                var point_list = this.getPointList(way, nodes);
                var geometry = null;
                if (poly) {
                    geometry = new OpenLayers.Geometry.Polygon(
                        new OpenLayers.Geometry.LinearRing(point_list));
                }
                else {
                    geometry = new OpenLayers.Geometry.LineString(point_list);
                }
                var feat = new OpenLayers.Feature.Vector(geometry,
                    way.tags);
                feat.osm_id = parseInt(way.id);
                feat.osm_version = parseInt(way.version);
                feat.geometry.osm_id = feat.osm_id;
                feat.type = "way";
                feat.fid = "way." + feat.osm_id;
                feat_list.push(feat);
            }
        }
        for (var node_id in nodes) {
            var node = nodes[node_id];
            if (!node.used || !this.checkTags || Object.keys(node.attributes).length > 1) {
                feat_list.push(node);
            }
        }
        return feat_list;
    },

        getPointList: function(way, nodes) {
        if (!way) {
            return [];
        }
        var point_list = new Array(way.nodes.length);
        for (var j = 0; j < way.nodes.length; j++) {
            var node = nodes[way.nodes[j]];
            node.used = true;

            var point = node.geometry;
            if (!this.shareNode) {
                point = new OpenLayers.Geometry.Point(node.geometry.x, node.geometry.y);
                point.osm_id = node.osm_id;
            }

            point_list[j] = point;
        }
        return point_list;
    },

        concatPathsIfLinear: function(lastPointList, pointList) {
        var result = {};
        if (lastPointList.length == 0) {
            result.succed = true;
            result.lastPointList = pointList;
            return result;
        }
        if (pointList.length == 0) {
            result.succed = true;
            result.lastPointList = lastPointList;
            return result;
        }
        if (lastPointList[lastPointList.length-1].x == pointList[0].x
         && lastPointList[lastPointList.length-1].y == pointList[0].y) {
            pointList = pointList.slice(1, pointList.length);
            lastPointList = lastPointList.concat(pointList);
            result.succed = true;
            result.lastPointList = lastPointList;
            return result;
        }
        else if (lastPointList[0].x == pointList[pointList.length-1].x
              && lastPointList[0].y == pointList[pointList.length-1].y) {
            lastPointList = lastPointList.slice(1, lastPointList.length);
            lastPointList = pointList.concat(lastPointList);
            result.succed = true;
            result.lastPointList = lastPointList;
            return result;
        }
        else if (lastPointList[0].x == pointList[0].x
              && lastPointList[0].y == pointList[0].y) {
            if (lastPointList.length > pointList.length) {
                pointList = pointList.slice(1, pointList.length);
                lastPointList = pointList.reverse().concat(lastPointList);
            }
            else {
                lastPointList = lastPointList.slice(1, lastPointList.length);
                lastPointList = lastPointList.reverse().concat(pointList);
            }
            result.succed = true;
            result.lastPointList = lastPointList;
            return result;
        }
        else if (lastPointList[lastPointList.length-1].x == pointList[pointList.length-1].x
              && lastPointList[lastPointList.length-1].y == pointList[pointList.length-1].y) {
            if (lastPointList.length > pointList.length) {
                pointList = pointList.slice(0, pointList.length - 1);
                lastPointList = lastPointList.concat(pointList.reverse());
            }
            else {
                lastPointList = lastPointList.slice(0, lastPointList.length - 1);
                lastPointList = pointList.concat(lastPointList.reverse());
            }
            result.succed = true;
            result.lastPointList = lastPointList;
            return result;
        }
        result.succed = false;
        return result;
    },

        getNodes: function(doc) {
        var node_list = doc.getElementsByTagName("node");
        var nodes = {};
        for (var i = 0; i < node_list.length; i++) {
            var node = node_list[i];
            var id = node.getAttribute("id");
            var geom = new OpenLayers.Geometry.Point(
                    node.getAttribute("lon"),
                    node.getAttribute("lat"))
            if (this.internalProjection && this.externalProjection) {
                geom.transform(this.externalProjection,
                    this.internalProjection);
            }
            var feat = new OpenLayers.Feature.Vector(geom, this.getTags(node));
            feat.osm_id = parseInt(id);
            feat.osm_version = parseInt(node.getAttribute("version"));
            feat.type = "node";
            feat.fid = "node." + feat.osm_id;
            feat.geometry.osm_id = feat.osm_id;

            nodes[id] = feat;
        }
        return nodes;
    },

        getRelations: function(doc) {
        var relation_list = doc.getElementsByTagName("relation");
        var return_relations = {};
        for (var i = 0; i < relation_list.length; i++) {
            var relation = relation_list[i];
            var id = relation.getAttribute("id");
            var relation_object = {
              id: id,
              version: relation.getAttribute("version")
            };

            relation_object.tags = this.getTags(relation);
            relation_object.nodes = [];
            relation_object.ways = [];
            relation_object.relations = [];

            var member_list = relation.getElementsByTagName("member");

            for (var j = 0; j < member_list.length; j++) {
                var member = member_list[j];
                var type = member.getAttribute("type");
                if (type == 'node') {
                    relation_object.nodes[relation_object.nodes.length] = member;
                }
                else if (type == 'way') {
                    relation_object.ways[relation_object.ways.length] = member;
                }
                else if (type == 'relation') {
                    relation_object.relations[relation_object.relations.length] = member;
                }
            }
            return_relations[id] = relation_object;
        }
        return return_relations;

    },

        getWays: function(doc) {
        var way_list = doc.getElementsByTagName("way");
        var return_ways = {};
        for (var i = 0; i < way_list.length; i++) {
            var way = way_list[i];
            var id = way.getAttribute("id");
            var way_object = {
              id: id,
              version: way.getAttribute("version")
            };

            if (this.checkTags) {
                var result = this.getTags(way, true);
                way_object.interesting = result[1];
                way_object.tags = result[0];
            } else {
                way_object.interesting = true;
                way_object.tags = this.getTags(way);
            }

            var node_list = way.getElementsByTagName("nd");

            way_object.nodes = new Array(node_list.length);

            for (var j = 0; j < node_list.length; j++) {
                way_object.nodes[j] = node_list[j].getAttribute("ref");
            }
            return_ways[id] = way_object;
        }
        return return_ways;

    },

        getTags: function(dom_node, interesting_tags) {
        var tag_list = dom_node.getElementsByTagName("tag");
        var tags = {};
        var interesting = false;
        for (var j = 0; j < tag_list.length; j++) {
            var key = tag_list[j].getAttribute("k");
            if (!this.checkTags || !this.interestingTagsExclude[key]) {
                tags[key] = tag_list[j].getAttribute("v");
            }
            if (interesting_tags && !this.interestingTagsExclude[key]) {
                interesting = true;
            }
        }
        return interesting_tags ? [tags, interesting] : tags;
    },

        isWayArea: function(way) {
        var poly_shaped = false;
        var poly_tags = false;

        if (way.nodes[0] == way.nodes[way.nodes.length - 1]) {
            poly_shaped = true;
        }
        if (this.checkTags) {
            for(var key in way.tags) {
                if (this.areaTags[key]) {
                    poly_tags = true;
                    break;
                }
            }
        }
        return poly_shaped && (this.checkTags ? poly_tags : true);
    },

        write: function(features) {
        if (!(OpenLayers.Util.isArray(features))) {
            features = [features];
        }

        this.osm_id = 1;
        this.created_nodes = {};
        var root_node = this.createElementNS(null, "osm");
        root_node.setAttribute("version", "0.5");
        root_node.setAttribute("generator", "OpenLayers "+ OpenLayers.VERSION_NUMBER);
        for(var i = features.length - 1; i >= 0; i--) {
            var nodes = this.createFeatureNodes(features[i]);
            for (var j = 0; j < nodes.length; j++) {
                root_node.appendChild(nodes[j]);
            }
        }
        return OpenLayers.Format.XML.prototype.write.apply(this, [root_node]);
    },

        createFeatureNodes: function(feature) {
        var nodes = [];
        var className = feature.geometry.CLASS_NAME;
        var type = className.substring(className.lastIndexOf(".") + 1);
        type = type.toLowerCase();
        var builder = this.createXML[type];
        if (builder) {
            nodes = builder.apply(this, [feature]);
        }
        return nodes;
    },

        createXML: {
        'point': function(point) {
            var id = null;
            var geometry = point.geometry ? point.geometry : point;

            if (this.internalProjection && this.externalProjection) {
                geometry = geometry.clone();
                geometry.transform(this.internalProjection,
                                   this.externalProjection);
            }

            var already_exists = false; // We don't return anything if the node
            if (point.osm_id) {
                id = point.osm_id;
                if (this.created_nodes[id]) {
                    already_exists = true;
                }
            } else {
               id = -this.osm_id;
               this.osm_id++;
            }
            if (already_exists) {
                node = this.created_nodes[id];
            } else {
                var node = this.createElementNS(null, "node");
            }
            this.created_nodes[id] = node;
            node.setAttribute("id", id);
            node.setAttribute("lon", geometry.x);
            node.setAttribute("lat", geometry.y);
            if (point.attributes) {
                this.serializeTags(point, node);
            }
            this.setState(point, node);
            return already_exists ? [] : [node];
        },
        linestring: function(feature) {
            var id;
            var nodes = [];
            var geometry = feature.geometry;
            if (feature.osm_id) {
                id = feature.osm_id;
            } else {
                id = -this.osm_id;
                this.osm_id++;
            }
            var way = this.createElementNS(null, "way");
            way.setAttribute("id", id);
            for (var i = 0; i < geometry.components.length; i++) {
                var node = this.createXML['point'].apply(this, [geometry.components[i]]);
                if (node.length) {
                    node = node[0];
                    var node_ref = node.getAttribute("id");
                    nodes.push(node);
                } else {
                    node_ref = geometry.components[i].osm_id;
                    node = this.created_nodes[node_ref];
                }
                this.setState(feature, node);
                var nd_dom = this.createElementNS(null, "nd");
                nd_dom.setAttribute("ref", node_ref);
                way.appendChild(nd_dom);
            }
            this.serializeTags(feature, way);
            nodes.push(way);

            return nodes;
        },
        polygon: function(feature) {
            var attrs = OpenLayers.Util.extend({'area':'yes'}, feature.attributes);
            var feat = new OpenLayers.Feature.Vector(feature.geometry.components[0], attrs);
            feat.osm_id = feature.osm_id;
            feat.geometry.osm_id = feat.osm_id;
            return this.createXML['linestring'].apply(this, [feat]);
        }
    },

        serializeTags: function(feature, node) {
        for (var key in feature.attributes) {
            var tag = this.createElementNS(null, "tag");
            tag.setAttribute("k", key);
            tag.setAttribute("v", feature.attributes[key]);
            node.appendChild(tag);
        }
    },

        setState: function(feature, node) {
        if (feature.state) {
            var state = null;
            switch(feature.state) {
                case OpenLayers.State.UPDATE:
                    state = "modify";
                case OpenLayers.State.DELETE:
                    state = "delete";
            }
            if (state) {
                node.setAttribute("action", state);
            }
        }
    },

    CLASS_NAME: "OpenLayers.Format.OSM"
});

OpenLayers.Format.OSM.multipolygonParser = function(relation, parser, nodes, ways, relations) {
    var lastRole = '';
    var lastPointList = [];
    var innerLignes = [];
    var outerLignes = [];

    for (var j = 0; j < relation.ways.length; j++) {
        var way = relation.ways[j]
        var ref = way.getAttribute("ref");
        var role = way.getAttribute("role");

        var pointList = parser.getPointList(ways[ref], nodes);
        if (pointList.length == 0) {
            continue;
        }
        var newPath = true;
        if (lastRole == '') {
            lastRole = role;
        }
        if (lastRole == role) {
            var result = parser.concatPathsIfLinear(lastPointList, pointList);
            if (result.succed) {
                newPath = false;
                lastPointList = result.lastPointList;
            }
        }

        if (newPath) {
            if (lastPointList.length > 0) {
                if (lastRole == 'inner' || lastRole == 'enclave') {
                    var geometry = new OpenLayers.Geometry.LinearRing(lastPointList)
                    innerLignes.push(geometry);
                }
                else { // if (lastRole == 'outer') {
                    var geometry = new OpenLayers.Geometry.LinearRing(lastPointList)
                    outerLignes.push(geometry);
                }
            }
            lastPointList = pointList;
            lastRole = role;
        }
    }
    if (lastPointList.length > 0) {
        if (lastRole == 'inner' || lastRole == 'enclave') {
            var geometry = new OpenLayers.Geometry.LinearRing(lastPointList)
            innerLignes.push(geometry);
        }
        else { // if (lastRole == 'outer') {
            var geometry = new OpenLayers.Geometry.LinearRing(lastPointList)
            outerLignes.push(geometry);
        }
    }

    var polygons = [];
    for (var j = 0 ; j < outerLignes.length ; j++) {
        if (innerLignes.length == 0) {
            polygons.push(new OpenLayers.Geometry.Polygon([outerLignes[j]]));
        }
        else {
            var currentInners = [];
            for (var k = 0 ; k < innerLignes.length ; k++) {
                var inner = innerLignes[k];
                if (outerLignes[j].containsPoint(inner.getCentroid())) {
                    currentInners.push(inner);
                }
            }
            polygons.push(new OpenLayers.Geometry.Polygon(
                    [outerLignes[j]].concat(currentInners)));
        }
    }
    var geometry = new OpenLayers.Geometry.MultiPolygon(polygons);
    var feat = new OpenLayers.Feature.Vector(geometry, relation.tags);
    feat.osm_id = parseInt(relation.id);
    feat.type = "relation";
    feat.fid = "relation." + feat.osm_id;
    return [feat];
},

OpenLayers.Format.OSM.getLineStrings = function(relation, parser, nodes, ways) {
    var geometries = [];
    for (var j = 0; j < relation.ways.length; j++) {
        var way = relation.ways[j]
        var ref = way.getAttribute("ref");
        var pointList = parser.getPointList(ways[ref], nodes);
        if (pointList.length == 0) {
            continue;
        }

        geometries.push(new OpenLayers.Geometry.LineString(pointList));
    }
    return geometries;
}

OpenLayers.Format.OSM.routeParser = function(relation, parser, nodes, ways, relations) {
    var geometries = OpenLayers.Format.OSM.getLineStrings(relation, parser, nodes, ways);
    var geometry = new OpenLayers.Geometry.MultiLineString(geometries);
    var feat = new OpenLayers.Feature.Vector(geometry, relation.tags);
    feat.osm_id = parseInt(relation.id);
    feat.type = "relation";
    feat.fid = "relation." + feat.osm_id;
    return [feat];
}

OpenLayers.Format.OSM.genericParser = function(relation, parser, nodes, ways, relations) {
    var geometries = OpenLayers.Format.OSM.getLineStrings(relation, parser, nodes, ways);
    for (var j = 0; j < relation.nodes.length; j++) {
        var node = relation.nodes[j]
        geometries.push(new OpenLayers.Geometry.Node(node));
    }
    var geometry = new OpenLayers.Geometry.Collection(geometries);
    var feat = new OpenLayers.Feature.Vector(geometry, relation.tags);
    feat.osm_id = parseInt(relation.id);
    feat.type = "relation";
    feat.fid = "relation." + feat.osm_id;
    return [feat];
}

OpenLayers.Format.OSM.routeParserWithRoles = function(relation, parser, nodes, ways, relations) {
    var geometries = [];
    var lastRole = '';
    var lastPointList = [];
    var features = [];

    for (var j = 0; j < relation.ways.length; j++) {
        var way = relation.ways[j]
        var ref = way.getAttribute("ref");
        var role = way.getAttribute("role");

        var pointList = parser.getPointList(ways[ref], nodes);
        if (pointList.length == 0) {
            continue;
        }
        var newPath = true;
        if (lastRole == '') {
            lastRole = role;
        }
        if (lastRole == role) {
            var result = parser.concatPathsIfLinear(lastPointList, pointList);
            if (result.succed) {
                newPath = false;
                lastPointList = result.lastPointList;
            }
        }
        if (newPath) {
            var geometry = new OpenLayers.Geometry.LineString(lastPointList)
            var feat = new OpenLayers.Feature.Vector(geometry, relation.tags);
            if (role) {
                feat.attributes.role = role;
            }
            feat.osm_id = parseInt(relation.id);
            feat.type = "relation";
            feat.fid = "relation." + feat.osm_id + "." + j;
            features.push(feat);
            lastPointList = pointList;
            lastRole = role;
        }
    }
    var geometry = new OpenLayers.Geometry.LineString(lastPointList)
    var feat = new OpenLayers.Feature.Vector(geometry, relation.tags);
    if (role) {
        feat.attributes.role = role;
    }
    feat.osm_id = parseInt(relation.id);
    feat.type = "relation";
    feat.fid = "relation." + feat.osm_id;
    features.push(feat);
    return features;
}
