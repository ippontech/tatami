/* Functions called by tatami.js that deal about tweet html object*/

function buildHtmlImgGravatarTag(gravatarName){
    return '<img src="http://www.gravatar.com/avatar/' + gravatarName + '?s=32" />';
}

function buildHtmlAreaForTheAvatar(userlineLink, gravatar){
    // identification de l'émetteur du message
    var html = '<td class="avatar">';
    
    if (userlineLink){
        html += userlineLink;
    }
    
    html += buildHtmlImgGravatarTag(gravatar);
    
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
    // contenu du message
    html += content.replace(userrefREG, userrefURL).replace(tagrefREG, tagrefURL);
    html += '</article></td>';
    return html;
}

function buildHtmlAreaForTheConnectionPart(login, loginInSession, tweetId, followUsers, likeTweets){
    var html = '<td class="tweetFriend">';
    if (assertStringNotEquals(login, loginInSession)) {
        if (followUsers) {
            html += '<a href="#" onclick="followUser(\'' + login + '\')" title="Follow"><i class="icon-star" /></a>&nbsp;';
        } else {
            html += '<a href="#" onclick="removeFriend(\'' + login + '\')" title="Unfollow"><i class="icon-star-empty" /></a>&nbsp;';
        }
    } else if (likeTweets) {
        html += '<a href="#" onclick="removeTweet(\'' + tweetId + '\')" title="Remove"><i class="icon-remove" /></a>&nbsp;';
    }
    if (likeTweets) {
        html += '<a href="#" onclick="addFavoriteTweet(\'' + tweetId + '\')" title="Like"><i class="icon-heart" /></a>&nbsp;';
    }
    html += '</td>';
    return html;
}

function buildHtmlAreaForDisplayingTheDateSincePublication(fieldPrettyPrintTweetDateInSession){
    return '<td class="tweetDate"><aside>' + fieldPrettyPrintTweetDateInSession+ '</aside></td>';
}

function buildContentForAHtmlLinePerTweet(
        userlineLink,
        fieldGravatarInSession,
        login, 
		tweetId,
        fieldLoginInSession, 
        fieldfirstNameInSession, 
        fieldLastNameInSession, 
        fieldContentInSession,
        followUsers, 
        likeTweets,
        fieldPrettyPrintTweetDateInSession){
            
    var html = buildHtmlAreaForTheAvatar(
                userlineLink, 
                fieldGravatarInSession);

    html += buildHtmlAreaForTheTweetContent(
                userlineLink,
                fieldLoginInSession,
                fieldfirstNameInSession,
                fieldLastNameInSession,
                fieldContentInSession);

    html += buildHtmlAreaForTheConnectionPart(
                login,
                fieldLoginInSession,
				tweetId,
                followUsers, 
                likeTweets);
                
    html += buildHtmlAreaForDisplayingTheDateSincePublication(fieldPrettyPrintTweetDateInSession);
    return html;
}

function buildAHtmlLinePerTweet(followUsers, likeTweets, linkLogins, login, entry){

    if (linkLogins) {
        var userlineLink = userlineURL.replace(userlineREG, entry['login']);
    }
      
    var html = '<tr class="alignVerticalContentOfAHtmlTweetLine">';  

    html += buildContentForAHtmlLinePerTweet(
        userlineLink,
        entry['gravatar'],
        login, 
		entry['tweetId'],
        entry['login'],
        entry['firstName'],
        entry['lastName'],
        entry['content'],
        followUsers, 
        likeTweets,
        entry['prettyPrintTweetDate']
        );

    html += '</tr>';
    return html;
}

function makeTweetsList(data, dest, linkLogins, followUsers, likeTweets) {
    dest.fadeTo(DURATION_OF_FADE_TO, 0, function() {	//DEBUG do NOT use fadeIn/fadeOut which would scroll up the page
		dest.empty();
        $.each(data, function(entryIndex, entry) {
            dest.append(buildAHtmlLinePerTweet(followUsers, likeTweets, linkLogins, login, entry));
        });
        dest.fadeTo(DURATION_OF_FADE_TO, 1);
    });
}