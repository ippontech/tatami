(function() {
'use strict';

    angular.module('tatamiJHipsterApp')
        .config(profileConfig);

    profileConfig.$inject = ['$stateProvider'];
    function profileConfig($stateProvider) {
        $stateProvider
        //state for all views that use profile sidebar
        .state('otherUserProfile', {
            parent: 'timelineHome',
            url: '/profile/:email',
            abstract: true,
            resolve: {
                user: ['UserService', '$stateParams', function (UserService, $stateParams) {
                    return UserService.get({email: $stateParams.email}).$promise;
                }],
                tags: ['TagService', '$stateParams', function (TagService, $stateParams) {
                    return TagService.query({popular: true, user: $stateParams.email}).$promise;
                }]
            }
        })
    }
})();




