(function() {
    'use strict';

    angular.module('tatami')
        .controller('MoreController', moreController);

    moreController.$inject = [
        '$scope',
        '$state',
        '$timeout',
        '$localStorage',
        '$ionicHistory',
        '$translate',
        '$ionicPopup',
        'PathService',
        'currentUser'
    ];
    function moreController($scope, $state, $http, $localStorage, $ionicHistory, $translate, $ionicPopup, PathService, currentUser) {
        var vm = this;

        vm.currentUser = currentUser;
        vm.logout = logout;
        vm.goToCompanyTimeline = goToCompanyTimeline;
        vm.goToSettings = goToSettings;
        vm.goToBlockedUsers = goToBlockedUsers;

        vm.language = window.localStorage.getItem('language');

        vm.languages = [
            {
                langKey: 'en',
                translateKey: 'more.language.english'
            },
            {
                langKey: 'fr',
                translateKey: 'more.language.french'
            }
        ];

        $scope.$watch('vm.language', updateLanguage);

        function updateLanguage(language) {
            $translate.use(language);
            window.localStorage.setItem('language', language);
        }

        function logout() {
            $localStorage.signOut();
            vm.attempted = false;
            $state.go('login');
            $timeout(function () {
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
            }, 1500)
        }

        function goToCompanyTimeline() {
            $state.go('company');
        }

        function goToSettings() {
            $state.go('settings');
        }

        function goToBlockedUsers(){
            $state.go('blockedusers');
        }
    }
})();
