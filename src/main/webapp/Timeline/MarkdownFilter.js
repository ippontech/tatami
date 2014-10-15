tatami.filter('markdown', ['$sce', function($sce) {
    return function(content) {
        return $sce.trustAsHtml(marked(content));
    };
}]);