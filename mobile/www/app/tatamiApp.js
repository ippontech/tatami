(function() {
    'use strict';

    angular.module('tatami', [
        'ionic',
        'tatami.services',
        'tatami.providers',
        'ngResource',
        'ngCordova',
        'hc.marked',
        'pascalprecht.translate'
    ]);

    angular.module('tatami')
        .run(tatamiRun)
        .config(tatamiConfig);

    tatamiRun.$inject = ['$ionicPlatform', '$state', '$localStorage', '$ionicHistory', '$translate'];
    function tatamiRun($ionicPlatform, $state, $localStorage, $ionicHistory, $translate) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)

            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.backgroundColorByName('white');
            }
        });

        $ionicPlatform.on('resume', resume);

        function resume() {

            if(isValidToken()) {
                $state.go('timeline');
            } else {
                $localStorage.clear();
                $ionicHistory.clearCache();
                $state.go('login');
            }
        }
        resume();

        function isValidToken() {
            var token = $localStorage.get('token');
            return token && token.expires && token.expires > new Date().getTime()
        }
    }

    tatamiConfig.$inject = [
        '$resourceProvider',
        '$stateProvider',
        '$translateProvider',
        '$compileProvider',
        '$httpProvider'
    ];
    function tatamiConfig($resourceProvider, $stateProvider, $translateProvider, $compileProvider, $httpProvider) {
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
        $resourceProvider.defaults.stripTrailingSlashes = false;

        $stateProvider
        // setup an abstract state for the tabs directive
            .state('tatami', {
                url: '',
                abstract: true,
                templateUrl: 'app/tatami.html',
                controller: 'TatamiCtrl',
                controllerAs: 'vm',
                resolve: {
                    translatePartialLoader: getTranslationPartialLoader
                }
            });

        getTranslationPartialLoader.$inject = ['$translate', '$translatePartialLoader'];
        function getTranslationPartialLoader($translate, $translatePartialLoader) {
            $translatePartialLoader.addPart('user');
            $translatePartialLoader.addPart('status');
            $translatePartialLoader.addPart('conversation');
            return $translate.refresh();
        }

        $httpProvider.interceptors.push('authInterceptor');
        $httpProvider.interceptors.push('authExpiredInterceptor');

        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: 'i18n/{lang}/{part}.json'
        });

        var usedLanguage = window.localStorage['language'];
        if(angular.equals({}, JSON.parse(usedLanguage))) {
            usedLanguage = JSON.stringify(navigator.language.split('-')[0]) || 'en';
        }
        window.localStorage['language'] = usedLanguage;
        usedLanguage = JSON.parse(usedLanguage);

        $translateProvider.preferredLanguage(usedLanguage);
        $translateProvider.use(usedLanguage);
        $translateProvider.useSanitizeValueStrategy('escaped');
        $translateProvider.addInterpolation('$translateMessageFormatInterpolation');

        $compileProvider.directive('compile', compile);

        compile.$inject = ['$compile'];
        function compile($compile) {
            return directive;

            directive.$inject = ['scope', 'element', 'attrs'];
            function directive(scope, element, attrs) {
                var ensureCompileRunsOnce = scope.$watch(
                    function(scope) {
                        return scope.$eval(attrs.compile);
                    },
                    function(value) {
                        element.html(value);

                        $compile(element.contents())(scope);

                        ensureCompileRunsOnce();
                    }
                );
            }
        }
    }
})();
