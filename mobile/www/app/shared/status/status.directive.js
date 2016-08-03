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

    controller.$inject = ['$scope', '$state', '$ionicPopup', '$ionicPopover', '$filter', '$sce', 'StatusService', 'PathService', 'BlockService', '$translate', 'ReportService', 'ToastService'];
    function controller($scope, $state, $ionicPopup, $ionicPopover, $filter, $sce, StatusService, PathService, BlockService, $translate, ReportService, ToastService) {
        var vm = this;

        vm.state = $state.current.name;
        vm.status = $scope.status;
        vm.status.content = $filter('markdown')(vm.status.content);

        vm.currentUser = $scope.currentUser;
        vm.isAdmin = $scope.currentUser.isAdmin;
        vm.customHeight = (vm.isAdmin)? {'height': '270px'} : {'height': '170px'}; //Adapts the height of the popover depending on the role because a different number of buttons is displayed
        vm.remove = remove;
        vm.favorite = favorite;
        vm.isCurrentUser = !vm.currentUser || vm.currentUser.username === vm.status.username;
        vm.postReply = postReply;
        vm.goToConversation = goToConversation;
        vm.goToProfile = goToProfile;
        vm.goToTagTimeline = goToTagTimeline;
        vm.shareStatus = shareStatus;
        vm.buildAttachmentUrl = buildAttachmentUrl;
        vm.blockUser = blockUser;
        vm.reportStatus = reportStatus;
        vm.hideStatus = hideStatus;
        vm.announceStatus = announceStatus;

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
            StatusService.update({ statusId: vm.status.statusId }, { favorite: !vm.status.favorite }, function (status) {
                setStatus(status);
                if(vm.status.favorite){
                    ToastService.display('status.favorite.add');
                } else {
                    ToastService.display('status.favorite.remove');
                }
            });
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
            StatusService.update({statusId: vm.status.statusId}, {shared: !vm.status.shareByMe}, function(status){
                setStatus(status);
                ToastService.display('status.share.toast');
            });
        }

        function reportStatus() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Report Status',
                template: '<span translate="status.reportStatus.message"></span>'
            });
            confirmPopup.then(reported);
            reported.$inject = ['decision'];
            function reported(decision) {
                if(decision) {
                    ReportService.reportStatus({statusId: vm.status.statusId}, function () {
                        ToastService.display('status.reportStatus.toast');
                        }
                    );
                }
            }

        }

        setStatus.$inject = ['status'];
        function setStatus(status) {
            vm.status = status;
        }

        buildAttachmentUrl.$inject = ['attachment'];
        function buildAttachmentUrl(attachment) {
            return '/tatami/file/' + attachment.attachmentId + '/' + attachment.filename;
        }

        $ionicPopover.fromTemplateUrl('app/shared/status/blockUserMenu.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popover = popover;
        });

        function blockUser() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Block User',
                template: '<span translate="user.block.confirmation"></span>'
            });

            confirmPopup.then(checkDelete);

            checkDelete.$inject = ['decision'];
            function checkDelete(decision) {
                if(decision) {
                    BlockService.updateBlockedUser( {username: vm.status.username }, function () {
                        ToastService.display('user.block.success');
                        }
                    );
                    $state.go($state.current, {}, {reload: true});
                    // $scope.onDelete(vm.status);
                }
            }
        }

        function hideStatus() {
            StatusService.hideStatus({statusId: vm.status.statusId}, function () {
                $scope.onDelete(vm.status);
                ToastService.display('status.hide.toast');
            });
        }

        function announceStatus() {
            StatusService.update({statusId: vm.status.statusId}, {announced: true}, function(){
                setStatus;
                ToastService.display('status.announcement.toast');
            });
        }
    }
})();
