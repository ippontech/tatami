(function(global){
  "use strict";

  var _ = global._;

  var arrayPrototype = Array.prototype;
  var arrayMethods = ['forEach', 'indexOf', 'map', 'filter', 'reduce', 'every', 'some', 'toArray', 'first', 'last'];

  var functionFactory = function(method){
    return function(){
      var args = _.union([this], arguments);
      return _[method].apply(args);
    };
  };

  for (var index in arrayMethods){
    var method = arrayMethods[index];
    if(typeof arrayPrototype[method] === 'undefined')
      arrayPrototype[method] = functionFactory(method);
  }
}(self));