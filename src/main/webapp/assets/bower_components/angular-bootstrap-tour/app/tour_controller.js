/* global angular: false */

(function (app) {
    'use strict';

    app.controller('TourController', ['$filter', '$timeout', function ($filter, $timeout) {

        var self = this,
            steps = [],
            tour,
            newStepFound = angular.noop,
            dummyStep = {};

        /**
         * Sorts steps based on "order" and set next and prev options appropriately
         *
         * @param {Array} steps
         * @returns {Array}
         */
        function orderSteps(steps) {
            var ordered = $filter('orderBy')(steps, 'order');

            angular.forEach(ordered, function (step, index) {
                step.next = ordered[index + 1] ? index + 1 : - 1;
                step.prev = index - 1;
            });

            return ordered;
        }

        /**
         * As steps are linked, add them to the tour options
         */
        self.refreshTour = function () {
            //remove dummy steps that were previously added
            steps = steps.filter(function (step) {
                return step !== dummyStep;
            });

            //if the first or last step redirects to another page, BT needs a step (dummyStep)
            if (steps[0] && steps[0].redirectPrev) {
                steps.unshift(dummyStep);
            }
            if (steps[steps.length-1] && steps[steps.length-1].redirectNext) {
                steps.push(dummyStep);
            }

            //refresh
            if (tour) {
                tour._options.steps = [];
                tour.addSteps(orderSteps(steps));
            }
        };

        /**
         * Adds a step to the tour
         *
         * @param {object} step
         */
        self.addStep = function (step) {
            if (~steps.indexOf(step)) {
                return;
            }

            steps.push(step);
            self.refreshTour();
            newStepFound(step);
        };

        /**
         * Removes a step from the tour
         *
         * @param step
         */
        self.removeStep = function (step) {
            if (!~steps.indexOf(step)) {
                return;
            }

            steps.splice(steps.indexOf(step), 1);
            self.refreshTour();
        };

        /**
         * Returns the list of steps
         *
         * @returns {Array}
         */
        self.getSteps = function () {
            return steps;
        };

        /**
         * Tells the tour to pause while ngView loads
         *
         * @param waitForStep
         */
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

        /**
         * Initialize the tour
         *
         * @param {object} options
         * @returns {Tour}
         */
        self.init = function (options) {
            options.steps = orderSteps(steps);
            tour = new Tour(options);
            return tour;
        };


    }]);

}(angular.module('bm.bsTour')));
