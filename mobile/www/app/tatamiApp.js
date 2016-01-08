angular.module('tatami', ['ionic', 'tatami.services', 'ngResource'])

    .run(['$ionicPlatform', '$state', 'ProfileService', function ($ionicPlatform, $state, ProfileService) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
        ProfileService.get().$promise.then(function(loggedUser) {
            if(loggedUser.username) {
                $state.go('tab.timeline');
            }
        }, function(error) {
            $state.go('login');
        })

    }])

    .config(function ($resourceProvider, $stateProvider, $urlRouterProvider) {

        $resourceProvider.defaults.stripTrailingSlashes = false;

        $stateProvider
            // setup an abstract state for the tabs directive
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'app/tabs.html'
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');

    });
