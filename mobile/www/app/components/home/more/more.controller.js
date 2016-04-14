(function() {
    'use strict';

    angular.module('tatami')
        .controller('MoreController', moreController);

    moreController.$inject = ['$scope', '$state', '$localStorage', '$ionicHistory', '$translate'];
    function moreController($scope, $state, $localStorage, $ionicHistory, $translate) {
        var vm = this;

        vm.logout = logout;
        vm.goToCompanyTimeline = goToCompanyTimeline;

        vm.language = $localStorage.get('language');

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
            $localStorage.set('language', language);
        }


        function logout() {
            $localStorage.clear();
            $localStorage.set('language', vm.language);
            $ionicHistory.clearCache();
            $state.go('login');
        }

        function goToCompanyTimeline() {
            $state.go('company');
        }
    }
})();
