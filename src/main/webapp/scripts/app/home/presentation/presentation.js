angular.module('tatamiJHipsterApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('timelinePresentation', {
                parent: 'timeline',
                url: '',
                onEnter: ['$stateParams', '$modal', function ($stateParams, $modal) {
                    $modal.open({
                        templateUrl: 'scripts/app/home/presentation/welcome.html',
                        controller: 'WelcomeController'
                    });
                }]
            })
    });
