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

function buildHtmlAreaForTheTweetContent(userlineLink, userLogin, firstName, lastName, content) {
    var html = '<td><article>';
    if (userlineLink) {
        html += userlineLink;
    }
    html += firstName + ' ' + lastName;
    if (userlineLink) {
        html += '</a>';
    }
    html += ' <em>@' + userLogin + '</em><br/>';
    // tweet content
    html += content.replace(userrefREG, userrefURL).replace(tagrefREG, tagrefURL);
    html += '</article></td>';
    return html;
}

function buildHtmlAreaForTheActions(tweetId){
    var html = '<td class="tweetActions">';

    // Favorite tweet
    html += '<a id="' + tweetId + '-favorite" href="#"></a>';

    // Remove Tweet
    html += '<a href="#" onclick="removeTweet(\'' + tweetId + '\')" title="Remove"><i class="icon-remove" /></a>';
    
    html += '</td>';
    return html;
}

function makeTweetsList(data, dest) {
    dest.fadeTo(DURATION_OF_FADE_TO, 0, function() {    //DEBUG do NOT use fadeIn/fadeOut which would scroll up the page
        dest.empty();
        $.each(data, function(entryIndex, entry) {
            var userlineLink = userlineURL.replace(userlineREG, entry['login']);

            var html = '<tr tweetId="' + entry['tweetId'] + '" class="tweet id-' + entry['tweetId'] + '\">';

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
                entry['tweetId']);

            html +=
                "<td class=\"tweetDate\"><aside>" + entry['prettyPrintTweetDate']+ "</aside></td>";

            html += '</tr>';
            dest.append(html);
        });
        decorateFavoriteTweets();
        dest.fadeTo(DURATION_OF_FADE_TO, 1);
    });
}