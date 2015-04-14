(function (app) {

    app.config(['$routeProvider', 'TourConfigProvider', function ($routeProvider, TourConfigProvider) {

        $routeProvider
            .when('/docs', {
                templateUrl: 'views/docs.html',
                controller: function ($scope) {
                    $scope.viewName = 'docs';
                }
            })
            .when('/other', {
                templateUrl: 'views/other.html',
                controller: function ($scope) {
                    $scope.viewName = 'other';
                }
            })
            .otherwise({
                redirectTo: '/docs'
            });

        //These are defaults
        TourConfigProvider.set('prefixOptions', false);
        TourConfigProvider.set('prefix', 'bsTour');

    }]);

}(angular.module('app', ['bm.bsTour', 'ngRoute'])));
