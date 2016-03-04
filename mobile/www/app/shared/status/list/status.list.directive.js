(function() {
    'use strict';

    angular.module('tatami')
        .directive('tatamiStatusList', tatamiStatusList);

    function tatamiStatusList() {
        var directive = {
            restrict: 'E',
            scope: {
                statuses: '=',
                currentUser: '=',
                tatamiRefresher: '&',
                tatamiInfiniteRefresher: '&'
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
        vm.currentUser = $scope.currentUser;
        vm.getNewStatuses = getNewStatuses;
        vm.getNewInfiniteScrollStatuses = getNewInfiniteScrollStatuses;
        vm.remove = remove;
        vm.finishedTimeline = true;

        function getNewStatuses() {
            $scope.tatamiRefresher().then(setStatuses);
        }

        function getNewInfiniteScrollStatuses() {
            $scope.tatamiInfiniteRefresher({ finalStatus: vm.statuses[vm.statuses.length - 1].timelineId }).then(addNewStatuses);
        }

        remove.$inject = ['status'];
        function remove(status) {
            vm.statuses.splice(vm.statuses.indexOf(status), 1);
        }

        setStatuses.$inject = ['statuses'];
        function setStatuses(statuses) {
            vm.statuses = statuses;
        }

        addNewStatuses.$inject = ['oldStatuses'];
        function addNewStatuses(oldStatuses) {
            if(oldStatuses.length == 0) {
                vm.finishedTimeline = false;
            }
            
            vm.statuses.push.apply(vm.statuses, oldStatuses);
        }
    }
})();
