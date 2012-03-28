/* Functions called by jsp/html/etc.. */

var nbTweetsToDisplay;

var userlineURL = '<a href="#" style="text-decoration:none" onclick="listUserTweets(\'LOGIN\')" title="Show LOGIN tweets">';
var userlineREG = new RegExp("LOGIN", "g");

var userrefREG = new RegExp("@(\\w+)", "g");
var userrefURL = '<a href="#" style="text-decoration:none" onclick="listUserTweets(\'$1\')" title="Show $1 tweets"><em>@$1</em></a>';

var tagrefREG = new RegExp("#(\\w+)", "g");
var tagrefURL = '<a href="#" style="text-decoration:none" onclick="listTagTweets(\'$1\')" title="Show $1 related tweets"><em>#$1</em></a>';

function tweet() {
    var $src = $('#tweetContent');
	if(validateTweetContent($src) && validateXSS($src)){
		postTheTweet($src);
	}
	return false;
}

function listTweets(reset) {    
	nbTweetsToDisplay = computeNbTweetsToDisplay(nbTweetsToDisplay, reset)
	displayTweets(login, nbTweetsToDisplay, $('#tweetsList'), $('#mainTab'));
}

function listFavoriteTweets() {
	displayFavoriteTweets($('#favTweetsList'));
}

function listUserTweets(login) {
	displayUserTweets($('#userTweetsList'), $("#userPicture"), $('#userTab'), data);
}

function listTagTweets(tag) {
	displayTagTweets($('#tagTweetsList'), $('#tagTab'));
}

function makeTweetsList(data, dest, linkLogins, followUsers, likeTweets) {
    dest.fadeTo(DURATION_OF_FADE_TO, OPACITY_ZERO, function() {	//DEBUG do NOT use fadeIn/fadeOut which would scroll up the page
        dest.empty();
        $.each(data, function(entryIndex, entry) {
            dest.append(buildAHtmlLinePerTweet(followUsers, likeTweets, linkLogins, login, entry));
        });
        dest.fadeTo(DURATION_OF_FADE_TO, OPACITY_UN);
    });
}

function makeUsersList(data, dest) {
    dest.fadeTo(DURATION_OF_FADE_TO, 0, function() {	//DEBUG do NOT use fadeIn/fadeOut which would scroll up the page
        dest.empty();
        var updated = false;
        $.each(data, function(entryIndex, entry) {
            dest.append(buildAHtmlLinePerUser(login, entry));
			updated = true;
        });
        if (!updated) {
			dest.append(buildAHtmlEmptyLineInsteadOfAUser());
        }
        dest.fadeTo(DURATION_OF_FADE_TO, OPACITY_UN);
    });
}

function whoToFollow() {
	displayWhoToFollow($('#suggestions'));
}

function followUser(loginToFollow) {
	newUserToFollow(loginToFollow, login, $("#followUserInput"), $('#followStatus'));
	return false;
}

function removeTweet(tweet) {
	removeFriendFromMyList(friend);
}

function addFavoriteTweet(tweet) {
	addATweetToMyFavorites($('#favTab'));
}
