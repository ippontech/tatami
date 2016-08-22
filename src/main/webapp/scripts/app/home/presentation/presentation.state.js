angular.module('tatamiJHipsterApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('timelinePresentation', {
                parent: 'timeline',
                url: '',
                onEnter: ['$stateParams', '$uibModal', function ($stateParams, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/home/presentation/welcome.html',
                        controller: 'WelcomeController'
                    });
                }]
            })
    });
