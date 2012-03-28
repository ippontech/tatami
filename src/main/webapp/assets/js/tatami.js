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
