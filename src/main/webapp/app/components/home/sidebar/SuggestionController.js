SidebarModule.controller('SuggestionController', ['$scope', 'SuggestionService', function($scope, SuggestionService) {
    $scope.suggestions = SuggestionService.query();
}]);