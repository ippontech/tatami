/* global angular: false */

(function (app) {
    'use strict';

    app.controller('TourController', ['$filter', '$timeout', function ($filter, $timeout) {

        var self = this,
            steps = [],
            tour,
            newStepFound = angular.noop,
            dummyStep = {};

                function orderSteps(steps) {
            var ordered = $filter('orderBy')(steps, 'order');

            angular.forEach(ordered, function (step, index) {
                step.next = ordered[index + 1] ? index + 1 : - 1;
                step.prev = index - 1;
            });

            return ordered;
        }

                self.refreshTour = function () {
            steps = steps.filter(function (step) {
                return step !== dummyStep;
            });
            if (steps[0] && steps[0].redirectPrev) {
                steps.unshift(dummyStep);
            }
            if (steps[steps.length-1] && steps[steps.length-1].redirectNext) {
                steps.push(dummyStep);
            }
            if (tour) {
                tour._options.steps = [];
                tour.addSteps(orderSteps(steps));
            }
        };

                self.addStep = function (step) {
            if (~steps.indexOf(step)) {
                return;
            }

            steps.push(step);
            self.refreshTour();
            newStepFound(step);
        };

                self.removeStep = function (step) {
            if (!~steps.indexOf(step)) {
                return;
            }

            steps.splice(steps.indexOf(step), 1);
            self.refreshTour();
        };

                self.getSteps = function () {
            return steps;
        };

                self.waitFor = function (waitForStep) {
            tour.end();
            newStepFound = function (step) {
                if (step.stepId === waitForStep) {
                    tour.setCurrentStep(steps.indexOf(step));
                    $timeout(function () {
                        tour.start(true);
                    });
                }
            };
        };

                self.init = function (options) {
            options.steps = orderSteps(steps);
            tour = new Tour(options);
            return tour;
        };


    }]);

}(angular.module('bm.bsTour')));
