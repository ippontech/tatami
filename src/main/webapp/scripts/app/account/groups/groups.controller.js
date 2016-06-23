tatamiJHipsterApp
    .controller('GroupsController', [
    '$scope',
    '$state',
    'GroupService',
    'SearchService',
    'profileInfo',
    'username',
    function($scope, $state, GroupService, SearchService, profileInfo, username) {
        if($scope.$state.name === 'groups') {
            $scope.$state.go('list');
        }
        $scope.$state = $state;
        $scope.username = username;

        /**
         * Determines the current look of the group page
         * When createGroup is true, we display the group creation view
         */


    }
]);
