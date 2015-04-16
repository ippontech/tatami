HomeModule.controller('StatusListContextController', [
    '$scope',
    '$q',
    '$timeout',
    'StatusService',
    'HomeService',
    'TagService',
    'GroupService',
    'profile',
    'statuses',
    'statusesWithContext',
    'userRoles',
    'showModal',
    'poller',
    function($scope, $q, $timeout, StatusService, HomeService, TagService, GroupService, profile, statuses, statusesWithContext, userRoles, showModal, poller) {
        if(showModal && $scope.$state.includes('tatami.home.home.timeline')) {
            $scope.$state.go('tatami.home.home.timeline.presentation');
        }

        $scope.isAdmin = userRoles.roles.indexOf('ROLE_ADMIN') !== -1;

        $scope.profile = profile;
        $scope.statusesWithContext = statusesWithContext;
        $scope.busy = false;

        if(statuses.length == 0) {
            $scope.end = true;
        } else {
            $scope.end = false;
            $scope.finish = statuses[statuses.length - 1].timelineId;
        }

        $scope.newMessages = null;

        if($scope.$state.is('tatami.home.home.timeline')) {
            var pollingDelay = 20000; // In milliseconds
            
            $timeout(function() {
                var statusPoller = poller.get(StatusService, {
                    action: 'getHomeTimeline',
                    delay: pollingDelay,
                    smart: true,
                    argumentsArray: [{ start: statuses[0].timelineId }]
                });

                statusPoller.promise.then(null, null, function(response) {
                    if(response.length > 0) {
                        $scope.newMessages = response.length;
                    }
                });
            }, pollingDelay);
        }

        var organizeStatuses = function(statuses, context) {
            var statusesWithContext = [];

            // Fill array with context statuses
            for(var i = 0; i < context.length; i++) {
                if(context[i] != null) {
                    statusesWithContext.push({ status: context[i], replies: [] });
                }
            }

            var individualStatuses = [];

            // Attach replies to corresponding context status
            for(var i = 0; i < statuses.length; i++) {
                if(statuses[i].replyTo) {
                    for(var j = 0; j < statusesWithContext.length; j++) {
                        if(statuses[i].replyTo == statusesWithContext[j].status.statusId) {
                            statusesWithContext[j].replies.unshift(statuses[i]);
                            break;
                        }

                        // If the context reply doesn't exist, then make the reply an individual status
                        if(j == statusesWithContext.length - 1) {
                            individualStatuses.push(statuses[i]);
                            break;
                        }
                    }
                } else {
                    var addIt = true;
                    // Check current timeline
                    for(var j = 0; j < $scope.statusesWithContext.length; j++) {
                        // If the status isn't already in the timeline as a
                        // context status, then add it to individualStatuses
                        if(statuses[i].statusId == $scope.statusesWithContext[j].status.statusId) {
                            addIt = false;
                            break;
                        }
                    }
                    // Check new timeline chunk
                    for(var j = 0; j < statusesWithContext.length; j++) {
                        // If the status isn't already in the timeline as a
                        // context status, then add it to individualStatuses
                        if(statuses[i].statusId == statusesWithContext[j].status.statusId) {
                            addIt = false;
                            break;
                        }
                    }
                    if(addIt) {
                        individualStatuses.push(statuses[i]);
                    }
                }
            }

            // Put remaining individual statuses (ones that aren't replies) into the timeline
            for(var i = 0; i < individualStatuses.length; i++) {
                // If the timeline is empty, put in a status
                if(statusesWithContext.length == 0) {
                    statusesWithContext.push({ status: individualStatuses[i], replies: null });
                    continue;
                }

                for(var j = 0; j <= statusesWithContext.length; j++) {
                    try {
                        // If the status block has replies, we need to check the 
                        // last reply's post date/time, because that is the latest status in the block.
                        // We order the timeline by the latest status in the block.
                        if(statusesWithContext[j].replies != null && statusesWithContext[j].replies.length != 0) {
                            var index = statusesWithContext[j].replies.length - 1;
                            if(statusesWithContext[j].replies[index].statusDate < individualStatuses[i].statusDate) {
                                statusesWithContext.splice(j, 0, { status: individualStatuses[i], replies: null });
                                break;
                            }
                        } else {
                            // Otherwise compare using the date of the individual status
                            if(statusesWithContext[j].status.statusDate < individualStatuses[i].statusDate) {
                                statusesWithContext.splice(j, 0, { status: individualStatuses[i], replies: null });
                                break;
                            }
                        }
                    } catch(err) {
                        // For statuses that are at the end (bottom) of the timeline
                        statusesWithContext.push({ status: individualStatuses[i], replies: null });
                        break;
                    }
                }
            }

            for(var i = 0; i < statusesWithContext.length; i++) {
                $scope.statusesWithContext.push(statusesWithContext[i]);
            }

            $scope.finish = statuses[statuses.length - 1].timelineId;
            $scope.busy = false;
        };

        var getContext = function(statuses) {
            if(statuses.length == 0) {
                $scope.end = true; // reached end of list
                return;
            }

            var temp = new Set();
            var context = [];

            for(var i = 0; i < statuses.length; ++i) {
                if(statuses[i].replyTo && !temp.has(statuses[i].replyTo)) {
                    temp.add(statuses[i].replyTo);
                    context.push(StatusService.get({ statusId: statuses[i].replyTo })
                        .$promise.then(
                            function(response) {
                                if(angular.equals({}, response.toJSON())) {
                                    return $q.when(null);
                                }
                            return response;
                    }));
                }
            }

            $q.all(context).then(function(context) {
                organizeStatuses(statuses, context);
            });
        };

        $scope.loadMore = function() {
            if($scope.busy || $scope.end) {
                return;
            }

            $scope.busy = true;

            if($scope.$state.current.name == 'tatami.home.home.timeline') {
                StatusService.getHomeTimeline({ finish: $scope.finish }, getContext);
            }
        };

        $scope.isOneDayOrMore = function(date) {
            return moment().diff(moment(date), 'days', true) >= 1;
        };

        $scope.favoriteStatus = function(status) {
            StatusService.update({ statusId: status.statusId }, { favorite: !status.favorite }, 
                function(response) {
                    $scope.$state.reload();
            });
        };

        $scope.shareStatus = function(status) {
            StatusService.update({ statusId: status.statusId }, { shared: !status.shareByMe }, 
                function(response) {
                    $scope.$state.reload();
            });
        };

        $scope.announceStatus = function(status) {
            StatusService.update({ statusId: status.statusId }, { announced: true },
                function() {
                    $scope.$state.reload();
                    //$scope.$state.transitionTo('tatami.home.home.timeline');
            });
        };

        $scope.deleteStatus = function(status, confirmMessage) {
            // Need a confirmation modal here
            StatusService.delete({ statusId: status.statusId }, null,
                function() {
                    $scope.$state.reload();
            });
        };

        $scope.getShares = function(status, firstIndex, secondIndex) {
            if(status.type == 'STATUS' && status.shares == null) {
                StatusService.getDetails({ statusId: status.statusId }, null,
                    function(response) {
                        if(secondIndex == null) {
                            $scope.statusesWithContext[firstIndex].status.shares = response.sharedByLogins;
                        } else {
                            $scope.statusesWithContext[firstIndex]['replies'][secondIndex].shares = response.sharedByLogins;
                        }
                });
            }
        };
    }
]);