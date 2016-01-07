angular.module('tatami')
    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('post', {
                url: '/post',
                templateUrl: 'app/components/post/post.html',
                controller: 'PostCtrl'
            });
    }
);
