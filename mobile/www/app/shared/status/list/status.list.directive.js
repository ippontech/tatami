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

    controller.$inject = ['$scope', '$state'];
    function controller($scope, $state) {
        var vm = this;
        vm.statuses = $scope.statuses;
        vm.currentUser = $scope.currentUser;
        vm.$state = $state;
        vm.getNewStatuses = getNewStatuses;
        vm.getNewInfiniteScrollStatuses = getNewInfiniteScrollStatuses;
        vm.remove = remove;
        vm.finishedTimeline = vm.statuses && vm.statuses.length < 20;

        function getNewStatuses() {
            $scope.tatamiRefresher().then(setStatuses);
        }

        function getNewInfiniteScrollStatuses() {
            if(vm.statuses && vm.statuses.length > 0) {
                var lastStatus = vm.statuses[vm.statuses.length - 1].timelineId;
                $scope.tatamiInfiniteRefresher({ finalStatus: lastStatus }).then(addNewStatuses);
            }
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
            if(oldStatuses.length < 20) {
                vm.finishedTimeline = true;
            }

            vm.statuses.push.apply(vm.statuses, oldStatuses);
        }
    }
})();
