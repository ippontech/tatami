(function() {
    'use strict';

    angular.module('tatami')
        .config(config);

    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('mentions', {
                url: '/mentions',
                parent: 'home',
                views: {
                    'mentions': {
                        templateUrl: 'app/components/home/mentions/mentions.html',
                        controller: 'MentionsCtrl',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    mentioned: mentioned
                }
            })
            .state('mentions.detail', {
                url: '/detail/:statusId',
                views: {
                    'mentions@home': {
                        templateUrl: 'app/components/home/detail/detail.html',
                        controller: 'DetailCtrl',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    status: getStatus
                }
            });
    }

    mentioned.$inject = ['HomeService'];
    function mentioned(HomeService) {
        return HomeService.getMentions().$promise;
    }

    getStatus.$inject = ['StatusService', '$stateParams'];
    function getStatus(StatusService, $stateParams) {
        return StatusService.get({ statusId : $stateParams.statusId }).$promise;
    }
})();

