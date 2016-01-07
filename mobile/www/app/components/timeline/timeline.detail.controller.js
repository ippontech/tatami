angular.module('tatami')
    .controller('LineItemDetailCtrl', function ($scope, $stateParams, LineItems) {

        // Displaying the same data on all of the pages...
        //
        //$http.get('./tatami/rest/statuses/home_timeline').then(function(resp) {
        //    var LineItems = resp.data;
        //
        //    for (var i = 0; i < LineItems.length; i++) {
        //        if (LineItems[i].lineItemId === $stateParams.timelineId) {
        //            $scope.lineItem = LineItems[i];
        //        }
        //    }
        //
        //}, function(err) {
        //    console.error('ERR', err);
        //});
        //

        $scope.lineItem = LineItems.get($stateParams.lineItemId);

        $scope.getAvatarURL = function(avatar) {
            var src = '../../../img/test-prof.png';
            if( avatar != '' &&  avatar != undefined) {
                src = '/tatami/avatar/' + avatar + '/photo.jpg';
            }
            return src;
        };

    });
