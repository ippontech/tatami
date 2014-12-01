(function(global){
  'use strict';

  var _ = global._;

  var arrayPrototype = Array.prototype;
  var arrayMethods = ['forEach', 'indexOf', 'map', 'filter', 'reduce', 'every', 'some', 'toArray', 'first', 'last'];

  var functionFactory = function(method){
    return function(){
      var args = Array.prototype.slice.apply(arguments);
      args.unshift(this);
      return _[method].apply(_, args);
    };
  };

  for (var index in arrayMethods){
    var method = arrayMethods[index];
    if(arrayPrototype[method] === undefined)
      arrayPrototype[method] = functionFactory(method);
  }
}(window));