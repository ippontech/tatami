angular.module('tatami')
    .directive('tatamiUsers', ['$state', function($state) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                user: '='
            },
            templateUrl: 'app/shared/user/users.html',
            controller: ['$scope', '$state', 'UserService', function($scope, $state, UserService) {
                $scope.followUser = function() {
                    UserService.follow({ username : $scope.user.username }, { friend: !$scope.user.friend, friendShip: true },
                        function() {
                            $state.reload();
                        });
                }
            }],
            link: function(scope, el, attrs) {
            }
        }
    }]
);
