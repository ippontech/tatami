/* Functions called by tatami.js that make requests on the server*/

function postTheTweet(tweet){
	$.ajax({
        type: 'POST',
        url: "rest/tweets",
        contentType: "application/json; charset=UTF-8",
        data: tweet.val(),
        dataType: "json",
        success: function(data) {
            tweet.slideUp().val("").slideDown('fast');
            setTimeout(function() {
                refreshProfile();
                listTweets(true);
            }, 1000);
        }
    });
}

function displayTweets(login, nbTweets, tweetsList, mainTab){
	$.ajax({
        type: 'GET',
        url: "rest/tweets/" + login + "/" + nbTweets,
        dataType: "json",
        success: function(data) {
            makeTweetsList(data, tweetsList, true, false, true);
            mainTab.tab('show');
        }
    });
}

function displayFavoriteTweets(favTweetsList) {
    $.ajax({
        type: 'GET',
        url: "rest/favTweets/" + login,
        dataType: "json",
        success: function(data) {
            makeTweetsList(data, favTweetsList, true, true, false);
        }
    });
}

function displayTagTweets(tagTweetsList, tagTab) {
    $.ajax({
        type: 'GET',
        url: "rest/tagtweets" + (tag ? '/' + tag : '') + "/30",
        dataType: "json",
        success: function(data) {
            //TODO refesh title's tag name
            makeTweetsList(data, tagTweetsList, true, true, true);
            tagTab.tab('show');
        }
    });
}

function displayUserInformations(userPicture, userTab, data){
	$.ajax({
        type: 'GET',
        url: "rest/users/" + login + "/",
        dataType: "json",
        success: function(data) {
            userPicture.attr('src', 'http://www.gravatar.com/avatar/' + data.gravatar + '?s=64');
            userPicture.popover({
                placement: 'bottom',
                title: data.firstName + ' ' + data.lastName,
                content: '<span class="badge badge-success">' + data.tweetCount + '</span>&nbsp;TWEETS<br/>' +
                '<span class="badge badge-success">' + data.friendsCount + '</span>&nbsp;FOLLOWING<br/>' +
                '<span class="badge badge-success">' + data.followersCount + '</span>&nbsp;FOLLOWERS'
            });

            userTab.tab('show');
        }
    });
}

function displayUserTweets(userTweetsList, userPicture, userTab, data){
	$.ajax({
        type: 'GET',
        url: "rest/ownTweets/" + login,
        dataType: "json",
        success: function(data) {
            makeTweetsList(data, userTweetsList, false, true, true);
			displayUserInformations(userPicture, data, userTab);  
        }
    });
}

function displayWhoToFollow(suggestions){
	$.ajax({
        type: 'GET',
        url: "rest/suggestions",
        dataType: "json",
        success: function(data) {
            makeUsersList(data, suggestions);
        }
    });
}

function newUserToFollow(loginToFollow, login, followUserInput, followStatus){
	$.ajax({
		type: 'POST',
		url: "rest/users/" + login + "/followUser",
		contentType: "application/json",
		data: loginToFollow,
		dataType: "json",
        success: function(data) {
            followUserInput.val("");
            setTimeout(function() {
                refreshProfile();
                whoToFollow();
                listTweets(true);
            }, 500);	//DEBUG wait for persistence consistency
        },
    	error: function(xhr, ajaxOptions, thrownError) {
    		followStatus.fadeIn("fast").text(thrownError);
            setTimeout(followStatus.fadeOut("slow"), 5000);
    	}
	});
}

function removeFriendFromMyList(friend) {
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

function addATweetToMyFavorites(favTab){
	$.ajax({
		type: 'GET',
		url: "rest/likeTweet/" + tweet,
		dataType: "json",
        success: function(data) {
            setTimeout(function() {
            	favTab.tab('show');
            }, 500);	//DEBUG wait for persistence consistency
        }
	});
}