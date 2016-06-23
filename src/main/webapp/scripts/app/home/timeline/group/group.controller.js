/**
 * Created by emilyklein on 6/22/16.
 */

angular.module('tatamiJHipsterApp')
    .controller('GroupStatusesController', ['$scope', 'GroupService', 'profileInfo', 'group', '$stateParams', '$state',
        function ($scope, GroupService, profileInfo, group, $stateParams, $state) {
            $scope.profile = profileInfo;
            $scope.group = group;
            $scope.currentState = $state.$current.name;
            $scope.joinLeaveGroup = function () {
                if (!$scope.group.member) {
                    GroupService.join(
                        {groupId: $scope.group.groupId, username: $scope.profile.username},
                        null,
                        function (response) {
                            if (response.isMember) {
                                $scope.group.member = response.isMember;
                                $scope.$state.reload();
                            }
                        }
                    );
                } else {
                    GroupService.leave(
                        {groupId: $scope.group.groupId, username: $scope.profile.username},
                        null,
                        function (response) {
                            if (response) {
                                $scope.group.member = !response;
                                $scope.$state.reload();
                            }
                        }
                    );
                }
            };

        }
    ]);
