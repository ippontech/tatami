(function() {
    'use strict';

    // This will dynamically create any tab substates inside the current tab. If in the timeline tab, we will
    // create a timeline.status state
    angular.module('tatami')
        .factory('StatusStateService', statusStateService);

    statusStateService.$inject = ['$stateProvider'];
    function statusStateService($stateProvider) {
        var service = {
            createState: createState
        };

        return service;

        function createState(prefixName) {
            console.log($stateProvider);
        }
    }
})();
