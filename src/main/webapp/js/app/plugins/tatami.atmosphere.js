/* Disabled as the proxy does not support SSE (yet)
$(function () {
    "use strict";

    var logged = false;
    var socket = $.atmosphere;
    var request = { url: '/realtime/statuses/home_timeline',
        contentType : "application/json",
        transport : 'sse' ,
        fallbackTransport: 'long-polling',
        trackMessageLength: true};

    request.onOpen = function(response) {
    };

    request.onReconnect = function (request, response) {
        socket.info("Reconnecting");
    };

    request.onMessage = function (response) {
        var message = response.responseBody;
        try {
            var json = jQuery.parseJSON(message);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message);
            return;
        }
        Tatami.app.trigger('refresh');
    };

    request.onClose = function(response) {
        logged = false;
    }

    request.onError = function(response) {
        console.log("Error:" + response);
    };

    var subSocket = socket.subscribe(request);
});
*/
