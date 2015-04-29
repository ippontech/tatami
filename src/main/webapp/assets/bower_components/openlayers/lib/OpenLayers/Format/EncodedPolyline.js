/* Copyright (c) 2006-2013 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */


OpenLayers.Format.EncodedPolyline = OpenLayers.Class(OpenLayers.Format, {

        geometryType: "linestring",

        initialize: function(options) {
        OpenLayers.Format.prototype.initialize.apply(this, [options]);
    },

        read: function(encoded) {
        var geomType;
        if (this.geometryType == "linestring")
            geomType = OpenLayers.Geometry.LineString;
        else if (this.geometryType == "linearring")
            geomType = OpenLayers.Geometry.LinearRing;
        else if (this.geometryType == "multipoint")
            geomType = OpenLayers.Geometry.MultiPoint;
        else if (this.geometryType != "point" && this.geometryType != "polygon")
            return null;

        var flatPoints = this.decodeDeltas(encoded, 2);
        var flatPointsLength = flatPoints.length;

        var pointGeometries = [];
        for (var i = 0; i + 1 < flatPointsLength;) {
            var y = flatPoints[i++], x = flatPoints[i++];
            pointGeometries.push(new OpenLayers.Geometry.Point(x, y));
        }


        if (this.geometryType == "point")
            return new OpenLayers.Feature.Vector(
                pointGeometries[0]
            );

        if (this.geometryType == "polygon")
            return new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.Polygon([
                    new OpenLayers.Geometry.LinearRing(pointGeometries)
                ])
            );

        return new OpenLayers.Feature.Vector(
            new geomType(pointGeometries)
        );
    },

        decode: function(encoded, dims, opt_factor) {
        var factor = opt_factor || 1e5;
        var flatPoints = this.decodeDeltas(encoded, dims, factor);
        var flatPointsLength = flatPoints.length;

        var points = [];
        for (var i = 0; i + (dims - 1) < flatPointsLength;) {
            var point = [];

            for (var dim = 0; dim < dims; ++dim) {
                point.push(flatPoints[i++])
            }

            points.push(point);
        }

        return points;
    },

        write: function(features) {
        var feature;
        if (features.constructor == Array)
            feature = features[0];
        else
            feature = features;

        var geometry = feature.geometry;
        var type = geometry.CLASS_NAME.split('.')[2].toLowerCase();

        var pointGeometries;
        if (type == "point")
            pointGeometries = new Array(geometry);
        else if (type == "linestring" ||
                 type == "linearring" ||
                 type == "multipoint")
            pointGeometries = geometry.components;
        else if (type == "polygon")
            pointGeometries = geometry.components[0].components;
        else
            return null;

        var flatPoints = [];

        var pointGeometriesLength = pointGeometries.length;
        for (var i = 0; i < pointGeometriesLength; ++i) {
            var pointGeometry = pointGeometries[i];
            flatPoints.push(pointGeometry.y);
            flatPoints.push(pointGeometry.x);
        }

        return this.encodeDeltas(flatPoints, 2);
    },

        encode: function (points, dims, opt_factor) {
        var factor = opt_factor || 1e5;
        var flatPoints = [];

        var pointsLength = points.length;
        for (var i = 0; i < pointsLength; ++i) {
            var point = points[i];

            for (var dim = 0; dim < dims; ++dim) {
                flatPoints.push(point[dim]);
            }
        }

        return this.encodeDeltas(flatPoints, dims, factor);
    },

        encodeDeltas: function(numbers, dimension, opt_factor) {
      var factor = opt_factor || 1e5;
      var d;

      var lastNumbers = new Array(dimension);
      for (d = 0; d < dimension; ++d) {
        lastNumbers[d] = 0;
      }

      var numbersLength = numbers.length;
      for (var i = 0; i < numbersLength;) {
        for (d = 0; d < dimension; ++d, ++i) {
          var num = numbers[i];
          var delta = num - lastNumbers[d];
          lastNumbers[d] = num;

          numbers[i] = delta;
        }
      }

      return this.encodeFloats(numbers, factor);
    },


        decodeDeltas: function(encoded, dimension, opt_factor) {
      var factor = opt_factor || 1e5;
      var d;

      var lastNumbers = new Array(dimension);
      for (d = 0; d < dimension; ++d) {
        lastNumbers[d] = 0;
      }

      var numbers = this.decodeFloats(encoded, factor);

      var numbersLength = numbers.length;
      for (var i = 0; i < numbersLength;) {
        for (d = 0; d < dimension; ++d, ++i) {
          lastNumbers[d] += numbers[i];

          numbers[i] = lastNumbers[d];
        }
      }

      return numbers;
    },


        encodeFloats: function(numbers, opt_factor) {
      var factor = opt_factor || 1e5;

      var numbersLength = numbers.length;
      for (var i = 0; i < numbersLength; ++i) {
        numbers[i] = Math.round(numbers[i] * factor);
      }

      return this.encodeSignedIntegers(numbers);
    },


        decodeFloats: function(encoded, opt_factor) {
      var factor = opt_factor || 1e5;

      var numbers = this.decodeSignedIntegers(encoded);

      var numbersLength = numbers.length;
      for (var i = 0; i < numbersLength; ++i) {
        numbers[i] /= factor;
      }

      return numbers;
    },


        encodeSignedIntegers: function(numbers) {
      var numbersLength = numbers.length;
      for (var i = 0; i < numbersLength; ++i) {
        var num = numbers[i];

        var signedNum = num << 1;
        if (num < 0) {
          signedNum = ~(signedNum);
        }

        numbers[i] = signedNum;
      }

      return this.encodeUnsignedIntegers(numbers);
    },


        decodeSignedIntegers: function(encoded) {
      var numbers = this.decodeUnsignedIntegers(encoded);

      var numbersLength = numbers.length;
      for (var i = 0; i < numbersLength; ++i) {
        var num = numbers[i];
        numbers[i] = (num & 1) ? ~(num >> 1) : (num >> 1);
      }

      return numbers;
    },


        encodeUnsignedIntegers: function(numbers) {
      var encoded = '';

      var numbersLength = numbers.length;
      for (var i = 0; i < numbersLength; ++i) {
        encoded += this.encodeUnsignedInteger(numbers[i]);
      }

      return encoded;
    },


        decodeUnsignedIntegers: function(encoded) {
      var numbers = [];

      var current = 0;
      var shift = 0;

      var encodedLength = encoded.length;
      for (var i = 0; i < encodedLength; ++i) {
        var b = encoded.charCodeAt(i) - 63;

        current |= (b & 0x1f) << shift;

        if (b < 0x20) {
          numbers.push(current);
          current = 0;
          shift = 0;
        } else {
          shift += 5;
        }
      }

      return numbers;
    },


        encodeFloat: function(num, opt_factor) {
      num = Math.round(num * (opt_factor || 1e5));
      return this.encodeSignedInteger(num);
    },


        decodeFloat: function(encoded, opt_factor) {
      var result = this.decodeSignedInteger(encoded);
      return result / (opt_factor || 1e5);
    },


        encodeSignedInteger: function(num) {
      var signedNum = num << 1;
      if (num < 0) {
        signedNum = ~(signedNum);
      }

      return this.encodeUnsignedInteger(signedNum);
    },


        decodeSignedInteger: function(encoded) {
      var result = this.decodeUnsignedInteger(encoded);
      return ((result & 1) ? ~(result >> 1) : (result >> 1));
    },


        encodeUnsignedInteger: function(num) {
      var value, encoded = '';
      while (num >= 0x20) {
        value = (0x20 | (num & 0x1f)) + 63;
        encoded += (String.fromCharCode(value));
        num >>= 5;
      }
      value = num + 63;
      encoded += (String.fromCharCode(value));
      return encoded;
    },


        decodeUnsignedInteger: function(encoded) {
      var result = 0;
      var shift = 0;

      var encodedLength = encoded.length;
      for (var i = 0; i < encodedLength; ++i) {
        var b = encoded.charCodeAt(i) - 63;

        result |= (b & 0x1f) << shift;

        if (b < 0x20)
          break;

        shift += 5;
      }

      return result;
    },

    CLASS_NAME: "OpenLayers.Format.EncodedPolyline"
});
