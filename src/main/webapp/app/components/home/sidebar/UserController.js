SidebarModule.controller('UserController',['$scope', 'ProfileService', function($scope, ProfileService) {
	$scope.user = ProfileService.get();   

    /*
     * quick fix for network error from angular requesting the wrong avatar
     * url. need to implement $q/promise to stop angular from requesting the 
     * default profile image even when it is not needed
     */
    $scope.user.avatar = ''; 
}]);