HomeModule.controller('StatusListController', [
    '$scope',
    'StatusService',
    'HomeService',
    'TagService',
    'GroupService',
    'profile',
    'statuses',
    'userRoles',
    'showModal',
    function($scope, StatusService, HomeService, TagService, GroupService, profile, statusesWithContext, userRoles, showModal) {
        $scope.profile = profile;
        $scope.statuses = statusesWithContext;
        $scope.isAdmin = userRoles.roles.indexOf('ROLE_ADMIN') !== -1;

        $scope.busy = false;
        if(showModal && $scope.$state.includes('tatami.home.home.timeline')) {
            console.log('hi');
            $scope.$state.go('tatami.home.home.timeline.presentation');
        }

        if($scope.statuses.length == 0) {
            $scope.end = true;
        } else {
            $scope.end = false;
            $scope.finish = $scope.statuses[$scope.statuses.length - 1].timelineId;
        }

        var loadMoreSuccess = function(statuses) {
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

        $scope.loadMore = function() {
            if($scope.busy || $scope.end) {
                return;
            }

            $scope.busy = true;

            if($scope.$state.current.name == 'tatami.home.home.timeline') {
                StatusService.getHomeTimeline({ finish: $scope.finish }, loadMoreSuccess);
            }

            if($scope.$state.current.name == 'tatami.home.home.mentions') {
                HomeService.getMentions({ finish: $scope.finish }, loadMoreSuccess);
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
            if($scope.$state.current.name == 'tatami.home.home.favorites') {
                HomeService.getFavorites({ finish: $scope.finish }, loadMoreSuccess);
            }
            */

            if($scope.$state.current.name == 'tatami.home.home.company') {
                HomeService.getCompanyTimeline({ finish: $scope.finish }, loadMoreSuccess);
            }

            if($scope.$state.current.name == 'tatami.home.home.tag') {
                TagService.getTagTimeline({ tag: $scope.$stateParams.tag, finish: $scope.finish }, loadMoreSuccess);
            }

            if($scope.$state.current.name == 'tatami.home.home.group.statuses') {
                GroupService.getStatuses({ groupId: $scope.$stateParams.groupId, finish: $scope.finish }, loadMoreSuccess);
            }

            if($scope.$state.current.name == 'tatami.home.profile.statuses') {
                StatusService.getUserTimeline({ username: $scope.$stateParams.username, finish: $scope.finish }, loadMoreSuccess);
            }
        };

        $scope.isOneDayOrMore = function(date) {
            return moment().diff(moment(date), 'days', true) >= 1;
        };

        $scope.favoriteStatus = function(status, index, favoriteContext) {
            if(favoriteContext) {
                StatusService.update({ statusId: status.context.statusId }, { favorite: !status.context.favorite }, 
                    function(response) {
                        $scope.statuses[index].context.favorite = response.favorite;
                });
            }
            else {
                StatusService.update({ statusId: status.statusId }, { favorite: !status.favorite }, 
                    function(response) {
                        $scope.statuses[index].favorite = response.favorite;
                });
            }
        };

        $scope.shareStatus = function(status, index, shareContext) {
            if(shareContext) {
                StatusService.update({ statusId: status.context.statusId }, { shared: !status.context.shareByMe }, 
                    function(response) {
                        $scope.statuses[index].context.shareByMe = response.shareByMe;
                });
            }
            else {
                StatusService.update({ statusId: status.statusId }, { shared: !status.shareByMe }, 
                    function(response) {
                        $scope.statuses[index].shareByMe = response.shareByMe;
                });
            }
        };

        $scope.announceStatus = function(status) {
            // Update announcement in model?
            StatusService.update({ statusId: status.statusId }, { announced: true });
        };

        // Might want extra delete logic when the same statuses show up in multiple places
        $scope.deleteStatus = function(status, index, confirmMessage) {
            // Need a confirmation modal here
            StatusService.delete({ statusId: status.statusId }, null,
                function() {
                    $scope.statuses.splice(index, 1);
            });
        };
    }
]);