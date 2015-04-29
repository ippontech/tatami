/* global Tour: false */

/**
 * @file angular-bootstrap-tour is micro-library.
 * Scaffolded with generator-microjs
 * @author  <Ben March>
 */


(function angularBootstrapTour(app) {
    'use strict';

    //all components moved to separate files

}(angular.module('bm.bsTour', [])));

/* global angular: false */

(function (app) {
    'use strict';

    app.provider('TourConfig', [function () {

        var config = {
            prefixOptions: false,
            prefix: 'bsTour'
        };

        this.set = function (option, value) {
            config[option] = value;
        };

        this.$get = [function () {

            var service = {};

            service.get = function (option) {
                return config[option];
            };

            return service;

        }];

    }]);

}(angular.module('bm.bsTour')));

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

                    //Pass static options through or use defaults
                    var tour = {},
                        templateReady,
                        events = 'onStart onEnd afterGetState afterSetState afterRemoveState onShow onShown onHide onHidden onNext onPrev onPause onResume'.split(' '),
                        options = 'name container keyboard storage debug redirect duration basePath backdrop orphan'.split(' ');

                    //Pass interpolated values through
                    TourHelpers.attachInterpolatedValues(attrs, tour, options);

                    //Attach event handlers
                    TourHelpers.attachEventHandlers(scope, attrs, tour, events);

                    //Compile template
                    templateReady = TourHelpers.attachTemplate(scope, attrs, tour);

                    //Monitor number of steps
                    scope.$watchCollection(ctrl.getSteps, function (steps) {
                        scope.stepCount = steps.length;
                    });

                    //If there is an options argument passed, just use that instead
                    //@deprecated use 'options' instead
                    if (attrs.tourOptions) {
                        angular.extend(tour, scope.$eval(attrs.tourOptions));
                    }

                    if (attrs[TourHelpers.getAttrName('options')]) {
                        angular.extend(tour, scope.$eval(attrs[TourHelpers.getAttrName('options')]));
                    }

                    //Initialize tour
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

/* global angular: false */

(function (app) {
    'use strict';

    app.factory('TourHelpers', ['$templateCache', '$http', '$compile', 'TourConfig', '$q', function ($templateCache, $http, $compile, TourConfig, $q) {

        var helpers = {},
            safeApply;

        /**
         * Helper function that calls scope.$apply if a digest is not currently in progress
         * Borrowed from: https://coderwall.com/p/ngisma
         *
         * @param {$rootScope.Scope} scope
         * @param {Function} fn
         */
        safeApply = helpers.safeApply = function(scope, fn) {
            var phase = scope.$$phase;
            if (phase === '$apply' || phase === '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                scope.$apply(fn);
            }
        };

        /**
         * Compiles and links a template to the provided scope
         *
         * @param {String} template
         * @param {$rootScope.Scope} scope
         * @returns {Function}
         */
        function compileTemplate(template, scope) {
            return function (/*index, step*/) {
                var $template = angular.element(template); //requires jQuery
                safeApply(scope, function () {
                    $compile($template)(scope);
                });
                return $template;
            };

        }

        /**
         * Looks up a template by URL and passes it to {@link helpers.compile}
         *
         * @param {String} templateUrl
         * @param {$rootScope.Scope} scope
         * @returns {Promise}
         */
        function lookupTemplate(templateUrl, scope) {

            return $http.get(templateUrl, {
                cache: $templateCache
            }).success(function (template) {
                if (template) {
                    return compileTemplate(template, scope);
                }
                return '';
            });

        }

        /**
         * Converts a stringified boolean to a JS boolean
         *
         * @param string
         * @returns {*}
         */
        function stringToBoolean(string) {
            if (string === 'true') {
                return true;
            } else if (string === 'false') {
                return false;
            }

            return string;
        }

        /**
         * Helper function that attaches proper compiled template to options
         *
         * @param {$rootScope.Scope} scope
         * @param {Attributes} attrs
         * @param {Object} options represents the tour or step object
         */
        helpers.attachTemplate = function (scope, attrs, options) {

            var deferred = $q.defer(),
                template;

            if (attrs[helpers.getAttrName('template')]) {
                template = compileTemplate(scope.$eval(attrs[helpers.getAttrName('template')]), scope);
                options.template = template;
                deferred.resolve(template);
            } else if (attrs[helpers.getAttrName('templateUrl')]) {
                lookupTemplate(attrs[helpers.getAttrName('templateUrl')], scope).then(function (template) {
                    if (template) {
                        options.template = template;
                        deferred.resolve(template);
                    }
                });
            } else {
                deferred.resolve();
            }

            return deferred.promise;

        };

        /**
         * Helper function that attaches event handlers to options
         *
         * @param {$rootScope.Scope} scope
         * @param {Attributes} attrs
         * @param {Object} options represents the tour or step object
         * @param {Array} events
         */
        helpers.attachEventHandlers = function (scope, attrs, options, events) {

            angular.forEach(events, function (eventName) {
                if (attrs[helpers.getAttrName(eventName)]) {
                    options[eventName] = function (tour) {
                        safeApply(scope, function () {
                            scope.$eval(attrs[helpers.getAttrName(eventName)]);
                        });
                    };
                }
            });

        };

        /**
         * Helper function that attaches observers to option attributes
         *
         * @param {Attributes} attrs
         * @param {Object} options represents the tour or step object
         * @param {Array} keys attribute names
         */
        helpers.attachInterpolatedValues = function (attrs, options, keys) {

            angular.forEach(keys, function (key) {
                if (attrs[helpers.getAttrName(key)]) {
                    options[key] = stringToBoolean(attrs[helpers.getAttrName(key)]);
                    attrs.$observe(helpers.getAttrName(key), function (newValue) {
                        options[key] = stringToBoolean(newValue);
                    });
                }
            });

        };

        /**
         * Returns the attribute name for an option depending on the prefix
         *
         * @param {string} option - name of option
         * @returns {string} potentially prefixed name of option, or just name of option
         */
        helpers.getAttrName = function (option) {
            if (TourConfig.get('prefixOptions')) {
                return TourConfig.get('prefix') + option.charAt(0).toUpperCase() + option.substr(1);
            } else {
                return option;
            }
        };

        return helpers;

    }]);

}(angular.module('bm.bsTour')));

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
