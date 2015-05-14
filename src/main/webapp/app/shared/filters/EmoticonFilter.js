TatamiApp.filter('emoticon', function() {
    return function(content) {
        if(content == null) {
            return content;
        }

        var emoticons = {
            '>:(': '/assets/img/emoticons/angry.png',
            ':$': '/assets/img/emoticons/blushing.png',
            '8)': '/assets/img/emoticons/cool.png',
            'B)': '/assets/img/emoticons/cool.png',
            ":'(": '/assets/img/emoticons/crying.png',
            ':(': '/assets/img/emoticons/frowning.png',
            ':o': '/assets/img/emoticons/gasping.png',
            ':O': '/assets/img/emoticons/gasping.png',
            ':D': '/assets/img/emoticons/grinning.png',
            '<3': '/assets/img/emoticons/heart.png',
            'XD': '/assets/img/emoticons/laughing.png',
            ':x': '/assets/img/emoticons/lips_sealed.png',
            ':X': '/assets/img/emoticons/lips_sealed.png',
            ':#': '/assets/img/emoticons/lips_sealed.png',
            '>:D': '/assets/img/emoticons/malicious.png',
            ':3': '/assets/img/emoticons/naww.png',
            ':)': '/assets/img/emoticons/smiling.png',
            ':|': '/assets/img/emoticons/speechless.png',
            '>:)': '/assets/img/emoticons/spiteful.png',
            'o_O': '/assets/img/emoticons/surprised.png',
            'D:': '/assets/img/emoticons/terrified.png',
            ':-1:': '/assets/img/emoticons/thumbs_down.png',
            ':+1:': '/assets/img/emoticons/thumbs_up.png',
            'XP': '/assets/img/emoticons/tongue_out_laughing.png',
            ':p': '/assets/img/emoticons/tongue_out.png',
            ':P': '/assets/img/emoticons/tongue_out.png',
            ':/': '/assets/img/emoticons/unsure.png',
            ';)': '/assets/img/emoticons/winking_grinning.png',
            ';p': '/assets/img/emoticons/winking_tongue_out.png',
            ';P': '/assets/img/emoticons/winking_tongue_out.png',
            ':t': '/assets/img/emoticons/trollface.png',
            ':T': '/assets/img/emoticons/trollface.png',
            '(troll)': '/assets/img/emoticons/trollface.png'
        };

        function escapeRegExp(str) {
            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
        }

        for(var key in emoticons) {
            var reg = new RegExp('(^| )' + escapeRegExp(key) + '($| )');
            content = content.replace(reg, ' ![' + key + '](' + emoticons[key] + ') ');
        }

        return content;
    };
});