/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Geometry.MultiLineString = OpenLayers.Class(
  OpenLayers.Geometry.Collection, {

        componentTypes: ["OpenLayers.Geometry.LineString"],

        
        split: function(geometry, options) {
        var results = null;
        var mutual = options && options.mutual;
        var splits, sourceLine, sourceLines, sourceSplit, targetSplit;
        var sourceParts = [];
        var targetParts = [geometry];
        for(var i=0, len=this.components.length; i<len; ++i) {
            sourceLine = this.components[i];
            sourceSplit = false;
            for(var j=0; j < targetParts.length; ++j) { 
                splits = sourceLine.split(targetParts[j], options);
                if(splits) {
                    if(mutual) {
                        sourceLines = splits[0];
                        for(var k=0, klen=sourceLines.length; k<klen; ++k) {
                            if(k===0 && sourceParts.length) {
                                sourceParts[sourceParts.length-1].addComponent(
                                    sourceLines[k]
                                );
                            } else {
                                sourceParts.push(
                                    new OpenLayers.Geometry.MultiLineString([
                                        sourceLines[k]
                                    ])
                                );
                            }
                        }
                        sourceSplit = true;
                        splits = splits[1];
                    }
                    if(splits.length) {
                        splits.unshift(j, 1);
                        Array.prototype.splice.apply(targetParts, splits);
                        break;
                    }
                }
            }
            if(!sourceSplit) {
                if(sourceParts.length) {
                    sourceParts[sourceParts.length-1].addComponent(
                        sourceLine.clone()
                    );
                } else {
                    sourceParts = [
                        new OpenLayers.Geometry.MultiLineString(
                            sourceLine.clone()
                        )
                    ];
                }
            }
        }
        if(sourceParts && sourceParts.length > 1) {
            sourceSplit = true;
        } else {
            sourceParts = [];
        }
        if(targetParts && targetParts.length > 1) {
            targetSplit = true;
        } else {
            targetParts = [];
        }
        if(sourceSplit || targetSplit) {
            if(mutual) {
                results = [sourceParts, targetParts];
            } else {
                results = targetParts;
            }
        }
        return results;
    },
    
        splitWith: function(geometry, options) {
        var results = null;
        var mutual = options && options.mutual;
        var splits, targetLine, sourceLines, sourceSplit, targetSplit, sourceParts, targetParts;
        if(geometry instanceof OpenLayers.Geometry.LineString) {
            targetParts = [];
            sourceParts = [geometry];
            for(var i=0, len=this.components.length; i<len; ++i) {
                targetSplit = false;
                targetLine = this.components[i];
                for(var j=0; j<sourceParts.length; ++j) {
                    splits = sourceParts[j].split(targetLine, options);
                    if(splits) {
                        if(mutual) {
                            sourceLines = splits[0];
                            if(sourceLines.length) {
                                sourceLines.unshift(j, 1);
                                Array.prototype.splice.apply(sourceParts, sourceLines);
                                j += sourceLines.length - 2;
                            }
                            splits = splits[1];
                            if(splits.length === 0) {
                                splits = [targetLine.clone()];
                            }
                        }
                        for(var k=0, klen=splits.length; k<klen; ++k) {
                            if(k===0 && targetParts.length) {
                                targetParts[targetParts.length-1].addComponent(
                                    splits[k]
                                );
                            } else {
                                targetParts.push(
                                    new OpenLayers.Geometry.MultiLineString([
                                        splits[k]
                                    ])
                                );
                            }
                        }
                        targetSplit = true;                    
                    }
                }
                if(!targetSplit) {
                    if(targetParts.length) {
                        targetParts[targetParts.length-1].addComponent(
                            targetLine.clone()
                        );
                    } else {
                        targetParts = [
                            new OpenLayers.Geometry.MultiLineString([
                                targetLine.clone()
                            ])
                        ];
                    }
                    
                }
            }
        } else {
            results = geometry.split(this);
        }
        if(sourceParts && sourceParts.length > 1) {
            sourceSplit = true;
        } else {
            sourceParts = [];
        }
        if(targetParts && targetParts.length > 1) {
            targetSplit = true;
        } else {
            targetParts = [];
        }
        if(sourceSplit || targetSplit) {
            if(mutual) {
                results = [sourceParts, targetParts];
            } else {
                results = targetParts;
            }
        }
        return results;
    },

    CLASS_NAME: "OpenLayers.Geometry.MultiLineString"
});
