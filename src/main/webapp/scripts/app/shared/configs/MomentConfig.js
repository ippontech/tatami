angular.module('tatamiJHipsterApp')
.run(['$translate', 'amMoment', function($translate, amMoment) {
    amMoment.changeLocale($translate.use());
}]);

moment.locale('en', {
    relativeTime : {
        future: "",
        past:   "%s",
        s:  "1s",
        m:  "1m",
        mm: "%dm",
        h:  "1h",
        hh: "%dh",
        d:  "1d",
        dd: "%dd",
        M:  "1mo",
        MM: "%dmo",
        y:  "1y",
        yy: "%dy"
    }
});

moment.locale('fr', {
         relativeTime : {
             future: "",
             past:   "%s",
             s:  "1 s",
             m:  "1 min",
             mm: "%d min",
             h:  "1 h",
             hh: "%d h",
             d:  "1 j",
             dd: "%d j",
             M:  "1 m",
             MM: "%d m",
             y:  "1 a",
             yy: "%d a"
         }
});
