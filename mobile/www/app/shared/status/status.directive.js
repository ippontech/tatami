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

    controller.$inject = ['$scope', '$state', '$ionicPopup', '$ionicPopover', '$filter', '$sce', 'StatusService', 'PathService', 'BlockService', 'ionicToast', '$translate', 'ReportService'];
    function controller($scope, $state, $ionicPopup, $ionicPopover, $filter, $sce, StatusService, PathService, BlockService, ionicToast, $translate, ReportService) {
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
                    $translate('status.favorite.add').then(function(msg){
                        if (ionic.Platform.isIOS()){
                            ionicToast.show(msg, 'top', false, 2000);
                        }
                        else{
                            ionicToast.show(msg, 'bottom', false, 2000);
                        }
                    });
                } else {
                    $translate('status.favorite.remove').then(function(msg){
                        ionicToast.show(msg, 'bottom', false, 2000);
                    });
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
                $translate('status.share.toast').then(function(msg){
                    if (ionic.Platform.isIOS()){
                        ionicToast.show(msg, 'top', false, 2000);
                    }
                    else{
                        ionicToast.show(msg, 'bottom', false, 2000);
                    }
                });
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
                            $translate('status.reportStatus.toast').then(function(msg){
                                if (ionic.Platform.isIOS()){
                                    ionicToast.show(msg, 'top', false, 2000);
                                }
                                else{
                                    ionicToast.show(msg, 'bottom', false, 2000);
                                }

                            });
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
            return PathService.buildPath('/tatami/file/' + attachment.attachmentId + '/' + attachment.filename);
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
                            $translate('user.block.success').then(function(msg){
                                if (ionic.Platform.isIOS()){
                                    ionicToast.show(msg, 'top', false, 2000);
                                }
                                else{
                                    ionicToast.show(msg, 'bottom', false, 2000);
                                }
                            });
                        }
                    );
                    // $scope.onDelete(vm.status);
                }
            }
        }

        function hideStatus() {
            StatusService.hideStatus({statusId: vm.status.statusId}, function () {
                $scope.onDelete(vm.status);
                $translate('status.hide.toast').then(function(msg){
                    ionicToast.show(msg, 'bottom', false, 2000);
                });
            });
        }

        function announceStatus() {
            StatusService.update({statusId: vm.status.statusId}, {announced: true}, function(){
                setStatus;
                $translate('status.announcement.toast').then(function(msg){
                    if (ionic.Platform.isIOS()){
                        ionicToast.show(msg, 'top', false, 2000);
                    }
                    else{
                        ionicToast.show(msg, 'bottom', false, 2000);
                    }
                });
            });
        }
    }
})();
