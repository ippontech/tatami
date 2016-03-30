(function() {
    'use strict';

    angular.module('tatami')
        .controller('SuggestedCtrl', suggestedCtrl);

    suggestedCtrl.$inject = ['suggested', 'TatamiUserRefresherService'];
    function suggestedCtrl(suggested, TatamiUserRefresherService) {
        var vm = this;

        vm.suggested = suggested;

        vm.getNewSuggested = getNewSuggested;

        function getNewSuggested() {
            TatamiUserRefresherService.refreshSuggested().$promise.then(updateUsers);
        }

        updateUsers.$inject = ['suggested'];
        function updateUsers(suggested) {
            vm.suggested = suggested;
        }
    }
})();

