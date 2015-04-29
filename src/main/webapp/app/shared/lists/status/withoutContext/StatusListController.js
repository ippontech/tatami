HomeModule.controller('StatusListController', [
    '$scope',
    '$timeout',
    '$window',
    '$translate',
    'StatusService',
    'HomeService',
    'TagService',
    'GroupService',
    'profile',
    'statuses',
    'userRoles',
    'showModal',
    function($scope, $timeout, $window, StatusService, HomeService, TagService, GroupService, profile, statuses, userRoles, showModal) {
        if(showModal && $scope.$state.is('tatami.home.home.timeline')) {
            $scope.$state.go('tatami.home.home.timeline.presentation');
        }

        $scope.isAdmin = userRoles.roles.indexOf('ROLE_ADMIN') !== -1;

        $scope.profile = profile;
        $scope.statuses = statuses;
        $scope.busy = false;

        if($scope.statuses.length == 0) {
            $scope.end = true;
        } else {
            $scope.end = false;
            $scope.finish = $scope.statuses[$scope.statuses.length - 1].timelineId;
        }

        /* Begin Polling Related Code */

        $scope.newMessages = null;
        $window.document.title = 'Tatami';

        var requestNewStatuses = function() {
            var pollingDelay = 20000; // In milliseconds

            $scope.poller = $timeout(function() {
                var arguments = null;

                if($scope.statuses.length > 0) {
                    if($scope.$state.is('tatami.home.home.tag')) {
                        arguments = { tag: $scope.$stateParams.tag, start: statuses[0].timelineId };
                    }

                    else if($scope.$state.is('tatami.home.home.group.statuses')) {
                        arguments = { groupId: $scope.$stateParams.groupId, start: statuses[0].timelineId };
                    }

                    else if($scope.$state.is('tatami.home.profile.statuses')) {
                        arguments = { username: $scope.$stateParams.username, start: statuses[0].timelineId };
                    }

                    else {
                        arguments = { start: statuses[0].timelineId };
                    }
                }
                else {
                    if($scope.$state.is('tatami.home.home.tag')) {
                        arguments = { tag: $scope.$stateParams.tag };
                    }

                    else if($scope.$state.is('tatami.home.home.group.statuses')) {
                        arguments = { groupId: $scope.$stateParams.groupId };
                    }

                    else if($scope.$state.is('tatami.home.profile.statuses')) {
                        arguments = { username: $scope.$stateParams.username };
                    }

                    else {
                        arguments = {};
                    }
                }

                var success = function(response) {
                    if(response.length > 0) {
                        $scope.newMessages = response;
                        $window.document.title = 'Tatami (' + $scope.newMessages.length + ')';
                    }
                    requestNewStatuses();
                };

                var error = function(err) {
                    requestNewStatuses();
                };

                if($scope.$state.is('tatami.home.home.timeline')) {
                    StatusService.getHomeTimeline(arguments, success, error);
                }

                else if($scope.$state.is('tatami.home.home.mentions')) {
                    HomeService.getMentions(arguments, success, error);
                }

                else if($scope.$state.is('tatami.home.home.company')) {
                    HomeService.getCompanyTimeline(arguments, success, error);
                }

                else if($scope.$state.is('tatami.home.home.tag')) {
                    TagService.getTagTimeline(arguments, success, error);
                }

                else if($scope.$state.is('tatami.home.home.group.statuses')) {
                    GroupService.getStatuses(arguments, success, error);
                }

                else if($scope.$state.is('tatami.home.profile.statuses')) {
                    StatusService.getUserTimeline(arguments, success, error);
                }
            }, pollingDelay);
        };

        requestNewStatuses();

        $scope.$on('$destroy', function() {
            $timeout.cancel($scope.poller);
        });

        $scope.loadNewStatuses = function() {
            for(var i = $scope.newMessages.length - 1; i >= 0 ; i--) {
                $scope.statuses.unshift($scope.newMessages[i]);
            }

            $scope.newMessages = null;
            $window.document.title = 'Tatami';
        };

        /* End Polling Related Code */

        /* Begin Infinite Scrolling Related Code */

        $scope.requestOldStatuses = function() {
            if($scope.busy || $scope.end) {
                return;
            }

            $scope.busy = true;

            if($scope.$state.is('tatami.home.home.timeline')) {
                StatusService.getHomeTimeline({ finish: $scope.finish }, loadOldStatuses);
            }

            else if($scope.$state.is('tatami.home.home.company')) {
                HomeService.getCompanyTimeline({ finish: $scope.finish }, loadOldStatuses);
            }

            else if($scope.$state.is('tatami.home.home.mentions')) {
                HomeService.getMentions({ finish: $scope.finish }, loadOldStatuses);
            }

            /*
                Favorites are limited to 50 total per user. All 50 are loaded
                from the favorites REST endpoint at once. There is no way to use
                &finish=timelineId for favorites as of now in the backend.

                Keep this commented out until the backend is changed to allow
                for more than 50 favorites and adding &finish=timelineId to the
                REST url.
            */
            /*
            else if($scope.$state.is('tatami.home.home.favorites')) {
                HomeService.getFavorites({ finish: $scope.finish }, loadOldStatuses);
            }
            */

            else if($scope.$state.is('tatami.home.home.tag')) {
                TagService.getTagTimeline({ tag: $scope.$stateParams.tag, finish: $scope.finish }, loadOldStatuses);
            }

            else if($scope.$state.is('tatami.home.home.group.statuses')) {
                GroupService.getStatuses({ groupId: $scope.$stateParams.groupId, finish: $scope.finish }, loadOldStatuses);
            }

            else if($scope.$state.is('tatami.home.profile.statuses')) {
                StatusService.getUserTimeline({ username: $scope.$stateParams.username, finish: $scope.finish }, loadOldStatuses);
            }
        };

        var loadOldStatuses = function(statuses) {
            if(statuses.length == 0) {
                $scope.end = true; // reached end of list
                return;
            }

            for(var i = 0; i < statuses.length; i++) {
                $scope.statuses.push(statuses[i]);
            }

            $scope.finish = $scope.statuses[$scope.statuses.length - 1].timelineId;
            $scope.busy = false;
        };

        /* End Infinite Scrolling Related Code */

        $scope.openReplyModal = function(status) {
            $scope.$state.go($scope.$state.current.name + '.post', { statusId: status.statusId });
        };

        $scope.isOneDayOrMore = function(date) {
            return moment().diff(moment(date), 'days', true) >= 1;
        };

        $scope.getLanguageKey = function() {
            return $translate.use();
        };

        $scope.openReplyModal = function(status) {
            $scope.$state.go($scope.$state.current.name + '.post', { statusId: status.statusId });
        };

        $scope.favoriteStatus = function(status, index) {
            StatusService.update({ statusId: status.statusId }, { favorite: !status.favorite }, 
                function(response) {
                    $scope.statuses[index].favorite = response.favorite;
            });
        };

        $scope.shareStatus = function(status, index) {
            StatusService.update({ statusId: status.statusId }, { shared: !status.shareByMe }, 
                function(response) {
                    $scope.statuses[index].shareByMe = response.shareByMe;
            });
        };

        $scope.announceStatus = function(status) {
            StatusService.update({ statusId: status.statusId }, { announced: true },
                function() {
                    $scope.$state.reload();
                    //$scope.$state.transitionTo('tatami.home.home.timeline', {}, { reload: true });
            });
        };

        $scope.deleteStatus = function(status, index, confirmMessage) {
            // Need a confirmation modal here
            StatusService.delete({ statusId: status.statusId }, null,
                function() {
                    $scope.statuses.splice(index, 1);
            });
        };

        $scope.getShares = function(status, index) {
            if(status.type == 'STATUS' && status.shares == null) {
                StatusService.getDetails({ statusId: status.statusId }, null,
                    function(response) {
                        $scope.statuses[index].shares = response.sharedByLogins;
                });
            }
        };
    }
]);
