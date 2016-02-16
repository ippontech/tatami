(function() {
    'use strict';

    angular.module('tatami')
        .factory('TatamiStatusRefresherService', tatamiStatusRefresherService);

    tatamiStatusRefresherService.$inject = ['$rootScope', 'StatusService', 'HomeService'];
    function tatamiStatusRefresherService($rootScope, StatusService, HomeService) {
        var service = {
            refreshHomeTimeline: refreshHomeTimeline,
            refreshMentions: refreshMentions,
            refreshFavorites: refreshFavorites
        };

        return service;

        function refreshHomeTimeline() {
            return StatusService.getHomeTimeline().$promise.then(updateStatuses);
        }

        function refreshMentions() {
            return HomeService.getMentions().$promise.then(updateStatuses);
        }

        function refreshFavorites() {
            return HomeService.getFavorites().$promise.then(updateStatuses);
        }

        updateStatuses.$inject = ['statuses'];
        function updateStatuses(statuses) {
            $rootScope.$broadcast('scroll.refreshComplete');

            return statuses;
        }
    }
})();
