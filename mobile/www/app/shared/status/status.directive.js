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

    controller.$inject = ['$scope', '$state', '$ionicPopup', '$filter', '$sce', 'StatusService', 'PathService'];
    function controller($scope, $state, $ionicPopup, $filter, $sce, StatusService, PathService) {
        var vm = this;

        vm.status = $scope.status;
        vm.status.content = $filter('markdown')(vm.status.content);

        vm.currentUser = $scope.currentUser;
        vm.remove = remove;
        vm.favorite = favorite;
        vm.isCurrentUser = !vm.currentUser || vm.currentUser.username === vm.status.username;
        vm.postReply = postReply;
        vm.goToConversation = goToConversation;
        vm.goToProfile = goToProfile;
        vm.goToTagTimeline = goToTagTimeline;
        vm.shareStatus = shareStatus;
        vm.buildAttachmentUrl = buildAttachmentUrl;

        function remove() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete',
                template: '<span translate="status.delete"></span>'
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
            StatusService.update({ statusId: vm.status.statusId }, { favorite: !vm.status.favorite }, setStatus)
        }

        function postReply() {
            $state.go('post', { statusId : vm.status.statusId });
        }

        goToConversation.$inject = ['statusId'];
        function goToConversation(statusId) {
            var destinationState = $state.current.name.split('.')[0] + '.conversation';
            $state.go(destinationState, { statusId : statusId });
        }

        goToProfile.$inject = ['username'];
        function goToProfile(username) {
            var destinationState = $state.current.name.split('.')[0] + '.profile';
            $state.go(destinationState, { username : username });
        }

        goToTagTimeline.$inject = ['tag'];
        function goToTagTimeline(tag) {
            var destinationState = $state.current.name.split('.')[0] + '.tag';
            $state.go(destinationState, { tag: tag });
        }

        function shareStatus() {
            StatusService.update({ statusId: vm.status.statusId }, { shared: !vm.status.shareByMe }, setStatus);
        }

        setStatus.$inject = ['status'];
        function setStatus(status) {
            vm.status = status;
        }

        buildAttachmentUrl.$inject = ['attachment'];
        function buildAttachmentUrl(attachment) {
            return PathService.buildPath('/tatami/file/' + attachment.attachmentId + '/' + attachment.filename);
        }
    }
})();
