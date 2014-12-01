/**
 * Handles group management
 *
 * This controller might be doing to much and may be refactored into two separate controllers
 */

GroupsModule.controller('AccountGroupsController', ['$scope', 'GroupService', 'GroupMemberService', '$routeParams', function($scope, GroupService, GroupMemberService, $routeParams, tabs) {
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
     * Determines the current look of the group page
     * When createGroup is true, we display the group creation view
     */
    $scope.current = {
        createGroup: false
    };

    // This is the set of groups the user belongs to
    $scope.userGroups = {};

    /**
     * Needs to be initialilzed differently
     *
     * This is used to help coordinating switching of tabs
     */
    $scope.tab = tabs;

    /**
     * When the page is started, we will fetch the groups the user is part of.
     *
     * It is likely that this can be done via routing rather than ng-init
     */
    $scope.getGroups = function() {
        GroupService.query(function(result) {
            $scope.userGroups = result;
        })
    };

    /**
     * This is designed to get the number of members in a given group
     * @param currentGroupId We want to find the number of members in the group with this id
     * @returns {number} The number of members in the group
     *
     * Currently this isn't working, it causes angular to die
     */
    $scope.getMembers = function(currentGroupId) {
        var memberCount = 1;
        GroupMemberService.query({ groupId: currentGroupId }, function(result) {
            memberCount = result.length;
            console.log(result);
        });
        return memberCount;
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
     * Creates a new group on the server
     */
    $scope.createNewGroup = function() {
        console.log($scope.groups);
        GroupService.save($scope.groups, function() {
            $scope.reset();
            // Alert user of new group creation
        });
    };

    /**
     * This allows us to manage the tab we are currently on.
     * @param groupTab
     * @param trendTab
     * @param searchTab
     */
    $scope.switchTabs = function(groupTab, trendTab, searchTab) {
        $scope.tab.groupTab = groupTab;
        $scope.tab.trendTab = trendTab;
        $scope.tab.searchTab = searchTab;
        console.log($routeParams);
    };

    $scope.showGroup = function() {
        $scope.tab.groupTab = true;
        $scope.tab.trendTab = false;
        $scope.tab.searchTab = false;
    };

    /**
     * Resets the group creation view
     */
    $scope.reset = function() {
        $scope.groups = {};
        $scope.current.createGroup = false;
    };
}]);