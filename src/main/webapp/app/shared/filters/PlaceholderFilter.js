TatamiApp.filter('placeholderFilter', ['$translate', function($translate) {
    return function(isReply) {
        if(isReply) {
            return "";
        }
        else {
            return $translate.instant('tatami.home.post.update');
        }
    }
}]);