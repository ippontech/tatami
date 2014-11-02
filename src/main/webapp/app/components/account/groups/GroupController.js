/**
 * Handles group management
 */

TatamiApp.controller('GroupController', ['$scope', 'GroupService', function($scope, GroupService) {
    $scope.groups = {
        name: "",
        description: "",
        publicGroup: true,
        archivedGroup: false
    },

    $scope.newGroup = function() {
        GroupService.save($scope.groups);
    }
}]);