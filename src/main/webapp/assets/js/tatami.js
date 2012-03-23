var nbTweets;

function resetNbTweets() {
	nbTweets = 20;
}

function incrementNbTweets() {
	nbTweets += 10;
}


//cross site scripting defense ; http://ha.ckers.org/xss.html
var xssREG1 = new RegExp("(javascript:|<\s*script.*?\s*>)", "i");
var xssREG2 = new RegExp('\s+on\w+\s*=\s*["\'].+["\']', "i");
//TODO <img src="alert('it's a trap!');"/>
function isXSS(msg) {
	return (msg.match(xssREG1) || msg.match(xssREG2));
}


function tweet() {
	var src = $('#tweetContent');

	if (src.val() === "") {
		src.popover('show');
		setTimeout(function() {
			src.popover('hide');
        }, 5000);
		return false;
	}
	if (isXSS(src.val())) {
		alert('Cross Site Scripting suspicion. Please check syntax.')
		setTimeout(function() {
			src.val("");
        }, 1000);
		return false;
	}

	$.ajax({
        type: 'POST',
        url: "rest/tweets",
        contentType: "application/json; charset=UTF-8",
        data: src.val(),
        dataType: "json",
        success: function(data) {
            src.slideUp().val("").slideDown('fast');
            setTimeout(function() {
                        refreshProfile();
                        listTweets(true);
                    }, 1000);	//DEBUG wait for persistence consistency
        }
    });

	return false;
}

var userlineURL = '<a href="#" style="text-decoration:none" onclick="listUserTweets(\'LOGIN\')" title="Show LOGIN tweets">';
var userlineREG = new RegExp("LOGIN", "g");

function listTweets(reset) {

	if (reset)	resetNbTweets();
	else		incrementNbTweets();

	$.ajax({
		type: 'GET',
		url: "rest/tweets/" + login + "/" + nbTweets,
		dataType: "json",
		success: function(data) {
			makeTweetsList(data, $('#tweetsList'), true, false, true);
			$('#mainTab').tab('show');
		}
	});
}

function listUserTweets(login) {
	$.ajax({
		type: 'GET',
		url: "rest/ownTweets/" + login,
		dataType: "json",
		success: function(data) {
			makeTweetsList(data, $('#userTweetsList'), false, true, true);

			$.ajax({
				type: 'GET',
				url: "rest/users/" + login + "/",
				dataType: "json",
				success: function(data) {
		            $("#userPicture").attr('src', 'http://www.gravatar.com/avatar/' + data.gravatar + '?s=64');
					$("#userPicture").popover({
						placement: 'bottom',
						title: data.firstName + ' ' + data.lastName,
						content: '<span class="badge badge-success">' + data.tweetCount + '</span>&nbsp;TWEETS<br/>' +
	            				 '<span class="badge badge-success">' + data.friendsCount + '</span>&nbsp;FOLLOWING<br/>' +
	            				 '<span class="badge badge-success">' + data.followersCount + '</span>&nbsp;FOLLOWERS'
					});

					$('#userTab').tab('show');
				}
			});
		}
	});
}

function listTagTweets(tag) {
	$.ajax({
		type: 'GET',
		url: "rest/tagtweets" + (tag ? '/' + tag : '') + "/30",
		dataType: "json",
		success: function(data) {
			//TODO refesh title's tag name
			makeTweetsList(data, $('#tagTweetsList'), true, true, true);
			$('#tagTab').tab('show');
		}
	});
}

function listFavoriteTweets() {
	$.ajax({
		type: 'GET',
		url: "rest/favTweets/" + login,
		dataType: "json",
		success: function(data) {
			makeTweetsList(data, $('#favTweetsList'), true, true, false);
		}
	});
}

var userrefREG = new RegExp("@(\\w+)", "g");
var userrefURL = '<a href="#" style="text-decoration:none" onclick="listUserTweets(\'$1\')" title="Show $1 tweets"><em>@$1</em></a>';

var tagrefREG = new RegExp("#(\\w+)", "g");
var tagrefURL = '<a href="#" style="text-decoration:none" onclick="listTagTweets(\'$1\')" title="Show $1 related tweets"><em>#$1</em></a>';

/*
 * linkLogins:	put links around login references
 * followUsers:	put "follow" action icons ; "forget" if false
 * likeTweets:	put "like" action icons
 */
function makeTweetsList(data, dest, linkLogins, followUsers, likeTweets) {
	dest.fadeTo(400, 0, function() {	//DEBUG do NOT use fadeIn/fadeOut which would scroll up the page
		dest.empty();

		$.each(data, function(entryIndex, entry) {
			var userlineLink;
			if (linkLogins && login != entry['login']) {
				userlineLink = userlineURL.replace(userlineREG, entry['login']);
			}

			var html = '<tr valign="top">';
			// identification de l'émetteur du message
			html += '<td style="width: 34px; ">';
			if (userlineLink)	html += userlineLink;
			html += '<img src="http://www.gravatar.com/avatar/' + entry['gravatar'] + '?s=32" />';
			if (userlineLink)	html += '</a>';
			html += '</td>';
			html += '<td><article>';
			if (login != entry['login']) {
				html += '<em>from:</em> <strong>' + entry['firstName'] + ' ' + entry['lastName'] + '</strong>&nbsp;';
				if (userlineLink)	html += userlineLink;
				html += '<em>@' + entry['login'] + '</em>';
				if (userlineLink)	html += '</a>';
				html += '<br/>';
			}
			// contenu du message
			html += entry['content'].replace(userrefREG, userrefURL).replace(tagrefREG, tagrefURL);
			html += '</article></td>';
			// colonne de suppression des abonnements
			html += '<td class="tweetFriend">';
			if (login != entry['login']) {
				if (followUsers) {
					html += '<a href="#" onclick="followUser(\'' + entry['login'] + '\')" title="Follow"><i class="icon-star" /></a>';
				} else {
					html += '<a href="#" onclick="removeFriend(\'' + entry['login'] + '\')" title="Unfollow"><i class="icon-star-empty" /></a>';
				}
			} else {
				html += '<a href="#" onclick="removeTweet(\'' + entry['tweetId'] + '\')" title="Remove"><i class="icon-remove" /></a>';
			}
			if (likeTweets) {
				html += '<br/><a href="#" onclick="addFavoriteTweet(\'' + entry['tweetId'] + '\')" title="Like"><i class="icon-heart" /></a>';
			}
			html += '</td>';
			// temps écoulé depuis la publication du message
			html += '<td class="tweetDate"><aside>' + entry['prettyPrintTweetDate'] + '</aside></td>';
			html += '</tr>';

			dest.append(html);
		});

		dest.fadeTo(400, 1);
	});
}

function whoToFollow() {
	$.ajax({
		type: 'GET',
		url: "rest/suggestions",
		dataType: "json",
		success: function(data) {
			makeUsersList(data, $('#suggestions'));
		}
	});
}

function makeUsersList(data, dest) {
	dest.fadeTo(400, 0, function() {	//DEBUG do NOT use fadeIn/fadeOut which would scroll up the page
		dest.empty();

		var updated = false;
		$.each(data, function(entryIndex, entry) {
			var userline;
			if (login != entry['login']) {
				userline = userlineURL.replace(userlineREG, entry['login']);
			}

			var html = '<tr valign="top">';
			// identification de l'émetteur du message
			html += '<td>';
			if (userline)	html += userline;
			html += '<img src="http://www.gravatar.com/avatar/' + entry['gravatar'] + '?s=32" /> ';
			html += '<em>@' + entry['login'] + '</em>';
			if (userline)	html += '</a>';
			html += '</td>';
			// colonne de suppression des abonnements
			html += '<td class="tweetFriend">';
			if (userline) {
				html += '<a href="#" onclick="followUser(\'' + entry['login'] + '\')" title="Follow"><i class="icon-star" /></a>';
			} else {
				html += '&nbsp;';
			}
			html += '</td>';
			html += '</tr>';
	
			dest.append(html);
			updated = true;
		});
		if (!updated) {
			var html = '<tr valign="top">';
			// identification de l'émetteur du message
			html += '<td colspan="2">No one new tweeted yet today...</td>';
			html += '</tr>';
			dest.append(html);
		}

		dest.fadeTo(400, 1);
	});
}

function followUser(loginToFollow) {
	$.ajax({
		type: 'POST',
		url: "rest/users/" + login + "/followUser",
		contentType: "application/json",
		data: loginToFollow,
		dataType: "json",
        success: function(data) {
            $("#followUserInput").val("");
            setTimeout(function() {
                refreshProfile();
                whoToFollow();
                listTweets(true);
            }, 500);	//DEBUG wait for persistence consistency
        },
    	error: function(xhr, ajaxOptions, thrownError) {
    		$('#followStatus').fadeIn("fast").text(thrownError);
            setTimeout($('#followStatus').fadeOut("slow"), 5000);
    	}
	});

	return false;
}

function removeFriend(friend) {
	$.ajax({
		type: 'POST',
		url: "rest/users/" + login + "/removeFriend",
		contentType: "application/json",
		data: friend,
		dataType: "json",
        success: function(data) {
            setTimeout(refreshProfile(), 500);	//DEBUG wait for persistence consistency
        }
	});
}

function removeTweet(tweet) {
	$.ajax({
		type: 'GET',
		url: "rest/removeTweet/" + tweet,
		dataType: "json",
        success: function(data) {
            setTimeout(function() {
                refreshProfile();
                listTweets(true);
            }, 500);	//DEBUG wait for persistence consistency
        }
	});
}

function addFavoriteTweet(tweet) {
	$.ajax({
		type: 'GET',
		url: "rest/likeTweet/" + tweet,
		dataType: "json",
        success: function(data) {
            setTimeout(function() {
            	$('#favTab').tab('show');
            }, 500);	//DEBUG wait for persistence consistency
        }
	});
}
