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
                    isAdmin: isAdmin,
                    currentUser: getCurrentUser,
                    translatePartialLoader: getTranslatePartialLoader
                }
            })
    }

    isAdmin.$inject = ['AccountService'];
    function isAdmin(AccountService) {
        return AccountService.get().$promise.then(function (response) {
            return response.roles ? response.roles.indexOf("ROLE_ADMIN") > -1 : false;
        });
    }

    getCurrentUser.$inject = ['ProfileService', 'isAdmin'];
    function getCurrentUser(ProfileService, isAdmin) {
        return ProfileService.get().$promise.then(function(currentUser) {
            currentUser.isAdmin = isAdmin;
            return currentUser;
        });
    }

    getTranslatePartialLoader.$inject = ['$translate', '$translatePartialLoader'];
    function getTranslatePartialLoader($translate, $translatePartialLoader) {
        $translatePartialLoader.addPart('home');
        return $translate.refresh();
    }
})();
