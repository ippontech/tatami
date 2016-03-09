angular.module('tatamiJHipsterApp')
.filter('emoticon', function() {
    return function(content) {
        if(content === null || angular.isUndefined(content)) {
            return content;
        }

        var emoticons = {
            '>:(': '/assets/images/emoticons/angry.png',
            ':$': '/assets/images/emoticons/blushing.png',
            '8)': '/assets/images/emoticons/cool.png',
            'B)': '/assets/images/emoticons/cool.png',
            ":'(": '/assets/images/emoticons/crying.png',
            ':(': '/assets/images/emoticons/frowning.png',
            ':o': '/assets/images/emoticons/gasping.png',
            ':O': '/assets/images/emoticons/gasping.png',
            ':D': '/assets/images/emoticons/grinning.png',
            '<3': '/assets/images/emoticons/heart.png',
            'XD': '/assets/images/emoticons/laughing.png',
            ':x': '/assets/images/emoticons/lips_sealed.png',
            ':X': '/assets/images/emoticons/lips_sealed.png',
            ':#': '/assets/images/emoticons/lips_sealed.png',
            '>:D': '/assets/images/emoticons/malicious.png',
            ':3': '/assets/images/emoticons/naww.png',
            ':)': '/assets/images/emoticons/smiling.png',
            ':|': '/assets/images/emoticons/speechless.png',
            '>:)': '/assets/images/emoticons/spiteful.png',
            'o_O': '/assets/images/emoticons/surprised.png',
            'D:': '/assets/images/emoticons/terrified.png',
            ':-1:': '/assets/images/emoticons/thumbs_down.png',
            ':+1:': '/assets/images/emoticons/thumbs_up.png',
            'XP': '/assets/images/emoticons/tongue_out_laughing.png',
            ':p': '/assets/images/emoticons/tongue_out.png',
            ':P': '/assets/images/emoticons/tongue_out.png',
            ':/': '/assets/images/emoticons/unsure.png',
            ';)': '/assets/images/emoticons/winking_grinning.png',
            ';p': '/assets/images/emoticons/winking_tongue_out.png',
            ';P': '/assets/images/emoticons/winking_tongue_out.png',
            ':t': '/assets/images/emoticons/trollface.png',
            ':T': '/assets/images/emoticons/trollface.png',
            '(troll)': '/assets/images/emoticons/trollface.png'
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
