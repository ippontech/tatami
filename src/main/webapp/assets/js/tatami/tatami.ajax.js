/*
* Ajax functions.
*/

function tweet() {
    var tweet = $('#tweetContent');
    if (tweet.val() != "") {
        $.ajax({
            type: 'POST',
            url: "/tatami/rest/tweets",
            contentType: 'application/json; charset=UTF-8',
            data: tweet.val(),
            dataType: 'json',
            success: function(data) {
                tweet.slideUp().empty().slideDown('FAST');
                tweet.parent().parent().find("div.error").empty();
                tweet.val("");
                setTimeout(function() {
                    refreshProfile();
                    listTweets(true);
                }, 500);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                tweet.parent().parent().find("div.error").empty().append(errorThrown);
            }
        });
    }
    return false;
}

function displayTweetsForAnUser(login, nbTweets, tweetsList, mainTab) {
	$.ajax({
        type: 'GET',
        url: "/tatami/rest/tweets/" + login + "/" + nbTweets,
        dataType: 'json',
        success: function(data) {
            makeTweetsList(data, tweetsList, true, false, true, login);
            mainTab.tab('show');
        }
    });
}

function displayTweets(login, nbTweets, tweetsList, mainTab) {
	$.ajax({
        type: 'GET',
        url: "/tatami/rest/tweets/" + login + "/" + nbTweets,
        dataType: 'json',
        success: function(data) {
            makeTweetsList(data, tweetsList, true, false, true, login);
            mainTab.tab('show');
        }
    });
}

function displayFavoriteTweets(favTweetsList) {
    $.ajax({
        type: 'GET',
        url: "/tatami/rest/favTweets/" + login,
        dataType: 'json',
        success: function(data) {
            makeTweetsList(data, favTweetsList, true, true, false, login);
        }
    });
}

function displayTagTweets(tagTweetsList, tagTab, tag) {
    $.ajax({
        type: 'GET',
        url: "/tatami/rest/tags" + (tag ? '/' + tag : '') + "/30",
        dataType: 'json',
        success: function(data) {
            //TODO refesh title's tag name
            makeTweetsList(data, tagTweetsList, true, true, true);
            tagTab.tab('show');
        }
    });
}

function displayUserInformations(userPicture, userTab, login) {
	$.ajax({
        type: 'GET',
        url: "/tatami/rest/users/" + login + "/",
        dataType: 'json',
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

function displayUserTweets(userTweetsList, userPicture, userTab, login) {
	$.ajax({
        type: 'GET',
        url: "/tatami/rest/users/" + login + "/tweets",
        dataType: 'json',
        success: function(data) {
            makeTweetsList(data, userTweetsList, false, true, true);
			displayUserInformations(userPicture, userTab, login);
        }
    });
}

function displayWhoToFollow() {
	$.ajax({
        type: 'GET',
        url: "/tatami/rest/suggestions",
        dataType: 'json',
        success: function(data) {
            makeWhoToFollowList(data);
        }
    });
}

function newUserToFollow(loginToFollow, login, followUserInput, followStatus) {
	$.ajax({
		type: 'POST',
		url: "/tatami/rest/users/" + login + "/followUser",
		contentType: 'application/json; charset=UTF-8',
		data: loginToFollow,
		dataType: 'json',
        success: function(data) {
            followUserInput.val("");
            setTimeout(function() {
                refreshProfile();
                whoToFollow();
                listTweets(true);
            }, 500);	//DEBUG wait for persistence consistency
        },
    	error: function(xhr, ajaxOptions, thrownError) {
    		followStatus.fadeIn('FAST').text(thrownError);
            setTimeout(followStatus.fadeOut('show'), 500);
    	}
	});
}

function removeFriendFromMyList(login, friend) {
	$.ajax({
		type: 'POST',
		url: "/tatami/rest/users/" + login + "/removeFriend",
		contentType: 'application/json; charset=UTF-8',
		data: friend,
		dataType: 'json',
        success: function(data) {
            setTimeout(refreshProfile(), 500);	//DEBUG wait for persistence consistency
        }
	});
}

function newUserToFollowFromHisProfile(loginToFollow, login, followUserInput, followStatus) {
	$.ajax({
		type: 'POST',
		url: "/tatami/rest/users/" + login + "/followUser",
		contentType: 'application/json; charset=UTF-8',
		data: loginToFollow,
		dataType: 'json',
        success: function(data) {
        	$("#userProfile a#followBtn").hide();
        	$("#userProfile a#unfollowBtn").show();
        }
	});
}

function removeFriendFromHisProfile(login, friend) {
	$.ajax({
		type: 'POST',
		url: "/tatami/rest/users/" + login + "/removeFriend",
		contentType: 'application/json; charset=UTF-8',
		data: friend,
		dataType: 'json',
        success: function(data) {
        	$("#userProfile a#followBtn").show();
        	$("#userProfile a#unfollowBtn").hide();
        }
	});
}

function removeOneOfMyTweet(tweet) {
	$.ajax({
		type: 'GET',
		url: "/tatami/rest/removeTweet/" + tweet,
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
		type: 'GET',
		url: "/tatami/rest/likeTweet/" + tweet,
		dataType: 'json',
        success: function(data) {
            setTimeout(function() {
            	favTab.tab('show');
            }, 500);	//DEBUG wait for persistence consistency
        }
	});
}

function searchUsersPossibilities(suggest, login){
	$.ajax({
		type: 'GET',
		url: "/tatami/rest/users/similar/"+login,
		dataType: 'json',
        success: function(data) {
        	suggest.empty();
        	if(null!=data && data.length >0) {
        		buildList(suggest, data);
        		suggest.show();
			}
        }
	});
}