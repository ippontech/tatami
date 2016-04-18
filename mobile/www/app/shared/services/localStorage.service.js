(function() {
    'use strict';

    angular.module('tatami.services')
        .factory('$localStorage', localStorage);

    localStorage.$inject = ['$window'];
    function localStorage($window) {
        var service = {
            get: getFromLocalStorage,
            set: setFromLocalStorage,
            signOut: clearToken
        };

        return service;

        getFromLocalStorage.$inject = ['key'];
        function getFromLocalStorage(key) {
            if(isLocalStorageUndefined(key)) {
                return undefined;
            }
            return JSON.parse($window.localStorage[key] || '{}');
        }

        setFromLocalStorage.$inject = ['key', 'value'];
        function setFromLocalStorage(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        }

        function clearToken() {
            $window.localStorage.removeItem('token');
        }

        isLocalStorageUndefined.$inject = ['key'];
        function isLocalStorageUndefined(key) {
            return $window.localStorage.length === 0 || $window.localStorage[key] === 'undefined';
        }
    }
})();
