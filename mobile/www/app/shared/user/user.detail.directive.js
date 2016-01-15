(function() {
    'use strict';

    angular.module('tatami')
        .directive('tatamiUserDetail', tatamiUserDetail);

    function tatamiUserDetail() {
        var directive = {
            restrict: 'E',
            scope: {
                user: '='
            },
            controller: controller,
            controllerAs: 'vm',
            templateUrl: 'app/shared/user/user-detail.html'
        };

        return directive;
    }

    controller.$inject = ['$scope'];
    function controller($scope) {
        var vm = this;
        vm.user = $scope.user;
    }
})();
