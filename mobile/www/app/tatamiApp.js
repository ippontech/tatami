angular.module('tatami', ['ionic', 'tatami.services', 'ngResource'])

    .run(['$ionicPlatform', '$state', 'ProfileService', '$rootScope', function ($ionicPlatform, $state, ProfileService, $rootScope) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.backgroundColorByName('white');
            }
        });
        ProfileService.get().$promise.then(function(loggedUser) {
            if(loggedUser.username) {
                $state.go('timeline');
            } else {
                $state.go('login');
            }
        }, function(error) {
            $state.go('login');
        });
    }])

    .config(function ($resourceProvider, $stateProvider, $urlRouterProvider) {

        $resourceProvider.defaults.stripTrailingSlashes = false;

        $stateProvider
            // setup an abstract state for the tabs directive
            .state('tatami', {
                url: '',
                abstract: true,
                template: '<ion-nav-view></ion-nav-view>'
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');
    });
