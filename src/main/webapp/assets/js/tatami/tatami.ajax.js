/**
 * Ajax functions.
 *
 * Tweets
 *
 * POST /tatami/rest/tweets -> create a new Tweet
 * GET  /tatami/rest/tweets/20 -> get the latest 20 tweets from the current user
 *
 *
 * Tags
 *
 * GET  /tatami/rest/tags -> get the latest tweets with no tags
 * GET  /tatami/rest/tags/ippon -> get the latest tweets tagged with "ippon"
 *
 * Users
 *
 * POST /tatami/rest/users/jdubois -> update the "jdubois" user
 * POST /tatami/rest/users/jdubois/follow -> follow user "jdubois"
 * POST /tatami/rest/users/jdubois/unfollow -> unfollow user "jdubois"
 * GET  /tatami/rest/users/jdubois -> get the "jdubois" user
 * GET  /tatami/rest/users/jdubois/tweets -> get the latest tweets from user "jdubois"
 * GET  /tatami/rest/users/jdubois/favorites -> get the favorite tweets of user "jdubois"
 * GET  /tatami/rest/users/jdub/autocomplete -> autocomplete login starting with "jdub"
 *
 *
 * Other
 *
 * GET  /tatami/rest/suggestions -> suggest users to follow
 */

/**
 * POST /tatami/rest/tweets -> create a new Tweet
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

/**
 * GET  /tatami/rest/tweets/20 -> get the latest 20 tweets from the current user
 */
function listTweets(reset) {
    if (reset) {
        nbTweetsToDisplay = DEFAULT_NUMBER_OF_TWEETS_TO_DISPLAY;
    } else {
        nbTweetsToDisplay += DEFAULT_NUMBER_INCREMENTATION_OF_TWEETS_TO_DISPLAY;
    }
	$.ajax({
        type: 'GET',
        url: "/tatami/rest/tweets/" + nbTweetsToDisplay,
        dataType: 'json',
        success: function(data) {
            makeTweetsList(data, $('#tweetsList'), true, false, true, login);
            $('#mainTab').tab('show');
        }
    });
}

/**
 * GET  /tatami/rest/tags -> get the latest tweets with no tags
 * GET  /tatami/rest/tags/ippon -> get the latest tweets tagged with "ippon"
 */
function listTagTweets(tag) {
    $.ajax({
        type: 'GET',
        url: "/tatami/rest/tags" + (tag ? '/' + tag : '') + "/30",
        dataType: 'json',
        success: function(data) {
            //TODO refesh title's tag name
            makeTweetsList(data, $('#tagTweetsList'), true, true, true);
            $('#tagTab').tab('show');
        }
    });
}


/**
 * POST /tatami/rest/users/jdubois -> update the "jdubois" user
 */
function updateProfile() {
	$profileFormErrors = $("#updateUserForm").parent().find("div.error");
	$.ajax({
		type: 'POST',
		url: "/tatami/rest/users/" + login,
		contentType: "application/json",
		data: JSON.stringify($("#updateUserForm").serializeObject()),
		dataType: "json",
		success: setTimeout(function() {
			$profileFormErrors.empty();
			$('#profileTab').tab('show');
		}, 500)	//DEBUG wait for persistence consistency
	});
	return false;	// no page refresh
}

/**
 * POST /tatami/rest/users/jdubois/follow -> follow user "jdubois"
 */
function followUser(loginToFollow) {
	$.ajax({
		type: 'POST',
		url: "/tatami/rest/users/" + loginToFollow + "/follow",
		contentType: 'application/json; charset=UTF-8',
		dataType: 'json',
        success: function(data) {
            $("#followUserInput").val("");
            setTimeout(function() {
                refreshProfile();
                suggestUsersToFollow();
                listTweets(true);
            }, 500);	//DEBUG wait for persistence consistency
        },
    	error: function(xhr, ajaxOptions, thrownError) {
    		$('#followStatus').fadeIn('FAST').text(thrownError);
            setTimeout(followStatus.fadeOut('show'), 500);
    	}
	});
    return false;
}

/**
 * POST /tatami/rest/users/jdubois/unfollow -> unfollow user "jdubois"
 */
function unfollowUser(loginToUnfollow) {
	$.ajax({
		type: 'POST',
		url: "/tatami/rest/users/" + loginToUnfollow + "/unfollow",
		contentType: 'application/json; charset=UTF-8',
		dataType: 'json',
        success: function(data) {
            setTimeout(refreshProfile(), 500);	//DEBUG wait for persistence consistency
        }
	});
}

/**
 * GET  /tatami/rest/users/jdubois -> get the "jdubois" user
 */
function getUser(userLogin, callback) {
	$.ajax({
        type: 'GET',
        url: "/tatami/rest/users/" + userLogin,
        dataType: 'json',
        success: function(data) {
            callback(data);
        }
    });
}

/**
 * GET  /tatami/rest/users/jdubois/tweets -> get the latest tweets from user "jdubois"
 */
function listUserTweets(userLogin) {
	$.ajax({
        type: 'GET',
        url: "/tatami/rest/users/" + userLogin + "/tweets",
        dataType: 'json',
        success: function(data) {
            makeTweetsList(data, $('#userTweetsList'), false, true, true);
			displayUserInformations(userLogin);
        }
    });
}

/**
 * GET  /tatami/rest/users/jdubois/favorites -> get the favorite tweets of user "jdubois"
 */
function listFavoriteTweets() {
    $.ajax({
        type: 'GET',
        url: "/tatami/rest/users/" + login + "/favorites",
        dataType: 'json',
        success: function(data) {
            makeTweetsList(data, $('#favTweetsList'), true, true, false, login);
        }
    });
}

/**
 * GET  /tatami/rest/users/jdub/autocomplete -> autocomplete login starting with "jdub"
 */
function autocompleteUser(userLogin) {
    var suggest = $('#usersSuggestions');
    if (login.length <= 3) {
        suggest.hide();
    } else {
        $.ajax({
            type: 'GET',
            url: "/tatami/rest/users/" + userLogin + "/autocomplete",
            dataType: 'json',
            success: function(data) {
                suggest.empty();
                if (null != data && data.length > 0) {
                    buildList(suggest, data);
                    suggest.show();
                }
            }
        });
    }
}

/**
 * GET  /tatami/rest/suggestions -> suggest users to follow
 */
function suggestUsersToFollow() {
	$.ajax({
        type: 'GET',
        url: "/tatami/rest/suggestions",
        dataType: 'json',
        success: function(data) {
            makeWhoToFollowList(data);
        }
    });
}

function removeTweet(tweet) {
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

function addFavoriteTweet(tweet) {
	$.ajax({
		type: 'GET',
		url: "/tatami/rest/likeTweet/" + tweet,
		dataType: 'json',
        success: function(data) {
            setTimeout(function() {
            	$('#favTab').tab('show');
            }, 500);	//DEBUG wait for persistence consistency
        }
	});
}

