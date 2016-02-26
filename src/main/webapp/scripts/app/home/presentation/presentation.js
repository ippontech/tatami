angular.module('tatamiJHipsterApp')
    .config(function ($stateProvider) {
    console.log("in presentation.js");
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
