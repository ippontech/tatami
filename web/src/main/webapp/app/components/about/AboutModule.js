var AboutModule = angular.module('AboutModule', []);

AboutModule.config(['$stateProvider', function($stateProvider) {

    $stateProvider
        .state('tatami.about',{
            url: '/about',
            abstract: true,
            templateUrl: 'app/components/about/AboutView.html'
        })
        .state('tatami.about.presentation', {
            url: '/presentation',
            views: {
                'aboutBody': {
                    templateUrl: 'app/components/about/presentation/PresentationView.min.html'
                }
            },
            data: {
                public: true
            }
        })
        .state('tatami.about.tos', {
            url: '/tos',
            views: {
                'aboutBody': {
                    templateUrl: 'app/components/about/tos/ToSView.min.html'
                }
            },
            data: {
                public: true
            }
        })
        .state('tatami.about.license', {
            url: '/license',
            views: {
                'aboutBody': {
                    templateUrl: 'app/components/about/license/LicenseView.min.html',
                    controller: 'LicenseController'
                }
            },
            data: {
                public: true
            }
        });

}]);
