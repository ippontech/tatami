(function() {
    'use strict';

    angular.module('tatami')
        .config(followConfig);

    followConfig.$inject = ['$stateProvider'];
    function followConfig($stateProvider) {
        $stateProvider
            .state('follow', {
                url: '/follow',
                parent: 'tatami',
                abstract: true,
                templateUrl: 'app/components/follow/follow.html',
                resolve: {
                    currentUser: getCurrentUser,
                    translatePartialLoader: getTranslatePartialLoader
                }
            });

        getCurrentUser.$inject = ['ProfileService'];
        function  getCurrentUser(ProfileService) {
            return ProfileService.get().$promise;
        }

        getTranslatePartialLoader.$inject = ['$translate', '$translatePartialLoader'];
        function getTranslatePartialLoader($translate, $translatePartialLoader) {
            $translatePartialLoader.addPart('follow');
            return $translate.refresh();
        }
    }
})();
