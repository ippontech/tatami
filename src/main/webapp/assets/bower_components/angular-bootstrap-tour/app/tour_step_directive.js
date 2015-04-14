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

                    //Assign required options
                    var step = {
                            element: element,
                            stepId: attrs.tourStep
                        },
                        events = 'onShow onShown onHide onHidden onNext onPrev onPause onResume'.split(' '),
                        options = 'content title path animation container placement backdrop redirect orphan reflex duration nextStep prevStep nextPath prevPath'.split(' '),
                        orderWatch,
                        skipWatch,
                        templateReady;

                    //Pass interpolated values through
                    TourHelpers.attachInterpolatedValues(attrs, step, options);
                    orderWatch = attrs.$observe(TourHelpers.getAttrName('order'), function (order) {
                        step.order = !isNaN(order*1) ? order*1 : 0;
                        ctrl.refreshTour();
                    });

                    //Attach event handlers
                    TourHelpers.attachEventHandlers(scope, attrs, step, events);

                    //Compile templates
                    templateReady = TourHelpers.attachTemplate(scope, attrs, step);

                    //Check whether or not the step should be skipped
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

                    //If there is an options argument passed, just use that instead
                    if (attrs[TourHelpers.getAttrName('options')]) {
                        angular.extend(step, scope.$eval(attrs[TourHelpers.getAttrName('options')]));
                    }

                    //set up redirects
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

                    //Add step to tour
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
