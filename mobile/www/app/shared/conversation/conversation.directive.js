(function() {
    'use strict';

    angular.module('tatami')
        .directive('tatamiConversation', tatamiConversation);

    function tatamiConversation() {
        var directive = {
            restrict: 'E',
            scope: {
                status: '='
            },
            controller: controller,
            controllerAs: 'vm',
            templateUrl: 'app/shared/conversation/conversation.html'
        };

        return directive;
    }

    controller.$inject = ['$scope', '$state'];
    function controller($scope) {
        var vm = this;

        vm.status = $scope.status;
    }
})();
