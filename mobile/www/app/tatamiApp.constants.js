(function() {
    'use strict';

    var endpointConstant = { url: 'http://10.1.10.201:8100' };

    angular.module('tatami')
        .constant('TatamiEndpoint', endpointConstant);

})();
