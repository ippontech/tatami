/* when jQuery Mobile CDN fail for css, fall back to local */
$(document).ready(function() {
    $.each(document.styleSheets, function(i,sheet) {
        if(sheet.href=='http://code.jquery.com/mobile/1.1.0/jquery.mobile-1.1.0.min.css') {
            var rules = sheet.rules ? sheet.rules : sheet.cssRules;
            if (rules.length == 0) {
                $('<link rel="stylesheet" href="assets/css/CDN/jquery.mobile-1.1.0.min.css" />').appendTo('head');
            }
        }
    });
});