var AboutModule = angular.module('AboutModule', ['ui.router']);

AboutModule.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('about',{
            url: '/about',
            abstract: true,
            templateUrl: 'app/components/about/AboutView.html'
        })
        .state('about.presentation', {
            url: '/presentation',
            views: {
                'aboutBody': {
                    templateUrl: 'app/components/about/presentation/PresentationView.html'
                },
            }
        })
        .state('about.tos', {
            url: '/tos',
            views: {
                'aboutBody': {
                    templateUrl: 'app/components/about/tos/ToSView.html'
                },
            }
        })
        .state('about.license', {
            url: '/license',
            views: {
                'aboutBody': {
                    templateUrl: 'app/components/about/license/LicenseView.html'
                },
            }
        });
}]);