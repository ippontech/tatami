/*
* Manage the tweet list.
*/

//Create a Tweet
function tweet() {
    postTweet(function(data) {
        var tweet = $('#tweetContent');
        tweet.slideUp().empty().slideDown('fast');
        tweet.parent().parent().find("div.error").empty();
        tweet.val("");
        setTimeout(function() {
            refreshProfile();
            $('#refreshTweets').click();
        }, 500);
    });
    return false;
}

//Create a Tweet sent to a user (from the "profile" page).
function tweetToUser() {
    postTweet(function(data) {
        var tweet = $('#tweetContent');
        tweet.slideUp().empty().slideDown('fast');
        tweet.parent().parent().find("div.error").empty();
        tweet.val("@" + userLogin + " ");
    });
    return false;
}

// Get the favorites, on the home page.
function favoriteTweets() {
    getFavoriteTweets(function(data) {
        makeTweetsList(data, $('#favTweetsList'));
    });
    return false;
}

// Decorate the tweets, depending if they are favorites or not.
function decorateFavoriteTweets() {
    getFavoriteTweets(function(data) {
        var favorites = [];
        $.each(data, function(entryIndex, entry) {
            favorites.push(entry.tweetId);
        });
        $('.tweet').each(function(index) {
            var tweetId = $(this).attr('tweetId');
            entity = $('#' + tweetId + '-favorite');
            entity.empty();
            if ($.inArray(tweetId, favorites) >= 0) {
                entity.attr("onclick", "unfavoriteTweet(\"" + tweetId + "\")");
                entity.append('<i class="icon-star-empty" />');
            } else {
                entity.attr("onclick", "favoriteTweet(\"" + tweetId + "\")");
                entity.append('<i class="icon-star" />');
            }
        });
    });
    return false;
}


function buildHtmlAreaForTheAvatar(userlineLink, gravatar){
    // identification de l'émetteur du message
	var template = '<td class="avatar">{{&userlineLink}}' +
		'<img src="http://www.gravatar.com/avatar/{{gravatar}}?s=32" />' +
		'{{#userlineLink}}</a>{{/userlineLink}} {{^userlineLink}}</td>{{/userlineLink}}';

	var data = {'userlineLink'	: userlineLink,
				'gravatar'		: gravatar
	};

	return Mustache.render(template, data);
}

function buildHtmlAreaForTheTweetContent(userlineLink, userLogin, firstName, lastName, content) {
	var template = '<td><article>{{&userlineLink}}{{firstName}}&nbsp;{{lastName}}' +
		'{{#userlineLink}}</a>{{/userlineLink}}&nbsp;<em>@{{userLogin}}</em><br/>' +
		'{{content}}</article></td>';
	
	var data = {'userlineLink'	: userlineLink,
				'userLogin'		: userLogin,
				'firstName'		: firstName,
				'lastName'		: lastName,
				'content'		: content
	}
		
	return Mustache.render(template, data);
}

function buildHtmlAreaForTheActions(tweetId, userLogin){
	var template = '<td class="tweetActions"><div class="hide {{tweetId}}-actions">' +
		'<a id="{{tweetId}}-favorite" href="#" title="Favorite"></a>' +
		'{{#isUserLogin}}<a href="#" onclick="removeTweet(\'{{tweetId}}\')" title="Remove"><i class="icon-remove" /></a>{{/isUserLogin}}' +
		'</div></td>';
	
	var data = {'tweetId' : tweetId,
				'userLogin' : userLogin,
				'isUserLogin' : userLogin == login };
	
	return Mustache.render(template, data);
	
    return html = '<td class="tweetActions"><div class="hide ' + tweetId + '-actions">';
}

function makeTweetsList(data, dest) {
    dest.fadeTo(DURATION_OF_FADE_TO, 0, function() {    //DEBUG do NOT use fadeIn/fadeOut which would scroll up the page
        dest.empty();
        $.each(data, function(entryIndex, entry) {
            var userlineLink = userlineURL.replace(userlineREG, entry['login']);

            var template = '<tr tweetId="{{tweetId}}" ' +
            	'class="tweet id-{{tweetId}}" ' +
            	'onmouseover="showActions(\'{{tweetId}}\')" '+
            	'onmouseout="hideActions(\'{{tweetId}}\')">' +
            	'{{&buildHtmlAreaForTheAvatar}}{{&buildHtmlAreaForTheTweetContent}}{{&buildHtmlAreaForTheActions}}' +
            	'<td class="tweetDate"><aside>{{prettyPrintTweetDate}}</aside></td></tr>';
            
            var data = {'tweetId' : entry['tweetId'],
            			'buildHtmlAreaForTheAvatar' 		: buildHtmlAreaForTheAvatar(
            													userlineLink,
            													entry['gravatar']),
                        'buildHtmlAreaForTheTweetContent' 	: buildHtmlAreaForTheTweetContent(
                        										userlineLink,
                        										entry['login'],
                        										entry['firstName'],
                        										entry['lastName'],
                        										entry['content']),
                        'buildHtmlAreaForTheActions'		: buildHtmlAreaForTheActions(
                        										entry['tweetId'],
                        										entry['login']),
                        'prettyPrintTweetDate'				: entry['prettyPrintTweetDate']
            };
            
            var html = Mustache.render(template, data);

            dest.append(html);
        });
        decorateFavoriteTweets();
        dest.fadeTo(DURATION_OF_FADE_TO, 1);
    });
}

function showActions(tweetId) {
    $("." + tweetId + "-actions").show();
}

function hideActions(tweetId) {
    $("." + tweetId + "-actions").hide();
}