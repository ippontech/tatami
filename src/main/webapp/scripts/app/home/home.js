(function() {
'use strict';

    angular.module('tatamiJHipsterApp')
        .config(homeConfig);

    homeConfig.$inject = ['$stateProvider'];
    function homeConfig($stateProvider) {
            $stateProvider
                .state('timelineHome', {
                    abstract: false,
                    parent: 'site',
                    data: {
                        authorities: [],
                        pageTitle: 'tatami.home.title'
                    },
                    url: '/home',
                    views: {
                        'content@': {
                            templateUrl: 'scripts/app/home/home.html',
                            controller: 'HomeController'
                        }
                    },
                    resolve: {
                        profile: getProfile,
                        profileInfo: getProfileInfo,
                        mainTranslatePartialLoader: getMainTranslatePartialLoader
                    }
                })
                //state for all views that use home sidebar
                .state('sidebarHome', {
                    parent: 'timelineHome',
                    url: '^/home',
                    abstract: true,
                    resolve: {
                        groups: getGroups,
                        tags: getTags,
                        suggestions: getSuggestions,
                        showModal: function () {
                            return false;
                        }
                    }
                });
            };

        getProfile.$inject = ['ProfileService'];
        function getProfile(ProfileService) {
            return ProfileService.get().$promise;
        }
        getProfileInfo.$inject = ['AccountService'];
        function getProfileInfo(AccountService){
            return AccountService.get().$promise;
        }
        getMainTranslatePartialLoader.$inject = ['$translate', '$translatePartialLoader'];
        function getMainTranslatePartialLoader($translate, $translatePartialLoader) {
            $translatePartialLoader.addPart('home');
            $translatePartialLoader.addPart('status');
            return $translate.refresh();
        }
        getGroups.$inject = ['GroupService'];
        function getGroups(GroupService) {
            return GroupService.get().$promise;
        }
        getTags.$inject = ['TagService'];
        function getTags(TagService) {
            return TagService.query({popular: true}).$promise;
        }
        getSuggestions.$inject = ['UserService'];
        function getSuggestions(UserService) {
            return UserService.getSuggestions().$promise;
        }
})();
