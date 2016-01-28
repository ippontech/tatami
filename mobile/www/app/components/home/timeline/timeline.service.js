angular.module('tatami')

    .factory('LineItems', [ '$http', function($http) {
        var lineItems = {};
        var url = './tatami/rest/statuses/home_timeline';

        lineItems = $http.get(url).success(function(data){
            return data;
        });

        lineItems.success(function(data) {
            lineItems = data;
        });

        // profile  = /tatami/rest/account/profile

        return {
            all: function() {
                return lineItems;
            },
            remove: function(lineItem) {
                lineItems.splice(lineItems.indexOf(lineItem), 1);
            },
            get: function(index) {
                for (var i = 0; i < lineItems.length; i++) {
                    if (lineItems[i].timelineId === index) {
                        return lineItems[i];
                    }
                }
                return null;
            }
        };
    }]);
