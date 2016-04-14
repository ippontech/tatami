(function() {
    'use strict';

    angular.module('tatami')
        .controller('MoreController', moreController);

    moreController.$inject = ['$scope', '$state', '$localStorage', '$ionicHistory', '$translate'];
    function moreController($scope, $state, $localStorage, $ionicHistory, $translate) {
        var vm = this;

        vm.logout = logout;
        vm.goToCompanyTimeline = goToCompanyTimeline;

        vm.language = 'en';

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
        }


        function logout() {
            $localStorage.clear();
            $ionicHistory.clearCache();
            $state.go('login');
        }

        function goToCompanyTimeline() {
            $state.go('company');
        }
    }
})();
