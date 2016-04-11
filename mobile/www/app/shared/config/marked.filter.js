(function() {
    'use strict';

    angular.module('tatami')
        .filter('markdown', markdown);

    markdown.$inject = ['$sce'];
    function markdown($sce) {
        return function(content) {
            return content ? marked(content) : '';
        };
    }
})();
