(function() {
'use strict';

    angular.module('tatamiJHipsterApp')
        .config(favoritesConfig);

    favoritesConfig.$inject = ['$stateProvider'];
    function favoritesConfig($stateProvider) {
        $stateProvider
        .state('status', {
            parent: 'sidebarHome',
            url: '/status/:statusId',
            views: {
                'homeBodyContent@timelineHome': {
                    templateUrl: 'scripts/app/home/status/status.html',
                    controller: 'StatusController'
                }
            },
            resolve: {
                status: ['StatusService', '$stateParams', '$q', function (StatusService, $stateParams, $q) {
                    return StatusService.get({statusId: $stateParams.statusId})
                        .$promise.then(
                        function (response) {
                            if (angular.equals({}, response.toJSON())) {
                                return $q.reject();
                            }
                            return response;
                        });
                }],
                context: ['StatusService', '$stateParams', function (StatusService, $stateParams) {
                    return StatusService.getDetails({statusId: $stateParams.statusId}).$promise;
                    }]
                }
            })
        }
})();
