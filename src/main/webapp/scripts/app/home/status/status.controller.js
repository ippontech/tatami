'use strict';

angular.module('tatamiJHipsterApp')
.controller('StatusController', [
    '$scope',
    '$translate',
    'StatusService',
    'status',
    'context',
    function($scope, $translate, StatusService, status, context) {
//        $scope.isAdmin = userRoles.roles.indexOf('ROLE_ADMIN') !== -1;

        if(context.discussionStatuses.length === 0) {
            $scope.statuses = [status];
        } else {
            $scope.statuses = context.discussionStatuses;
        }
        try {
          for(var i = 0; i <= context.discussionStatuses.length; i++) {
              if (status.statusDate < $scope.statuses[i].statusDate) {
                  $scope.statuses.splice(i, 0, status);
                  break;
              }
          }
        } catch(err) {
            $scope.statuses.push(status);
        }

        $scope.isOneDayOrMore = function(date) {
            return moment().diff(moment(date), 'days', true) >= 1;
        };

        $scope.getLanguageKey = function() {
            return $translate.use();
        };

        $scope.openReplyModal = function(status) {
            $scope.$state.go($scope.$state.current.name + '.post', { statusIdReply: status.statusId });
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
                    if($scope.$stateParams.statusId === status.statusId) {
                        $scope.$state.transitionTo('tatami.home.home.timeline');
                    } else {
                        $scope.statuses.splice(index, 1);
                    }
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
    }
]);
