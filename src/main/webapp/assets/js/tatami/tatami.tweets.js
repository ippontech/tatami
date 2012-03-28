/* Functions called by tatami.js that deal about tweet html object*/

function buildHtmlImgGravatarTag(gravatarName){
    return '<img src="http://www.gravatar.com/avatar/' + gravatarName + '?s=32" />';
}

function buildTheUserLineLink(linkLogins, login, entry){
    var userlineLink;
    var userWhoRunsTheApplication = entry[fieldLoginInSession];
    if (linkLogins && assertStringNotEquals(login,userWhoRunsTheApplication)) {
        userlineLink = userlineURL.replace(userlineREG, userWhoRunsTheApplication);
    }
    return userlineLink;
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

function buildHtmlAreaForTheTweetContent(userlineLink, login, loginInSession, firstName, lastName, content){
    var html = '<td><article>';
    if (assertStringNotEquals(login, loginInSession)) {
        html += '<em>from:</em> <strong>' + firstName + ' ' + lastName + '</strong>&nbsp;';
        
        if (userlineLink){
            html += userlineLink;
        }
        
        html += '<em>@' + login + '</em>';
        
        if (userlineLink){
            html += '</a>';
        }
        
        html += '<br/>';
    }
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
                login,
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
    
    var userlineLink = buildTheUserLineLink(linkLogins, login, entry);
      
    var html = '<tr class="alignVerticalContentOfAHtmlTweetLine">';  

    html += buildContentForAHtmlLinePerTweet(
        userlineLink,
        entry[fieldGravatarInSession],
        login, 
		entry[fieldTweetIdInSession],
        entry[fieldLoginInSession], 
        entry[fieldfirstNameInSession], 
        entry[fieldLastNameInSession], 
        entry[fieldContentInSession],
        followUsers, 
        likeTweets,
        entry[fieldPrettyPrintTweetDateInSession]
        );

    html += '</tr>';
    return html;
}