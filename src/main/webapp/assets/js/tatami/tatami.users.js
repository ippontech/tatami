/* Functions called by tatami.js that deal about tweet html object*/

function buildTheUserLineLink(login, entry){
   	var userline;
    var userWhoRunsTheApplication = entry[fieldLoginInSession];
    if (assertStringNotEquals(login,userWhoRunsTheApplication)) {
        userline = userlineURL.replace(userlineREG, userWhoRunsTheApplication);
    }
	return userline;
}

function buildHtmlAreaForTheTweetAuthor(entry, userline){
	var html = '<td>';
    if (userline){
		html += userline;
	}	
    html += '<img src="http://www.gravatar.com/avatar/' + entry['gravatar'] + '?s=32" /> ';
    html += '<em>@' + entry['login'] + '</em>';
    if (userline){
		html += '</a>';
	}	
    html += '</td>';
	return html;
}

function buildHtmlAreaToDeleteAnAbo(entry, userline){
	var html = '<td class="tweetFriend">';
    if (userline) {
        html += '<a href="#" onclick="followUser(\'' + entry['login'] + '\')" title="Follow"><i class="icon-star" /></a>';
    } else {
        html += '&nbsp;';
    }
    html += '</td>';
	return html;
}

function buildAHtmlLinePerUser(login, entry){
	var userline = buildTheUserLineLink(login, entry)
    
	var html = '<tr valign="top">';
	html += buildHtmlAreaForTheTweetAuthor(entry, userline);
	html += buildHtmlAreaToDeleteAnAbo(entry, userline);
    html += '</tr>';

    return html;
}

function buildAHtmlEmptyLineInsteadOfAUser(){
	return '<tr valign="top"><td colspan="2">No one new tweeted yet today...</td></tr>';
}