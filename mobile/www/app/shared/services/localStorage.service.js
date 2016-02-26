(function() {
    'use strict';

    angular.module('tatami.services')
        .factory('$localStorage', localStorage);

    localStorage.$inject = ['$window'];
    function localStorage($window) {
        var service = {
            get: getFromLocalStorage,
            set: setFromLocalStorage
        };

        return service;

        getFromLocalStorage.$inject = ['key'];
        function getFromLocalStorage(key) {
            return JSON.parse($window.localStorage[key] || '{}');
        }

        setFromLocalStorage.$inject = ['key', 'value'];
        function setFromLocalStorage(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        }
    }
})();
