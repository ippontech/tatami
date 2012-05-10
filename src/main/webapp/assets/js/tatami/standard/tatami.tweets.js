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
        $('#favTweetsList').empty();
        makeTweetsList(data, $('#favTweetsList'));
    });
    return false;
}

var bottomTweetId;

function makeTweetsList(data, dest) {
    $.each(data, function(entryIndex, entry) {
        var userlineLink = userlineURL.replace(userlineREG, entry['login']);

        var template = $('#template_tweets').html();
        var content = entry['content']
            		.replace(userrefREG, userrefURL)
            		.replace(tagrefREG, tagrefURL)
            		.replace(URL1_REG, URL1_LINK)
            		.replace(URL2_REG, URL2_LINK)
            		.replace(URL3_REG, URL3_LINK);
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
        bottomTweetId = entry['tweetId'];
    });
}

function showActions(tweetId) {
    $("." + tweetId + "-actions").show();
}

function hideActions(tweetId) {
    $("." + tweetId + "-actions").hide();
}