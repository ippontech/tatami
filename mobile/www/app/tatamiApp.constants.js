(function() {
    'use strict';

    var endpointConstant = { url: 'http://app.tatamisoft.com' };

    angular.module('tatami')
        .constant('TatamiEndpoint', endpointConstant);

})();
