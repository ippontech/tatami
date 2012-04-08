/* Functions called by tatami.js that make requests on the server*/
function postTheTweet(tweet) {
	var $tweet = $('#tweetContent');
	$.ajax({
        type: POST_TYPE_REQUEST,
        url: "rest/tweets",
        contentType: JSON_CONTENT_TYPE,
        data: tweet.val(),
        dataType: JSON_DATA_TYPE,
        success: function(data) {
            tweet.slideUp().empty().slideDown(FAST_EFFECT);
            $tweet.parent().parent().find("div.error").empty();
            $tweet.val("");
            setTimeout(function() {
                refreshProfile();
                listTweets(true);
            }, 1000);
        },
        error: function(jqXHR, textStatus, errorThrown){
        	$tweet.parent().parent().find("div.error").empty().append(errorThrown);
        }
    });
}

function displayTweets(login, nbTweets, tweetsList, mainTab) {
	$.ajax({
        type: GET_TYPE_REQUEST,
        url: "rest/tweets/" + login + "/" + nbTweets,
        dataType: JSON_DATA_TYPE,
        success: function(data) {
            makeTweetsList(data, tweetsList, true, false, true);
            mainTab.tab(SHOW_EFFECT);
        }
    });
}

function displayFavoriteTweets(favTweetsList) {
    $.ajax({
        type: GET_TYPE_REQUEST,
        url: "rest/favTweets/" + login,
        dataType: JSON_DATA_TYPE,
        success: function(data) {
            makeTweetsList(data, favTweetsList, true, true, false);
        }
    });
}

function displayTagTweets(tagTweetsList, tagTab, tag) {
    $.ajax({
        type: GET_TYPE_REQUEST,
        url: "rest/tags" + (tag ? '/' + tag : '') + "/30",
        dataType: JSON_DATA_TYPE,
        success: function(data) {
            //TODO refesh title's tag name
            makeTweetsList(data, tagTweetsList, true, true, true);
            tagTab.tab(SHOW_EFFECT);
        }
    });
}

function displayUserInformations(userPicture, userTab, login) {
	$.ajax({
        type: GET_TYPE_REQUEST,
        url: "rest/users/" + login + "/",
        dataType: JSON_DATA_TYPE,
        success: function(data) {
            userPicture.attr('src', 'http://www.gravatar.com/avatar/' + data.gravatar + '?s=64');
            userPicture.popover({
                placement: 'bottom',
                title: data.firstName + ' ' + data.lastName,
                content: '<span class="badge badge-success">' + data.tweetCount + '</span>&nbsp;TWEETS<br/>' +
                '<span class="badge badge-success">' + data.friendsCount + '</span>&nbsp;FOLLOWING<br/>' +
                '<span class="badge badge-success">' + data.followersCount + '</span>&nbsp;FOLLOWERS'
            });

            userTab.tab(SHOW_EFFECT);
        }
    });
}

function displayUserTweets(userTweetsList, userPicture, userTab, login) {
	$.ajax({
        type: GET_TYPE_REQUEST,
        url: "rest/users/" + login + "/tweets",
        dataType: JSON_DATA_TYPE,
        success: function(data) {
            makeTweetsList(data, userTweetsList, false, true, true);
			displayUserInformations(userPicture, userTab, login);
        }
    });
}

function displayWhoToFollow() {
	$.ajax({
        type: GET_TYPE_REQUEST,
        url: "rest/suggestions",
        dataType: JSON_DATA_TYPE,
        success: function(data) {
            makeWhoToFollowList(data);
        }
    });
}

function newUserToFollow(loginToFollow, login, followUserInput, followStatus) {
	$.ajax({
		type: POST_TYPE_REQUEST,
		url: "rest/users/" + login + "/followUser",
		contentType: JSON_CONTENT_TYPE,
		data: loginToFollow,
		dataType: JSON_DATA_TYPE,
        success: function(data) {
            followUserInput.val("");
            setTimeout(function() {
                refreshProfile();
                whoToFollow();
                listTweets(true);
            }, 500);	//DEBUG wait for persistence consistency
        },
    	error: function(xhr, ajaxOptions, thrownError) {
    		followStatus.fadeIn(FAST_EFFECT).text(thrownError);
            setTimeout(followStatus.fadeOut(SHOW_EFFECT), 5000);
    	}
	});
}

function removeFriendFromMyList(login, friend) {
	$.ajax({
		type: POST_TYPE_REQUEST,
		url: "rest/users/" + login + "/removeFriend",
		contentType: JSON_CONTENT_TYPE,
		data: friend,
		dataType: JSON_DATA_TYPE,
        success: function(data) {
            setTimeout(refreshProfile(), 500);	//DEBUG wait for persistence consistency
        }
	});
}

function removeOneOfMyTweet(tweet) {
	$.ajax({
		type: 'GET',
		url: "rest/removeTweet/" + tweet,
		dataType: "json",
      		success: function(data) {
          		setTimeout(function() {
              		refreshProfile();
              		listTweets(true);
          			}, 500); //DEBUG wait for persistence consistency
      			}
			});
}

function addATweetToMyFavorites(tweet, favTab){
	$.ajax({
		type: GET_TYPE_REQUEST,
		url: "rest/users/" + tweet,
		dataType: JSON_DATA_TYPE,
        success: function(data) {
            setTimeout(function() {
            	favTab.tab(SHOW_EFFECT);
            }, 500);	//DEBUG wait for persistence consistency
        }
	});
}

function searchUsersPossibilities(suggest, login){
	$.ajax({
		type: GET_TYPE_REQUEST,
		url: "rest/users/similar/"+login,
		dataType: JSON_DATA_TYPE,
        success: function(data) {
        	suggest.empty();
        	if(null!=data && data.length >0) {
        		buildList(suggest, data);
        		suggest.show();
			}
        }
	});
}

function getUserProfile(login){
	$.ajax({
		type: GET_TYPE_REQUEST,
		url: "user/"+login,
		dataType: JSON_DATA_TYPE,
        success: function(data) {
        	if(null!=data && data.length >0) {
        		alert(data.login);
			}
        }
	});
}