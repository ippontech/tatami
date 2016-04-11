(function() {
    'use strict';

    angular.module('tatami')
        .config(markedConfig);

    markedConfig.$inject = ['markedProvider'];
    function markedConfig(markedProvider) {
        markedProvider.setOptions({
            gfm: true,
            pedantic: false,
            sanitize: true,
            highlight: null,
            urls: {
                youtube : function(text, url){
                    var cap;
                    if((cap = /(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&"'>]+)/.exec(url))){
                        return '<iframe width="420" height="315" src="https://www.youtube.com/embed/' +
                            cap[5] +
                            '" frameborder="0" allowfullscreen></iframe>';
                    }
                },
                vimeo : function(text, url){
                    var cap;
                    if((cap = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/.exec(url))){
                        return '<iframe src="https://player.vimeo.com/video/' +
                            cap[5] +
                            '" width="500" height="281" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
                    }
                },
                dailymotion : function(text, url){
                    var cap;
                    if((cap = /^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/.exec(url))){
                        return '<iframe frameborder="0" width="480" height="271" src="https://www.dailymotion.com/embed/video/' +
                            cap[2] +
                            '"></iframe>';
                    }
                },
                gist : function(text, url){
                    var cap;
                    if((cap = /^.+gist.github.com\/(([A-z0-9-]+)\/)?([0-9A-z]+)/.exec(url))){
                        $.ajax({
                            url: cap[0] + '.json',
                            dataType: 'jsonp',
                            success: function(response){
                                if(response.stylesheet && $('link[href="' + response.stylesheet + '"]').length === 0){
                                    var l = document.createElement("link"),
                                        head = document.getElementsByTagName("head")[0];

                                    l.type = "text/css";
                                    l.rel = "stylesheet";
                                    l.href = response.stylesheet;
                                    head.insertBefore(l, head.firstChild);
                                }
                                var $elements = $('.gist' + cap[3]);
                                $elements.html(response.div);
                            }
                        });
                        return '<div class="gist' + cap[3] + '"/>';
                    }
                }
            }
        });
    }
})();
