(function() {
    'use strict';

    angular.module('tatami')
        .directive('tatamiStatus', tatamiStatus);

    function tatamiStatus() {
        var directive = {
            restrict: 'E',
            scope: {
                status: '=',
                currentUser: '=',
                onDelete: '&'
            },
            controller: controller,
            controllerAs: 'vm',
            templateUrl: 'app/shared/status/status.html'
        };

        return directive;
    }

    controller.$inject = ['$scope', '$state', '$ionicPopup', 'StatusService'];
    function controller($scope, $state, $ionicPopup, StatusService) {
        var vm = this;

        vm.status = $scope.status;
        vm.currentUser = $scope.currentUser;
        vm.remove = remove;
        vm.favorite = favorite;
        vm.isCurrentUser = !vm.currentUser || vm.currentUser.username === vm.status.username;
        vm.postReply = postReply;
        vm.goToConversation = goToConversation;

        function remove() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete',
                template: 'Are you sure you want to delete the status?'
            });

            confirmPopup.then(checkDelete);

            checkDelete.$inject = ['decision'];
            function checkDelete(decision) {
                if(decision) {
                    StatusService.delete({ statusId : vm.status.statusId }, function() {
                        $scope.onDelete(vm.status);
                    });
                }
            }

        }

        function favorite() {
            StatusService.update({ statusId: vm.status.statusId }, { favorite: !vm.status.favorite }, function(result) {
                vm.status = result
            })
        }

        function postReply() {
            $state.go('post', { statusId : vm.status.statusId });
        }

        function goToConversation(statusId) {
            var destinationState = $state.current.name.split('.')[0] + '.status';
            $state.go(destinationState, { statusId : statusId });
        }
    }
})();
