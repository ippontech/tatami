TatamiApp.directive('postTypeahead', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        template:'<div typeahed="val.name for val in results"></div>',
        link: function(scope, element, attr, ngModelController) {
            element.bind('keyup', function() {
                console.log(ngModelController);
                var caretPosition = element[0].selectionStart;
                var content = ngModelController.$$rawModelValue;
                var curChar = content.charAt(caretPosition);
                if(curChar === 'a') {
                    console.log('found a');
                }
                console.log(element[0].selectionStart);
            })
        }
    }
});