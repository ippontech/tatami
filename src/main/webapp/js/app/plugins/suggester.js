(function(window, Tatami){

    var patterns = {
        login: /(^|[^\w])@[\w]*$/gim,
        hash: /(^|[^\w])#[\w]*$/gim,
        char: /([a-zA-Z]+)/
    };

    function Suggester(element) {
        this.source = function (raw_query, process) {
            var caretPosition = Suggester.getCaretPos(element.get()[0]);
            var query = raw_query.substring(0, caretPosition);
            var matchLogin = query.match(patterns.login);
            var matchHash = query.match(patterns.hash);
            if (matchLogin === null && matchHash === null) {
                if (this.shown) {
                    this.hide();
                }
                return;
            }
            var query2 = (matchLogin === null) ? matchHash[0] : matchLogin[0];

            // Didn't find a good reg ex that doesn't catch the character before # or @ : have to cut it down :
            query2 = (query2.charAt(0) != '#' && query2.charAt(0) != '@') ? query2.substring(1, query2.length) : query2;

            if (query2.length < 2) {return;} // should at least contains @ or # and another character to continue.

            switch (query2.charAt(0)) {
                case '@' :
                    q = query2.substring(1, query2.length);
                    return $.get('/tatami/rest/search/users', {q:q}, function (data) {
                        var results = [];
                        for (var i = 0; i < data.length; i++) {
                            results[i] = '@' + data[i].username;
                        }
                        return process(results);
                    });
                case '#' :
                    q = query2.substring(1, query2.length);
                    return $.get('/tatami/rest/search/tags', {q:q}, function (data) {
                        var results = [];
                        for (var i = 0; i < data.length; i++) {
                            results[i] = '#' + data[i].name;
                        }
                        return process(results);
                    });
            }
        };
        this.matcher = function (item) {
            return true;
        };
        this.updater = function (item) {
            var caretPosition = Suggester.getCaretPos(element.get()[0]);
            var firstPart = element.val().substring(0, caretPosition);
            var secondPart = element.val().substring(caretPosition, element.val().length);
            var firstChar = item.charAt(0);
            var newText = item;
            if (firstPart.lastIndexOf(firstChar) > -1) {
                newText = firstPart.substring(0, firstPart.lastIndexOf(firstChar)) + item + ' ' + secondPart;
            }
            return newText;
        };
    }

    Suggester.getCaretPos = function(element) {
      var caretPos = 0; // IE Support
      if (document.selection) {
        element.focus ();
        var sel = document.selection.createRange ();
        sel.moveStart ('character', -element.value.length);
        caretPos = sel.text.length;
      }
      // Firefox support
      else if (element.selectionStart || element.selectionStart == '0')
        caretPos = element.selectionStart;
      return (caretPos);
    };

    Tatami.Suggester = Suggester;
})(window, Tatami);