/* global angular: false */

(function (app) {
    'use strict';

    function directive() {
        return ['TourHelpers', '$location', function (TourHelpers, $location) {

            return {
                restrict: 'EA',
                scope: true,
                require: '^tour',
                link: function (scope, element, attrs, ctrl) {
                    var step = {
                            element: element,
                            stepId: attrs.tourStep
                        },
                        events = 'onShow onShown onHide onHidden onNext onPrev onPause onResume'.split(' '),
                        options = 'content title path animation container placement backdrop redirect orphan reflex duration nextStep prevStep nextPath prevPath'.split(' '),
                        orderWatch,
                        skipWatch,
                        templateReady;
                    TourHelpers.attachInterpolatedValues(attrs, step, options);
                    orderWatch = attrs.$observe(TourHelpers.getAttrName('order'), function (order) {
                        step.order = !isNaN(order*1) ? order*1 : 0;
                        ctrl.refreshTour();
                    });
                    TourHelpers.attachEventHandlers(scope, attrs, step, events);
                    templateReady = TourHelpers.attachTemplate(scope, attrs, step);
                    function stepIsSkipped() {
                        var skipped;
                        if (attrs[TourHelpers.getAttrName('skip')]) {
                            skipped = scope.$eval(attrs[TourHelpers.getAttrName('skip')]);
                        }
                        if (!skipped) {
                            skipped = !!step.path || (element.is(':hidden') && !attrs.availableWhenHidden);
                        }
                        return skipped;
                    }
                    skipWatch = scope.$watch(stepIsSkipped, function (skip) {
                        if (skip) {
                            ctrl.removeStep(step);
                        } else {
                            ctrl.addStep(step);
                        }
                    });

                    scope.$on('$destroy', function () {
                        ctrl.removeStep(step);
                        orderWatch();
                        skipWatch();
                    });
                    if (attrs[TourHelpers.getAttrName('options')]) {
                        angular.extend(step, scope.$eval(attrs[TourHelpers.getAttrName('options')]));
                    }
                    function setRedirect(direction, path, targetName) {
                        var oldHandler = step[direction];
                        step[direction] = function (tour) {
                            if (oldHandler) {
                                oldHandler(tour);
                            }
                            ctrl.waitFor(targetName);

                            TourHelpers.safeApply(scope, function () {
                                $location.path(path);
                            });
                        };
                    }
                    if (step.nextPath) {
                        step.redirectNext = true;
                        setRedirect('onNext', step.nextPath, step.nextStep);
                    }
                    if (step.prevPath) {
                        step.redirectPrev = true;
                        setRedirect('onPrev', step.prevPath, step.prevStep);
                    }
                    templateReady.then(function () {
                        ctrl.addStep(step);
                    });

                }
            };

        }];
    }

    app.directive('tourStep', directive());
    app.directive('bsTourStep', directive());

}(angular.module('bm.bsTour')));
