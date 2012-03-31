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
	nbTweetsToDisplay = computeNbTweetsToDisplay(nbTweetsToDisplay, reset);
	displayTweets(login, nbTweetsToDisplay, $('#tweetsList'), $('#mainTab'));
}

function listFavoriteTweets() {
	displayFavoriteTweets($('#favTweetsList'));
}

function listUserTweets() {
	displayUserTweets($('#userTweetsList'), $("#userPicture"), $('#userTab'), data);
}

function listTagTweets(tag) {
	displayTagTweets($('#tagTweetsList'), $('#tagTab'), tag);
}

function whoToFollow() {
	displayWhoToFollow($('#suggestions'));
}

function followUser(loginToFollow) {
	newUserToFollow(loginToFollow, login, $("#followUserInput"), $('#followStatus'));
	return false;
}

function removeFriend(friend) {
	removeFriendFromMyList(login, friend);
}

function removeTweet(tweet) {
	removeOneOfMyTweet(tweet);
}

function addFavoriteTweet(tweet) {
	addATweetToMyFavorites(tweet, $('#favTab'));
}

function searchUsers(login) {
	$suggest = $('#usersSuggestions');
	if(login.length <= 3){
		$suggest.hide();
	} else {
		searchUsersPossibilities($suggest, login);
	}
}