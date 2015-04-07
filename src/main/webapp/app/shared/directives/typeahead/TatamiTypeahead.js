TatamiApp.directive('tatamiTypeahead', function() {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        templateUrl: '/app/shared/directives/typeahead/TypeaheadTemplate.html',
        controller: 'TypeaheadController'
    }
});