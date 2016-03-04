(function() {
    'use strict';

    angular.module('tatami')
        .factory('TatamiStatusRefresherService', tatamiStatusRefresherService);

    tatamiStatusRefresherService.$inject = ['$rootScope', 'StatusService', 'HomeService'];
    function tatamiStatusRefresherService($rootScope, StatusService, HomeService) {
        var service = {
            refreshHomeTimeline: refreshHomeTimeline,
            refreshMentions: refreshMentions,
            refreshFavorites: refreshFavorites,
            refreshUserTimeline: refreshUserTimeline,
            getOldFromHomeTimeline: getOldFromHomeTimeline
        };

        return service;

        function refreshHomeTimeline() {
            return StatusService.getHomeTimeline().$promise.then(updateStatuses);
        }

        refreshUserTimeline.$inject = ['user'];
        function refreshUserTimeline(user) {
            return StatusService.getUserTimeline({ username : user.username }).$promise.then(updateStatuses);
        }

        function refreshMentions() {
            return HomeService.getMentions().$promise.then(updateStatuses);
        }

        function refreshFavorites() {
            return HomeService.getFavorites().$promise.then(updateStatuses);
        }

        getOldFromHomeTimeline.$inject = ['finalStatus'];
        function getOldFromHomeTimeline(finalStatus) {
            return StatusService.getHomeTimeline({ finish: finalStatus }).$promise.then(updateInfiniteStatuses);
        }

        updateStatuses.$inject = ['statuses'];
        function updateStatuses(statuses) {
            $rootScope.$broadcast('scroll.refreshComplete');

            return statuses;
        }

        updateInfiniteStatuses.$inject = ['statuses'];
        function updateInfiniteStatuses(statuses) {
            $rootScope.$broadcast('scroll.infiniteScrollComplete');
            console.log(statuses);

            return statuses;
        }
    }
})();
