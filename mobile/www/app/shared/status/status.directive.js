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
        console.log(directive);

        return directive;
    }

    controller.$inject = ['$scope', 'StatusService'];
    function controller($scope, StatusService) {
        console.log('here');
        var vm = this;
    }
})();
