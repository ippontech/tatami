(function() {
    'use strict';

    angular.module('tatami')
        .factory('TatamiStatusRefresherService', tatamiStatusRefresherService);

    tatamiStatusRefresherService.$inject = ['$rootScope', 'StatusService', 'HomeService'];
    function tatamiStatusRefresherService($rootScope, StatusService, HomeService) {
        var service = {
            refreshHomeTimeline: refreshHomeTimeline,
            refreshMentionsTimeline: refreshMentionsTimeline
        };

        return service;

        function refreshHomeTimeline() {
            return StatusService.getHomeTimeline().$promise.then(updateStatuses);
        }

        function refreshMentionsTimeline() {
            return HomeService.getMentions().$promise.then(updateStatuses);
        }

        updateStatuses.$inject = ['statuses'];
        function updateStatuses(statuses) {
            $rootScope.$broadcast('scroll.refreshComplete');

            return statuses;
        }
    }
})();
