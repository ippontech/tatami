(function() {
    'use strict';

    angular.module('tatami')
        .directive('tatamiStatus', tatamiStatus);

    function tatamiStatus() {
        var directive = {
            restrict: 'E',
            scope: {
                status: '=',
                currentUser: '='
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
        vm.currentUser = $scope.currentUser;
        vm.remove = remove;
        vm.favorite = favorite;
        vm.isCurrentUser = !vm.currentUser || vm.currentUser.username === vm.status.username;
        vm.postReply = postReply;
        vm.goToConversation = goToConversation;

        function remove() {
            StatusService.delete({ statusId : vm.status.statusId }, function() {
                $state.reload();
            })
        }

        function favorite() {
            StatusService.update({ statusId: vm.status.statusId }, { favorite: !vm.status.favorite }, function() {
                $state.reload();
            })
        }

        function postReply() {
            $state.go('post', { statusId : vm.status.statusId });
        }

        function goToConversation(statusId) {
            console.log($state);
            console.log(statusId);
        }
    }
})();
