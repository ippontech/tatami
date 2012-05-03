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

function makeTweetsList(data, dest) {
    dest.fadeTo(DURATION_OF_FADE_TO, 0, function() {    //DEBUG do NOT use fadeIn/fadeOut which would scroll up the page
        dest.empty();
        $.each(data, function(entryIndex, entry) {
            var userlineLink = userlineURL.replace(userlineREG, entry['login']);
            
        	var template = $('#template_tweets').html();
        	var data = {'userlineLink' : userlineLink,
        				'login' : entry['login'],
        				'firstName':entry['firstName'],
        				'lastName':entry['lastName'],
        				'content':entry['content'],
        				'tweetId':entry['tweetId'],
        				'gravatar':entry['gravatar'],
        				'prettyPrintTweetDate':entry['prettyPrintTweetDate'],
        				'isUserLogin' : login == entry['login']
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