TatamiApp.run(['$translate', 'amMoment', function($translate, amMoment) {
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
        //s:  "1d",
        //m:  "1m",
        //mm: "%dm",
        //h:  "1h",
        //hh: "%dh",
        d:  "1j",
        dd: "%dj",
        M:  "1m",
        MM: "%dm",
        y:  "1a",
        yy: "%da"
    }
});