tatamiJHipsterApp.controller('GroupsCreateController', ['$scope', '$translate', 'GroupService', 'ngToast', function($scope, $translate, GroupService, ngToast) {
    $scope.current = {};
    $scope.current.createGroup = false;
    /**
     * When creating a group, the POST requires this payload
     * @type {{name: string, description: string, publicGroup: boolean, archivedGroup: boolean}}
     */
    $scope.groups = {
        name: "",
        description: "",
        publicGroup: true,
        archivedGroup: false
    };

    /**
     * Allows the user to toggle the group creation view
     */
    $scope.newGroup = function() {
        $scope.current.createGroup = !$scope.current.createGroup;
    };

    /**
     * Allows the user to cancel group creation
     */
    $scope.cancelGroupCreate = function() {
        $scope.reset();
    };

    /**
     * Resets the group creation view
     */
    $scope.reset = function() {
           console.log($scope.groups);
        $scope.groups = {};
        $scope.current.createGroup = false;
    };

    /**
     * Creates a new group on the server
     */
    $scope.createNewGroup = function() {
        console.log($scope.groups);
        GroupService.save($scope.groups, function() {
            $scope.reset();
            $scope.$state.reload();
            // Alert user of new group creation
            ngToast.create({
                content: $translate.instant('tatami.account.groups.save')
            });
        }, function() {
            ngToast.create({
                content: $translate.instant('tatami.form.fail'),
                class: 'danger'
            });
        });
    };
}]);
