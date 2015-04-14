/* global angular: false */

(function (app) {
    'use strict';

    app.provider('TourConfig', [function () {

        var config = {
            prefixOptions: false,
            prefix: 'bsTour'
        };

        this.set = function (option, value) {
            config[option] = value;
        };

        this.$get = [function () {

            var service = {};

            service.get = function (option) {
                return config[option];
            };

            return service;

        }];

    }]);

}(angular.module('bm.bsTour')));
