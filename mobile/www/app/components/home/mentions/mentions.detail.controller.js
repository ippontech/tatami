angular.module('tatami')
    .controller('MentionDetailCtrl', function ($scope, $stateParams, Mentions) {
        $scope.mention = Mentions.get($stateParams.mentionId);
    });
