'use strict';
angular.module('tatamiJHipsterApp')
    .directive('tatamiStatusList', function() {
            return {
                restrict: 'E',
                templateUrl: 'scripts/shared/lists/status/tatamiStatusList.html',
                scope: {
                    statuses: '='
                },
                controller: [
                    '$scope',
                    '$state',
                    '$stateParams',
                    '$timeout',
                    '$window',
                    '$uibModal',
                    '$translate',
                    'GroupService',
                    'HomeService',
                    'StatusService',
                    'PostModalService',
                    'TagService',
                    'GeolocalisationService',
                    function($scope, $state, $stateParams, $timeout, $window, $uibModal, $translate, GroupService, HomeService, StatusService, PostModalService, TagService, GeolocalisationService, statuses, showModal) {
                        if(showModal && $state.$current.name == 'timeline') {
                            $state.go('timelinePresentation');
                        }

                        $scope.busy = false;

                        if($scope.statuses.length === 0) {
                            $scope.end = true;
                        } else {
                            $scope.end = false;
                            $scope.finish = $scope.statuses[$scope.statuses.length - 1].timelineId;
                        }


                        /* Begin Polling Related Code */

                        $scope.newMessages = null;
                        $window.document.title = 'Tatami';

                        var requestNewStatuses = function() {
                            // In milliseconds
                            var pollingDelay = 600000;

                            $scope.poller = $timeout(function() {
                                var args = null;

                                if($scope.statuses.length > 0) {
                                    if($state.$current.name == 'tag') {
                                        args = { tag: $scope.$stateParams.tag, start: $scope.statuses[0].timelineId };
                                    }

                                    else if($state.$current.name == 'timelineHome.sidebarHome.group.statuses') {
                                        args = { groupId: $scope.$stateParams.groupId, start: $scope.statuses[0].timelineId };
                                    }

                                    else if($state.$current.name == 'home.profile.statuses') {
                                        args = { email: $scope.$stateParams.email, start: $scope.statuses[0].timelineId };
                                    }

                                    else {
                                        args = { start: $scope.statuses[0].timelineId };
                                    }
                                }
                                else {
                                    if($state.$current.name == 'tag') {
                                        args = { tag: $scope.$stateParams.tag };
                                    }

                                    else if($state.$current.name == 'timelineHome.sidebarHome.group.statuses') {
                                        args = { groupId: $scope.$stateParams.groupId };
                                    }

                                    else if($state.$current.name == 'home.profile.statuses') {
                                        args = { email: $scope.$stateParams.email };
                                    }

                                    else {
                                        args = {};
                                    }
                                }

                                var success = function(response) {
                                    if(response.length > 0) {
                                        $scope.newMessages = response;
                                        $window.document.title = 'Tatami (' + $scope.newMessages.length + ')';
                                    }
                                    requestNewStatuses();
                                };

                                var error = function() {
                                    requestNewStatuses();
                                };

                                if($state.$current.name == 'timeline') {
                                    StatusService.getHomeTimeline(args, success, error);
                                }

                                else if($state.$current.name == 'mentions') {
                                    HomeService.getMentions(args, success, error);
                                }

                                else if($state.$current.name == 'company') {
                                    StatusService.getCompanyTimeline(args, success, error);
                                }

                                else if($state.$current.name == 'tag') {
                                    TagService.getTagTimeline(args, success, error);
                                }

                                else if($state.$current.name == 'timelineHome.sidebarHome.group.statuses') {
                                    GroupService.getStatuses(args, success, error);
                                }

                                else if($state.$current.name == 'home.profile.statuses') {
                                    StatusService.getUserTimeline(args, success, error);
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

                            if($state.$current.name == 'timelinePresentation') {
                                StatusService.getHomeTimeline({ finish: $scope.finish }, loadOldStatuses);
                            }

                            if($state.$current.name == 'timeline') {
                                StatusService.getHomeTimeline({ finish: $scope.finish }, loadOldStatuses);
                            }

                            else if($state.$current.name == 'company') {
                                StatusService.getCompanyTimeline({ finish: $scope.finish }, loadOldStatuses);
                            }

                            else if($state.$current.name == 'mentions') {
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

                            else if($state.$current.name == 'tag') {
                                TagService.getTagTimeline({ tag: $scope.$stateParams.tag, finish: $scope.finish }, loadOldStatuses);
                            }

                            else if($state.$current.name == 'statuses') {
                                GroupService.getStatuses({ groupId: $scope.$stateParams.groupId, finish: $scope.finish }, loadOldStatuses);
                            }

                            else if($state.$current.name == 'statuses') {
                                StatusService.getUserTimeline({ email: $scope.$stateParams.email, finish: $scope.finish }, loadOldStatuses);
                            }
                        };

                        var loadOldStatuses = function(statuses) {
                            if(statuses.length === 0){
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

                        $scope.isOneDayOrMore = function(date) {
                            return moment().diff(moment(date), 'days', true) >= 1;
                        };

                        $scope.getLanguageKey = function() {
                            return $translate.use();
                        };

                        $scope.openReplyModal = function(statusId) {
                            PostModalService.openPostModal(statusId);
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

                                });
                        };

                        $scope.deleteStatus = function(status, index) {
                            // Need a confirmation modal here
                            StatusService.delete({ statusId: status.statusId }, null,
                                function() {
                                    $scope.statuses.splice(index, 1);
                                });
                        };

                        $scope.getShares = function(status, index) {
                            if(status.type === 'STATUS' && status.shares === null) {
                                StatusService.getDetails({ statusId: status.statusId }, null,
                                    function(response) {
                                        $scope.statuses[index].shares = response.sharedByEmails;
                                    });
                            }
                        };

                        $scope.displayGeoLocInfo = function (status, index) {
                            if (status.locationURL) {
                                GeolocalisationService.getGeoLocDetails($scope.statuses[index]).then(function (address) {
                                    $scope.statuses[index].locationDetails = address.city + ", " + address.state;
                                });
                            }
                        };

                        $scope.hideStatus = function (status, index) {
                            StatusService.hideStatus({statusId: status.statusId}, function () {
                                $scope.statuses.splice(index,1);
                            })
                        }
                    }
                ]
            }
        }
    );
