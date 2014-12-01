ProfileSideModule.controller('ProfileTrendsController', ['$scope', 'TagService', function($scope, TagService) {
	$scope.tags = TagService.query({popular: true});
}]);