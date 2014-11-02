SidebarModule.controller('TrendsController',['$scope', 'TagService', function($scope, TagService) {
	$scope.tags = TagService.query();
}]);