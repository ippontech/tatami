/* Functions called by jsp/html/etc.. */

var nbTweetsToDisplay;

var userlineURL = '<a href="#" style="text-decoration:none" onclick="listUserTweets(\'LOGIN\')" title="Show LOGIN tweets">';
var userlineREG = new RegExp("LOGIN", "g");

var userrefREG = new RegExp("@(\\w+)", "g");
var userrefURL = '<a href="#" style="text-decoration:none" onclick="listUserTweets(\'$1\')" title="Show $1 tweets"><em>@$1</em></a>';

var tagrefREG = new RegExp("#(\\w+)", "g");
var tagrefURL = '<a href="#" style="text-decoration:none" onclick="listTagTweets(\'$1\')" title="Show $1 related tweets"><em>#$1</em></a>';

function initTatami() {
    // left panel
    $('#homeTabContent').load('/assets/fragments/home.html', function () {
        refreshProfile();
        $('#tweetContent').popover({
            trigger: 'manual',
            placement: 'bottom',
            title: 'Error',
            content: '<i class="icon-exclamation-sign"></i>&nbsp;Please type a message to tweet.'
        });
    });
    $('#profileTabContent').load('/assets/fragments/profile.html');
    $('#followUserContent').load('/assets/fragments/followUser.html', whoToFollow());
    // auto-refresh
    $('a[data-toggle="pill"]').on('show', function(e) {
        if (e.target.hash == '#homeTabContent') {
            refreshProfile();
        } else if (e.target.hash == '#profileTabContent') {
            displayProfile();
        }
    });

    // right panel
    $('#timeLinePanel').load('/assets/fragments/timeline.html', function() {
        listTweets(true);
    });
    // browser's refresh shortcut override
    shortcut.add("Ctrl+R", function() {
        listTweets(true);
    });
    // infinite scroll
    $(window).scroll(function() {
        if ($('#timeline').is(':visible') && $(window).scrollTop() >= $(document).height() - $(window).height()) {
            listTweets(false);
        }
    });

    $('#favLinePanel').load('/assets/fragments/favline.html');
    $('#userLinePanel').load('/assets/fragments/userline.html');
    $('#tagLinePanel').load('/assets/fragments/tagline.html');

    $('#piechartPanel').load('/assets/fragments/piechart.html');
    $('#punchchartPanel').load('/assets/fragments/punchchart.html');
    // auto-refresh
    $('a[data-toggle="tab"]').on('show', function(e) {
        if (e.target.hash == '#favLinePanel') {
            listFavoriteTweets();
        } else if (e.target.hash == '#piechartPanel') {
            refreshPieChart();
        } else if (e.target.hash == '#punchchartPanel') {
            refreshPunchChart();
        }
    });
}


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

function listUserTweets(login) {
	displayUserTweets($('#userTweetsList'), $("#userPicture"), $('#userTab'),  login);
}

function listTagTweets(tag) {
	displayTagTweets($('#tagTweetsList'), $('#tagTab'), tag);
}

function whoToFollow() {
	displayWhoToFollow();
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
	var $suggest = $('#usersSuggestions');
	if(login.length <= 3){
		$suggest.hide();
	} else {
		searchUsersPossibilities($suggest, login);
	}
}