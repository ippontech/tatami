/* Functions called by tatami.js that deal about users */

function displayProfile() {
	getUser(login, function(data) {
			$("#emailInput").val(data.email);
			$("#firstNameInput").val(htmlDecode(data.firstName));
			$("#lastNameInput").val(htmlDecode(data.lastName));
		});
}

function refreshProfile() {
	getUser(login, function(data) {
        $("#picture").parent().css('width', '68px');	// optional
        $("#picture").attr('src', 'http://www.gravatar.com/avatar/' + data.gravatar + '?s=64');
        $("#profile_view").html("<a href='/tatami/profile/" + login + "'><h3>" +
            data.firstName + " " + data.lastName + "</h3>@" +
            login + "</a>");
        $("#tweetCount").text(data.tweetCount);
        $("#friendsCount").text(data.friendsCount);
        $("#followersCount").text(data.followersCount);
		});
}


function makeWhoToFollowList(data) {
    dest = $('#suggestions');
    dest.fadeTo(DURATION_OF_FADE_TO, 0, function() {    //DEBUG do NOT use fadeIn/fadeOut which would scroll up the page
        dest.empty();
        var updated = false;
        $.each(data, function(entryIndex, entry) {
            var suggestedLogin = entry['login'];
            if (login != suggestedLogin) {
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
            dest.append('<tr valign="top"><td colspan="2">No new user to follow today...</td></tr>');
        }
        dest.fadeTo(DURATION_OF_FADE_TO, 1);
    });
}

function addLineToList(dest, user){
	dest.append('<li><img src="http://www.gravatar.com/avatar/' + user.gravatar + '?s=16">&nbsp;' + user.login + '</li>');
}

function buildList(dest, array){
	$.each(array, function(i,user){
		addLineToList(dest, user);
    });
}