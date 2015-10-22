/* global angular: false */

(function (app) {
    'use strict';

    app.factory('TourHelpers', ['$templateCache', '$http', '$compile', 'TourConfig', '$q', function ($templateCache, $http, $compile, TourConfig, $q) {

        var helpers = {},
            safeApply;

                safeApply = helpers.safeApply = function(scope, fn) {
            var phase = scope.$$phase;
            if (phase === '$apply' || phase === '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                scope.$apply(fn);
            }
        };

                function compileTemplate(template, scope) {
            return function (/*index, step*/) {
                var $template = angular.element(template); //requires jQuery
                safeApply(scope, function () {
                    $compile($template)(scope);
                });
                return $template;
            };

        }

                function lookupTemplate(templateUrl, scope) {

            return $http.get(templateUrl, {
                cache: $templateCache
            }).success(function (template) {
                if (template) {
                    return compileTemplate(template, scope);
                }
                return '';
            });

        }

                function stringToBoolean(string) {
            if (string === 'true') {
                return true;
            } else if (string === 'false') {
                return false;
            }

            return string;
        }

                helpers.attachTemplate = function (scope, attrs, options) {

            var deferred = $q.defer(),
                template;

            if (attrs[helpers.getAttrName('template')]) {
                template = compileTemplate(scope.$eval(attrs[helpers.getAttrName('template')]), scope);
                options.template = template;
                deferred.resolve(template);
            } else if (attrs[helpers.getAttrName('templateUrl')]) {
                lookupTemplate(attrs[helpers.getAttrName('templateUrl')], scope).then(function (template) {
                    if (template) {
                        options.template = template;
                        deferred.resolve(template);
                    }
                });
            } else {
                deferred.resolve();
            }

            return deferred.promise;

        };

                helpers.attachEventHandlers = function (scope, attrs, options, events) {

            angular.forEach(events, function (eventName) {
                if (attrs[helpers.getAttrName(eventName)]) {
                    options[eventName] = function (tour) {
                        safeApply(scope, function () {
                            scope.$eval(attrs[helpers.getAttrName(eventName)]);
                        });
                    };
                }
            });

        };

                helpers.attachInterpolatedValues = function (attrs, options, keys) {

            angular.forEach(keys, function (key) {
                if (attrs[helpers.getAttrName(key)]) {
                    options[key] = stringToBoolean(attrs[helpers.getAttrName(key)]);
                    attrs.$observe(helpers.getAttrName(key), function (newValue) {
                        options[key] = stringToBoolean(newValue);
                    });
                }
            });

        };

                helpers.getAttrName = function (option) {
            if (TourConfig.get('prefixOptions')) {
                return TourConfig.get('prefix') + option.charAt(0).toUpperCase() + option.substr(1);
            } else {
                return option;
            }
        };

        return helpers;

    }]);

}(angular.module('bm.bsTour')));
