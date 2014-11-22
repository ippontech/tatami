/**
 * Handles group management
 */

TatamiApp.controller('GroupController', ['$scope', 'GroupService', function($scope, GroupService) {
    $scope.groups = {
        name: "",
        description: "",
        publicGroup: true,
        archivedGroup: false
    };

    $scope.userGroups = {};

    $scope.getGroups = function (){
        GroupService.query(function (result){
            $scope.userGroups = result;
        })
    }

    $scope.current = {
        createGroup: false
    };

    $scope.newGroup = function() {
        $scope.current.createGroup = true;
    };

    $scope.cancelGroupCreate = function(){
        $scope.current.createGroup = false;
    };

    $scope.createNewGroup = function(){
        console.log($scope.groups);
        GroupService.save($scope.groups, function (){
            $scope.reset();
            $scope.current.createGroup = false;
            // Alert user of new group creation
        });
    };

    $scope.reset = function(){
        $scope.groups = {};
    }

    $scope.test = function () {
        console.log('Angular works');
    }
}]);