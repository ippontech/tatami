/*
* Manage the tweet list.
*/

function buildHtmlAreaForTheAvatar(userlineLink, gravatar){
    // identification de l'émetteur du message
    var html = '<td class="avatar">';
    
    if (userlineLink){
        html += userlineLink;
    }
    
    html += '<img src="http://www.gravatar.com/avatar/' + gravatar + '?s=32" />'
    
    if (userlineLink){
	html += '</a>';
    }
    html += '</td>';
    
    return html;
}

function buildHtmlAreaForTheTweetContent(userlineLink, loginInSession, firstName, lastName, content) {
    var html = '<td><article>';
    if (userlineLink) {
        html += userlineLink;
    }
    html += firstName + ' ' + lastName;
    if (userlineLink) {
        html += '</a>';
    }
    html += ' <em>@' + loginInSession + '</em><br/>';
    // tweet content
    html += content.replace(userrefREG, userrefURL).replace(tagrefREG, tagrefURL);
    html += '</article></td>';
    return html;
}

function buildHtmlAreaForTheActions(login, loginInSession, tweetId, followUsers, likeTweets){
    var html = '<td class="tweetFriend">';
    if (login != loginInSession) {
        if (followUsers) {
            html += '<a href="#" onclick="followUser(\'' + loginInSession + '\')" title="Follow"><i class="icon-star" /></a>&nbsp;';
        } else {
            html += '<a href="#" onclick="unfollowUser(\'' + loginInSession + '\')" title="Unfollow"><i class="icon-star-empty" /></a>&nbsp;';
        }
    } else if (likeTweets) {
        html += '<a href="#" onclick="removeTweet(\'' + tweetId + '\')" title="Remove"><i class="icon-remove" /></a>&nbsp;';
    }
    if (likeTweets) {
        html += '<a href="#" onclick="favoriteTweet(\'' + tweetId + '\')" title="Like"><i class="icon-heart" /></a>&nbsp;';
    }
    html += '</td>';
    return html;
}

function makeTweetsList(data, dest, linkLogins, followUsers, likeTweets, login) {
    dest.fadeTo(DURATION_OF_FADE_TO, 0, function() {    //DEBUG do NOT use fadeIn/fadeOut which would scroll up the page
        dest.empty();
        $.each(data, function(entryIndex, entry) {
            if (linkLogins) {
                var userlineLink = userlineURL.replace(userlineREG, entry['login']);
            }
            var html = '<tr class="alignVerticalContentOfAHtmlTweetLine">';

            html += buildHtmlAreaForTheAvatar(
                userlineLink,
                entry['gravatar']);

            html += buildHtmlAreaForTheTweetContent(
                userlineLink,
                entry['login'],
                entry['firstName'],
                entry['lastName'],
                entry['content']);

            html += buildHtmlAreaForTheActions(
                login,
                entry['login'],
                entry['tweetId'],
                followUsers,
                likeTweets);

            html +=
                "<td class=\"tweetDate\"><aside>" + entry['prettyPrintTweetDate']+ "</aside></td>";

            html += '</tr>';
            dest.append(html);
        });
        dest.fadeTo(DURATION_OF_FADE_TO, 1);
    });
}