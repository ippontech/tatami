'use strict';

angular.module('tatamiJHipsterApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('timelineHome', {
                abstract: false,
                parent: 'site',
                data: {
                    authorities: [],
                    pageTitle: 'home.title'
                },
                url: '/home',
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/home/home.html',
                        controller: 'HomeController'
                    }
                },
                resolve: {
                    profile: ['ProfileService', function (ProfileService) {
                        return ProfileService.get().$promise;
                    }],
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader',
                        function ($translate,$translatePartialLoader) {
                            $translatePartialLoader.addPart('home');
                            $translatePartialLoader.addPart('status');
                            return $translate.refresh();
                    }],
                    profileInfo: ['Account', function(Account) {
                        return Account.get().$promise;
                    }]
                }
            })
            //state for all views that use home sidebar
            .state('sidebarHome', {
                parent: 'timelineHome',
                url: '^/home',
                abstract: true,
                resolve: {
                    groups: ['GroupService', function (GroupService) {
                        return GroupService.query().$promise;
                    }],
                    tags: ['TagService', function (TagService) {
                        return TagService.query({popular: true}).$promise;
                    }],
                    suggestions: ['UserService', function (UserService) {
                        return UserService.getSuggestions().$promise;
                    }],
                    showModal: function () {
                        return false;
                    }
                }
            })
    });
