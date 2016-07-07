(function() {
    'use strict';

    angular.module('tatami')
        .controller('SettingsController', settingsController);

    settingsController.$inject = ['$scope', '$translate', 'currentUser'];
    function settingsController($scope, $translate, currentUser) {
        var vm = this;
        vm.currentUser = currentUser;

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

    }
})();
