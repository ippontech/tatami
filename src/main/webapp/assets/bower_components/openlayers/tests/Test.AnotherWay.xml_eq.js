
(function() {

        function createNode(text) {
        
        var index = text.indexOf('<');
        if(index > 0) {
            text = text.substring(index);
        }
        
        var doc;
        if(window.ActiveXObject && !this.xmldom) {
            doc = new ActiveXObject("Microsoft.XMLDOM");
            try {
                doc.loadXML(text);
            } catch(err) {
                throw "ActiveXObject loadXML failed: " + err;
            }
        } else if(window.DOMParser) {
            try {
                doc = new DOMParser().parseFromString(text, 'text/xml');
            } catch(err) {
                throw "DOMParser.parseFromString failed";
            }
            if(doc.documentElement && doc.documentElement.nodeName == "parsererror") {
                throw "DOMParser.parseFromString returned parsererror";
            }
        } else {
            var req = new XMLHttpRequest();
            req.open("GET", "data:text/xml;charset=utf-8," +
                     encodeURIComponent(text), false);
            if(req.overrideMimeType) {
                req.overrideMimeType("text/xml");
            }
            req.send(null);
            doc = req.responseXML;
        }
        
        var root = doc.documentElement;
        if(!root) {
            throw "no documentElement";
        }
        return root;
    }
    
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
    
        function assertElementNodesEqual(got, expected, options) {
        var testPrefix = (options && options.prefix === true);
        assertEqual(got.nodeType, expected.nodeType, "Node type mismatch");
        var gotName = testPrefix ?
            got.nodeName : got.nodeName.split(":").pop();
        var expName = testPrefix ?
            expected.nodeName : expected.nodeName.split(":").pop();
        assertEqual(gotName, expName, "Node name mismatch");
        if(got.nodeType == 3) {
            assertEqual(
                got.nodeValue, expected.nodeValue, "Node value mismatch"
            );
        }
        else if(got.nodeType == 1) {
            if(got.prefix || expected.prefix) {
                if(testPrefix) {
                    assertEqual(
                        got.prefix, expected.prefix,
                        "Bad prefix for " + got.nodeName
                    );
                }
            }
            if(got.namespaceURI || expected.namespaceURI) {
                assertEqual(
                    got.namespaceURI, expected.namespaceURI,
                    "Bad namespaceURI for " + got.nodeName
                );
            }
            var gotAttrLen = 0;
            var gotAttr = {};
            var expAttrLen = 0;
            var expAttr = {};
            var ga, ea, gn, en;
            for(var i=0; i<got.attributes.length; ++i) {
                ga = got.attributes[i];
                if(ga.specified === undefined || ga.specified === true) {
                    if(ga.name.split(":").shift() != "xmlns") {
                        gn = testPrefix ? ga.name : ga.name.split(":").pop();
                        gotAttr[gn] = ga;
                        ++gotAttrLen;
                    }
                }
            }
            for(var i=0; i<expected.attributes.length; ++i) {
                ea = expected.attributes[i];
                if(ea.specified === undefined || ea.specified === true) {
                    if(ea.name.split(":").shift() != "xmlns") {
                        en = testPrefix ? ea.name : ea.name.split(":").pop();
                        expAttr[en] = ea;
                        ++expAttrLen;
                    }
                }
            }
            assertEqual(
                gotAttrLen, expAttrLen,
                "Attributes length mismatch for " + got.nodeName
            );
            var gv, ev;
            for(var name in gotAttr) {
                if(expAttr[name] == undefined) {
                    throw "Attribute name " + gotAttr[name].name + " expected for element " + got.nodeName;
                }
                assertEqual(
                    gotAttr[name].namespaceURI, expAttr[name].namespaceURI,
                    "Attribute namespace mismatch for element " +
                    got.nodeName + " attribute name " + gotAttr[name].name
                );
                assertEqual(
                    gotAttr[name].value, expAttr[name].value,
                    "Attribute value mismatch for element " + got.nodeName +
                    " attribute name " + gotAttr[name].name
                );
            }
            var gotChildNodes = getChildNodes(got, options);
            var expChildNodes = getChildNodes(expected, options);

            assertEqual(
                gotChildNodes.length, expChildNodes.length,
                "Children length mismatch for " + got.nodeName
            );
            for(var j=0; j<gotChildNodes.length; ++j) {
                try {
                    assertElementNodesEqual(
                        gotChildNodes[j], expChildNodes[j], options
                    );
                } catch(err) {
                    throw "Bad child " + j + " for element " + got.nodeName + ": " + err;
                }
            }
        }
        return true;
    }

        function getChildNodes(node, options) {
        if (options && options.includeWhiteSpace) {
            return node.childNodes;
        }
        else {
           nodes = [];
           for (var i = 0; i < node.childNodes.length; i++ ) {
              var child = node.childNodes[i];
              if (child.nodeType == 1) {
                 nodes.push(child);
              }
              else if (child.nodeType == 3) {
                 if (child.nodeValue && 
                       child.nodeValue.replace(/^\s*(.*?)\s*$/, "$1") != "" ) { 

                    nodes.push(child);
                 }
              }
           }
  
           return nodes;
        }
    } 
    
        var proto = Test.AnotherWay._test_object_t.prototype;
    proto.xml_eq = function(got, expected, msg, options) {
        if(typeof got == "string") {
            try {
                got = createNode(got);
            } catch(err) {
                this.fail(msg + ": got argument could not be converted to an XML node: " + err);
                return;
            }
        }
        if(typeof expected == "string") {
            try {
                expected = createNode(expected);
            } catch(err) {
                this.fail(msg + ": expected argument could not be converted to an XML node: " + err);
                return;
            }
        }
        try {
            assertElementNodesEqual(got, expected, options);
            this.ok(true, msg);
        } catch(err) {
            this.fail(msg + ": " + err);
        }
    }
    
})();
