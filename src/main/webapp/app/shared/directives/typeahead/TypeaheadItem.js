TatamiApp.directive('typeaheadItem', function() {
    return {
        require: '^tatamiTypeahead',
        link: function(scope, elem, attrs, controller) {
            var item = scope.$eval(attrs.typeaheadItem);

            scope.$watch(function() {
                return controller.isActive(item);
            }, function(active) {
                if(active) {
                    elem.addClass('active');
                }
                else {
                    elem.removeClass('active');
                }
            });

            elem.bind('mouseenter', function(evt) {
                scope.$apply(function() {
                    controller.activate(item);
                });
            });

            elem.bind('click', function(evt) {
                scope.$apply(function() {
                    controller.select(item);
                })
            })
        }
    }
})