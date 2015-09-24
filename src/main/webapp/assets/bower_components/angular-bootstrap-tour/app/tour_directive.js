/* global angular: false */

(function (app) {
    'use strict';

    function directive () {
        return ['TourHelpers', function (TourHelpers) {

            return {
                restrict: 'EA',
                scope: true,
                controller: 'TourController',
                link: function (scope, element, attrs, ctrl) {
                    var tour = {},
                        templateReady,
                        events = 'onStart onEnd afterGetState afterSetState afterRemoveState onShow onShown onHide onHidden onNext onPrev onPause onResume'.split(' '),
                        options = 'name container keyboard storage debug redirect duration basePath backdrop orphan'.split(' ');
                    TourHelpers.attachInterpolatedValues(attrs, tour, options);
                    TourHelpers.attachEventHandlers(scope, attrs, tour, events);
                    templateReady = TourHelpers.attachTemplate(scope, attrs, tour);
                    scope.$watchCollection(ctrl.getSteps, function (steps) {
                        scope.stepCount = steps.length;
                    });
                    if (attrs.tourOptions) {
                        angular.extend(tour, scope.$eval(attrs.tourOptions));
                    }

                    if (attrs[TourHelpers.getAttrName('options')]) {
                        angular.extend(tour, scope.$eval(attrs[TourHelpers.getAttrName('options')]));
                    }
                    templateReady.then(function () {
                        scope.tour = ctrl.init(tour);
                        scope.tour.refresh = ctrl.refreshTour;
                    });

                }
            };

        }];
    }

    app.directive('tour', directive());
    app.directive('bsTour', directive());

}(angular.module('bm.bsTour')));
