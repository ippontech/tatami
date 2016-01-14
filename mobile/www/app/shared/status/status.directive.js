(function() {
    'use strict';

    angular.module('tatami')
        .directive('tatamiStatus', tatamiStatus);

    function tatamiStatus() {
        var directive = {
            restrict: 'E',
            scope: {
                status: '='
            },
            controller: controller,
            controllerAs: 'vm',
            templateUrl: 'app/shared/status/status.html'
        };

        return directive;
    }

    controller.$inject = ['$scope', '$state', 'StatusService'];
    function controller($scope, $state, StatusService) {
        var vm = this;

        vm.status = $scope.status;
        vm.remove = remove;

        function remove() {
            StatusService.delete({ statusId : vm.status.statusId }, function() {
                $state.reload();
            })
        }
    }
})();
