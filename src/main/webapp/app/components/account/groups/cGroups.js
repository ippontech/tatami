/**
 * Handles group management
 */
tatamiApp.controller('groupController', ['$scope', 'GroupService', function ($scope, GroupService) {
    $scope.groups = {
        name:"",
        description:"",
        publicGroup:true,
        archivedGroup:false
    },

    $scope.newGroup = function () {
        GroupService.save($scope.groups);
    }
}]);
