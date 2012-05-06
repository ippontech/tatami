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

function makeTweetsList(data, dest) {
    dest.fadeTo(DURATION_OF_FADE_TO, 0, function() {    //DEBUG do NOT use fadeIn/fadeOut which would scroll up the page
        dest.empty();
        $.each(data, function(entryIndex, entry) {
            var userlineLink = userlineURL.replace(userlineREG, entry['login']);
            
        	var template = $('#template_tweets').html();
            var content = entry['content']
            		.replace(userrefREG, userrefURL)
            		.replace(tagrefREG, tagrefURL)
            		.replace(url1REG, url1URL)
            		.replace(url2REG, url2URL);
        	var data = {'userlineLink' : userlineLink,
        				'login' : entry['login'],
        				'firstName':entry['firstName'],
        				'lastName':entry['lastName'],
        				'content':content,
        				'tweetId':entry['tweetId'],
        				'gravatar':entry['gravatar'],
        				'prettyPrintTweetDate':entry['prettyPrintTweetDate'],
                        'favorite':entry['favorite'],
        				'isUserLogin' : login == entry['login']
        	};
        	
            var html = Mustache.render(template, data);

            dest.append(html);
        });
        dest.fadeTo(DURATION_OF_FADE_TO, 1);
    });
}

function showActions(tweetId) {
    $("." + tweetId + "-actions").show();
}

function hideActions(tweetId) {
    $("." + tweetId + "-actions").hide();
}