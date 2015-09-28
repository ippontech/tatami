/* global Tour: false */



(function angularBootstrapTour(app) {
    'use strict';

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

/* global angular: false */

(function (app) {
    'use strict';

    app.factory('TourHelpers', ['$templateCache', '$http', '$compile', 'TourConfig', '$q', function ($templateCache, $http, $compile, TourConfig, $q) {

        var helpers = {},
            safeApply;

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

                function compileTemplate(template, scope) {
            return function (/*index, step*/) {
                var $template = angular.element(template); //requires jQuery
                safeApply(scope, function () {
                    $compile($template)(scope);
                });
                return $template;
            };

        }

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

                function stringToBoolean(string) {
            if (string === 'true') {
                return true;
            } else if (string === 'false') {
                return false;
            }

            return string;
        }

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
