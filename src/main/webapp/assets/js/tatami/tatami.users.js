/* Functions called by tatami.js that deal about users */

function makeWhoToFollowList(data) {
    dest = $('#suggestions');
    dest.fadeTo(DURATION_OF_FADE_TO, 0, function() {    //DEBUG do NOT use fadeIn/fadeOut which would scroll up the page
        dest.empty();
        var updated = false;
        $.each(data, function(entryIndex, entry) {
            var suggestedLogin = entry['login'];
            if (assertStringNotEquals(login, suggestedLogin)) {
                userline = userlineURL.replace(userlineREG, suggestedLogin);
            }

            var html = '<tr valign="top"><td>';
            if (userline) {
                html += userline;
            }
            html += '<img src="http://www.gravatar.com/avatar/' + entry['gravatar'] + '?s=32" /> ';
            html += '<em>@' + entry['login'] + '</em>';
            if (userline) {
                html += '</a>';
            }
            html += '</td><td class="tweetFriend">';
            if (userline) {
                html += '<a href="#" onclick="followUser(\'' + entry['login'] + '\')" title="Follow"><i class="icon-star" /></a>';
            } else {
                html += '&nbsp;';
            }
            html += '</td></tr>';
            dest.append(html);
            updated = true;
        });
        if (!updated) {
            dest.append('<tr valign="top"><td colspan="2">No new user tweeted today...</td></tr>');
        }
        dest.fadeTo(DURATION_OF_FADE_TO, 1);
    });
}

function addLineToList(dest, content){
	dest.append('<li>' + content + '</li>');
}

function buildList(dest, array){
	$.each(array, function(i,user){
		addLineToList(dest, user);
    });
}