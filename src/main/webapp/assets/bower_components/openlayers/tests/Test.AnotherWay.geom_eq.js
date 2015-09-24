
(function() {
    
        function assertEqual(got, expected, msg) {
        if(got === undefined) {
            got = "undefined";
        } else if (got === null) {
            got = "null";
        }
        if(expected === undefined) {
            expected = "undefined";
        } else if (expected === null) {
            expected = "null";
        }
        if(got != expected) {
            throw msg + ": got '" + got + "' but expected '" + expected + "'";
        }
    }
    
        function assertFloatEqual(got, expected, msg) {
        var OpenLayers = Test.AnotherWay._g_test_iframe.OpenLayers;
        if(got === undefined) {
            got = "undefined";
        } else if (got === null) {
            got = "null";
        }
        if(expected === undefined) {
            expected = "undefined";
        } else if (expected === null) {
            expected = "null";
        }
        if(Math.abs(got - expected) > Math.pow(10, -OpenLayers.Util.DEFAULT_PRECISION)) {
            throw msg + ": got '" + got + "' but expected '" + expected + "'";
        }
    }
    
        function assertGeometryEqual(got, expected, options) {
        
        var OpenLayers = Test.AnotherWay._g_test_iframe.OpenLayers;
        assertEqual(typeof got, typeof expected, "Object types mismatch");
        assertEqual(got.CLASS_NAME, expected.CLASS_NAME, "Object class mismatch");
        
        if(got instanceof OpenLayers.Geometry.Point) {
            assertFloatEqual(got.x, expected.x, "x mismatch");
            assertFloatEqual(got.y, expected.y, "y mismatch");
            assertFloatEqual(got.z, expected.z, "z mismatch");
        } else {
            assertEqual(
                got.components.length, expected.components.length,
                "Component length mismatch for " + got.CLASS_NAME
            );
            for(var i=0; i<got.components.length; ++i) {
                try {
                    assertGeometryEqual(
                        got.components[i], expected.components[i], options
                    );
                } catch(err) {
                    throw "Bad component " + i + " for " + got.CLASS_NAME + ": " + err;
                }
            }
        }
        return true;
    }
    
        var proto = Test.AnotherWay._test_object_t.prototype;
    proto.geom_eq = function(got, expected, msg, options) {        
        try {
            assertGeometryEqual(got, expected, options);
            this.ok(true, msg);
        } catch(err) {
            this.fail(msg + ": " + err);
        }
    }
    
})();
