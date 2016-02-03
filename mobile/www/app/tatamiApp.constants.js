(function() {
    'use strict';

    var endpointConstant = { url: 'http://localhost:8100' };

    angular.module('tatami')
        .constant('TatamiEndpoint', endpointConstant);

})();
