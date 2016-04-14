(function() {
    'use strict';

    angular.module('tatami')
        .factory('TatamiStatusRefresherService', tatamiStatusRefresherService);

    tatamiStatusRefresherService.$inject = ['$rootScope', 'StatusService', 'HomeService', 'TagService'];
    function tatamiStatusRefresherService($rootScope, StatusService, HomeService, TagService) {
        var service = {
            refreshHomeTimeline: refreshHomeTimeline,
            refreshCompanyTimeline: refreshCompanyTimeline,
            refreshMentions: refreshMentions,
            refreshFavorites: refreshFavorites,
            refreshUserTimeline: refreshUserTimeline,
            refreshTagTimeline: refreshTagTimeline,
            getOldFromHomeTimeline: getOldFromHomeTimeline,
            getOldFromCompanyTimeline: getOldFromCompanyTimeline,
            getOldMentions: getOldMentions,
            getOldTags: getOldTags
        };

        return service;

        function refreshHomeTimeline() {
            return StatusService.getHomeTimeline().$promise.then(updateStatuses);
        }

        function refreshCompanyTimeline() {
            return HomeService.getCompanyTimeline().$promise.then(updateStatuses);
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

        refreshTagTimeline.$inject = ['tag'];
        function refreshTagTimeline(tag) {
            return TagService.getTagTimeline({ tag: tag }).$promise.then(updateStatuses);
        }

        getOldFromHomeTimeline.$inject = ['finalStatus'];
        function getOldFromHomeTimeline(finalStatus) {
            return StatusService.getHomeTimeline({ finish: finalStatus }).$promise.then(updateInfiniteStatuses);
        }

        getOldFromCompanyTimeline.$inject = ['finalStatus'];
        function getOldFromCompanyTimeline(finalStatus) {
            return HomeService.getCompanyTimeline({ finish: finalStatus }).$promise.then(updateInfiniteStatuses);
        }

        getOldMentions.$inject = ['finalStatus'];
        function getOldMentions(finalStatus) {
            return HomeService.getMentions({ finish: finalStatus }).$promise.then(updateInfiniteStatuses);
        }

        getOldTags.$inject = ['finalStatus', 'tag'];
        function getOldTags(finalStatus, tag) {
            return TagService.getTagTimeline({ tag: tag, finish: finalStatus }).$promise.then(updateInfiniteStatuses);
        }

        updateStatuses.$inject = ['statuses'];
        function updateStatuses(statuses) {
            $rootScope.$broadcast('scroll.refreshComplete');

            return statuses;
        }

        updateInfiniteStatuses.$inject = ['statuses'];
        function updateInfiniteStatuses(statuses) {
            $rootScope.$broadcast('scroll.infiniteScrollComplete');

            return statuses;
        }
    }
})();
