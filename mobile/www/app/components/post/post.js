angular.module('tatami')
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('post', {
                url: '/post',
                parent: 'tatami',
                templateUrl: 'app/components/post/post.html',
                controller: 'PostCtrl'
            });
    }
);
