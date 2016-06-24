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
                        {groupId: $scope.group.groupId, email: $scope.profile.data.username},
                        null,
                        function (response) {
                                $scope.$state.reload();
                        }
                    );
                } else {
                    GroupService.leave(
                        {groupId: $scope.group.groupId, email: $scope.profile.data.username},
                        null,
                        function (response) {
                            console.log(response);
                                $scope.$state.reload();
                        }
                    );
                }
            };

        }
    ]);
