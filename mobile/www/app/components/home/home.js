(function() {
    'use strict';

    angular.module('tatami')
        .config(homeConfig);

    homeConfig.$inject = ['$stateProvider'];
    function homeConfig($stateProvider) {
        $stateProvider
            .state('home', {
                parent: 'tatami',
                abstract: true,
                url: '/home',
                templateUrl: 'app/components/home/home.html',
                resolve: {
                    currentUser: getCurrentUser,
                    translatePartialLoader: getTranslatePartialLoader
                }
            })
    }

    getCurrentUser.$inject = ['ProfileService'];
    function getCurrentUser(ProfileService) {
        return ProfileService.get().$promise;
    }

    getTranslatePartialLoader.$inject = ['$translate', '$translatePartialLoader'];
    function getTranslatePartialLoader($translate, $translatePartialLoader) {
        $translatePartialLoader.addPart('home');
        return $translate.refresh();
    }
})();
