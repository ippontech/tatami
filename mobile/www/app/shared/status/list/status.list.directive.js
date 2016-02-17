(function() {
    'use strict';

    angular.module('tatami')
        .directive('tatamiStatusList', tatamiStatusList);

    function tatamiStatusList() {
        var directive = {
            restrict: 'E',
            scope: {
                statuses: '=',
                tatamiRefresher: '&'
            },
            controller: controller,
            controllerAs: 'vm',
            templateUrl: 'app/shared/status/list/status-list.html'
        };

        return directive;
    }

    controller.$inject = ['$scope'];
    function controller($scope) {
        var vm = this;
        vm.statuses = $scope.statuses;
        vm.getNewStatuses = getNewStatuses;
        vm.remove = remove;

        function getNewStatuses() {
            $scope.tatamiRefresher().then(setStatuses);
        }

        remove.$inject = ['status'];
        function remove(status) {
            vm.statuses.splice(vm.statuses.indexOf(status), 1);
        }

        setStatuses.$inject = ['statuses'];
        function setStatuses(statuses) {
            vm.statuses = statuses;
        }
    }
})();
