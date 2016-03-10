tatamiJHipsterApp
.filter('placeholderFilter', ['$translate', function($translate) {
    return function(isReply) {
        if(isReply) {
            return "";
        }
        else {
            return $translate.instant('post.update');
        }
    };
}]);